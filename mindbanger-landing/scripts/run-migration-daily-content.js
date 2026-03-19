const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Connection string from other scripts (or env if available)
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

const migrationPath = path.join(__dirname, '../supabase/migrations/202603180000_enhance_daily_signals.sql');

async function runMigration() {
  console.info(`Reading migration file from: ${migrationPath}`);
  
  let sql;
  try {
    sql = fs.readFileSync(migrationPath, 'utf8');
  } catch (err) {
    console.error('Failed to read migration file:', err);
    process.exit(1);
  }

  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to database...");
    
    console.log("Executing migration SQL...");
    await client.query(sql);
    
    console.log("✅ Migration 202603180000_enhance_daily_signals.sql executed successfully!");
  } catch (error) {
    console.error("❌ Error executing migration:", error);
  } finally {
    await client.end();
  }
}

runMigration();
