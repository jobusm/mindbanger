const fs = require('fs');
let content = fs.readFileSync('src/components/PricingSection.tsx', 'utf8');

content = content.replace(
  /'use client';/,
  "'use client';\nimport { useDictionary } from './LanguageProvider';"
);

content = content.replace(
  /export default function PricingSection\(\) \{/,
  "export default function PricingSection() {\n  const { dict } = useDictionary();"
);

content = content.replace(
  /Simple daily support\.<br \/> One monthly plan\./,
  "{dict?.landing?.pricing?.title1 || 'Simple daily support.'}<br /> {dict?.landing?.pricing?.title2 || 'One monthly plan.'}"
);

content = content.replace(
  /Mindbanger Daily<\/h3>/,
  "{dict?.landing?.pricing?.planName || 'Mindbanger Daily'}</h3>"
);

content = content.replace(
  /â‚¬7\.90/g,
  "{dict?.landing?.pricing?.price || '€7.90'}"
);
content = content.replace(
  /€7\.90/g,
  "{dict?.landing?.pricing?.price || '€7.90'}"
);

content = content.replace(
  /\/ month<\/span>/,
  "{dict?.landing?.pricing?.period || '/ month'}</span>"
);

content = content.replace(
  /Less than a cup of coffee per week\./,
  "{dict?.landing?.pricing?.subtitle || 'Less than a cup of coffee per week.'}"
);

content = content.replace(
  /\{features\.map\(\(feat, idx\) => \(/,
  "{(dict?.landing?.pricing?.features || features).map((feat, idx) => ("
);

content = content.replace(
  /Cancel anytime\. No questions asked\./,
  "{dict?.landing?.pricing?.cancelText || 'Cancel anytime. No questions asked.'}"
);

fs.writeFileSync('src/components/PricingSection.tsx', content);
console.log('PricingSection updated!');
