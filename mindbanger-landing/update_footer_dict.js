const fs = require('fs');

const updateDict = (file, data) => {
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  dict.landing.footer = data;
  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
};

updateDict('src/dictionaries/en.json', {
  tagline: 'Daily signals for clarity, calm & focus.',
  login: 'Login',
  join: 'Join',
  privacy: 'Privacy',
  terms: 'Terms'
});

updateDict('src/dictionaries/sk.json', {
  tagline: 'Denné signály pre jasnosť, pokoj a sústredenie.',
  login: 'Prihlásiť',
  join: 'Pridať sa',
  privacy: 'Súkromie',
  terms: 'Podmienky'
});

updateDict('src/dictionaries/cs.json', {
  tagline: 'Denní signály pro jasnost, klid a soustředění.',
  login: 'Přihlásit',
  join: 'Přidat se',
  privacy: 'Soukromí',
  terms: 'Podmínky'
});

console.log('Footer dictionaries updated.');
