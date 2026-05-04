import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const { Client } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });

async function applyRLS() {
  try {
    await client.connect();
    console.log("Applying missing RLS policies for onboarding_signals and admin...");
    
    await client.query(`
      -- Policy for INSERT
      DROP POLICY IF EXISTS "Admins can insert onboarding signals" ON public.onboarding_signals;
      CREATE POLICY "Admins can insert onboarding signals"
      ON public.onboarding_signals
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

      -- Policy for UPDATE
      DROP POLICY IF EXISTS "Admins can update onboarding signals" ON public.onboarding_signals;
      CREATE POLICY "Admins can update onboarding signals"
      ON public.onboarding_signals
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

      -- Policy for DELETE
      DROP POLICY IF EXISTS "Admins can delete onboarding signals" ON public.onboarding_signals;
      CREATE POLICY "Admins can delete onboarding signals"
      ON public.onboarding_signals
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
    `);
    
    console.log("✅ Admin policies for onboarding_signals successfully created!");
  } catch (err) {
    console.error("❌ DB Error:", err);
  } finally {
    await client.end();
  }
}
applyRLS();