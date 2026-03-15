const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function updateSubscriptionsTable() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Pripojené k databáze...");
    await client.query(`
      ALTER TABLE public.subscriptions
      ADD COLUMN IF NOT EXISTS country text,
      ADD COLUMN IF NOT EXISTS amount_total numeric,
      ADD COLUMN IF NOT EXISTS currency text,
      ADD COLUMN IF NOT EXISTS customer_email text;
    `);
    console.log("✅ Nové stĺpce pre analytiku úspešne pridané do 'subscriptions'!");
  } catch (error) {
    console.error("❌ Chyba:", error);
  } finally {
    await client.end();
  }
}

updateSubscriptionsTable();
