import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const sql = \
-- Create corporate_onboarding_signals table
CREATE TABLE IF NOT EXISTS public.corporate_onboarding_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_number INTEGER NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',

    -- Content Fields 
    theme TEXT,
    title TEXT,
    signal_text TEXT,
    script TEXT,
    focus_text TEXT,
    focus TEXT,
    affirmation TEXT,
    meditation_text TEXT,
    push_text TEXT,

    -- Media
    audio_url TEXT,
    spoken_audio_url TEXT,
    meditation_audio_url TEXT,

    -- Meta
    generation_metadata JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Constraints
    UNIQUE(day_number, language)
);

-- Comments
COMMENT ON TABLE public.corporate_onboarding_signals IS 'Fixed sequence of B2B signals for new corporate users (Days 1-X)';
COMMENT ON COLUMN public.corporate_onboarding_signals.day_number IS 'Sequence number (1 = First day after B2B signup)';

-- Policies (RLS)
ALTER TABLE public.corporate_onboarding_signals ENABLE ROW LEVEL SECURITY;

-- Allow read for everyone (authenticated)
-- In B2B, it is safer to ensure it's accessible.
CREATE POLICY "Allow read access for authenticated B2B users" ON public.corporate_onboarding_signals
    FOR SELECT TO authenticated USING (true);

-- Allow full access for service role 
CREATE POLICY "Allow full access corporate onboarding service role" ON public.corporate_onboarding_signals 
    FOR ALL TO service_role USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.corporate_onboarding_signals;
\

async function run() {
  await client.connect();
  console.log('Executing migration...');
  await client.query(sql);
  console.log('Success!');
  await client.end();
}
run().catch(console.error);
