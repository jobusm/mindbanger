// scripts/create-promo-materials.js
import postgres from 'postgres';

const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function createPromoMaterialsTable() {
  try {
    console.log('Connecting to database...');

    await sql`
      CREATE TABLE IF NOT EXISTS public.affiliate_materials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        url TEXT NOT NULL,
        language TEXT NOT NULL,
        resolution TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    console.log('Table created or already exists...');

    await sql`ALTER TABLE public.affiliate_materials ENABLE ROW LEVEL SECURITY;`;

    // Drop if exists to be safe
    await sql`DROP POLICY IF EXISTS "Allow public read access" ON public.affiliate_materials;`;

    await sql`
      CREATE POLICY "Allow public read access" ON public.affiliate_materials
      FOR SELECT USING (true);
    `;

    console.log('Successfully created affiliate_materials table and RLS policies.');

  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await sql.end();
    console.log('Disconnected from database.');
  }
}

createPromoMaterialsTable();
