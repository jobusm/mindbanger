const fs = require('fs');
const path = require('path');

const locales = ['en', 'sk', 'cs'];

locales.forEach(lang => {
  const filePath = path.join(__dirname, 'src', 'dictionaries', `${lang}.json`);
  let content = fs.readFileSync(filePath, 'utf8');
  let dict = JSON.parse(content);

  // checkout updates
  if (lang === 'sk') {
    dict.checkout.errors = {
      default: "Došlo k neznámej chybe. Skontrolujte svoje údaje a skúste to prosím znova.",
      rateLimit: "Prekročili ste limit žiadostí. Počkajte, prosím, chvíľu a skúste to znova.",
      wrongPassword: "Účet s týmto e-mailom už existuje, ale zadali ste nesprávne heslo. Prihláste sa najprv.",
      missingData: "Chýba e-mail alebo ID. Skúste to prosím znova."
    };
  } else if (lang === 'cs') {
    dict.checkout.errors = {
      default: "Došlo k neznámé chybě. Zkontrolujte své údaje a zkuste to prosím znovu.",
      rateLimit: "Překročili jste limit žádostí. Počkejte, prosím, chvíli a zkuste to znovu.",
      wrongPassword: "Účet s tímto e-mailem již existuje, ale zadali jste nesprávné heslo. Přihlaste se nejprve.",
      missingData: "Chybí e-mail nebo ID. Zkuste to prosím znovu."
    };
  } else if (lang === 'en') {
    dict.checkout.errors = {
      default: "An unknown error occurred. Please check your details and try again.",
      rateLimit: "You have exceeded the request limit. Please wait a moment and try again.",
      wrongPassword: "An account with this email exists but with a different password. Please log in first.",
      missingData: "Missing email or user ID. Please try again."
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`Updated checkout errors for ${lang}`);
});