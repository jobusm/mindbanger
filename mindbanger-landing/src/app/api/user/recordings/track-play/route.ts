import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { recordingId } = await request.json();
    
    if (!recordingId) {
      return NextResponse.json({ error: 'Missing recordingId' }, { status: 400 });
    }

    // Verify session
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call Supabase RPC for atomic increment
    const { data: newCount, error } = await supabase
      .rpc('increment_play_count', { record_id: recordingId });

    if (error) {
      console.error('RPC Error incrementing play count:', error);
      throw error;
    }

    return NextResponse.json({ success: true, play_count: newCount });

  } catch (error: any) {
    console.error('Error tracking play:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
