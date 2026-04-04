import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function fixRLS() {
  try {
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Admins can view all organizations') THEN
            CREATE POLICY "Admins can view all organizations"
            ON public.organizations FOR SELECT
            USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
        END IF;
      END
      $$;
    `;
    console.log('Fixed organizations RLS for admin');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
fixRLS();