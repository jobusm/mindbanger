const fs = require('fs');

const updateDict = (file, data) => {
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  dict.landing.faq = data;
  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
};

updateDict('src/dictionaries/en.json', {
  title: 'Questions',
  faqs: [
    { q: 'What do I get every day?', a: 'A daily theme, short signal, focus, affirmation and audio reset.' },
    { q: 'Is this a meditation app?', a: 'No. It is a daily mind ritual designed for clarity, calm and direction.' },
    { q: 'Can I cancel anytime?', a: 'Yes.' },
    { q: 'Is the content in English?', a: 'Yes. English is the main version.' },
    { q: 'Do I get access to past days?', a: 'Yes, through the archive.' }
  ]
});

updateDict('src/dictionaries/sk.json', {
  title: 'Otázky',
  faqs: [
    { q: 'Čo získam každý deň?', a: 'Dennú tému, krátky signál, zameranie, afirmáciu a audio reset.' },
    { q: 'Je toto meditačná aplikácia?', a: 'Nie. Ide o denný rituál mysle určený pre jasnosť, pokoj a smerovanie.' },
    { q: 'Môžem to kedykoľvek zrušiť?', a: 'Áno.' },
    { q: 'Je obsah v slovenčine?', a: 'Áno. Aplikácia sa prispôsobí vášmu jazyku.' },
    { q: 'Mám prístup k predchádzajúcim dňom?', a: 'Áno, prostredníctvom archívu.' }
  ]
});

updateDict('src/dictionaries/cs.json', {
  title: 'Otázky',
  faqs: [
    { q: 'Co získám každý den?', a: 'Denní téma, krátký signál, zaměření, afirmaci a audio reset.' },
    { q: 'Je to meditační aplikace?', a: 'Ne. Jde o denní rituál mysli určený pro jasnost, klid a směřování.' },
    { q: 'Mohu to kdykoli zrušit?', a: 'Ano.' },
    { q: 'Je obsah v češtině?', a: 'Ano. Aplikace se přizpůsobí vašemu jazyku.' },
    { q: 'Mám přístup k předchozím dnům?', a: 'Ano, prostřednictvím archivu.' }
  ]
});

console.log('FAQ dictionaries updated.');
