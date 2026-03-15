const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

content = content.replace(
  /\{dict\?\.landing\?\.hero\?\.widgetFooter \|\| \'A new signal every day\. <br\/> A stronger inner direction over time\.\'\}/,
  "{dict?.landing?.hero?.widgetFooter1 || 'A new signal every day.'} <br/> {dict?.landing?.hero?.widgetFooter2 || 'A stronger inner direction over time.'}"
);

fs.writeFileSync('src/components/HeroSection.tsx', content);

const dicts = ['en', 'sk', 'cs'];
for (const lang of dicts) {
  const dict = JSON.parse(fs.readFileSync(\src/dictionaries/\.json\, 'utf8'));
  if (lang === 'en') {
    dict.landing.hero.widgetFooter1 = 'A new signal every day.';
    dict.landing.hero.widgetFooter2 = 'A stronger inner direction over time.';
  } else if (lang === 'sk') {
    dict.landing.hero.widgetFooter1 = 'Nový signál každý deň.';
    dict.landing.hero.widgetFooter2 = 'Silnejšie vnútorné smerovanie časom.';
  } else if (lang === 'cs') {
    dict.landing.hero.widgetFooter1 = 'Nový signál každý den.';
    dict.landing.hero.widgetFooter2 = 'Silnější vnitřní směřování časem.';
  }
  fs.writeFileSync(\src/dictionaries/\.json\, JSON.stringify(dict, null, 2));
}

console.log('HeroSection widget text corrected!');
