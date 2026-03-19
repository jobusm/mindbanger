const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');

try {
    let content = fs.readFileSync(envPath).toString(); // Read as buffer then to string? Wait, readFileSync default is buffer.

    // If it has null bytes, likely UTF-16 LE or hidden chars.
    // Let's filter out null bytes.
    let cleanContent = content.replace(/\0/g, '');

    // Now append VAPID keys if not present
    if (!cleanContent.includes('NEXT_PUBLIC_VAPID_PUBLIC_KEY')) {
        cleanContent += '\n\n# Web Push Notifications (VAPID Keys)\n';
        cleanContent += 'NEXT_PUBLIC_VAPID_PUBLIC_KEY=BDrLjSgNx1FWvUmzPEVq4W1wJKJQpN9qGSrkLc9bqvQvFxoMqlght-ohG9xanq_T8_XPadPQa4REjsvJRgIleV0\n';
        cleanContent += 'VAPID_PRIVATE_KEY=MmfCnn8hmdPCkVXGsnOM6RC8TdcSvV5CDrGF1e6H_T0\n';
        cleanContent += 'VAPID_SUBJECT=mailto:admin@mindbanger.com\n';
    }

    fs.writeFileSync(envPath, cleanContent, 'utf8');
    console.log('Fixed .env.local via script.');
} catch (err) {
    console.error('Error fixing .env.local:', err);
}
