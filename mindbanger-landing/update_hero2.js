const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

content = content.replace(
  /Daily mind signals for clarity, calm & focus\./,
  "{dict?.landing?.hero?.subtitleDesc || 'Daily mind signals for clarity, calm & focus.'}"
);

content = content.replace(
  /Created by a Life Coach & Hypnotherapist\./,
  "{dict?.landing?.hero?.subtitleAuthor || 'Created by a Life Coach & Hypnotherapist.'}"
);

content = content.replace(
  /“The way your mind is set begins to shape your reality\.”/,
  "{dict?.landing?.hero?.quote || '“The way your mind is set begins to shape your reality.”'}"
);

fs.writeFileSync('src/components/HeroSection.tsx', content);
console.log('HeroSection additional text updated!');
