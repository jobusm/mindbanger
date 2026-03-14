import postgres from 'postgres';
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function updateTrigger() {
  try {
    await sql`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name, avatar_url, referred_by, preferred_language)
        VALUES (
          new.id, 
          new.raw_user_meta_data->>'full_name', 
          new.raw_user_meta_data->>'avatar_url',
          new.raw_user_meta_data->>'referred_by',
          COALESCE(new.raw_user_meta_data->>'preferred_language', 'en')
        );
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    console.log("Trigger updated to include referred_by and preferred_language.");
  } catch(e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
updateTrigger();