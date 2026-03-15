const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function queryDb() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public'");
  console.log(res.rows);
  await client.end();
}
queryDb();
