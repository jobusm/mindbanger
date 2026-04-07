import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function start() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: signals, error } = await supabase.from('daily_signals').select('id, date, language, script, status').eq('date', '2026-04-08');
    console.log("Signals for 2026-04-08:");
    console.log(signals);
}
start();
