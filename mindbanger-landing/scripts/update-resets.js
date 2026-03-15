const fs = require('fs');

const file = 'src/app/app/resets/[id]/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(
  "import { redirect } from 'next/navigation';",
  "import { redirect } from 'next/navigation';\nimport { getDictionary } from '@/lib/i18n';"
);

txt = txt.replace(
  "const userLang = profile?.preferred_language || 'en';",
  "const userLang = profile?.preferred_language || 'en';\n  const dict = getDictionary(userLang);"
);

txt = txt.replace(
  /Späť na zoznam produktov/,
  '{dict.resets?.backToProducts || "Back to products"}'
);

txt = txt.replace(
  /Audio zatiaľ nie je k dispozícii./,
  '{dict.resets?.audioNotAvailable || "Audio not available yet."}'
);

fs.writeFileSync(file, txt);
