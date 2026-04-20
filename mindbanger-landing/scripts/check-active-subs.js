require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubscriptions() {
  console.log("Fetching profiles with active subscriptions...");
  
  // Try to find users with active subscription
  const { data: activeProfiles, error: activeErr } = await supabase
    .from('profiles')
    .select('id, email, full_name, is_subscribed, subscription_status, subscription_tier, b2b_status');
    
  if (activeErr) {
    console.error("Error fetching profiles:", activeErr.message);
    return;
  }
  
  // Filter for active ones (depending on how the status is stored)
  const actives = activeProfiles.filter(p => 
    p.is_subscribed === true || 
    p.subscription_status === 'active' || 
    p.subscription_status === 'trialing' ||
    p.b2b_status === 'active'
  );
  
  console.log(`Found ${actives.length} active profiles:`);
  actives.forEach(p => {
    console.log(`- ${p.email} (Status: ${p.subscription_status}, is_subscribed: ${p.is_subscribed}, Tier: ${p.subscription_tier})`);
  });
  
  console.log("\n-----------------------------------\n");
  console.log("Checking specifically for jobusmiro@gmail.com...");
  
  const targetEmail = "jobusmiro@gmail.com";
  
  // First, find the auth user to get the correct email from auth.users (sometimes profile.email is not synced)
  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUser = authData?.users?.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
  
  if (!authUser) {
    console.log(`User ${targetEmail} not found in Supabase Auth.`);
    // Try to find directly in profiles just in case
    const targetProfile = activeProfiles.find(p => p.email?.toLowerCase() === targetEmail.toLowerCase());
    if (targetProfile) {
        console.log("Found in profiles:", targetProfile);
    }
    return;
  }
  
  console.log(`Found user in Auth: ID = ${authUser.id}`);
  
  const { data: profileTarget, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();
    
  if (profErr) {
    console.error("Error fetching target profile:", profErr.message);
  } else if (!profileTarget) {
    console.log("Profile not found for this Auth ID!");
  } else {
    console.log("FULL PROFILE FOR jobusmiro@gmail.com:");
    console.log(JSON.stringify(profileTarget, null, 2));
  }
}

checkSubscriptions();
