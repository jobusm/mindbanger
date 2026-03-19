const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database...");
    
    // Check if column exists
    const checkRes = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='daily_signals' AND column_name='meditation_audio_url';
    `);

    if (checkRes.rows.length > 0) {
        console.log("Column 'meditation_audio_url' already exists.");
    } else {
        console.log("Adding column 'meditation_audio_url'...");
        await client.query(`
            ALTER TABLE public.daily_signals
            ADD COLUMN IF NOT EXISTS meditation_audio_url TEXT;
            COMMENT ON COLUMN public.daily_signals.meditation_audio_url IS 'URL to the guided meditation audio file';
        `);
        console.log("Column added successfully.");
    }

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();