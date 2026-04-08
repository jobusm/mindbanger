const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SignalsManager.tsx', 'utf8');

// The first script didn't modify anything (no diff), let's inspect why: 
console.log('Spoken match found?', /<label[^>]*>\s*<FileAudio[^>]*>\s*Text Dňa[\s\S]*?<\/label>/i.test(code));
console.log('Meditation match found?', /<label[^>]*>\s*<FileAudio[^>]*>\s*Meditácia \(Sprievodca\)[\s\S]*?<\/label>/i.test(code));

// Ensure Sparkles is imported
if (!code.includes('Sparkles')) {
  code = code.replace('{ FileAudio, Headphones', '{ FileAudio, Headphones, Sparkles');
}
fs.writeFileSync('src/components/admin/SignalsManager.tsx', code, 'utf8');

