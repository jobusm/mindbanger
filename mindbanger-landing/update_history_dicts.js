const fs = require('fs');
const dicts = ['en', 'sk', 'cs'];

const translations = {
  en: {
    "history_title": "Payout History & Movements",
    "history_desc": "Track your payout requests and their statuses.",
    "history_empty": "No payout movements yet.",
    "history_date": "Date",
    "history_amount": "Amount",
    "history_status": "Status"
  },
  sk: {
    "history_title": "História výplat a pohyby",
    "history_desc": "Sledujte svoje žiadosti o výplatu a ich stav.",
    "history_empty": "Zatiaľ žiadne pohyby na účte.",
    "history_date": "Dátum",
    "history_amount": "Suma",
    "history_status": "Stav"
  },
  cs: {
    "history_title": "Historie výplat a pohyby",
    "history_desc": "Sledujte své žádosti o výplatu a jejich stav.",
    "history_empty": "Zatím žádné pohyby na účtu.",
    "history_date": "Datum",
    "history_amount": "Částka",
    "history_status": "Stav"
  }
};

dicts.forEach(lang => {
  const path = `src/dictionaries/${lang}.json`;
  const fileData = fs.readFileSync(path, 'utf8');
  const jsonData = JSON.parse(fileData);
  if(jsonData.affiliate) {
    Object.assign(jsonData.affiliate, translations[lang]);
    fs.writeFileSync(path, JSON.stringify(jsonData, null, 2), 'utf8');
  }
});
console.log('Dictionaries updated with history translations!');
