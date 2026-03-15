import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import readline from 'readline';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !BREVO_API_KEY) {
  console.error("Chýbajú environmentálne premenné (Supabase alebo Brevo).");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sendReleaseEmails = async () => {
  try {
    // 1. Fetch waitlist pending users
    const { data: waitlist, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('status', 'pending');

    if (error) throw error;

    if (!waitlist || waitlist.length === 0) {
      console.log('Žiadni používatelia na waitliste so statusom "pending".');
      process.exit(0);
    }

    console.log(`Našli sme ${waitlist.length} používateľov na waitliste.`);
    
    // Rozdelené podľa jazykov
    const langGroups: Record<string, string[]> = { en: [], sk: [], cs: [] };
    
    for (const user of waitlist) {
       const lang = user.language || 'en';
       if (!langGroups[lang]) langGroups[lang] = [];
       langGroups[lang].push(user.email);
    }

    console.log('Počty podľa jazykov:');
    console.log(`EN: ${langGroups.en.length}`);
    console.log(`SK: ${langGroups.sk.length}`);
    console.log(`CS: ${langGroups.cs.length}`);

    rl.question('\nChcete TERAZ odoslať E-MAILY o OTVORENÍ a pozvať ich dnu pomocou tokenu "beta2026"? (napíš "ano", ak chceš pokračovať): ', async (answer) => {
        if (answer.toLowerCase() !== 'ano') {
            console.log('Zrušené používateľom.');
            process.exit(0);
        }

        console.log('\nOdosielam e-maily...');

        let totalSent = 0;

        for (const [lang, emails] of Object.entries(langGroups)) {
            if (emails.length === 0) continue;

            const bccList = emails.map((email: string) => ({ email }));
            
            // Šablóny (môžeš si tu text prispôsobiť)
            let subject = "Mindbanger is officially open! 🎵";
            let headline = "Welcome early bird";
            let contentText = "The wait is over. You can now access your Mindbanger Daily dashboard. Use our special beta checkout link to configure your subscription.";
            let cta = "Complete Checkout";
            
            if (lang === 'sk') {
                subject = "Mindbanger je oficiálne otvorený! 🎵";
                headline = "Dvere sú otvorené";
                contentText = "Čakanie skončilo. Odteraz máš prístup k svojmu Mindbanger Daily dashboardu. Použi tento špeciálny beta link na dokončenie tvojej registrácie.";
                cta = "Pokračovať k objednávke";
            } else if (lang === 'cs') {
                subject = "Mindbanger je oficiálně otevřen! 🎵";
                headline = "Dveře jsou otevřené";
                contentText = "Čekání skončilo. Odteď máš přístup k svému Mindbanger Daily dashboardu. Použij tento speciální beta odkaz na dokončení tvé registrace.";
                cta = "Pokračovat k objednávce";
            }

            const checkoutUrl = `https://mindbanger.com/checkout?invite=beta2026`;

            const emailData = {
                sender: { name: "Mindbanger", email: "hello@mindbanger.com" },
                to: [{ email: "hello@mindbanger.com", name: "Mindbanger Early Adopters" }],
                bcc: bccList,
                subject: subject,
                htmlContent: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #050505; color: #ffffff; border-radius: 12px; border: 1px solid #1a1a1a;">
                  <h2 style="color: #ffffff; text-align: center; margin-bottom: 20px;">${headline}</h2>
                  <p style="font-size: 16px; line-height: 1.6; color: #cccccc; text-align: center;">
                    ${contentText}
                  </p>
                  <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                    <a href="${checkoutUrl}" style="background-color: #f59e0b; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px;">
                      ${cta}
                    </a>
                  </div>
                </div>
                `
            };

            const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': BREVO_API_KEY
                },
                body: JSON.stringify(emailData)
            });

            if (!brevoResponse.ok) {
                console.error(`Chyba pri odosielaní jazyka ${lang}:`, await brevoResponse.text());
            } else {
                totalSent += emails.length;
                console.log(`Odoslané: ${emails.length} e-mailov pre ${lang.toUpperCase()} publikum.`);
                
                // Aktualizácia statusov na pozvaný (invited)
                await supabase
                    .from('waitlist')
                    .update({ status: 'invited' })
                    .in('email', emails);
            }
        }

        console.log(`\n✅ Hotovo! Celkovo pozvaných používateľov: ${totalSent}`);
        process.exit(0);
    });

  } catch (error) {
    console.error("Chyba:", error);
    process.exit(1);
  }
};

sendReleaseEmails();
