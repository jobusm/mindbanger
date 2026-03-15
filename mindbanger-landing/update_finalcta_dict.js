const fs = require('fs');

const updateDict = (file, data) => {
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  dict.landing.finalCta = data;
  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
};

updateDict('src/dictionaries/en.json', {
  badge: 'Start your daily reset',
  title1: 'Set your mind.',
  title2: 'Shape your day.',
  quote: '\"The way your mind is set begins to shape your reality.\"',
  footer: 'Join Mindbanger Daily Waitlist'
});

updateDict('src/dictionaries/sk.json', {
  badge: 'Začnite svoj denný reset',
  title1: 'Nastavte svoju myseľ.',
  title2: 'Formujte svoj deň.',
  quote: '\"Spôsob, akým je vaša myseľ nastavená, začína formovať vašu realitu.\"',
  footer: 'Pridajte sa na čakaciu listinu Mindbanger Daily'
});

updateDict('src/dictionaries/cs.json', {
  badge: 'Začněte svůj denní reset',
  title1: 'Nastavte svou mysl.',
  title2: 'Formujte svůj den.',
  quote: '\"To, jak je nastavena vaše mysl, začíná utvářet vaši realitu.\"',
  footer: 'Přidejte se na čekací listinu Mindbanger Daily'
});

console.log('FinalCTA dictionaries updated.');
