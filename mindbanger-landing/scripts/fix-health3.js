const fs = require('fs');
const path = 'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/components/admin/HealthCheckWidget.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/ShieldCore/g, 'AlertTriangle');

fs.writeFileSync(path, code);
