import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

// using anon key since frontend uses anon key generally, wait, admin frontend might use anon key with a session!
// Let's first test if something fails.
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
  const { data, error } = await supabaseAdmin.from('onboarding_signals').delete().eq('theme', 'test');
  console.log("Admin delete:", error || "Success");
}

testInsert();