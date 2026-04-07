import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const sourceId = '4e9eba33-9b56-4948-a1e7-128c4a10872e';
    const lang = 'cs';
    const { data: sourceRow, error: fetchErr } = await supabaseAdmin.from('daily_signals').select('*').eq('id', sourceId).single();
    if (fetchErr) { console.error('fetch err', fetchErr); return; }
    
    console.log('Got source row, theme:', sourceRow.theme || sourceRow.title);
    
    // Simulate what happens at line 66:
    const textContent = {
        theme: sourceRow.theme || sourceRow.title || '',
        focus: sourceRow.focus || sourceRow.focus_text || '',
        affirmation: sourceRow.affirmation || '',
        script: sourceRow.script || sourceRow.signal_text || '',
        meditation_text: sourceRow.meditation_text || '',
        push_text: sourceRow.push_text || ''
    };

    if (!textContent.theme && !textContent.script) {
        console.log('Skipping due to empty content');
        return;
    }
    console.log('Would translate:', textContent);
}
run();
