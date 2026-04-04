import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function upgradeOrgs() {
  try {
    await sql`
      ALTER TABLE public.organizations 
      ADD COLUMN IF NOT EXISTS address_street text,
      ADD COLUMN IF NOT EXISTS address_city text,
      ADD COLUMN IF NOT EXISTS address_zip text,
      ADD COLUMN IF NOT EXISTS address_country text DEFAULT 'Slovenská republika',
      ADD COLUMN IF NOT EXISTS dic text
    `;
    console.log('Added address and dic columns to organizations table');
    
    // Zapnime UPDATE politiku pre organizations, nech si to owner/admin moze aktualizovat
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organizations' AND policyname = 'Owner can update org properties') THEN
            CREATE POLICY "Owner can update org properties"
            ON public.organizations FOR UPDATE
            USING (
                auth.uid() IN (SELECT user_id FROM organization_members WHERE organization_id = organizations.id AND role IN ('owner', 'admin'))
            );
        END IF;
      END
      $$;
    `;
    console.log('Added UPDATE policy for organizations table');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
upgradeOrgs();