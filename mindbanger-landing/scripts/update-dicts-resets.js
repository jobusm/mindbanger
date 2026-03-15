const fs = require('fs');

const dictionaries = {
  en: {
    resets: {
      "backToProducts": "Back to products",
      "audioNotAvailable": "Audio not available yet."
    }
  },
  sk: {
    resets: {
      "backToProducts": "Späť na zoznam produktov",
      "audioNotAvailable": "Audio zatiaľ nie je k dispozícii."
    }
  },
  cs: {
    resets: {
      "backToProducts": "Zpět na seznam produktů",
      "audioNotAvailable": "Audio zatím není k dispozici."
    }
  }
};

['en', 'sk', 'cs'].forEach(lang => {
  const file = `src/dictionaries/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.resets = dictionaries[lang].resets;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
