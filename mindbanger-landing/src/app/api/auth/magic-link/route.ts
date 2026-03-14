import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. Vygeneruje prihlasovací token ale NEPOŠLE HO! (chceme plnú kontrolu my)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError) {
      console.error("Supabase Link Error:", linkError);
      throw new Error(linkError.message);
    }

    // Toto je náš vygenerovaný url odkaz s tokenom, ktorý prihlási používateľa
    const magicLink = linkData.properties.action_link;

    // 2. Náš vlastný krásny HTML email
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: -apple-system, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 40px; text-align: center; }
        .title { font-family: Georgia, serif; font-size: 24px; margin-bottom: 16px; color: #f8fafc; }
        .text { color: #94a3b8; line-height: 1.6; margin-bottom: 32px; }
        .button { display: inline-block; background: linear-gradient(to right, #fde68a, #f59e0b, #d97706); color: #0f172a; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 9999px; }
        .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 40px;">
          <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #f8fafc;">Mindbanger Daily</span>
        </div>
        
        <div class="card">
          <h1 class="title">Secure Magic Link</h1>
          <p class="text">
            Click the button below to securely sign in to your Mindbanger Daily account. <br/><br/>
            Wait for the page to load, no password is required.
          </p>
          
          <a href="${magicLink}" class="button">
            Sign in to The Vault
          </a>
          
          <p style="margin-top: 32px; color: #64748b; font-size: 11px;">
            This link expires soon. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        
        <div class="footer">
          Mindbanger Daily <br/>
          The way your mind is set begins to shape your reality.
        </div>
      </div>
    </body>
    </html>
    `;

    // 3. Pošleme priamo cez BREVO API pod našou 100% kontrolou
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'hello@mindbanger.com'; // Nastav si defaultny odosielaci mail

    if (!brevoApiKey) {
        throw new Error('BREVO_API_KEY is not configured in .env.local');
    }

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Mindbanger Daily', email: senderEmail },
        to: [{ email: email }],
        subject: 'Vstup do Mindbanger Vault ✨',
        htmlContent: htmlContent
      })
    });

    if (!brevoResponse.ok) {
      const respText = await brevoResponse.text();
      console.error("Brevo API Error:", respText);
      throw new Error('Nepodarilo sa odoslať email cez Brevo.');
    }

    return NextResponse.json({ success: true, message: 'Magic link sent via Brevo!' });
  } catch (err: any) {
    console.error('Magic Link Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}