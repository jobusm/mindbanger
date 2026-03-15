const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  "'use client';\nimport { useDictionary } from './LanguageProvider';"
);

content = content.replace(
  /export default function HeroSection\(\) \{/,
  "export default function HeroSection() {\n  const { dict } = useDictionary();"
);

content = content.replace(
  /Mindbanger Daily<\/span>/,
  "{dict?.landing?.hero?.badge || 'Mindbanger Daily'}</span>"
);

content = content.replace(
  /Set yourself up for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">success<\/span> every day/,
  "{dict?.landing?.hero?.titlePart1 || 'Set yourself up for '}<span className=\"text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600\">{dict?.landing?.hero?.titleHighlight || 'success'}</span>{dict?.landing?.hero?.titlePart2 || ' every day'}"
);

content = content.replace(
  /A short daily reset for more clarity, less noise and a stronger mind\./,
  "{dict?.landing?.hero?.subtitle || 'A short daily reset for more clarity, less noise and a stronger mind.'}"
);

fs.writeFileSync('src/components/HeroSection.tsx', content);
console.log('HeroSection updated!');
