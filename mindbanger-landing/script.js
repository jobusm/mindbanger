const fs = require('fs');
let c = fs.readFileSync('src/components/admin/IndividualRecordingsManager.tsx', 'utf8');

const p = c.split('const formData = new FormData();');
const p2 = p[1].split('body: formData');
const p3 = p2[1].split('});');

const r = "            const s3Req = await fetch('/api/upload', { " +
"                method: 'POST', " +
"                headers: { 'Content-Type': 'application/json' }, " +
"                body: JSON.stringify({ filename: file.name, contentType: file.type || 'audio/mpeg' }) " +
"            }); " +
"            const s3Data = await s3Req.json(); " +
"            if (!s3Req.ok) throw new Error(s3Data.error || 'Nepodarilo sa vytvorit upload URL'); " +
"            const { uploadUrl, publicUrl } = s3Data; " +
" " +
"            toast.loading('Nahravam subor do R2...', { id: toastId }); " +
"            const uploadReq = await fetch(uploadUrl, { " +
"                method: 'PUT', " +
"                headers: { 'Content-Type': file.type || 'audio/mpeg' }, " +
"                body: file " +
"            }); " +
"            if (!uploadReq.ok) throw new Error('Zlyhal upload na R2'); " +
" " +
"            toast.loading('Pripravujem notifikacie...', { id: toastId }); " +
"            const res = await fetch('/api/admin/upload-individual', { " +
"                method: 'POST', " +
"                headers: { 'Content-Type': 'application/json' }, " +
"                body: JSON.stringify({ " +
"                    publicUrl, " +
"                    title, " +
"                    userId: selectedUser.id, " +
"                    userEmail: selectedUser.email, " +
"                    userName: selectedUser.full_name || 'Odberatel' " +
"                }) " +
"            });";

c = p[0] + r + p3.slice(1).join('});');
fs.writeFileSync('src/components/admin/IndividualRecordingsManager.tsx', c);
