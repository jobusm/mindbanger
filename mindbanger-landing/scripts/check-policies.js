const { Client } = require('pg');
const client = new Client('postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres');
client.connect().then(() => client.query("SELECT policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'corporate_onboarding_signals'")).then(r => console.log(r.rows)).finally(() => client.end());