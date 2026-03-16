const fs = require('fs');
const path = require('path');

const locales = ['en', 'sk', 'cs'];

locales.forEach(lang => {
  const filePath = path.join(__dirname, 'src', 'dictionaries', `${lang}.json`);
  let content = fs.readFileSync(filePath, 'utf8');
  let dict = JSON.parse(content);

  // checkout updates
  if (lang === 'sk') {
    dict.checkout.submit = "Objednávka s povinnosťou platby";
    dict.checkout.digitalConsent = "Výslovne súhlasím s okamžitým dodaním digitálneho obsahu a beriem na vedomie, že tým strácam právo na odstúpenie od zmluvy do 14 dní.";
    dict.checkout.ageConsent = "Potvrdzujem, že mám viac ako 18 rokov pre možnosť platby, resp. 16+ rokov pre používanie služby.";
  } else if (lang === 'cs') {
    dict.checkout.submit = "Objednávka s povinností platby";
    dict.checkout.digitalConsent = "Výslovně souhlasím s okamžitým dodáním digitálního obsahu a beru na vědomí, že tím ztrácím právo na odstoupení od smlouvy do 14 dnů.";
    dict.checkout.ageConsent = "Potvrzuji, že je mi více než 18 let pro možnost platby, resp. 16+ let pro používání služby.";
  } else if (lang === 'en') {
    dict.checkout.submit = "Order with obligation to pay";
    dict.checkout.digitalConsent = "I explicitly consent to the immediate delivery of digital content and acknowledge that I thereby lose my right of withdrawal within 14 days.";
    dict.checkout.ageConsent = "I confirm that I am over 18 years old to make a purchase, or 16+ years old to use the service.";
  }

  // cookie banner
  dict.cookieBanner = {
    "text": "Tento web používa súbory cookie pre zlepšenie používateľskej skúsenosti a správne fungovanie služby. Pokračovaním vyjadrujete súhlas s ich používaním.",
    "accept": "Rozumiem a súhlasím"
  };
  if (lang === 'cs') {
    dict.cookieBanner = {
      "text": "Tento web používá soubory cookie pro zlepšení uživatelské zkušenosti a správné fungování služby. Pokračováním vyjadřujete souhlas s jejich používáním.",
      "accept": "Rozumím a souhlasím"
    };
  } else if (lang === 'en') {
    dict.cookieBanner = {
      "text": "This website uses cookies to enhance user experience and ensure the proper functioning of the service. By continuing, you agree to their use.",
      "accept": "I understand and agree"
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`Updated ${lang}.json`);
});
