const fs = require('fs');
let code = fs.readFileSync('src/app/app/archive/page.tsx', 'utf8');

code = code.replace(
  "import { getDictionary } from '@/lib/i18n';",
  "import { getDictionary } from '@/lib/i18n';\nimport { cookies } from 'next/headers';\nimport LockedDashboard from '@/components/app/LockedDashboard';"
);

code = code.replace(
  ".select('preferred_language, created_at')",
  ".select('preferred_language, created_at, subscription_status')"
);

code = code.replace(
  "const userLang = profile?.preferred_language || 'en';",
  "const cookieStore = await cookies();\n  const cookieLang = cookieStore.get('user-lang')?.value;\n  const userLang = cookieLang || profile?.preferred_language || 'en';\n\n  // Check premium access\n  const hasAccess = profile?.subscription_status === 'premium';"
);

code = code.replace(
  "  if (currentTab === 'daily') {",
  "  if (currentTab === 'daily' && hasAccess) {"
);

code = code.replace(
  "            {signals.length === 0 ? (",
  "            {!hasAccess ? (\n              <div className=\"mt-8\">\n                <LockedDashboard userLang={userLang} />\n              </div>\n            ) : signals.length === 0 ? ("
);

let todayCode = fs.readFileSync('src/app/app/today/page.tsx', 'utf8');
todayCode = todayCode.replace(
  "const userLang = profile?.preferred_language || cookieStore.get('user-lang')?.value || 'en';",
  "const userLang = cookieStore.get('user-lang')?.value || profile?.preferred_language || 'en';"
);
fs.writeFileSync('src/app/app/today/page.tsx', todayCode);

fs.writeFileSync('src/app/app/archive/page.tsx', code);
console.log('Patched Archive and Today pages!');
