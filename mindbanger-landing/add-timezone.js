import postgres from 'postgres';
const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function addTimezone() {
  try {
    // 1. Add timezone column
    await sql`ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';`
    console.log('Column timezone added to profiles.');

    // 2. Update trigger to include timezone from metadata
    await sql`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name, avatar_url, referred_by, preferred_language, timezone)
        VALUES (
          new.id,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'avatar_url',
          new.raw_user_meta_data->>'referred_by',
          COALESCE(new.raw_user_meta_data->>'preferred_language', 'en'),
          COALESCE(new.raw_user_meta_data->>'timezone', 'UTC')
        );
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
    console.log('Trigger updated to include timezone.');
  } catch(e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
addTimezone();
