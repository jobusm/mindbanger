import postgres from 'postgres';

const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function fixDB() {
  try {
    console.log('Fixing daily_signals...');
    
    await sql`DROP TABLE IF EXISTS public.daily_signals CASCADE;`;

    // Recreate
    await sql`
      CREATE TABLE public.daily_signals (
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
    
    await sql`ALTER TABLE public.daily_signals ENABLE ROW LEVEL SECURITY;`;
    
    await sql`
      CREATE POLICY "Anyone can view published daily signals"
      ON public.daily_signals FOR SELECT USING (is_published = true);
    `;

    console.log('Daily signals table created properly.');

    // 3. Create Storage Buckets
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
    
    try {
        await sql`CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');`;
    } catch(e) {}
    
    console.log('Done.');
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await sql.end();
  }
}

fixDB();
