const fs = require('fs');

const updateDict = (file, data) => {
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  dict.landing.hero.subtitleDesc = data.subtitleDesc;
  dict.landing.hero.subtitleAuthor = data.subtitleAuthor;
  dict.landing.hero.quote = data.quote;
  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
};

updateDict('src/dictionaries/en.json', {
  subtitleDesc: 'Daily mind signals for clarity, calm & focus.',
  subtitleAuthor: 'Created by a Life Coach & Hypnotherapist.',
  quote: '\"The way your mind is set begins to shape your reality.\"'
});

updateDict('src/dictionaries/sk.json', {
  subtitleDesc: 'Denné signály pre jasnosť, pokoj a sústredenie.',
  subtitleAuthor: 'Vytvorené životným koučom a hypnoterapeutom.',
  quote: '\"Spôsob, akým je vaša myseľ nastavená, začína formovať vašu realitu.\"'
});

updateDict('src/dictionaries/cs.json', {
  subtitleDesc: 'Denní signály pro jasnost, klid a soustředění.',
  subtitleAuthor: 'Vytvořeno životním koučem a hypnoterapeutem.',
  quote: '\"To, jak je nastavena vaše mysl, začíná utvářet vaši realitu.\"'
});

console.log('Hero dictionary extras updated.');
