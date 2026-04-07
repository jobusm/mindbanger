import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    for (const table of ['corporate_signals', 'onboarding_signals']) {
        const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
        if (data && data.length > 0) {
            console.log(table, ':', Object.keys(data[0]).join(', '));
        } else {
            console.log('No rows for', table, 'error:', error);
            // Lets fetch the definition via RPC or simple insert fail?
        }
    }
}
run();
