import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { translateMindsetToSSML } from '@/lib/content-engine/openai';

const ADMIN_EMAILS = ['miroslav.jobus@gmail.com'];

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  // Client for Authentication check
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

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized Admin' }, { status: 401 }); 
  }

  // Client for Database operations (bypasses RLS for Admin actions)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { sourceId, type, targetLanguages = ['cs', 'en'] } = await request.json();

    if (!sourceId || !type) {
        return NextResponse.json({ error: 'Missing sourceId or type' }, { status: 400 });
    }

    const table = type === 'personal' ? 'daily_signals' : type === 'b2b' ? 'corporate_signals' : 'onboarding_signals';

    const { data: sourceRow, error: fetchErr } = await supabaseAdmin.from(table).select('*').eq('id', sourceId).single();

    if (fetchErr || !sourceRow) {
        return NextResponse.json({ error: 'Source not found (Admin Fetch)' }, { status: 404 });
    }

    const results = [];

    for (const lang of targetLanguages) {
      if (sourceRow.language === lang) continue;

      const textContent = {
        theme: sourceRow.theme || sourceRow.title || '',
        focus: sourceRow.focus || sourceRow.focus_text || '',
        affirmation: sourceRow.affirmation || '',
        script: sourceRow.script || sourceRow.signal_text || '',
        meditation_text: sourceRow.meditation_text || '',
        push_text: sourceRow.push_text || ''
      };

      if (!textContent.theme && !textContent.script) continue;

      try {
        const translatedContent = await translateMindsetToSSML(textContent, lang);

        let newRow: any = { ...sourceRow };
        delete newRow.id;
        delete newRow.created_at;
        delete newRow.updated_at;

        newRow.language = lang;
        newRow.spoken_audio_url = null;
        newRow.meditation_audio_url = null;

if ('theme' in sourceRow) newRow.theme = translatedContent.theme;
        if ('title' in sourceRow) newRow.title = translatedContent.theme; // legacy field
        if ('focus' in sourceRow) newRow.focus = translatedContent.focus;
        if ('focus_text' in sourceRow) newRow.focus_text = translatedContent.focus; // legacy field
        if ('affirmation' in sourceRow) newRow.affirmation = translatedContent.affirmation;
        if ('script' in sourceRow) newRow.script = translatedContent.script;
        if ('signal_text' in sourceRow) newRow.signal_text = translatedContent.script; // legacy field
        if ('meditation_text' in sourceRow) newRow.meditation_text = translatedContent.meditation_text;
        if ('push_text' in sourceRow) newRow.push_text = translatedContent.push_text || null;

        if (type === 'personal') {
            newRow.status = 'draft';

            // Check if existing record for this date and language exists
            const { data: existing } = await supabaseAdmin.from('daily_signals').select('id').eq('date', sourceRow.date).eq('language', lang).single();
            if (existing) {
                newRow.id = existing.id; // UPDATE existing
            }
        } else if (type === 'b2b') {
            newRow.is_published = false;

            // Check existing for b2b (date, language, organization_id or industry)
            let q = supabaseAdmin.from('corporate_signals').select('id').eq('date', sourceRow.date).eq('language', lang);
            if (sourceRow.organization_id) q = q.eq('organization_id', sourceRow.organization_id);
            else q = q.is('organization_id', null).eq('industry', sourceRow.industry || '');

            const { data: existing } = await q.limit(1).maybeSingle();
            if (existing) {
                newRow.id = existing.id;
            }
        } else if (type === 'onboarding') {
            const { data: existing } = await supabaseAdmin.from('onboarding_signals').select('id').eq('day_number', sourceRow.day_number).eq('language', lang).single();
            if (existing) {
                newRow.id = existing.id;
            }
        }

        // Upsert logic based on whether we populated newRow.id
        let inserted;
        let insertErr;

        if (newRow.id) {
            const res = await supabaseAdmin.from(table).update(newRow).eq('id', newRow.id).select().single();
            inserted = res.data;
            insertErr = res.error;
        } else {
            const res = await supabaseAdmin.from(table).insert(newRow).select().single();
            inserted = res.data;
            insertErr = res.error;
        }

        if (insertErr) {
            console.error(`DB Insert/Update Error for ${lang}:`, insertErr);
            throw new Error(`DB Error [${lang}]: ${insertErr.message}`);
        }

        results.push({ lang, status: 'success', id: inserted.id });
      } catch (err: any) {
        console.error(`Translation Error for ${lang}:`, err);
        results.push({ lang, status: 'error', error: err.message });
      }
    }

    const errors = results.filter(r => r.status === 'error');
    if (errors.length > 0) {
        return NextResponse.json(
            { error: `Translation failed for: ${errors.map(e => e.lang).join(', ')}. Details: ${errors.map(e => e.error).join(' | ')}`, results },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Translation process error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
