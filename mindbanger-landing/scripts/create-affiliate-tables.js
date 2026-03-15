// scripts/create-affiliate-tables.js
import postgres from 'postgres';

// Use same DB string from run-sql.js
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function createAffiliateTables() {
  try {
    console.log('Connecting to database...');

    // 1. Create affiliates table
    await sql`
      CREATE TABLE IF NOT EXISTS public.affiliates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
        paypal_email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;

    // Add RLS to affiliates
    await sql`ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;`;

    // Drop policies if exist to re-run safely
    await sql`DROP POLICY IF EXISTS "Users can read own affiliate data" ON public.affiliates;`;
    await sql`DROP POLICY IF EXISTS "Users can insert own affiliate data" ON public.affiliates;`;
    await sql`DROP POLICY IF EXISTS "Users can update own affiliate data" ON public.affiliates;`;

    await sql`
      CREATE POLICY "Users can read own affiliate data" ON public.affiliates
        FOR SELECT TO authenticated USING (auth.uid() = user_id);
    `;
    await sql`
      CREATE POLICY "Users can insert own affiliate data" ON public.affiliates
        FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    `;
    await sql`
      CREATE POLICY "Users can update own affiliate data" ON public.affiliates
        FOR UPDATE TO authenticated USING (auth.uid() = user_id);
    `;

    // 2. Create referrals table tracking referee ID, commission model used, status, and amount
    await sql`
      CREATE TABLE IF NOT EXISTS public.referrals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
        referee_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        commission_model TEXT NOT NULL CHECK (commission_model IN ('second_month', 'lifetime_20')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
        amount NUMERIC NOT NULL DEFAULT 0,
        stripe_session_id TEXT,
        stripe_invoice_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;

    // Add RLS to referrals
    await sql`ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;`;
    
    await sql`DROP POLICY IF EXISTS "Affiliates can read their own referrals" ON public.referrals;`;
    await sql`
      CREATE POLICY "Affiliates can read their own referrals" ON public.referrals
        FOR SELECT TO authenticated USING (
          affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
          )
        );
    `;

    console.log('Successfully created affiliates and referrals tables with RLS policies.');

  } catch (error) {
    console.error('Database connection or query failed:');
    console.error(error);
  } finally {
    await sql.end();
  }
}

createAffiliateTables();
