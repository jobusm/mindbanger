
const fs = require('fs');
let content = fs.readFileSync('src/components/DailyRitualSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  \'use client';\nimport { useDictionary } from './LanguageProvider';\
);

content = content.replace(
  /export default function DailyRitualSection\(\) \{/,
  \export default function DailyRitualSection() {
  const { dict } = useDictionary();\
);

content = content.replace(
  /Every day inside Mindbanger Daily:/,
  \{dict?.landing?.dailyRitual?.title}\
);

content = content.replace(
  /\{features\.map\(\(feature, idx\)/,
  \{features.map((feature, idx)\
);

content = content.replace(
  /\{feature\.title\}/g,
  \{dict?.landing?.dailyRitual?.features?.[idx]?.title || feature.title}\
);

content = content.replace(
  /\{feature\.desc\}/g,
  \{dict?.landing?.dailyRitual?.features?.[idx]?.desc || feature.desc}\
);

fs.writeFileSync('src/components/DailyRitualSection.tsx', content);
console.log('DailyRitualSection updated.');

