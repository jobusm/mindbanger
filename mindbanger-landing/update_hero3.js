const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

const quoteRegex = /[“"”\u201C\u201D]The way your mind is set begins to shape your reality\.[“"”\u201C\u201D]/;
content = content.replace(
  quoteRegex,
  "{dict?.landing?.hero?.quote || '\"The way your mind is set begins to shape your reality.\"'}"
);

fs.writeFileSync('src/components/HeroSection.tsx', content);
console.log('HeroSection quote text updated!');
