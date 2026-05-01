import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data } = await supabase.from('payout_requests').select('*');
  console.log('PAYOUTS', data);
  const { data: refs } = await supabase.from('referrals').select('id, payout_request_id, status');
  console.log('REFS count', refs?.length);
  process.exit(0);
}
run();
