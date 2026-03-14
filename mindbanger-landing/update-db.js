import postgres from 'postgres';

const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function updateDB() {
  try {
    console.log('Connecting to database...');

    // 1. Alter profiles table
    await sql`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS username TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
      ADD COLUMN IF NOT EXISTS referred_by TEXT;
    `;
    console.log('Profile table altered.');

    // 2. Create daily_signals table for 3 languages
    await sql`
      CREATE TABLE IF NOT EXISTS public.daily_signals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE NOT NULL,
        language TEXT NOT NULL CHECK (language IN ('en', 'sk', 'cs')),
        theme TEXT NOT NULL,
        title TEXT NOT NULL,
        signal_text TEXT NOT NULL,
        focus_text TEXT,
        affirmation TEXT,
        audio_url TEXT,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(date, language)
      );
    `;
    
    // Enable RLS for daily_signals
    await sql`ALTER TABLE public.daily_signals ENABLE ROW LEVEL SECURITY;`;
    
    // Drop policy safely
    try {
        await sql`DROP POLICY IF EXISTS "Anyone can view published daily signals" ON public.daily_signals;`;
    } catch(e) {}
    
    await sql`
      CREATE POLICY "Anyone can view published daily signals"
      ON public.daily_signals FOR SELECT USING (is_published = true);
    `;

    console.log('Daily signals table created.');

    // 3. Create Storage Buckets
    // In Supabase, bucket creation can be done via storage.buckets table insertion
    await sql`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('avatars', 'avatars', true)
      ON CONFLICT (id) DO NOTHING;
    `;
    
    await sql`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('content_audio', 'content_audio', false)
      ON CONFLICT (id) DO NOTHING;
    `;
    
    // Create RLS policies for storage buckets (rudimentary for now)
    // Avatars: anyone can view. 
    try {
        await sql`CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');`;
    } catch(e) { } // Ignore if exists
    
    console.log('Storage buckets created.');

    console.log('Database update completed successfully.');
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await sql.end();
  }
}

updateDB();
