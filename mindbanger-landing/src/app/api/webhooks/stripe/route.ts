import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';
import { welcomeEmailTemplates, generateEmailHtml } from '@/lib/email-templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

// Zmena na citanie secretov tak aby bral aj fallback
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');
  
  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return new NextResponse('Webhook secret is missing in env', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
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

        if (userId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await supabase.from('subscriptions').upsert({
            id: subscriptionId,
            user_id: userId,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_end: new Date(((subscription as any).current_period_end || (subscription.items.data[0] as any).current_period_end) * 1000).toISOString(),
            country: session.customer_details?.address?.country || 'Unknown',
            amount_total: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'eur',
            customer_email: session.customer_details?.email || ''
          });

          if (customerId) {
            await supabase.from('profiles').update({ stripe_customer_id: customerId, subscription_status: 'premium' }).eq('id', userId);
          } else {
            await supabase.from('profiles').update({ subscription_status: 'premium' }).eq('id', userId);
          }

          // Send welcome email via Resend
          const email = session.customer_details?.email;
          if (email) {
            let userLang = 'en';
            try {
              const { data: profile } = await supabase.from('profiles').select('preferred_language').eq('id', userId).single();
              if (profile?.preferred_language) userLang = profile.preferred_language;
            } catch (e) {
               console.error('Error fetching profile lang:', e);
            }
            
            const template = welcomeEmailTemplates[userLang as keyof typeof welcomeEmailTemplates] || welcomeEmailTemplates.en;

            // Vygenerujeme Magic Link
            let magicUrl = template.url;
            try {
              const { data: linkData } = await supabase.auth.admin.generateLink({
                type: 'magiclink',
                email: email
              });
              if (linkData?.properties?.action_link) {
                magicUrl = linkData.properties.action_link + "&redirect_to=https://www.mindbanger.com/auth/callback";
              }
            } catch (e) {
              console.error('Failed to generate magic link:', e);
            }

            const htmlContent = generateEmailHtml(template.headline, template.body, template.cta, magicUrl);

            const { success, error } = await sendEmail({
              to: email,
              subject: template.subject,
              html: htmlContent
            });
            
            if (!success) {
                console.error('Email sending error:', error);
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
            current_period_end: new Date(((subscription as any).current_period_end || (subscription.items.data[0] as any).current_period_end) * 1000).toISOString(),
          });

          if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
             await supabase.from('profiles').update({ subscription_status: 'canceled' }).eq('id', userId);
          } else if (['active', 'trialing', 'past_due'].includes(subscription.status)) {
             await supabase.from('profiles').update({ subscription_status: 'premium' }).eq('id', userId);
          }
        }
        break;
      }
    }
  } catch (err: any) {
    console.error(`Webhook Action Error: ${err.message}`, err);
    return new NextResponse('Internal Webhook Logic Error', { status: 500 });
  }

  return new NextResponse('Success', { status: 200 });
}
