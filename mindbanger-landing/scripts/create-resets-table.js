const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Same connection as other scripts
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function createResetsTable() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Pripojené k databáze...");
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS public.quick_resets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT,
        description TEXT,
        audio_url TEXT,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✅ Tabuľka 'quick_resets' úspešne vytvorená!");
  } catch (error) {
    console.error("❌ Chyba:", error);
  } finally {
    await client.end();
  }
}

createResetsTable();