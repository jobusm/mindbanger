const { Client } = require('pg');
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

async function updateDb() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Pripojené k databáze...");
    await client.query(`
      alter table if exists public.profiles
      add column if not exists role text default 'user';
    `);
    await client.query(`
      comment on column public.profiles.role is 'Role of the user: "user" | "admin"';
    `);
    console.log("✅ Stĺpec 'role' bol úspešne pridaný do tabuľky 'profiles'!");
  } catch (error) {
    console.error("❌ Chyba:", error);
  } finally {
    await client.end();
  }
}

updateDb();