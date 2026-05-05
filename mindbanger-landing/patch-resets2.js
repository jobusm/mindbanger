const fs = require('fs');
let code = fs.readFileSync('src/app/app/resets/page.tsx', 'utf8');

code = code.replace(
  "import { getDictionary } from '@/lib/i18n';",
  "import { getDictionary } from '@/lib/i18n';\nimport { cookies } from 'next/headers';"
);

code = code.replace(
  "const userLang = profile?.preferred_language || 'en';",
  "const cookieStore = await cookies();\n  const cookieLang = cookieStore.get('user-lang')?.value;\n  const userLang = cookieLang || profile?.preferred_language || 'en';"
);

fs.writeFileSync('src/app/app/resets/page.tsx', code);
console.log('Patched Resets page twice safely!');
