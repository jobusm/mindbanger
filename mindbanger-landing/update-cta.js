const fs = require('fs');
const path = require('path');

const locales = ['en', 'sk', 'cs'];

locales.forEach(lang => {
  const filePath = path.join(__dirname, 'src', 'dictionaries', `${lang}.json`);
  let content = fs.readFileSync(filePath, 'utf8');
  let dict = JSON.parse(content);

  // Add hero CTA
  if (lang === 'sk') {
    dict.landing.hero.cta = "Začať Mindbanger Daily";
    dict.landing.pricing.cta = "Začať Mindbanger Daily";
  } else if (lang === 'cs') {
    dict.landing.hero.cta = "Začít Mindbanger Daily";
    dict.landing.pricing.cta = "Začít Mindbanger Daily";
  } else if (lang === 'en') {
    dict.landing.hero.cta = "Start Mindbanger Daily";
    dict.landing.pricing.cta = "Start Mindbanger Daily";
  }

  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), 'utf8');
});

console.log("Updated dicts for CTA buttons");
