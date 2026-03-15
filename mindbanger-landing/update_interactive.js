
const fs = require('fs');
let content = fs.readFileSync('src/components/InteractivePreviewSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  \'use client';\nimport { useDictionary } from './LanguageProvider';\
);

content = content.replace(
  /export default function InteractivePreviewSection\(\) \{/,
  \export default function InteractivePreviewSection() {
  const { dict } = useDictionary();\
);

content = content.replace(
  /Choose the word that pulls you in first/,
  \{dict?.landing?.interactivePreview?.title || 'Choose the word that pulls you in first'}\
);

content = content.replace(
  /\{options\.map\(\(opt\) => \{/,
  \{options.map((opt, idx) => {\
);

content = content.replace(
  /const isActive = active === opt\.keyword;/,
  \const translatedKeyword = dict?.landing?.interactivePreview?.options?.[idx]?.keyword || opt.keyword;
            const translatedDesc = dict?.landing?.interactivePreview?.options?.[idx]?.desc || opt.desc;
            const isActive = active === opt.keyword;\
);

content = content.replace(
  /\{opt\.keyword\}/g,
  \{translatedKeyword}\
);

content = content.replace(
  /\{opt\.desc\}/g,
  \{translatedDesc}\
);

content = content.replace(
  /\{active \? \Unlock the full daily signal for \$\{active\}\ : 'Unlock the full daily signal'\}/,
  \{active 
    ? (dict?.landing?.interactivePreview?.buttonActive || 'Unlock the full daily signal for {active}').replace('{active}', dict?.landing?.interactivePreview?.options?.find(o => o.keyword === active || (options.find(orig => orig.keyword === active)?.keyword === o.keyword))?.keyword || active)
    : (dict?.landing?.interactivePreview?.buttonInactive || 'Unlock the full daily signal')}\
);

fs.writeFileSync('src/components/InteractivePreviewSection.tsx', content);
console.log('InteractivePreviewSection updated.');

