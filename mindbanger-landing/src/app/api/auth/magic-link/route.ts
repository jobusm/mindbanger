import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. (Variant B) Check if user exists, if not, create them so they can receive the code
    try {
      // Just check existence first
      const { data: userList } = await supabase.auth.admin.listUsers(); // Note: inefficient for large user base, better use getUserById or attempt create
      // Actually, createUser with same email throws error, which is fine
      await supabase.auth.admin.createUser({
          email: email,
          email_confirm: true // Auto-confirm so they can login immediately? Or false to require verification?
          // Since we use OTP for login, that IS the verification.
          // If we set confirm: true, they are verified.
      });
    } catch (createError: any) {
        // Ignore "User already registered" error
        // console.log("User likely exists or error in creation:", createError.message);
    }

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

    const { success, error } = await sendEmail({
      to: email,
      subject: 'Vstupný kód - Mindbanger Vault',
      html: htmlContent
    });

    if (!success) {
      console.error('Email API Error:', error);
      throw new Error('Nepodarilo sa odoslať email.');
    }

    return NextResponse.json({ success: true, message: 'OTP token sent via Email!' });
  } catch (err: any) {
    console.error('Magic Link Route Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
