import 'dotenv/config.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    }
});

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
    console.log('1. Fetching from DB...');
    const { data: sourceRow } = await sb.from('daily_signals').select('*').eq('id', 'ff417766-4a95-478c-ae59-f1ef5647d172').single();
    let rawText = sourceRow.script;
    console.log('Text length:', rawText.length);

    console.log('2. ElevenLabs API...');
    const elevenLabsUrl = \https://api.elevenlabs.io/v1/text-to-speech/eGbMQjHtPyAT1vmmz4ux\;
    const start = Date.now();
    const elevenRes = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: \<speak>\</speak>\,
        model_id: "eleven_multilingual_v3"
      })
    });
    console.log('ElevenLabs Time:', Date.now() - start, 'ms');
    
    if(!elevenRes.ok) {
        console.error('ElevenLabs Failed:', elevenRes.status, await elevenRes.text());
        return;
    }
    
    console.log('3. Buffering audio...');
    const arrayBuffer = await elevenRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uniqueFilename = \	est-cs-audio-\.mp3\;
    console.log('4. Uploading to R2 as', uniqueFilename, 'Size:', buffer.length);
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: 'audio/mpeg'
    });

    try {
        await s3Client.send(command);
        console.log('R2 Upload SUCCESS', uniqueFilename);
    } catch(e) {
        console.error('R2 Upload FAILED', e);
        return;
    }

    console.log('5. Updating DB...');
    const {error} = await sb.from('daily_signals').update({spoken_audio_url: uniqueFilename}).eq('id', 'ff417766-4a95-478c-ae59-f1ef5647d172');
    if(error){
        console.error('DB UPDATE FAILED', error);
    } else {
        console.log('ALL SUCCESS!');
    }
}
test().catch(console.error);
