import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const check = async () => {
    console.log('Looking for Milkam...');
    const { data: orgs, error: orgErr } = await supabase.from('organizations').select('*').ilike('name', '%Milkam%');
    console.log('Orgs:', orgs);
    for (const org of orgs || []) {
        const { data: members } = await supabase.from('organization_members').select('*').eq('organization_id', org.id);
        console.log('Members count:', members ? members.length : 0);
        console.log('First 5:', members.slice(0, 5));
    }
};
check();
