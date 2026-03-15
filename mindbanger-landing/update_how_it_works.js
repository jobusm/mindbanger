
const fs = require('fs');
let content = fs.readFileSync('src/components/HowItWorksSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  \'use client';\nimport { useDictionary } from './LanguageProvider';\
);

content = content.replace(
  /export default function HowItWorksSection\(\) \{/,
  \export default function HowItWorksSection() {
  const { dict } = useDictionary();\
);

content = content.replace(
  /How it works</g,
  \{dict?.landing?.howItWorks?.title || 'How it works'}</\
);

content = content.replace(
  /\{step\.title\}/g,
  \{dict?.landing?.howItWorks?.steps?.[idx]?.title || step.title}\
);

content = content.replace(
  /\{step\.desc\}/g,
  \{dict?.landing?.howItWorks?.steps?.[idx]?.desc || step.desc}\
);

fs.writeFileSync('src/components/HowItWorksSection.tsx', content);
console.log('HowItWorksSection updated.');

