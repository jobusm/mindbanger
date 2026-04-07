import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function start() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    // Delete the mock row we inserted for CS
    await supabase.from('daily_signals').delete().eq('language', 'cs').eq('date', '2026-04-08');
    await supabase.from('daily_signals').delete().eq('language', 'en').eq('date', '2026-04-08');
    console.log("Cleanup done.");
}
start();
