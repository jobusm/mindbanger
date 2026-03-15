const fs = require('fs');
let content = fs.readFileSync('src/components/FinalCTASection.tsx', 'utf8');

content = content.replace(
  /'use client';\n\nimport React from 'react';/,
  "'use client';\n\nimport React from 'react';\nimport { useDictionary } from './LanguageProvider';"
);

content = content.replace(
  /export default function FinalCTASection\(\) \{/,
  "export default function FinalCTASection() {\n  const { dict } = useDictionary();"
);

content = content.replace(
  /<span>Start your daily reset<\/span>/,
  "<span>{dict?.landing?.finalCta?.badge || 'Start your daily reset'}</span>"
);

content = content.replace(
  /Set your mind\.<br \/>/,
  "{dict?.landing?.finalCta?.title1 || 'Set your mind.'}<br />"
);

content = content.replace(
  /Shape your day\./,
  "{dict?.landing?.finalCta?.title2 || 'Shape your day.'}"
);

content = content.replace(
  /\"The way your mind is set begins to shape your reality\.\"/,
  "{dict?.landing?.finalCta?.quote || '\"The way your mind is set begins to shape your reality.\"'}"
);

content = content.replace(
  /Join Mindbanger Daily Waitlist/,
  "{dict?.landing?.finalCta?.footer || 'Join Mindbanger Daily Waitlist'}"
);

fs.writeFileSync('src/components/FinalCTASection.tsx', content);
console.log('FinalCTASection updated!');
