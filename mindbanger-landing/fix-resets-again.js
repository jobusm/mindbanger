const fs = require('fs');
let code = fs.readFileSync('src/app/app/resets/page.tsx', 'utf8');

code = code.replace(/import \{ cookies \} from 'next\/headers';\n/g, '');
code = code.replace(
  "import { getDictionary } from '@/lib/i18n';",
  "import { getDictionary } from '@/lib/i18n';\nimport { cookies } from 'next/headers';"
);

fs.writeFileSync('src/app/app/resets/page.tsx', code);
console.log('Fixed duplicate cookies in resets!');
