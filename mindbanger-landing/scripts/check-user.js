const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const email = "miroslav.jobus@gmail.com";
  console.log(`Checking user: ${email}...`);
  
  const { data: usersData, error: userErr } = await supabase.auth.admin.listUsers();
  const user = usersData?.users?.find(u => u.email === email);
  
  if (!user) {
    console.log("User not found in auth.users!");
    return;
  }
  
  console.log(`User ID: ${user.id}`);
  
  const { data: profile, error: profErr } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  
  if (profErr) {
    console.log("Error fetching profile:", profErr.message);
  } else if (!profile) {
    console.log("Profile NOT FOUND for this user ID in 'profiles' table!");
  } else {
    console.log("Profile data:", profile);
  }
}

check();
