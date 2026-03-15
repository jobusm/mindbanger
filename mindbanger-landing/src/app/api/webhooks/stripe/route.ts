import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';
import { welcomeEmailTemplates, generateEmailHtml } from '@/lib/email-templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const refCode = session.metadata?.refCode;
        const refMode = session.metadata?.refMode;

        if (userId && subscriptionId) {
          // Zapíšeme odber do DB
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          
          // Affiliate DB Insert
          if (refCode && refMode && refCode !== userId) {
            try {
              // Find affiliate mapped to refCode
              const { data: affiliate } = await supabase
                .from('affiliates')
                .select('id')
                .eq('user_id', refCode)
                .single();

              if (affiliate) {
                let commissionAmount = 0;
                let commissionModel = 'second_month';
                
                // For simplified POC, assume 100 EUR plan
                if (refMode === 'A') {
                  commissionModel = 'second_month';
                  commissionAmount = 100; // 100% of second month
                } else if (refMode === 'B') {
                  commissionModel = 'lifetime_20';
                  commissionAmount = 20; // 20% recurring
                }

                await supabase.from('referrals').insert({
                  affiliate_id: affiliate.id,
                  referred_user_id: userId,
                  status: 'pending', // paid out after delay
                  commission_amount: commissionAmount,
                  commission_model: commissionModel
                });
                console.log(`[Stripe Webhook] Referral logged for affiliate ${affiliate.id}`);
              }
            } catch (err) {
              console.error('Failed to register referral:', err);
            }
          }

          await supabase.from('subscriptions').upsert({
            id: subscriptionId,
            user_id: userId,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            country: session.customer_details?.address?.country || 'Unknown',
            amount_total: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'eur',
            customer_email: session.customer_details?.email || ''
          });

          // Send welcome email via Brevo
          const email = session.customer_details?.email;
          if (email && process.env.BREVO_API_KEY) {
            try {
              let userLang = 'en';
              const { data: profile } = await supabase.from('profiles').select('preferred_language').eq('id', userId).single();
              if (profile?.preferred_language) {
                userLang = profile.preferred_language;
              }
              const template = welcomeEmailTemplates[userLang as keyof typeof welcomeEmailTemplates] || welcomeEmailTemplates.en;
              const htmlContent = generateEmailHtml(template.headline, template.body, template.cta, template.url);

              const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                  'accept': 'application/json',
                  'api-key': process.env.BREVO_API_KEY,
                  'content-type': 'application/json'
                },
                body: JSON.stringify({
                  sender: {
                    name: 'Mindbanger',
                    email: 'hello@mindbanger.com'
                  },
                  to: [
                    {
                      email: email,
                      name: session.customer_details?.name || 'Vzácny Člen'
                    }
                  ],
                  subject: template.subject,
                  htmlContent: htmlContent
                })
              });
              if (!brevoRes.ok) {
                console.error('Brevo API error:', await brevoRes.text());
              } else {
                console.log('Welcome email sent via Brevo to', email);
              }
            } catch (err) {
              console.error('Failed to send Brevo welcome email:', err);
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await supabase.from('subscriptions').upsert({
            id: subscription.id,
            user_id: userId,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          });

          // Ak ho vymazali / alebo vypršalo
          if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
             await supabase.from('profiles').update({ subscription_status: 'canceled' }).eq('id', userId);
          } else if (subscription.status === 'active') {
             await supabase.from('profiles').update({ subscription_status: 'premium' }).eq('id', userId);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    console.error(`Webhook handler failed: ${err.message}`);
    return new NextResponse('Internal Webhook Error', { status: 500 });
  }

  return new NextResponse('Success', { status: 200 });
}
