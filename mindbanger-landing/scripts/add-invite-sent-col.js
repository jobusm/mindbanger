const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw\@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function addColumn() {
  try {
    console.log("Adding column...");
    await sql.unsafe("ALTER TABLE public.organization_members ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP WITH TIME ZONE;");
    console.log("invite_sent_at added.");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
addColumn();
