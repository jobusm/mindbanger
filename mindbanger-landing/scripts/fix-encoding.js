const fs = require('fs');

let c = fs.readFileSync('src/components/organization/CompanySettingsModal.tsx', 'utf8');

// Replace the T block completely
const newT = `const t = {
    title: (lang === 'sk' || lang === 'cs') ? 'Firemné údaje' : 'Company Details',
    desc: (lang === 'sk' || lang === 'cs') ? 'Tieto údaje budú použité na fakturáciu.' : 'These details will be used for billing.',
    name: (lang === 'sk' || lang === 'cs') ? 'Názov spoločnosti' : 'Company Name',
    tax_id: (lang === 'sk' || lang === 'cs') ? 'IČO' : 'Company ID (IČO)',
    dic: (lang === 'sk' || lang === 'cs') ? 'DIČ / IČ DPH' : 'Tax ID (DIČ / VAT)',
    street: (lang === 'sk' || lang === 'cs') ? 'Ulica a číslo' : 'Street & Number',
    city: (lang === 'sk' || lang === 'cs') ? 'Mesto' : 'City',
    zip: (lang === 'sk' || lang === 'cs') ? 'PSČ' : 'ZIP Code',
    country: (lang === 'sk' || lang === 'cs') ? 'Krajina' : 'Country',
    billing_email: (lang === 'sk' || lang === 'cs') ? 'Fakturačný email' : 'Billing Email',
    save: (lang === 'sk' || lang === 'cs') ? 'Uložiť zmeny' : 'Save Changes',
    cancel: (lang === 'sk' || lang === 'cs') ? 'Zrušiť' : 'Cancel',
    success: (lang === 'sk' || lang === 'cs') ? 'Údaje boli úspešne uložené.' : 'Details saved successfully.',
    error: (lang === 'sk' || lang === 'cs') ? 'Nastala chyba pri ukladaní údajov.' : 'An error occurred while saving details.',
    required: (lang === 'sk' || lang === 'cs') ? 'Prosím vyplňte všetky povinné polia.' : 'Please fill all required fields.'
  };`;

c = c.replace(/const t = \{[\s\S]*?\};/, newT);
c = c.replace('Adresa sďż˝dla', 'Adresa sídla');

fs.writeFileSync('src/components/organization/CompanySettingsModal.tsx', c);
