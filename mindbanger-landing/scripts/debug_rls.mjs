import postgres from 'postgres';
const sql = postgres('postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });
async function start() {
    console.log("Fetching policies...");
    const res = await sql`SELECT tablename, policyname, cmd, roles FROM pg_policies WHERE schemaname='public'`;
    console.log(res);
    process.exit(0);
}
start();