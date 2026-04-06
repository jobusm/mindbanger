import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const test = async () => {
    // first insert a test org manually if needed, or query one
    const {data: org} = await supabase.from('organizations').select('id').limit(1).single();
    if(!org) { console.log('no org'); return; }
    
    const testEmail = 'singletest@example.com';
    
    // 1. insert test1
    await supabase.from('organization_members').insert({ organization_id: org.id, email: testEmail });
    
    // 2. upsert test1 with ignore duplicates
    const toInsert = { organization_id: org.id, email: testEmail, role: 'member', status: 'invited' };
    const { data, error } = await supabase.from('organization_members')
        .upsert(toInsert, { onConflict: 'organization_id,email', ignoreDuplicates: true })
        .select('*')
        .maybeSingle(); // Does it return null instead of throwing?
        
    console.log('Error:', error);
    console.log('Data returned:', data);
    
    // clean up
    await supabase.from('organization_members').delete().in('email', [testEmail]);
};
test();
