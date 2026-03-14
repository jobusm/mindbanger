import postgres from 'postgres';
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function check() {
  const [{ prosrc }] = await sql`
    SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user'
  `;
  console.log(prosrc);
  await sql.end();
}
check();