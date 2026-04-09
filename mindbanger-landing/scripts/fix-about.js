const fs = require('fs');
let c = fs.readFileSync('src/components/AboutTrustSection.tsx', 'utf8');
c = c.replace(/"\{dict\?\\.landing\?\\.about\?\\.quote1\}[\s\S]*?\{dict\?\\.landing\?\\.about\?\\.quote5\}"/, '{dict?.landing?.about?.quote1} <span className="text-white font-medium">{dict?.landing?.about?.span1}</span> {dict?.landing?.about?.quote2}');
fs.writeFileSync('src/components/AboutTrustSection.tsx', c);