const fs = require('fs');
const path = require('path');

const locales = ['en', 'sk', 'cs'];

locales.forEach(lang => {
  const mainDictPath = path.join(__dirname, 'src', 'dictionaries', `${lang}.json`);
  let content = fs.readFileSync(mainDictPath, 'utf8');
  let dict = JSON.parse(content);

  // Add affiliateTerms translation to footer
  if (lang === 'sk') {
    dict.landing.footer.affiliateTerms = "Affiliate podmienky";
  } else if (lang === 'cs') {
    dict.landing.footer.affiliateTerms = "Affiliate podmínky";
  } else if (lang === 'en') {
    dict.landing.footer.affiliateTerms = "Affiliate Terms";
  }

  fs.writeFileSync(mainDictPath, JSON.stringify(dict, null, 2), 'utf8');

  // Create legal dictionaries
  const legalDictPath = path.join(__dirname, 'src', 'dictionaries', 'legal', `${lang}.json`);
  const legalContent = {
    terms: {
      title: lang === 'sk' ? "Všeobecné obchodné podmienky" : lang === 'cs' ? "Všeobecné obchodní podmínky" : "Terms and Conditions",
      lastUpdated: "16. 03. 2026",
      content: lang === 'sk' ? "<p>Tu vložte plné znenie VOP v slovenčine (môžete používať HTML tagy ako <br>, <strong> atď.).</p>" : lang === 'cs' ? "<p>Zde vložte plné znění VOP v češtině.</p>" : "<p>Insert full Terms and Conditions here.</p>"
    },
    privacy: {
      title: lang === 'sk' ? "Ochrana osobných údajov (GDPR)" : lang === 'cs' ? "Ochrana osobních údajů (GDPR)" : "Privacy Policy (GDPR)",
      lastUpdated: "16. 03. 2026",
      content: lang === 'sk' ? "<p>Tu vložte plné znenie GDPR podmienok v slovenčine.</p>" : lang === 'cs' ? "<p>Zde vložte plné znění GDPR podmínek v češtině.</p>" : "<p>Insert full GDPR/Privacy policy here.</p>"
    },
    affiliate: {
      title: lang === 'sk' ? "Affiliate podmienky" : lang === 'cs' ? "Affiliate podmínky" : "Affiliate Terms",
      lastUpdated: "16. 03. 2026",
      content: lang === 'sk' ? "<p>Tu vložte plné znenie podmienok pre Affiliate program.</p>" : lang === 'cs' ? "<p>Zde vložte plné znění podmínek pro Affiliate program.</p>" : "<p>Insert full Affiliate terms here.</p>"
    }
  };

  fs.writeFileSync(legalDictPath, JSON.stringify(legalContent, null, 2), 'utf8');
});

console.log("Legal dictionaries and footer translations updated.");