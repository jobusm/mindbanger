const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function queryDb() {
  const client = new Client({ connectionString });
  await client.connect();
  
  console.log('--- Columns ---');
  const queryColumns = `
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name IN ('daily_signals')
    ORDER BY table_name, column_name;
  `;
  const resColumns = await client.query(queryColumns);
  console.log(JSON.stringify(resColumns.rows, null, 2));

  console.log('\n--- Foreign Keys ---');
  const queryFK = `
    SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'subscriptions';
  `;
  const resFK = await client.query(queryFK);
  console.log(JSON.stringify(resFK.rows, null, 2));

  await client.end();
}
queryDb();
