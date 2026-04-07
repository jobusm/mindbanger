import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { translateMindsetToSSML } from '@/lib/content-engine/openai';

const ADMIN_EMAILS = ['miroslav.jobus@gmail.com'];

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
           try {
             cookiesToSet.forEach(({ name, value, options }) =>
               cookieStore.set(name, value, options)
             )
           } catch {}
        },
      },
    }
  );

  // Auth check
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized Admin' }, { status: 401 });
  }

  try {
    const { sourceId, type, targetLanguages = ['cs', 'en'] } = await request.json();

    if (!sourceId || !type) {
      return NextResponse.json({ error: 'Missing sourceId or type' }, { status: 400 });
    }

    const table = type === 'personal' ? 'daily_signals' : type === 'b2b' ? 'corporate_signals' : 'onboarding_signals';

    // 1. Fetch source row
    const { data: sourceRow, error: fetchErr } = await supabase
      .from(table)
      .select('*')
      .eq('id', sourceId)
      .single();

    if (fetchErr || !sourceRow) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    const results = [];

    // 2. Loop through target languages
    for (const lang of targetLanguages) {
      if (sourceRow.language === lang) continue;

      // Extract text content for the prompt
      const textContent = {
        theme: sourceRow.theme || sourceRow.title || '',
        focus: sourceRow.focus || sourceRow.focus_text || '',
        affirmation: sourceRow.affirmation || '',
        script: sourceRow.script || sourceRow.signal_text || '',
        meditation_text: sourceRow.meditation_text || '',
        push_text: sourceRow.push_text || ''
      };

      // Ensure there's something to translate
      if (!textContent.theme && !textContent.script) continue;

      try {
        // 3. Translate and inject SSML via OpenAI
        const translatedContent = await translateMindsetToSSML(textContent, lang);

        // 4. Construct new row
        let newRow: any = { ...sourceRow };
        // Delete Primary Key & standard metadata so DB generates new ones
        delete newRow.id;
        delete newRow.created_at;
        delete newRow.updated_at;
        
        newRow.language = lang;

        // Keep audio_url (Background music) but wipe voice URLs
        newRow.spoken_audio_url = null;
        newRow.meditation_audio_url = null;

        if (type === 'personal') {
            newRow.theme = translatedContent.theme;
            newRow.focus = translatedContent.focus;
            newRow.affirmation = translatedContent.affirmation;
            newRow.script = translatedContent.script;
            newRow.meditation_text = translatedContent.meditation_text;
            newRow.push_text = translatedContent.push_text || null;
            newRow.status = 'draft';
        } else if (type === 'b2b') {
            newRow.theme = translatedContent.theme;
            newRow.title = translatedContent.theme;
            newRow.focus_text = translatedContent.focus;
            newRow.affirmation = translatedContent.affirmation;
            newRow.signal_text = translatedContent.script;
            newRow.meditation_text = translatedContent.meditation_text;
            newRow.push_text = translatedContent.push_text || null;
            newRow.is_published = false;
        } else if (type === 'onboarding') {
            newRow.theme = translatedContent.theme;
            newRow.title = translatedContent.theme;
            newRow.focus = translatedContent.focus;
            newRow.focus_text = translatedContent.focus;
            newRow.affirmation = translatedContent.affirmation;
            newRow.script = translatedContent.script;
            newRow.signal_text = translatedContent.script;
            newRow.meditation_text = translatedContent.meditation_text;
            newRow.push_text = translatedContent.push_text || null;
        }

        // 5. Insert new language variant into DB
        const { data: inserted, error: insertErr } = await supabase
          .from(table)
          .insert(newRow)
          .select()
          .single();

        if (insertErr) {
            console.error(`DB Insert Error for ${lang}:`, insertErr);
            throw new Error(insertErr.message);
        }

        results.push({ lang, status: 'success', id: inserted.id });

      } catch (err: any) {
        console.error(`Translation Error for ${lang}:`, err);
        results.push({ lang, status: 'error', error: err.message });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error('Translation process error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
