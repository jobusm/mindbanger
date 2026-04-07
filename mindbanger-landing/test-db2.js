import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function start() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: sourceRow } = await supabase.from('daily_signals').select('*').limit(1).single();
    let newRow = { ...sourceRow };
    delete newRow.id;
    delete newRow.created_at;
    delete newRow.updated_at;
    newRow.language = 'cs';
    const { data, error } = await supabase.from('daily_signals').insert(newRow).select().single();
    console.log("Insert Error:", error);
}
start();
