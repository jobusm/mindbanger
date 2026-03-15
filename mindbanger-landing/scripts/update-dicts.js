const fs = require('fs');

const dictionaries = {
  en: {
    settings: {
      "loading": "Loading settings...",
      "title": "Account Settings",
      "subtitle": "Customize your Mindbanger experience.",
      "nameLabel": "Your Name",
      "namePlaceholder": "Your name",
      "languageLabel": "Content Language",
      "langEn": "English (English)",
      "langSk": "Slovenčina (Slovak)",
      "langCs": "Čeština (Czech)",
      "languageDesc": "Determines the language of your daily signal.",
      "timezoneLabel": "My Timezone",
      "timezoneDesc": "Important if you travel. Helps us unlock today's content exactly for your local time.",
      "saveBtn": "Save settings",
      "savingBtn": "Saving...",
      "dangerZone": "Subscription & Sign Out",
      "dangerDesc": "Manage your card, invoices via Stripe, or sign out.",
      "manageStripe": "Manage Subscription in Stripe",
      "logoutBtn": "Sign Out"
    }
  },
  sk: {
    settings: {
      "loading": "Načítavam nastavenia...",
      "title": "Nastavenia účtu",
      "subtitle": "Prispôsobte si svoj Mindbanger zážitok.",
      "nameLabel": "Vaše Meno",
      "namePlaceholder": "Tvoje meno",
      "languageLabel": "Jazyk obsahu",
      "langEn": "Angličtina (English)",
      "langSk": "Slovenčina (Slovak)",
      "langCs": "Čeština (Czech)",
      "languageDesc": "Určuje v akom jazyku dostanete denný signál.",
      "timezoneLabel": "Moje Časové Pásmo",
      "timezoneDesc": "Dôležité, ak cestujete. Pomáha nám odomknúť dnešný obsah presne pre váš lokálny čas.",
      "saveBtn": "Uložiť nastavenia",
      "savingBtn": "Ukladám...",
      "dangerZone": "Správa odberu & Odhlásenie",
      "dangerDesc": "Tu si môžete spravovať svoju kartu, faktúry cez Stripe alebo sa odhlásiť z aplikácie.",
      "manageStripe": "Spravovať Predplatné v Stripe",
      "logoutBtn": "Odhlásiť sa"
    }
  },
  cs: {
    settings: {
      "loading": "Načítám nastavení...",
      "title": "Nastavení účtu",
      "subtitle": "Přizpůsobte si svůj Mindbanger zážitek.",
      "nameLabel": "Vaše Jméno",
      "namePlaceholder": "Tvoje jméno",
      "languageLabel": "Jazyk obsahu",
      "langEn": "Angličtina (English)",
      "langSk": "Slovenčina (Slovak)",
      "langCs": "Čeština (Czech)",
      "languageDesc": "Určuje v jakém jazyce dostanete denní signál.",
      "timezoneLabel": "Moje Časové Pásmo",
      "timezoneDesc": "Důležité, pokud cestujete. Pomáhá nám odemknout dnešní obsah přesně pro váš lokální čas.",
      "saveBtn": "Uložit nastavení",
      "savingBtn": "Ukládám...",
      "dangerZone": "Správa odběru & Odhlášení",
      "dangerDesc": "Zde si můžete spravovat svou kartu, faktury přes Stripe nebo se odhlásit z aplikace.",
      "manageStripe": "Spravovat Předplatné ve Stripe",
      "logoutBtn": "Odhlásit se"
    }
  }
};

['en', 'sk', 'cs'].forEach(lang => {
  const file = `src/dictionaries/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.settings = dictionaries[lang].settings;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
