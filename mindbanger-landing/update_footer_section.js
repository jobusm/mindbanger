const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  "'use client';\nimport { useDictionary } from './LanguageProvider';"
);

content = content.replace(
  /export default function Footer\(\) \{/,
  "export default function Footer() {\n  const { dict } = useDictionary();"
);

content = content.replace(
  /Daily signals for clarity, calm & focus\./,
  "{dict?.landing?.footer?.tagline || 'Daily signals for clarity, calm & focus.'}"
);

content = content.replace(
  />Login</,
  ">{dict?.landing?.footer?.login || 'Login'}<"
);

content = content.replace(
  />Join</,
  ">{dict?.landing?.footer?.join || 'Join'}<"
);

content = content.replace(
  />Privacy</,
  ">{dict?.landing?.footer?.privacy || 'Privacy'}<"
);

content = content.replace(
  />Terms</,
  ">{dict?.landing?.footer?.terms || 'Terms'}<"
);

fs.writeFileSync('src/components/Footer.tsx', content);
console.log('Footer updated!');
