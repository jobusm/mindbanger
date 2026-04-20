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
        subject: "Vstupn� k�d - Mindbanger Vault",
        title: "Tvoj overovac� k�d",
        subtitle: "Skop�ruj si alebo si zapam�taj tento 6-miestny k�d:",
        button: "Prejs� na zadanie k�du",
        description: "Ak si sa sem dostal z inej aplik�cie, stla� tla�idlo vy��ie, ktor� �a bezpe�ne prepne sp� do prehliada�a priamo na zadanie k�du.",
        footer: "Tento email bol vygenerovan� automaticky. Ak si o tento k�d ne�iadal, m��e� t�to spr�vu ignorova�."
      }
    };

    return NextResponse.json({ success: true, message: 'Link sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 });
  }
}
