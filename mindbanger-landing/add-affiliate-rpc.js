require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL; // Wait, we need actual postgres connection string.
  // We can just get DATABASE_URL from .env.local
  const client = new Client({ connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log('Connected to DB');
    await client.query(\
      CREATE OR REPLACE FUNCTION get_affiliate_registrations(p_affiliate_id TEXT)
      RETURNS TABLE (user_id UUID, email TEXT, registered_at TIMESTAMP WITH TIME ZONE, ref_mode TEXT) AS \\\$\\\$
      BEGIN
          RETURN QUERY 
          SELECT 
              u.id, 
              u.email::TEXT,
              u.created_at, 
              (u.raw_user_meta_data->>'mb_refMode')::TEXT
          FROM auth.users u
          WHERE u.raw_user_meta_data->>'mb_refCode' = p_affiliate_id;
      END;
      \\\$\\\$ LANGUAGE plpgsql SECURITY DEFINER;
    \);
    console.log('Function get_affiliate_registrations created');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
main();
