import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import { sendEmail } from '@/lib/email';
import { welcomeEmailTemplates, generateEmailHtml } from '@/lib/email-templates';

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
        
        // --- B2B HANDLING START ---
        if (session.metadata?.type === 'b2b_subscription') {
           const meta = session.metadata;
           
           // 1. Create Organization
           const { data: org, error: orgError } = await supabase.from('organizations').insert({
              name: meta.company_name,
              tax_id: meta.tax_id,
              vat_id: meta.vat_id,
              billing_email: meta.contact_email,
              contact_person: meta.contact_name,
              industry: 'General', // Default, editable later
              subscription_status: 'active',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              seats_limit: parseInt(meta.seats || '5'),
           }).select().single();

           if (orgError) {
              console.error('B2B Org Creation Error:', orgError);
              return new NextResponse('Org Creation Failed', { status: 500 });
           }

           // 2. Add Representative as Owner (Invite)
           // Check if user exists
           const { data: existingUser } = await supabase.from('profiles').select('id').eq('email', meta.contact_email).single();
           
           const userId = existingUser?.id;

           // Helper: Create Member
           await supabase.from('organization_members').insert({
              organization_id: org.id,
              user_id: userId || null, // If null, they are just invited by email
              email: meta.contact_email,
              role: 'owner',
              status: existingUser ? 'active' : 'invited'
           });

           // 3. Send Welcome Email (B2B Specific)
           // We reuse the email logic but with B2B template
           const b2bSubject = meta.lang === 'sk' ? 'Vitajte v Mindbanger B2B' : 'Welcome to Mindbanger B2B';
           // ... (Email sending logic would go here - simplified for now)
           
           return new NextResponse('B2B Handled', { status: 200 });
        }
        // --- B2B HANDLING END ---

        // --- B2B UPGRADE HANDLING START ---
        if (session.metadata?.type === 'b2b_upgrade') {
           const meta = session.metadata;
           const orgId = meta.org_id;

           // 1. Get the pending emails from the organization table
           const { data: orgData } = await supabase.from('organizations').select('pending_invites, seats_limit').eq('id', orgId).single();
           
           if (orgData) {
             const pendingEmails = (orgData.pending_invites as string[]) || [];
             const newSeatsLimit = orgData.seats_limit + parseInt(meta.seats || '0');

             // 2. Update organization stats and clean pending
             await supabase.from('organizations').update({
               seats_limit: newSeatsLimit,
               subscription_status: 'active',
               pending_invites: [] // clear them
             }).eq('id', orgId);

             // 3. Create member records & invite
             if (pendingEmails.length > 0) {
               // Get inviter profile name
               const { data: adminMembers } = await supabase.from('organization_members').select('user_id').eq('organization_id', orgId).in('role', ['owner', 'admin']).limit(1);
               let inviterName = 'Admin';
               if (adminMembers && adminMembers.length > 0) {
                 const { data: invProfile } = await supabase.from('profiles').select('full_name').eq('id', adminMembers[0].user_id).single();
                 if (invProfile?.full_name) inviterName = invProfile.full_name;
               }

               for (const email of pendingEmails) {
                 const em = email.trim().toLowerCase();
                 // Create invitation via our existing internal invite API mechanism or manually 
                 // here. We'll do it manually to avoid NEXT_PUBLIC_SITE_URL issues inside webhook
                 
                 const { data: existingUser } = await supabase.from('profiles').select('id').eq('email', em).single();
                 
                 await supabase.from('organization_members').insert({
                    organization_id: orgId,
                    user_id: existingUser?.id || null,
                    email: em,
                    role: 'member',
                    status: 'invited'
                 });

                 // Send email via b2b/invite endpoint (it can be called serverside if we use internal fetch, but simple is fire & forget to domain)
                 try {
                     const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mindbanger.com';
                     await fetch(`${siteUrl}/api/b2b/invite`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ 
                             email: em,
                             orgId: orgId,
                             inviterName: inviterName,
                             lang: 'sk' // or fetch from org
                         })
                     });
                 } catch (e) {
                     console.error('Failed to dispatch invite for', em, e);
                 }
               }
             }
           }
           
           return new NextResponse('B2B Upgrade Processed', { status: 200 });
        }
        // --- B2B UPGRADE HANDLING END ---

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

          // --- PAYOUT AND AFFILIATE HANDLING START ---
          if (session.metadata?.refCode || session.metadata?.affiliate_id || session.metadata?.affiliateId) {
             try {
                const rawRef = session.metadata?.affiliate_id || session.metadata?.affiliateId || session.metadata?.refCode;
                const commissionModel = session.metadata?.refMode === 'lifetime' ? 'lifetime_20' : 'second_month';
                
                const { data: affiliate } = await supabase.from('affiliates').select('id').eq('id', rawRef).single();
                
                if (affiliate) {
                   const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
                   let commissionAmount = amountTotal * 0.20; // fallback calculation

                   if (commissionModel === 'lifetime_20') {
                      commissionAmount = amountTotal * 0.20;
                   } else {
                      // second_month model tracks the full subscription amount as the base to calculate the 100% second month payload
                      commissionAmount = amountTotal;
                   }

                   await supabase.from('referrals').upsert({
                      affiliate_id: affiliate.id,
                      referee_user_id: userId || null, 
                      commission_model: commissionModel,
                      status: 'pending',
                      amount: commissionAmount,
                      stripe_session_id: session.id,
                   });
                   console.log('Affiliate referral verified and inserted for session:', session.id);
                }
             } catch (affErr) {
                console.error('Affiliate Tracking Hook Error:', affErr);
             }
          }
          // --- PAYOUT AND AFFILIATE HANDLING END ---

try {
              const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', userId).single();
              const updatePayload: any = { subscription_status: 'premium' };
              if (customerId) {
                updatePayload.stripe_customer_id = customerId;
              }
              
              const stripeName = session.customer_details?.name;
              if (stripeName) {
                const currentName = prof?.full_name;
                if (!currentName || currentName.includes('@') || currentName.trim() === '') {
                  updatePayload.full_name = stripeName;
                }
              }
              
              await supabase.from('profiles').update(updatePayload).eq('id', userId);
            } catch (e) {
              console.error('Error updating profile with Stripe data:', e);
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
