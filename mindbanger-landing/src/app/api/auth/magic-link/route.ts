import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/email";
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // Basic IP-based rate limiting fallback
    if (rateLimit) {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const { success } = await rateLimit.limit(`magic-link_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      }
    }

    const { email, options, lang = "sk" } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    try {
      const { data: userList } = await supabase.auth.admin.listUsers();
      const existingUser = userList.users.find(u => u.email === email);
      
      if (!existingUser) {
        await supabase.auth.admin.createUser({
            email: email,
            email_confirm: true,
            user_metadata: options?.data
        });
      } else if (options?.data) {
        await supabase.auth.admin.updateUserById(existingUser.id, {
            user_metadata: { ...existingUser.user_metadata, ...options.data }
        });
      }
    } catch (createError: any) {
    }

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
    });

    if (linkError) {
      console.error("Supabase Link Error:", linkError);
      throw new Error(linkError.message);
    }

    const otpCode = linkData.properties?.email_otp;
    if (!otpCode) {
      throw new Error("Nepodarilo sa vygenerovat OTP kod zo Supabase.");
    }

    const t: Record<string, any> = {
      sk: {
        subject: "Vstupný kód - Mindbanger Vault",
        title: "Tvoj overovací kód",
        subtitle: "Skopíruj si alebo si zapamätaj tento 6-miestny kód:",
        button: "Prejsť na zadanie kódu",
        description: "Ak si sa sem dostal z inej aplikácie, stlač tlačidlo vyššie, ktoré ťa bezpečne prepne späť do prehliadača priamo na zadanie kódu.",
        footer: "Tento email bol vygenerovaný automaticky. Ak si o tento kód nežiadal, môžeš túto správu ignorovať."
      }
    };

    const htmlContent = lang === 'sk' ? `
      <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a; margin-bottom: 24px;">${t.sk.title}</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              ${t.sk.subtitle} <strong>${otpCode}</strong>
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mindbanger.com'}/auth/verify" style="display: inline-block; padding: 14px 28px; background-color: #f59e0b; color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  ${t.sk.button}
              </a>
          </div>
          <p style="font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              ${t.sk.description}
          </p>
      </div>` : `
      <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a; margin-bottom: 24px;">Entry Code - Mindbanger Vault</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Your verification code is: <strong>${otpCode}</strong>
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mindbanger.com'}/auth/verify" style="display: inline-block; padding: 14px 28px; background-color: #f59e0b; color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Go to verification
              </a>
          </div>
      </div>`;

    const { success, error: emailError } = await sendEmail({
      to: email,
      subject: lang === 'sk' ? t.sk.subject : "Entry code - Mindbanger Vault",
      html: htmlContent
    });

    if (!success) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Link sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 });
  }
}
