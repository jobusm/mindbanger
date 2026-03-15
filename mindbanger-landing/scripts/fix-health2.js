const fs = require('fs');
const path = 'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/components/admin/HealthCheckWidget.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/className=\{\ounded-2xl.*?\}\/s, 'className={"rounded-2xl p-4 flex items-start mb-6 border " + (isHealthy ? "bg-emerald-900/10 border-emerald-500/20" : "bg-red-900/10 border-red-500/20")}');

code = code.replace(/<h3 className=\{\ont-medium.*?\}\\>/s, '<h3 className={"font-medium " + (isHealthy ? "text-emerald-400" : "text-red-400")}>');

code = code.replace(/: \\\Chýba denný obsah pre nasledujúce dni \(poèet dní od dnes\): \\\$\{missingDays\.join\(\', \'\)\}\. Okamžite doplòte signály, inak platiaci užívatelia nedostanú svoj denný email\!\\\/s, ': "Chýba denný obsah pre nasledujúce dni (poèet dní od dnes): " + missingDays.join(", ") + ". Okamžite doplòte signály, inak platiaci užívatelia nedostanú svoj denný email!"');

code = code.replace(/: \\\Chýba.*?\\\/si, ': "Chýba denný obsah pre nasledujúce dni (poèet dní od dnes): " + missingDays.join(", ") + ". Okamžite doplòte signály, inak platiaci užívatelia nedostanú svoj denný email!"');

fs.writeFileSync(path, code);
