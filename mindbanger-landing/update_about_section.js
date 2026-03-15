const fs = require('fs');
let content = fs.readFileSync('src/components/AboutTrustSection.tsx', 'utf8');

content = content.replace(/About the Creator/, '{dict?.landing?.about?.badge}');
content = content.replace(/Life Coach, Hypnotherapist, and mental performance guide\./, '{dict?.landing?.about?.role}');

const oldP = /\"Mindbanger Daily was created.*?\.\"/s;

content = content.replace(oldP, '\"{dict?.landing?.about?.quote1} <span className=\"text-white font-medium\">{dict?.landing?.about?.span1}</span>{dict?.landing?.about?.quote2}<span className=\"text-white font-medium\">{dict?.landing?.about?.span2}</span>{dict?.landing?.about?.quote3}<span className=\"text-white font-medium\">{dict?.landing?.about?.span3}</span>{dict?.landing?.about?.quote4}<span className=\"text-white font-medium\">{dict?.landing?.about?.span4}</span>{dict?.landing?.about?.quote5}\"');

fs.writeFileSync('src/components/AboutTrustSection.tsx', content);
console.log('AboutTrustSection updated!');
