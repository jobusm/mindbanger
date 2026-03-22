
require('dotenv').config({ path: '.env' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function deploy() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const migrationPath = path.join(__dirname, '../supabase/migrations/20260322130000_fix_completions.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Executing completion fix...');
    await client.query(sql);
    
    console.log('Completions successfully deployed!');
  } catch (err) {
    console.error('Error applying migration:', err);
  } finally {
    await client.end();
  }
}

deploy();