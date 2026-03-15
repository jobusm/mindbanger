const fs = require('fs');
const txt = fs.readFileSync('src/app/app/today/page.tsx', 'utf8');
const fixed = txt.replace(/\/\/ Get localized today's date in YYYY-MM-DD format based on user's timezone[\s\S]*?timeZone: userTimezone/, "// Get localized today's date in YYYY-MM-DD format based on user's timezone\n  const now = new Date();\n  const optionsForDate: Intl.DateTimeFormatOptions = {\n    timeZone: userTimezone");
fs.writeFileSync('src/app/app/today/page.tsx', fixed);