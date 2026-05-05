require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function checkCols() {
  const client = new Client({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });
  await client.connect();
  const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'referrals';");
  console.log('Columns:', res.rows.map(r => r.column_name));

  // Reload cache just in case
  await client.query("NOTIFY pgrst, 'reload schema'");
  await client.end();
}
checkCols();
