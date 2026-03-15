import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Vygeneruje prihlasovaci token (OTP) ale NEPOSLE HO (posielame my cez Brevo)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError) {
      console.error('Supabase Link Error:', linkError);
      throw new Error(linkError.message);
    }

    // Tu vytahujeme len 6-miestny OTP kod namiesto klasickeho generovaneho url
    const otpCode = linkData.properties?.email_otp;
    if (!otpCode) {
      throw new Error('Nepodarilo sa vygenerovat OTP kod zo Supabase.');
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: -apple-system, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 40px; text-align: center; }
        .title { font-family: Georgia, serif; font-size: 24px; margin-bottom: 16px; color: #f8fafc; }
        .text { color: #94a3b8; line-height: 1.6; margin-bottom: 32px; font-size: 16px; }
        .otp-box { background: #0f172a; border: 1px solid #475569; padding: 24px; border-radius: 12px; margin-bottom: 32px; }
        .otp-code { color: #fde68a; font-family: monospace; font-size: 40px; font-weight: bold; letter-spacing: 8px; justify-content: center; display: flex;}
        .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body style="background-color:#0f172a;">
      <div class="container">
        <div style="text-align: center; margin-bottom: 40px;">
          <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #f8fafc;">Mindbanger Daily</span>
        </div>

        <div class="card">
          <h1 class="title">Tvoj pristupovy kod</h1>
          <p class="text">
            Zadaj tento bezpecnostny 6-miestny kod pre vstup do aplikacie.
          </p>

          <div class="otp-box">
            <span class="otp-code">${otpCode}</span>
          </div>

          <p style="color: #64748b; font-size: 12px;">
            Tento kod vyprsi o par minut. Ak si o prihlasenie neziadal, mozes tento email ignorovat.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'hello@mindbanger.com'; 
    if (!brevoApiKey) {
        throw new Error('BREVO_API_KEY is not configured');
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
        subject: 'Vstupny kod - Mindbanger Vault',
        htmlContent: htmlContent
      })
    });

    if (!brevoResponse.ok) {
      throw new Error('Nepodarilo sa odoslat email cez Brevo.');
    }

    return NextResponse.json({ success: true, message: 'OTP token sent via Brevo!' });
  } catch (err: any) {
    console.error('Magic Link Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
