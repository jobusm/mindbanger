import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, options } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. (Variant B) Check if user exists, if not, create them so they can receive the code
    try {
      // Just check existence first
      const { data: userList } = await supabase.auth.admin.listUsers();
      
      const existingUser = userList.users.find(u => u.email === email);
      
      if (!existingUser) {
        await supabase.auth.admin.createUser({
            email: email,
            email_confirm: true,
            user_metadata: options?.data // Save consents
        });
      } else if (options?.data) {
        // Update existing user with new consents if provided (e.g. re-registering)
        await supabase.auth.admin.updateUserById(existingUser.id, {
            user_metadata: { ...existingUser.user_metadata, ...options.data }
        });
      }

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
        .card { background-color: rgba(30, 41, 59, 1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; text-align: center; }
        .title { font-family: Georgia, serif; font-size: 24px; margin-bottom: 16px; color: #f8fafc; }
        .text { color: #94a3b8; line-height: 1.6; margin-bottom: 24px; font-size: 16px; }
        .code-box { background-color: #0f172a; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #fde68a; justify-content: center; display: flex; }
        .button { display: inline-block; background: linear-gradient(to right, #fde68a, #f59e0b, #d97706); color: #0f172a !important; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 9999px; box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.4); font-size: 16px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body style="background-color:#0f172a;">
      <div class="container">
        <div class="header" style="text-align: center; margin-bottom: 40px;">
          <span class="logo" style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #f8fafc;">Mindbanger Daily</span>
        </div>

        <div class="card">
          <h1 class="title">Tvoj overovací kód</h1>
          <p class="text">
            Skopíruj si alebo si zapamätaj tento 6-miestny kód:
          </p>

          <div class="code-box">
            ${otpCode}
          </div>

          <p class="text" style="font-size: 14px;">
            Ak si sa sem dostal z inej aplikácie, stlač tlačidlo nižšie, ktoré ťa bezpečne prepne späť do prehliadača priamo na zadanie kódu.
          </p>
          
          <a href="https://mindbanger.com/login?step=otp&email=${encodeURIComponent(email)}" class="button">
            Prejsť na zadanie kódu
          </a>
        </div>
        
        <div class="footer">
          &copy; 2026 Mindbanger Daily<br/>
          Tento email bol vygenerovaný automaticky. Ak si o tento kód nežiadal, môžeš túto správu ignorovať.
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

