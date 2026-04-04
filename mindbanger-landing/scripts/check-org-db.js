require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const { data: users } = await supabase.auth.admin.listUsers();
    console.log("Users:", users.users.map(u => ({ id: u.id, email: u.email })));

    const { data: orgs } = await supabase.from('organizations').select('*');
    console.log("Organizations:", orgs);

    const { data: members } = await supabase.from('organization_members').select('*');
    console.log("Members:", members);

}

check();