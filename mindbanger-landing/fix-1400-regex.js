const fs = require('fs');
let code = fs.readFileSync('src/app/app/today/page.tsx', 'utf8');

code = code.replace(/if\s*\(refHour\s*>=\s*14\)\s*\{\s*startDayDate\.setDate\(startDayDate\.getDate\(\)\s*\+\s*1\);\s*\}/g, '// Disabled refHour 14 rules');

fs.writeFileSync('src/app/app/today/page.tsx', code);
console.log('Fixed ALL 1400 rules via regex!');
