const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Use connection string from env or fallback to hardcoded (if present in other scripts)
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
        WHERE table_name='daily_signals' AND column_name='content_payload';
    `);

    if (checkRes.rows.length > 0) {
        console.log("Column 'content_payload' already exists.");
    } else {
        console.log("Adding column 'content_payload'...");
        await client.query(`
            ALTER TABLE public.daily_signals
            ADD COLUMN IF NOT EXISTS content_payload JSONB;
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