import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Verify CRON_SECRET to ensure only Vercel (or authorized client) can run this
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 2. Connect to Supabase bypassing RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response('Server Error', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Fetch active and trialing subscriptions
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('customer_email')
      .in('status', ['active', 'trialing']);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return new Response('Error fetching subscriptions from database', { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No active subscriptions found. Skipping emails.' });
    }

    // Extract unique emails
    const uniqueEmails = Array.from(new Set(subscriptions.map(sub => sub.customer_email).filter(Boolean)));

    if (uniqueEmails.length === 0) {
      return NextResponse.json({ message: 'No valid email addresses found among subscriptions.' });
    }

    // 4. Send Email via Brevo
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('Missing BREVO_API_KEY');
      return new Response('Server Error', { status: 500 });
    }

    // Map unique emails to Brevo's required bcc object format
    const bccList = uniqueEmails.map(email => ({ email }));

    const emailData = {
      sender: { name: "Mindbanger", email: "hello@mindbanger.com" },
      // Send TO a dummy address (or admin address) and BCC everyone else so they don't see each other
      to: [{ email: "hello@mindbanger.com", name: "Mindbanger Subscribers" }],
      bcc: bccList,
      subject: "Dnešný signál je pripravený 🎵",
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #000000; color: #ffffff; border-radius: 12px; border: 1px solid #333;">
          <h2 style="color: #ffffff; text-align: center; margin-bottom: 20px;">Dobré ráno, čas na tvoj rituál.</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #cccccc; text-align: center;">
            Dnešný signál je už naladený na frekvenciu.
          </p>
          <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
            <a href="https://mindbanger.com/app/today" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px;">
              Spustiť dnešný signál
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
        'api-key': brevoApiKey
      },
      body: JSON.stringify(emailData)
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error('Brevo API error:', errorData);
      return new Response('Error sending emails via Brevo', { status: 500 });
    }

    return NextResponse.json({ success: true, sentCount: uniqueEmails.length });
  } catch (err: any) {
    console.error('Cron job error:', err.message);
    return new Response('Internal Server Error', { status: 500 });
  }
}
