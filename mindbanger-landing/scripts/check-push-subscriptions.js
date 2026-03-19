
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkPushSubscriptions() {
  console.log('\n=======================================');
  console.log('  🔍 PUSH NOTIFICATION DIAGNOSTICS');
  console.log('=======================================\n');

  console.log('1️⃣  Checking "push_subscriptions" (Browser endpoints)...');
  const { data: pushData, error: pushError, count: pushCount } = await supabase
    .from('push_subscriptions')
    .select('*', { count: 'exact' });

  if (pushError) {
    if (pushError.code === '42P01') {
      console.log('❌  Table "push_subscriptions" DOES NOT EXIST.');
    } else {
      console.error('❌  Error:', pushError.message);
    }
  } else {
    console.log(`✅  Found ${pushCount} browser subscriptions.`);
    if (pushData.length > 0) console.table(pushData);
  }

  console.log('\n2️⃣  Checking "subscriptions" (Billing status)...');
  // Used by cron job to filter ACTIVE users
  const { data: subData, error: subError, count: subCount } = await supabase
    .from('subscriptions')
    .select('user_id, status', { count: 'exact' });

  if (subError) {
    if (subError.code === '42P01') {
      console.log('❌  Table "subscriptions" DOES NOT EXIST. (Cron job will fail)');
    } else {
      console.error('❌  Error:', subError.message);
    }
  } else {
     console.log(`✅  Found ${subCount} billing subscriptions.`);
     if (subData.length > 0) {
        console.table(subData);
        // Check for active ones
        const active = subData.filter(s => s.status === 'active' || s.status === 'trialing');
        console.log(`ℹ️  Active/Trialing Users: ${active.length}`);
     } else {
        console.log('ℹ️  No billing subscriptions found. Cron job skips users without active billing.');
     }
  }
}

checkPushSubscriptions();
