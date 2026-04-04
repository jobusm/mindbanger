import postgres from 'postgres';
const sql = postgres('postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function run() {
    try {
        console.log('Adding pending_invites to organizations...');
        await sql`ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS pending_invites JSONB DEFAULT '[]'::jsonb;`
        console.log('Done!');
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
run();