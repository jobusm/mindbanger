const fs = require('fs');
let c = fs.readFileSync('src/components/AboutTrustSection.tsx', 'utf8');

const sIdx = c.indexOf('"{dict?.landing?.about?.quote1}');
const eIdx = c.indexOf('{dict?.landing?.about?.quote5}"');

if (sIdx !== -1 && eIdx !== -1) {
    const endL = eIdx + '{dict?.landing?.about?.quote5}"'.length;
    const pre = c.substring(0, sIdx);
    const post = c.substring(endL);
    c = pre + '{dict?.landing?.about?.quote1} <span className="text-white font-medium">{dict?.landing?.about?.span1}</span> {dict?.landing?.about?.quote2}' + post;
    fs.writeFileSync('src/components/AboutTrustSection.tsx', c, 'utf8');
    console.log('Fixed quotes.');
} else {
    console.log('Not found.');
}
