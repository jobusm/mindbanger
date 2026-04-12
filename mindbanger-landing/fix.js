const fs = require('fs');
let code = fs.readFileSync('src/app/api/auth/magic-link/route.ts', 'utf8');

let startIndex = code.indexOf('sk: {');
let endIndex = code.indexOf('en: {');
code = code.substring(0, startIndex) + 
'sk: {\n' +
'        subject: "Vstupnı kód - Mindbanger Vault",\n' +
'        title: "Tvoj overovací kód",\n' +
'        subtitle: "Skopíruj si alebo si zapamätaj tento 6-miestny kód:",\n' +
'        button: "Prejs na zadanie kódu",\n' +
'        description: "Ak si sa sem dostal z inej aplikácie, stlaè tlaèidlo vyššie, ktoré a bezpeène prepne spä do prehliadaèa priamo na zadanie kódu.",\n' +
'        footer: "Tento email bol vygenerovanı automaticky. Ak si o tento kód neiadal, môeš túto správu ignorova."\n' +
'      },\n      ' + code.substring(endIndex);

startIndex = code.indexOf('cz: {');
endIndex = code.indexOf('};\n    \n    // fallback to SK');
code = code.substring(0, startIndex) + 
'cz: {\n' +
'        subject: "Vstupní kód - Mindbanger Vault",\n' +
'        title: "Tvùj ovìøovací kód",\n' +
'        subtitle: "Zkopíruj si nebo si zapamatuj tento 6místnı kód:",\n' +
'        button: "Pøejít na zadání kódu",\n' +
'        description: "Pokud jsi to otevøel v jiné aplikaci, stiskni tlaèítko vıše, které tì bezpeènì pøepne zpìt do prohlíeèe pøímo na zadání kódu.",\n' +
'        footer: "Tento email byl vygenerován automaticky. Pokud jsi o tento kód neádal, mùeš tuto zprávu ignorovat."\n' +
'      }\n    ' + code.substring(endIndex);

fs.writeFileSync('src/app/api/auth/magic-link/route.ts', code, 'utf8');
