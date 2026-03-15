const fs = require('fs');
const path = 'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/components/admin/HealthCheckWidget.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/\\\Chýba/g, '\Chýba');
code = code.replace(/email\!\\\/g, 'email!\');
code = code.replace(/\\\$\\\{isHealthy /g, '\/g, "text-emerald-400' : 'text-red-400'}");

fs.writeFileSync(path, code);
