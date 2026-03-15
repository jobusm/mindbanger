const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });

async function run() {
  try {
    await client.connect();
    console.log("Applying missing RLS policies for affiliate_materials and admin...");
    
    await client.query(\
      -- Policy for INSERT
      DROP POLICY IF EXISTS "Admins can insert affiliate materials" ON public.affiliate_materials;
      CREATE POLICY "Admins can insert affiliate materials"
      ON public.affiliate_materials
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

      -- Policy for UPDATE
      DROP POLICY IF EXISTS "Admins can update affiliate materials" ON public.affiliate_materials;
      CREATE POLICY "Admins can update affiliate materials"
      ON public.affiliate_materials
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );

      -- Policy for DELETE
      DROP POLICY IF EXISTS "Admins can delete affiliate materials" ON public.affiliate_materials;
      CREATE POLICY "Admins can delete affiliate materials"
      ON public.affiliate_materials
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
    \);
    
    console.log("? Admin policies for affiliate_materials successfully created!");
  } catch (err) {
    console.error("? DB Error:", err);
  } finally {
    await client.end();
  }
}
run();
