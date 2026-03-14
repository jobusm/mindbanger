// run-sql.js
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

// Zostavime connection string (skusime IPv4 pooler)
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

const sql = postgres(connectionString, { ssl: 'require' });

async function runSQL() {
  try {
    console.log('Connecting to database...');
    
    // Create subscriptions table for Stripe data
    await sql`
      CREATE TABLE IF NOT EXISTS public.subscriptions (
        id TEXT PRIMARY KEY, -- Stripe subscription ID
        user_id UUID REFERENCES public.profiles(id) NOT NULL,
        status TEXT NOT NULL,
        price_id TEXT NOT NULL,
        current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;

    // Enable RLS for subscriptions
    await sql`ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;`;
    
    // Drop existing policy just in case so we can recreate it
    await sql`DROP POLICY IF EXISTS "Users can view own subscriptions." ON public.subscriptions;`;
    
    await sql`
      CREATE POLICY "Users can view own subscriptions." 
      ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
    `;

    console.log('Database updated successfully for Stripe subscriptions.');

  } catch (error) {
    console.error('Database connection or query failed:');
    console.error(error);
  } finally {
    await sql.end();
  }
}

runSQL();
