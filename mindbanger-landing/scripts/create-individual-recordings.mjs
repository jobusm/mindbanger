import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Chyba: NEXT_PUBLIC_SUPABASE_URL alebo SUPABASE_SERVICE_ROLE_KEY chýba v .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Vytváram tabuľku individual_recordings...");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS public.individual_recordings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      audio_url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );

    ALTER TABLE public.individual_recordings ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist so this script is idempotent
    DROP POLICY IF EXISTS "Users can view their own individual recordings" ON public.individual_recordings;
    DROP POLICY IF EXISTS "Admins can manage all individual recordings" ON public.individual_recordings;

    CREATE POLICY "Users can view their own individual recordings" ON public.individual_recordings
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Admins can manage all individual recordings" ON public.individual_recordings
      FOR ALL USING (auth.jwt() ->> 'email' IN ('miroslav.jobus@gmail.com', 'admin@mindbanger.com'));
  `;

  // We can execute raw SQL using Supabase RPC if a custom raw query function exists.
  // Alternatively, we use Postgres directly or direct API call if it bypasses RPC restrictions.
  // The simplest reliable way for Supabase is to try fetching from it, or if it fails, telling the user to paste this to the console.
  
  // Since supabase-js v2 doesn't have a direct .sql() method without a defined RPC,
  // we'll print instructions for the user or try a known RPC endpoint.
  console.log("-----------------------------------------");
  console.log("Pre automatické vytvorenie tabulky vložte tento SQL kód do Supabase SQL Editora:");
  console.log(createTableQuery);
  console.log("-----------------------------------------");

  // Just to test if we can do an RPC call
  const { data, error } = await supabase.rpc('exec_sql', { sql: createTableQuery }).catch(() => ({error: 'RPC eval failed'}));
  
  if (error) {
      console.log("Supabase RPC(exec_sql) zlyhalo, musíte SQL spustiť manuálne v Supabase (vložiť do SQL Editora).");
  } else {
      console.log("Tabuľka úspešne vytvorená cez RPC!");
  }
}

main();