const fs = require('fs');
const dicts = ['en', 'sk', 'cs'];

const translations = {
  en: {
    "title": "Partner Program",
    "subtitle": "Share Mindbanger with your audience and earn. Choose the model that works best for you. Your unique links are ready to use instantly.",
    "modelA_badge": "Box 1: The Fast 100%",
    "modelA_title": "100% of 2nd Month",
    "modelA_desc": "You get 100% commission for the user's second month. Best for quick, high-ticket conversions upfront.",
    "refA_label": "Your Referral Link (Ref A)",
    "modelB_badge": "Box 2: Lifetime 20%",
    "modelB_title": "20% Recurring",
    "modelB_desc": "Earn 20% commission on every payment for the life of the customer. Build true passive income.",
    "refB_label": "Your Referral Link (Ref B)",
    "stat_pendingA": "Pending Model A",
    "stat_activeB": "Active Model B",
    "stat_unpaid": "Unpaid Balance",
    "stat_total": "Total Earned",
    "promo_title": "Promo Library",
    "promo_desc": "Download prepared materials for your campaigns.",
    "promo_videoVisual": "Video Visual",
    "promo_download": "Download",
    "promo_empty": "No promo materials are available yet."
  },
  sk: {
    "title": "Partnerský program",
    "subtitle": "Zdieľajte Mindbanger so svojím publikom a zarábajte. Vyberte si model, ktorý vám najviac vyhovuje. Vaše unikátne odkazy sú pripravené na okamžité použitie.",
    "modelA_badge": "Box 1: Rýchlych 100%",
    "modelA_title": "100% z 2. mesiaca",
    "modelA_desc": "Získate 100% províziu za druhý mesiac používateľa. Najlepšie pre rýchle konverzie s vysokou odmenou.",
    "refA_label": "Váš referenčný odkaz (Ref A)",
    "modelB_badge": "Box 2: Doživotných 20%",
    "modelB_title": "20% opakujúca sa platba",
    "modelB_desc": "Získajte 20% províziu z každej platby po celú dobu životnosti zákazníka. Vybudujte si skutočný pasívny príjem.",
    "refB_label": "Váš referenčný odkaz (Ref B)",
    "stat_pendingA": "Čakajúce platby Model A",
    "stat_activeB": "Aktívne programy Model B",
    "stat_unpaid": "Nevyplatený zostatok",
    "stat_total": "Celkom zarobené",
    "promo_title": "Knižnica promo materiálov",
    "promo_desc": "Stiahnite si pripravené materiály pre vaše kampane.",
    "promo_videoVisual": "Video vizuál",
    "promo_download": "Stiahnuť",
    "promo_empty": "Zatiaľ nie sú dostupné žiadne promo materiály."
  },
  cs: {
    "title": "Partnerský program",
    "subtitle": "Sdílejte Mindbanger se svým publikem a vydělávejte. Vyberte si model, který vám nejvíce vyhovuje. Vaše unikátní odkazy jsou připraveny k okamžitému použití.",
    "modelA_badge": "Box 1: Rychlých 100%",
    "modelA_title": "100% z 2. měsíce",
    "modelA_desc": "Získáte 100% provizi za druhý měsíc uživatele. Nejlepší pro rychlé konverze s vysokou odměnou.",
    "refA_label": "Váš referenční odkaz (Ref A)",
    "modelB_badge": "Box 2: Doživotních 20%",
    "modelB_title": "20% opakující se platba",
    "modelB_desc": "Získejte 20% provizi z každé platby po celou dobu životnosti zákazníka. Vybudujte si skutečný pasivní příjem.",
    "refB_label": "Váš referenční odkaz (Ref B)",
    "stat_pendingA": "Čekající platby Model A",
    "stat_activeB": "Aktivní programy Model B",
    "stat_unpaid": "Nevyplacený zůstatek",
    "stat_total": "Celkem vyděláno",
    "promo_title": "Knihovna promo materiálů",
    "promo_desc": "Stáhněte si připravené materiály pro vaše kampaně.",
    "promo_videoVisual": "Video vizuál",
    "promo_download": "Stáhnout",
    "promo_empty": "Zatím nejsou dostupné žádné promo materiály."
  }
};

dicts.forEach(lang => {
  const path = `src/dictionaries/${lang}.json`;
  const fileData = fs.readFileSync(path, 'utf8');
  const jsonData = JSON.parse(fileData);
  jsonData.affiliate = translations[lang];
  fs.writeFileSync(path, JSON.stringify(jsonData, null, 2), 'utf8');
});
console.log('Dictionaries updated!');
