import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkRLS() {
  const { data, error } = await supabase.rpc('execute_sql_query', {
    sql: "SELECT * FROM pg_policies WHERE tablename = 'onboarding_signals';"
  });
  console.log('Policies:', data || error);
}

checkRLS();
