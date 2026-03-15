const fs = require('fs');

const updateDict = (file, data) => {
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  dict.landing.pricing = data;
  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
};

updateDict('src/dictionaries/en.json', {
  title1: 'Simple daily support.',
  title2: 'One monthly plan.',
  planName: 'Mindbanger Daily',
  price: '€7.90',
  period: '/ month',
  subtitle: 'Less than a cup of coffee per week.',
  features: [
    'Daily mind signal',
    'Daily focus',
    'Daily affirmation',
    'Audio reset',
    'Archive access',
    'Bonus resets'
  ],
  cancelText: 'Cancel anytime. No questions asked.'
});

updateDict('src/dictionaries/sk.json', {
  title1: 'Jednoduchá denná podpora.',
  title2: 'Jeden mesačný plán.',
  planName: 'Mindbanger Daily',
  price: '€7.90',
  period: '/ mesiac',
  subtitle: 'Menej ako jedna káva týždenne.',
  features: [
    'Denný mind signál',
    'Denné zameranie',
    'Denná afirmácia',
    'Audio reset',
    'Prístup do archívu',
    'Bonusové resety'
  ],
  cancelText: 'Zrušenie kedykoľvek. Žiadne otázky.'
});

updateDict('src/dictionaries/cs.json', {
  title1: 'Jednoduchá denní podpora.',
  title2: 'Jeden měsíční plán.',
  planName: 'Mindbanger Daily',
  price: '€7.90',
  period: '/ měsíc',
  subtitle: 'Méně než jedna káva týdně.',
  features: [
    'Denní mind signál',
    'Denní zaměření',
    'Denní afirmace',
    'Audio reset',
    'Přístup do archivu',
    'Bonusové resety'
  ],
  cancelText: 'Zrušení kdykoliv. Žádné otázky.'
});

console.log('Pricing dictionaries updated.');
