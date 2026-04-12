import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, options, lang = "sk" } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
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
      type: "magiclink",
      email: email,
    });

    if (linkError) {
      console.error("Supabase Link Error:", linkError);
      throw new Error(linkError.message);
    }

    // Tu vytahujeme len 6-miestny OTP kod namiesto klasickeho generovaneho url
    const otpCode = linkData.properties?.email_otp;
    if (!otpCode) {
      throw new Error("Nepodarilo sa vygenerovat OTP kod zo Supabase.");
    }

    const t: Record<string, any> = {
      sk: {
        title: "Prihlásenie do Mindbanger Daily",
        subject: "Vstupný kód: ${otpCode}",
        html: `
${otpHtml}

    <p style="color: #94a3b8; font-size: 16px; margin-top: 24px;">
      Alebo môžeš použiť tento link na prihlásenie:
      <br/>
      <a href="${magicLink}" style="color: #3b82f6;">Klikni sem pre prihlásenie</a>
    </p>
        `
      },
      cz: {
        title: "Přihlášení do Mindbanger Daily",
        subject: "Vstupní kód: ${otpCode}",
        html: `
${otpHtml}

    <p style="color: #94a3b8; font-size: 16px; margin-top: 24px;">
      Nebo můžeš použít tento link pro přihlášení:
      <br/>
      <a href="${magicLink}" style="color: #3b82f6;">Klikni sem pro přihlášení</a>
    </p>
        `
      }\n    };\n    
    // fallback to SK
    const txt = t[lang] || t.sk;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background-color: rgba(30, 41, 59, 1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px 20px; text-align: center; }
        .title { font-family: Georgia, serif; font-size: 24px; margin-bottom: 16px; color: #f8fafc; }
        .text { color: #94a3b8; line-height: 1.6; font-size: 16px; margin: 0;}
        .code-box { background-color: #0f172a; border: 2px dashed #4ade80; border-radius: 12px; padding: 24px 10px; margin: 32px 0; font-size: 36px; font-weight: bold; letter-spacing: 4px; color: #fde68a; justify-content: center; display: block; word-break: break-all; }
        .button { display: inline-block; background: linear-gradient(to right, #4ade80, #22c55e, #16a34a); color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 18px 40px; border-radius: 9999px; box-shadow: 0 4px 14px 0 rgba(34, 197, 94, 0.4); font-size: 18px; margin: 0px 0 24px 0; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 12px; }
        @media only screen and (max-width: 480px) {
            .code-box { font-size: 32px; letter-spacing: 2px; }
            .card { padding: 30px 15px; }
        }
      </style>
    </head>
    <body style="background-color:#0f172a;">
      <div class="container">
        <div class="header" style="text-align: center; margin-bottom: 40px;">
          <span style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #f8fafc; display: inline-block; vertical-align: middle; margin-right: 15px;">Mindbanger <span style="color: #f59e0b;">Daily</span></span>
          <img src="https://mindbanger.com/logo.png" alt="Mindbanger" style="height: 40px; width: auto; object-fit: contain; display: inline-block; vertical-align: middle;">
        </div>
        <div class="card">
          <h1 class="title">${txt.title}</h1>
          <p class="text" style="margin-bottom: 24px;">
            ${txt.subtitle}
          </p>
          <div class="code-box">
            ${otpCode}
          </div>
          <a href="https://mindbanger.com/login?step=otp&email=${encodeURIComponent(email)}" class="button">
            ${txt.button}
          </a>
          <p class="text" style="font-size: 14px; margin-top: 24px; color: #64748b;">
            ${txt.description}
          </p>
        </div>
        <div class="footer">
          &copy; 2026 Mindbanger Daily<br/>
          ${txt.footer}
        </div>
      </div>
    </body>
    </html>
    `;

    const { success, error } = await sendEmail({
      to: email,
      subject: txt.subject,
      html: htmlContent
    });

    if (!success) {
      console.error("Email API Error:", error);
      throw new Error("Nepodarilo sa odosla� email.");
    }

    return NextResponse.json({ success: true, message: "OTP token sent via Email!" });
  } catch (err: any) {
    console.error("Magic Link Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
