import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const sourceId = '4e9eba33-9b56-4948-a1e7-128c4a10872e';
    const lang = 'cs';

    const { data: sourceRow } = await supabaseAdmin.from('daily_signals').select('*').eq('id', sourceId).single();

    let newRow = { ...sourceRow };
    delete newRow.id;
    delete newRow.created_at;
    delete newRow.updated_at;

    newRow.language = lang;
    newRow.theme = 'TEST THEME';
    newRow.title = 'TEST THEME';
    newRow.focus = 'TEST FOCUS';
    newRow.focus_text = 'TEST FOCUS';
    newRow.affirmation = 'TEST AFFIRMATION';
    newRow.script = 'TEST SCRIPT';
    newRow.signal_text = 'TEST SCRIPT';
    newRow.meditation_text = '';
    newRow.push_text = null;
    newRow.status = 'draft';
    newRow.spoken_audio_url = null;
    newRow.meditation_audio_url = null;

    const { data: existing } = await supabaseAdmin.from('daily_signals').select('id').eq('date', sourceRow.date).eq('language', lang).single();
    if (existing) {
        newRow.id = existing.id;
    }

    if (newRow.id) {
        console.log('Update');
        const res = await supabaseAdmin.from('daily_signals').update(newRow).eq('id', newRow.id).select().single();
        console.log('res.error:', res.error);
        console.log('res.data:', res.data?.id);
    } else {
        console.log('Insert');
        const res = await supabaseAdmin.from('daily_signals').insert(newRow).select().single();
        console.log('res.error:', res.error);
        console.log('res.data:', res.data?.id);
    }
}
run();
