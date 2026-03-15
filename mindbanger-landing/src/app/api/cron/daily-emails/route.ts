import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { dailyEmailTemplates, generateEmailHtml } from '@/lib/email-templates';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response('Server Error', { status: 500 });
    }

    // Bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch active/trialing subscriptions & their user profiles to get language
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        customer_email,
        user_id,
        profiles (
          preferred_language
        )
      `)
      .in('status', ['active', 'trialing']);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return new Response('Error fetching subscriptions from database', { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No active subscriptions found.' });
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('Missing BREVO_API_KEY');
      return new Response('Server Error', { status: 500 });
    }

    // Group emails by language
    const langGroups: Record<string, string[]> = { en: [], sk: [], cs: [] };
    
    // De-duplicate emails based on best profile language found
    const processedEmails = new Set<string>();

    for (const sub of subscriptions) {
      if (!sub.customer_email || processedEmails.has(sub.customer_email)) continue;
      
      const lang = (sub.profiles as any)?.preferred_language || 'en';
      const safeLang = langGroups[lang] ? lang : 'en'; // default to en if missing

      langGroups[safeLang].push(sub.customer_email);
      processedEmails.add(sub.customer_email);
    }

    let sentBatches = 0;

    // Send emails grouped by language via Brevo
    for (const [lang, emails] of Object.entries(langGroups)) {
      if (emails.length === 0) continue;

      const template = dailyEmailTemplates[lang as keyof typeof dailyEmailTemplates];
      const htmlContent = generateEmailHtml(
        template.headline, 
        template.body, 
        template.cta, 
        template.url
      );

      const emailData = {
        sender: { name: "Mindbanger", email: "hello@mindbanger.com" },
        to: [{ email: "hello@mindbanger.com", name: "Mindbanger Subscribers" }], // dummy TO
        bcc: emails.map(email => ({ email })), // BCC to actual recipients
        subject: template.subject,
        htmlContent: htmlContent
      };

      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify(emailData)
      });

      if (!brevoResponse.ok) {
        const errorData = await brevoResponse.text();
        console.error(`Brevo API error for lang ${lang}:`, errorData);
      } else {
        sentBatches++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      sentEmailsCount: processedEmails.size,
      batches: sentBatches
    });
  } catch (err: any) {
    console.error('Cron job error:', err.message);
    return new Response('Internal Server Error', { status: 500 });
  }
}
