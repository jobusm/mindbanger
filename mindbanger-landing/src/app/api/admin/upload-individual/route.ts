import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Resend } from 'resend';
import webpush from 'web-push';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:miroslav.jobus@gmail.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string | null;
        const userId = formData.get('userId') as string | null;
        const userEmail = formData.get('userEmail') as string | null;
        const userName = formData.get('userName') as string | null;

        if (!file || !title || !userId) {
            return NextResponse.json({ error: 'Chýbajú parametre formulára' }, { status: 400 });
        }

        // Upload to R2
        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueFilename = `individual-${userId}-${Date.now()}.mp3`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            Body: buffer,
            ContentType: file.type || 'audio/mpeg',
        });

        await s3Client.send(command);

        // Save DB Record
        const { data: insertedRec, error: dbErr } = await supabaseAdmin.from('individual_recordings').insert({
            user_id: userId,
            title: title,
            audio_url: uniqueFilename
        }).select().single();

        if (dbErr) throw dbErr;

        // Send Email
        if (userEmail && resend) {
            try {
                await resend.emails.send({
                    from: 'Mindbanger <noreply@mindbanger.com>',
                    to: userEmail,
                    subject: 'Máte novú individuálnu nahrávku!',
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2>Získali ste novú nahrávku!</h2>
                            <p>Ahoj ${userName || ''},</p>
                            <p>Do vášho profilu v aplikácii Mindbanger bola pridaná nová súkromná nahrávka s názvom: <strong>${title}</strong>.</p>
                            <p><a href="https://mindbanger.com/app/my-audio" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Prehrať nahrávku v appke</a></p>
                            <p style="margin-top: 30px; font-size: 12px; color: #666;">Táto nahrávka je dostupná len pre váš profil.</p>
                        </div>
                    `
                });
            } catch(e) {
                console.error("Resend error:", e);
            }
        }

        // Send Push Notification
        try {
            const { data: subs } = await supabaseAdmin.from('push_subscriptions').select('subscription').eq('user_id', userId);
            
            if (subs && subs.length > 0) {
                const payload = JSON.stringify({
                    title: 'Nová osobná nahrávka!',
                    body: `Práve pre vás bola nahratá nová nahrávka: ${title}`,
                    url: '/app/my-audio'
                });

                for (const subRow of subs) {
                    try {
                        const sub = typeof subRow.subscription === 'string' ? JSON.parse(subRow.subscription) : subRow.subscription;
                        await webpush.sendNotification(sub, payload);
                    } catch(pushErr) {
                        console.error('Push error for sub', pushErr);
                    }
                }
            }
        } catch(e) {
             console.error("Push query error:", e);
        }

        return NextResponse.json({ success: true, recording: insertedRec });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || 'Nastala neočakávaná chyba.' }, { status: 500 });
    }
}