import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { recordingId } = await request.json();
    
    if (!recordingId) {
      return NextResponse.json({ error: 'Missing recordingId' }, { status: 400 });
    }

    // Call Supabase RPC or just fetch and increment (not fully safe from race conditions but enough for play count)
    // Since we don't have a custom RPC increment, we'll read then update.
    const { data: rec, error: fetchErr } = await supabaseAdmin
      .from('individual_recordings')
      .select('play_count')
      .eq('id', recordingId)
      .single();
      
    if (fetchErr) throw fetchErr;

    const newCount = (rec.play_count || 0) + 1;

    const { error: updateErr } = await supabaseAdmin
      .from('individual_recordings')
      .update({ play_count: newCount })
      .eq('id', recordingId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, play_count: newCount });

  } catch (error: any) {
    console.error('Error tracking play:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
