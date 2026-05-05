require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function testCons() {
  const client = new Client({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });
  try {
    await client.connect();
    const res = await client.query("SELECT pg_get_constraintdef(c.oid) AS constraint_def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'referrals' AND c.conname = 'referrals_status_check';");
    console.log(res.rows[0]);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
testCons();
