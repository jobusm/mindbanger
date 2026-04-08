const fs = require('fs');
let c = fs.readFileSync('src/app/api/admin/upload-individual/route.ts', 'utf8');

c = c.replace(/import \{ Resend \} from 'resend';/g, "import { sendEmail } from '@/lib/email';");
c = c.replace(/const resend = process\.env\.RESEND_API_KEY \? new Resend\(process\.env\.RESEND_API_KEY\) : null;/g, "");

const emailOld = \        // Send Email
        if (userEmail && resend) {
            try {
                await resend.emails.send({
                    from: 'Mindbanger <noreply@mindbanger.com>',
                    to: userEmail,
                    subject: 'M√°te nov√∫ individu√°lnu nahr√°vku!',
                    html: \\\
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2>Z√skali ste nov√∫ nahr√°vku!</h2>
                            <p>Ahoj \,</p>
                            <p>Do v√°≈°ho profilu v aplik√°cii Mindbanger bola pridan√° nov√° s√∫kromn√° nahr√°vka s n√°zvom: <strong>\</strong>.</p>
                            <p><a href="https://mindbanger.com/app/my-audio" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Prehra≈• nahr√°vku v appke</a></p>
                            <p style="margin-top: 30px; font-size: 12px; color: #666;">T√°to nahr√°vka je dostupn√° len pre v√°≈° profil.</p>
                        </div>
                    \\\
                });
            } catch(e) {
                console.error("Resend error:", e);
            }
        }\;

const splitted = c.split('// Send Email');
if(splitted.length < 2) {
    console.error('Could not find Send Email section.');
    process.exit(1);
}

const p2 = splitted[1].split('// Send Push Notification');

const emailNew = \
        if (userEmail) {
            try {
                await sendEmail({
                    from: 'Mindbanger <noreply@mindbanger.com>',
                    to: userEmail,
                    subject: 'M·te nov˙ individu·lnu nahr·vku!',
                    html: \\\
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2>ZÌskali ste nov˙ nahr·vku!</h2>
                            <p>Ahoj \,</p>
                            <p>Do v·öho profilu v aplik·cii Mindbanger bola pridan· nov· s˙kromn· nahr·vka s n·zvom: <strong>\</strong>.</p>
                            <p><a href="https://mindbanger.com/app/my-audio" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Prehraù nahr·vku v appke</a></p>
                            <p style="margin-top: 30px; font-size: 12px; color: #666;">T·to nahr·vka je dostupn· len pre v·ö profil.</p>
                        </div>
                    \\\
                });
            } catch(e) {
                console.error("Email send error:", e);
            }
        }

        \;

c = splitted[0] + '// Send Email' + emailNew + '// Send Push Notification' + p2[1];

fs.writeFileSync('src/app/api/admin/upload-individual/route.ts', c);
console.log('Successfully patched email script.');
