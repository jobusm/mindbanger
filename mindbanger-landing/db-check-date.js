import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function start() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: signals } = await supabase.from('daily_signals').select('id, date, language, script').eq('date', '2026-04-08');
    console.log("All signals for 2026-04-08:", signals);
}
start();
