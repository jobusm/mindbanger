import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const test = async () => {
    const { data: orgs } = await supabase.from('organizations').select('id').ilike('name', '%Milkam%');
    if (!orgs || orgs.length===0) return;
    const orgId = orgs[0].id;
    
    const { data: members, error } = await supabase
      .from('organization_members')
      .select('id, email, role, status, created_at, user_id, profiles(full_name, avatar_url)')
      .eq('organization_id', orgId);
      
    console.log("Error:", error);
    console.log("Members returned:", members ? members.length : 0);
};
test();
