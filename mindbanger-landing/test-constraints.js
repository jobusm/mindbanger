import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function start() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: res, error } = await supabase.rpc('duplicate_this_does_not_exist');
    // Wait, let's just insert and see if it fails for corporate_signals
    
    const { data: sourceRow } = await supabase.from('corporate_signals').select('*').limit(1).single();
    if (!sourceRow) { console.log('no corp signals'); return; }
    let newRow = { ...sourceRow };
    delete newRow.id;
    newRow.language = 'cs';
    const { error: err } = await supabase.from('corporate_signals').insert(newRow);
    console.log("Corp Insert Error:", err);
}
start();
