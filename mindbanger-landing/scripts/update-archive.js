const fs = require('fs');
let c = fs.readFileSync('src/app/app/archive/page.tsx', 'utf8');

if (!c.includes('getDictionary')) {
    c = c.replace(/import Link from 'next\/link';/, "import Link from 'next/link';\nimport { getDictionary } from '@/lib/i18n';");
    c = c.replace(/const userLang = profile\?\.preferred_language \|\| 'en';/, "const userLang = profile?.preferred_language || 'en';\n  const dict = getDictionary(userLang);\n  const t = dict.archive;");
}

// Header
c = c.replace(/The Vault/, '{t.title}');
// It's safer to use regex for text blocks that might contain special characters
c = c.replace(/<p className="text-slate-400 max-w-lg leading-relaxed">[\s\S]*?<\/p>/, '<p className="text-slate-400 max-w-lg leading-relaxed">{t.subtitle}</p>');

// Tabs
c = c.replace(/>\s*Denn[^\n<]+Arch[^\n<]+\s*<\/Link>/i, '>{t.tabDaily}</Link>');
c = c.replace(/>\s*Samostatn[^\n<]+Produkty\s*<\/Link>/i, '>{t.tabProducts}</Link>');

// Read Reset
c = c.replace(/Read reset <span/g, '{t.readReset} <span');

// Empty Library
c = c.replace(/Va[^\n<]+kni[^\n<]+nica je\s*zatia[^\n<]+pr[^\n<]+zdna/gi, '{t.libraryEmpty}');
c = c.replace(/Temporal Content Lock akt[^\n<]+vny[^<]+zopakova[^\n<]+\./gi, '{t.temporalLockText}');

// Quick Resets items
c = c.replace(/Audio \S+prava/g, '{t.audioAdjust}');
c = c.replace(/R\S+chly Reset/g, '{t.quickReset}');
c = c.replace(/Za\S+a\S+ reset <span/g, '{t.startReset} <span');

// Missing products
c = c.replace(/Pripravujeme nov\S+ resety/gi, '{t.preparing}');
c = c.replace(/R\S+chle zvukov\S+ resety [^\n<]+ Vaultu\./gi, '{t.noResetsText}');

fs.writeFileSync('src/app/app/archive/page.tsx', c, 'utf8');

console.log("Successfully replaced archive strings.");
