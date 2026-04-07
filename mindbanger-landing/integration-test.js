import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function start() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const sourceId = '4e9eba33-9b56-4948-a1e7-128c4a10872e';
    const type = 'personal';
    const targetLanguages = ['en'];
    const table = 'daily_signals';

    const { data: sourceRow, error: fetchErr } = await supabase.from(table).select('*').eq('id', sourceId).single();
    if (fetchErr) { console.log(fetchErr); return; }

    for (const lang of targetLanguages) {
        let newRow = { ...sourceRow };
        delete newRow.id;
        delete newRow.created_at;
        delete newRow.updated_at;
        
        newRow.language = lang;
        newRow.spoken_audio_url = null;
        newRow.meditation_audio_url = null;
        
        newRow.script = 'Mock translated EN';
        
        const { data: existing } = await supabase.from('daily_signals').select('id').eq('date', sourceRow.date).eq('language', lang).single();
        if (existing) {
            newRow.id = existing.id; // UPDATE existing
        }
        
        let inserted;
        let insertErr;
        
        if (newRow.id) {
            console.log("UPDATING", newRow.id);
            const res = await supabase.from(table).update(newRow).eq('id', newRow.id).select().single();
            inserted = res.data;
            insertErr = res.error;
        } else {
            console.log("INSERTING", newRow.language);
            const res = await supabase.from(table).insert(newRow).select().single();
            inserted = res.data;
            insertErr = res.error;
        }

        console.log("Result:", inserted != null ? 'Inserted OK' : null);
        console.log("Err:", insertErr);
    }
}
start();
