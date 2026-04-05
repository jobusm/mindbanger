const { Client } = require('pg');
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function queryDb() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%progress%'`);
  console.log(res.rows.map(r=>r.table_name));
  await client.end();
}
queryDb();