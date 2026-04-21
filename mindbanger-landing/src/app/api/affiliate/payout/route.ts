import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const payoutSchema = z.object({
  affiliateId: z.string().uuid('Neplatné ID affiliate partnera'),
  amount: z.number().positive('Suma musí byť kladná').min(20, 'Minimálna suma na výplatu je 20 EUR'),
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

    // CHECK: Guard against duplicate pending requests
    const { count: pendingCount, error: countErr } = await supabase
        .from('payout_requests')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', affiliateId)
        .eq('status', 'pending');
        
    if (!countErr && pendingCount !== null && pendingCount > 0) {
        return NextResponse.json({ error: 'Máte už jeden nespracovaný výber (pending). Počkajte na jeho vybavenie.' }, { status: 409 });
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
      if (insertError.code === '23505' || (insertError.message && insertError.message.includes('duplicate'))) { return NextResponse.json({ error: 'Máte už jeden nespracovaný výber (pending). Počkajte na jeho vybavenie.' }, { status: 409 }); }
      // Fallback pre pripad ak tabulka payout_requests este neexistuje v databaze:
      // Ulozime notifikaciu do nejakej inej formy
      console.error('Insert payout_request error');
      
      // Pokus poslat si to na support logovaciu strukturu:
      try {
        await supabase.from('contact_messages').insert([
          { email: session.user.email, name: 'Affiliate System', message: `PAYOUT_ERROR|REQUEST: Affiliate requested ${amount} EUR. Please process manually.` }
        ]);
      } catch (err) {
        // Ignorujeme
      }
      return NextResponse.json({ error: 'Payout process failed, system notified' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Payout request failed');
    return NextResponse.json({ error: 'Nastala chyba pri spracovaní žiadosti o výplatu' }, { status: 500 });
  }
}
