import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function start() {
    console.log("Triggering translation for 4e9eba33-9b56-4948-a1e7-128c4a10872e");
    const res = await fetch('http://localhost:3000/api/admin/translate-mindset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: '4e9eba33-9b56-4948-a1e7-128c4a10872e', type: 'personal', targetLanguages: ['cs', 'en'] })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
}
start();
