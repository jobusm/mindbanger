
const fs = require('fs');
let content = fs.readFileSync('src/components/VIPZonePreviewSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  \'use client';\nimport { useDictionary } from './LanguageProvider';\
);

content = content.replace(
  /export default function VIPZonePreviewSection\(\) \{/,
  \export default function VIPZonePreviewSection() {
  const { dict } = useDictionary();\
);

content = content.replace(
  /Inside the VIP Zone/,
  \{dict?.landing?.vipZone?.title || 'Inside the VIP Zone'}\
);

content = content.replace(
  /\{card\.title\}/g,
  \{dict?.landing?.vipZone?.cards?.[idx]?.title || card.title}\
);

content = content.replace(
  /\{card\.desc\}/g,
  \{dict?.landing?.vipZone?.cards?.[idx]?.desc || card.desc}\
);

fs.writeFileSync('src/components/VIPZonePreviewSection.tsx', content);
console.log('VIPZonePreviewSection updated.');

