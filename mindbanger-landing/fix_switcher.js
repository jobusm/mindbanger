const fs = require('fs');
let content = fs.readFileSync('src/components/LanguageSwitcher.tsx', 'utf8');
content = content.replace(
    'document.cookie = \\\\user-lang=\\\\; path=/; max-age=31536000\\\\;',
    'document.cookie = \user-lang=\; path=/; max-age=31536000\;'
);
fs.writeFileSync('src/components/LanguageSwitcher.tsx', content, 'utf8');
