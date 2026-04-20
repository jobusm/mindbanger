import fs from 'fs';

// 1. Fix Magic Link Flow
const magicLinkPath = 'src/app/api/auth/magic-link/route.ts';
let magicLinkContent = fs.readFileSync(magicLinkPath, 'utf8');

magicLinkContent = magicLinkContent.replace(
  'return NextResponse.json({ success: true, message: \'Link sent\' });',
  `
    const htmlContent = lang === 'sk' ? \`
      <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a; margin-bottom: 24px;">\${t.sk.title}</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              \${t.sk.subtitle} <strong>\${otpCode}</strong>
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
              <a href="\${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mindbanger.com'}/auth/verify" style="display: inline-block; padding: 14px 28px; background-color: #f59e0b; color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  \${t.sk.button}
              </a>
          </div>
          <p style="font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              \${t.sk.description}
          </p>
      </div>\` : \`
      <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a; margin-bottom: 24px;">Entry Code - Mindbanger Vault</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Your verification code is: <strong>\${otpCode}</strong>
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
              <a href="\${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mindbanger.com'}/auth/verify" style="display: inline-block; padding: 14px 28px; background-color: #f59e0b; color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Go to verification
              </a>
          </div>
      </div>\`;

    const { success, error: emailError } = await sendEmail({
      to: email,
      subject: lang === 'sk' ? t.sk.subject : "Entry code - Mindbanger Vault",
      html: htmlContent
    });

    if (!success) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Link sent' });`
);

// fix charset issues in magic link texts
magicLinkContent = magicLinkContent.replace(/Vstupnďż˝ kďż˝d/g, "Vstupný kód");
magicLinkContent = magicLinkContent.replace(/overovacďż˝ kďż˝d/g, "overovací kód");
magicLinkContent = magicLinkContent.replace(/Skopďż˝ruj si alebo si zapamďż˝taj tento 6-miestny kďż˝d/g, "Skopíruj si alebo si zapamätaj tento 6-miestny kód");
magicLinkContent = magicLinkContent.replace(/Prejsďż˝ na zadanie kďż˝du/g, "Prejsť na zadanie kódu");
magicLinkContent = magicLinkContent.replace(/aplikďż˝cie, stlaďż˝ tlaďż˝idlo vyďż˝ďż˝ie, ktorďż˝ ďż˝a bezpeďż˝ne prepne spďż˝ do prehliadaďż˝a priamo na zadanie kďż˝du/g, "aplikácie, stlač tlačidlo kód");
magicLinkContent = magicLinkContent.replace(/vygenerovanďż˝ automaticky\. Ak si o tento kďż˝d neďż˝iadal, mďż˝ďż˝eďż˝ tďż˝to sprďż˝vu ignorovaďż˝/g, "vygenerovaný automaticky. Ak si o kód nežiadal, môžeš túto správu ignorovať");

fs.writeFileSync(magicLinkPath, magicLinkContent);
console.log('Fixed magic-link/route.ts');


// 2. Fix checkout trusts userId
const checkoutPath = 'src/app/api/checkout/route.ts';
let checkoutContent = fs.readFileSync(checkoutPath, 'utf8');

checkoutContent = checkoutContent.replace("import stripe from '@/lib/stripe';", "import stripe from '@/lib/stripe';\nimport { createClient } from '@/lib/supabase-server';");

checkoutContent = checkoutContent.replace(
  "const { email, userId, refMode, refCode } = body;",
  `const { email, refMode, refCode } = body;
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;`
);

fs.writeFileSync(checkoutPath, checkoutContent);
console.log('Fixed checkout/route.ts');

// 3. Fix B2B Checkout trusts userId
const b2bCheckoutPath = 'src/app/api/b2b/checkout/route.ts';
let b2bContent = fs.readFileSync(b2bCheckoutPath, 'utf8');

if (!b2bContent.includes("createClient")) {
    b2bContent = b2bContent.replace("import stripe from '@/lib/stripe';", "import stripe from '@/lib/stripe';\nimport { createClient } from '@/lib/supabase-server';");
}

b2bContent = b2bContent.replace(
  "const { email, userId, type, seats, company_name, tax_id, vat_id, contact_name, contact_email, org_id } = body;",
  `const { email, type, seats, company_name, tax_id, vat_id, contact_name, contact_email, org_id } = body;
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;`
);
fs.writeFileSync(b2bCheckoutPath, b2bContent);
console.log('Fixed b2b/checkout/route.ts');

// 4. Fix webhook referrals onConflict and B2B Invite
const webhookPath = 'src/app/api/webhooks/stripe/route.ts';
let webhookContent = fs.readFileSync(webhookPath, 'utf8');

webhookContent = webhookContent.replace("import { welcomeEmailTemplates, generateEmailHtml } from '@/lib/email-templates';", "import { welcomeEmailTemplates, generateEmailHtml } from '@/lib/email-templates';\nimport { sendB2BInviteEmail } from '@/lib/b2b-services';");

const fetchInviteCode = `                 try {
                     const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mindbanger.com';
                     await fetch(\`\${siteUrl}/api/b2b/invite\`, {
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
                 }`;

webhookContent = webhookContent.replace(fetchInviteCode, `                 // Now using internal service function directly from backend without session hurdles
                 try {
                     await sendB2BInviteEmail(em, orgId, inviterName, 'sk');
                 } catch (e) {
                     console.error('Failed to dispatch invite via service for', em, e);
                 }`);

// also the explicit onConflict for referrals
webhookContent = webhookContent.replace(
  `                   await supabase.from('referrals').upsert({
                      affiliate_id: affiliate.id,
                      referee_user_id: userId || null, 
                      commission_model: commissionModel,
                      status: 'pending',
                      amount: commissionAmount,
                      stripe_session_id: session.id,
                   });`,
  `                   await supabase.from('referrals').upsert({
                      affiliate_id: affiliate.id,
                      referee_user_id: userId || null, 
                      commission_model: commissionModel,
                      status: 'pending',
                      amount: commissionAmount,
                      stripe_session_id: session.id,
                   }, { onConflict: 'stripe_session_id' });`
);

fs.writeFileSync(webhookPath, webhookContent);
console.log('Fixed webhooks/stripe/route.ts');
