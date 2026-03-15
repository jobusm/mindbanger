
const fs = require('fs');

const updateDict = (file, data) => {
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  dict.landing.about = data;
  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
};

updateDict('src/dictionaries/en.json', {
  badge: 'About the Creator',
  role: 'Life Coach, Hypnotherapist, and mental performance guide.',
  quote1: 'Mindbanger Daily was created to help people shape each day from the inside out — through',
  span1: 'clarity',
  quote2: ', ',
  span2: 'calm',
  quote3: ', ',
  span3: 'focus',
  quote4: ' and ',
  span4: 'intentional mental direction',
  quote5: '.'
});

updateDict('src/dictionaries/sk.json', {
  badge: 'O Tvorcovi',
  role: 'ivotnı kouè, hypnoterapeut a sprievodca mentálnym vıkonom.',
  quote1: 'Mindbanger Daily bol vytvorenı, aby pomohol ¾uïom formova kadı deò zvnútra von — prostredníctvom',
  span1: 'jasnosti',
  quote2: ', ',
  span2: 'pokoja',
  quote3: ', ',
  span3: 'sústredenia',
  quote4: ' a ',
  span4: 'zámerného mentálneho smerovania',
  quote5: '.'
});

updateDict('src/dictionaries/cs.json', {
  badge: 'O tvùrci',
  role: 'ivotní kouè, hypnoterapeut a prùvodce mentálním vıkonem.',
  quote1: 'Mindbanger Daily byl vytvoøen, aby pomohl lidem formovat kadı den zevnitø ven — prostøednictvím',
  span1: 'jasnosti',
  quote2: ', ',
  span2: 'klidu',
  quote3: ', ',
  span3: 'soustøedìní',
  quote4: ' a ',
  span4: 'zámìrného mentálního smìøování',
  quote5: '.'
});

console.log('About dictionaries updated.');

