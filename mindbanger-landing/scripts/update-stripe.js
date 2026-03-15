import fs from 'fs';

const filePath = 'src/app/api/webhooks/stripe/route.ts';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  "import { createAdminClient } from '@/lib/supabase-server';",
  "import { createAdminClient } from '@/lib/supabase-server';\nimport { welcomeEmailTemplates, generateEmailHtml } from '@/lib/email-templates';"
);

const oldEmailLogic = `const email = session.customer_details?.email;
          if (email && process.env.BREVO_API_KEY) {
            try {
              const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email'
, {                                                                                             method: 'POST',
                headers: {
                  'accept': 'application/json',
                  'api-key': process.env.BREVO_API_KEY,
                  'content-type': 'application/json'
                },
                body: JSON.stringify({
                  sender: {
                    name: 'Mindbanger Daily',
                    email: 'hello@mindbanger.com'
                  },
                  to: [
                    {
                      email: email,
                      name: session.customer_details?.name || 'VzĂˇcny ÄŚlen'   
                    }
                  ],
                  subject: 'Welcome to Mindbanger Daily',
                  htmlContent: \`
                    <div style="font-family: sans-serif; background-color: #111;
 color: #fff; padding: 40px; text-align: center;">                                                    <h1 style="color: #ffd700;">Vitajte v Mindbanger Daily</h1
>                                                                                                     <p style="font-size: 18px; line-height: 1.5; color: #ccc;"
>                                                                                                       VaĹˇa myseÄľ sa prĂˇve stala vaĹˇĂm najsilnejĹˇĂm nĂˇs s
trojom.                                                                                               </p>
                      <a href="https://mindbanger.com/login" style="display: inl
ine-block; margin-top: 20px; padding: 12px 24px; background-color: #ffd700; color: #000; text-decoration: none; font-weight: bold; border-radius: 4px;">PrihlĂˇsiĹĄ sa</a>                                                                                          </div>
                  \`
                })
              });`;

const cleanOldLogic = code.substring(code.indexOf('const email = session.customer_details?.email;'), code.indexOf('if (!brevoRes.ok) {'));

const newEmailLogic = `const email = session.customer_details?.email;
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
              `;

code = code.replace(cleanOldLogic, newEmailLogic);

fs.writeFileSync(filePath, code);
