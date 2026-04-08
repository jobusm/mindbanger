import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { enhanceTextWithSSML } from '@/lib/content-engine/openai';

export const maxDuration = 120; // 2 minutes

const ADMIN_EMAILS = ['miroslav.jobus@gmail.com'];

// S3 / R2 config
let s3Client: S3Client | null = null;
try {
  if (process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      s3Client = new S3Client({
          region: 'auto',
          endpoint: process.env.R2_ENDPOINT,
          credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
      });
  }
} catch(e) { console.error('R2 init error:', e); }

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

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

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized Admin' }, { status: 401 });
  }

  // Client for Database operations (bypasses RLS for Admin actions)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const { sourceId, type, field } = body;

    // field e.g. 'spoken_audio_url' or 'meditation_audio_url'
    if (!sourceId || !type || !field) {
        return NextResponse.json({ error: 'Missing sourceId, type, or field' }, { status: 400 });
    }
    
    if (!process.env.ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: 'Missing ELEVENLABS_API_KEY env variable' }, { status: 500 });
    }

    const table = type === 'personal' ? 'daily_signals' : type === 'b2b' ? 'corporate_signals' : 'onboarding_signals';

    const { data: sourceRow, error: fetchErr } = await supabaseAdmin.from(table).select('*').eq('id', sourceId).single();

    if (fetchErr || !sourceRow) {
        return NextResponse.json({ error: 'Source not found (Admin Fetch)' }, { status: 404 });
    }

    let rawText = '';
    if (field === 'spoken_audio_url') {
       rawText = sourceRow.script || sourceRow.signal_text || '';
    } else if (field === 'meditation_audio_url') {
       rawText = sourceRow.meditation_text || '';
    }

    if (!rawText.trim()) {
        return NextResponse.json({ error: 'Text source is empty. Write text first.' }, { status: 400 });
    }

    // 1. OpenAI SSML Enhancement
    console.log('Enhancing text with SSML...');
    let ssmlText = rawText;
    try {
        ssmlText = await enhanceTextWithSSML(rawText);
    } catch(e: any) {
        console.error('Enhance SSML error:', e);
    }

    // 2. ElevenLabs API Call
    console.log('Calling ElevenLabs API for Voice eGbMQjHtPyAT1vmmz4ux ...');
    
    const voiceId = "eGbMQjHtPyAT1vmmz4ux";
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const elevenRes = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `<speak>${ssmlText}</speak>`,
        model_id: "eleven_multilingual_v3"
      })
    });

    if (!elevenRes.ok) {
        const errText = await elevenRes.text();
        console.error('ElevenLabs Error:', elevenRes.status, errText);
        return NextResponse.json({ error: `ElevenLabs API Error: ${elevenRes.status} ${errText}` }, { status: 500 });
    }

    const arrayBuffer = await elevenRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to Cloudflare R2
    const prefix = field === 'spoken_audio_url' ? 'script' : 'meditation';
    const lang = sourceRow.language || 'unk';
    const dateStr = sourceRow.date || "onboarding-" + sourceId || 'b2b';
    
    const uniqueFilename = `${lang}-${prefix}-${dateStr}-${Date.now()}.mp3`;
    console.log('Uploading to R2 as', uniqueFilename);

    if (!s3Client || !R2_BUCKET_NAME) {
        console.error('R2 not configured properly. Cannot upload.');
        return NextResponse.json({ error: 'Storage (R2) is not configured properly' }, { status: 500 });
    }

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            Body: buffer,
            ContentType: 'audio/mpeg'
        });

        await s3Client.send(command);
    } catch(err: any) {
        console.error('R2 Upload error:', err);
        return NextResponse.json({ error: `R2 S3 Upload failed: ${err.message}` }, { status: 500 });
    }

    // 4. Update the DB
    const publicUrl = uniqueFilename;
    
    const updatePayload: any = { [field]: publicUrl };
    
    // Ensure we also populate legacy columns just in case
    if (field === 'spoken_audio_url') {
      updatePayload.audio_url = publicUrl; // legacy fallback
    }

    const { error: updateErr } = await supabaseAdmin.from(table).update(updatePayload).eq('id', sourceId);

    if (updateErr) {
       console.error('DB Update Error:', updateErr);
       return NextResponse.json({ error: 'Audio generated and uploaded, but failed to save to DB.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, publicUrl });
  } catch (error: any) {
    console.error('Generate Audio Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
