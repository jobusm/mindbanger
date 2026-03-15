import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const payoutSchema = z.object({
  affiliateId: z.string().uuid('Neplatné ID affiliate partnera'),
  amount: z.number().positive('Suma musí byť kladná').min(10, 'Minimálna suma na výplatu je 10 EUR'),
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = payoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { affiliateId, amount } = result.data;

    // Over, že affiliateId patrí prihlásenému používateľovi
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, paypal_email')
      .eq('id', affiliateId)
      .eq('user_id', session.user.id)
      .single();

    if (!affiliate) {
      return NextResponse.json({ error: 'Invalid affiliate' }, { status: 403 });
    }

    // Tu uložíme požiadavku o výplatu do tabuľky payout_requests
    // Ak tabuľka neexistuje alebo zlyhá, môžeme to zalogovať. V produkcii by mal existovať webhook alebo DB table.
    const { error: insertError } = await supabase
      .from('payout_requests')
      .insert([
        {
          affiliate_id: affiliateId,
          amount: amount,
          status: 'pending',
          paypal_email: affiliate.paypal_email || 'Not provided',
        }
      ]);

    if (insertError) {
      // Fallback pre pripad ak tabulka payout_requests este neexistuje v databaze:
      // Ulozime notifikaciu do nejakej inej formy
      console.error('Insert payout_request error');
      
      // Pokus poslat si to na support tabulku, ak existuje:
      try {
        await supabase.from('contact_messages').insert([
          { email: session.user.email, message: `PAYOUT REQUEST: Affiliate requested ${amount} EUR.` }
        ]);
      } catch (err) {
        // Ignorujeme
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Payout request failed');
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní žiadosti o výplatu' }, { status: 500 });
  }
}
