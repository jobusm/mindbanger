const fs = require('fs');
let c = fs.readFileSync('src/components/CompleteButton.tsx', 'utf8');

c = c.replace(/ProsĂm, najprv sa prihlĂˇste\./g, 'Prosím, najprv sa prihláste.');
c = c.replace(/DennĂ˝ mindset nastavenĂ˝!/g, 'Denný mindset nastavený!');
c = c.replace(/Chyba pri ukladanĂ:/g, 'Chyba pri ukladaní:');
c = c.replace(/DennĂ˝ Mindset NastavenĂ˝/g, 'Denný Mindset Nastavený');

fs.writeFileSync('src/components/CompleteButton.tsx', c);