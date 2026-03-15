const fs = require('fs');

const path = 'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/app/api/webhooks/stripe/route.ts';
let code = fs.readFileSync(path, 'utf8');

const target1 = `const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (userId && subscriptionId) {`;

const replacement1 = `const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        
        const refCode = session.metadata?.refCode;
        const refMode = session.metadata?.refMode;

        if (userId && subscriptionId) {`;

code = code.replace(target1, replacement1);

const target2 = `await supabase.from('subscriptions').upsert({`;

const replacement2 = `
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
                console.log(\`[Stripe Webhook] Referral logged for affiliate \${affiliate.id}\`);
              }
            } catch (err) {
              console.error('Failed to register referral:', err);
            }
          }

          await supabase.from('subscriptions').upsert({`;

code = code.replace(target2, replacement2);

fs.writeFileSync(path, code);
console.log('Webhook updated with affiliate tracking.');