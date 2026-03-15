const fs = require('fs');
let content = fs.readFileSync('src/components/FAQSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  "'use client';\nimport { useDictionary } from './LanguageProvider';"
);

content = content.replace(
  /export default function FAQSection\(\) \{/,
  "export default function FAQSection() {\n  const { dict } = useDictionary();"
);

content = content.replace(
  /Questions<\/h2>/,
  "{dict?.landing?.faq?.title || 'Questions'}</h2>"
);

content = content.replace(
  /\{faqs\.map\(\(item, idx\) => \(/,
  "{(dict?.landing?.faq?.faqs || faqs).map((item, idx) => ("
);

content = content.replace(
  /\{item\.q\}/,
  "{item.q}"
);

content = content.replace(
  /\{item\.a\}/,
  "{item.a}"
);

fs.writeFileSync('src/components/FAQSection.tsx', content);
console.log('FAQSection updated!');
