
const fs = require('fs');
let content = fs.readFileSync('src/components/BenefitsSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  \'use client';\nimport { useDictionary } from './LanguageProvider';\
);

content = content.replace(
  /export default function BenefitsSection\(\) \{/,
  \export default function BenefitsSection() {
  const { dict } = useDictionary();\
);

content = content.replace(
  /Mindbanger Daily is for you if you want to…/,
  \{dict?.landing?.benefits?.title || 'Mindbanger Daily is for you if you want to…'}\
);

content = content.replace(
  /\{benefits\.map\(\(benefit, idx\) => \(/,
  \{(dict?.landing?.benefits?.items || benefits).map((benefit, idx) => (\
);

fs.writeFileSync('src/components/BenefitsSection.tsx', content);
console.log('BenefitsSection updated.');

