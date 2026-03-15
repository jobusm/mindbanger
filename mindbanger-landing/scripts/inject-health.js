const fs = require('fs');
const path = 'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/components/admin/AdminPanel.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('HealthCheckWidget')) {
  code = code.replace(
    'import { Radio, Users, RefreshCw, Megaphone } from "lucide-react";',
    'import { Radio, Users, RefreshCw, Megaphone } from "lucide-react";\nimport HealthCheckWidget from "./HealthCheckWidget";'
  );
  
  code = code.replace(
    '<div className="flex border-b border-white/10 mb-6 space-x-8 overflow-x-auto">',
    '<HealthCheckWidget />\n      <div className="flex border-b border-white/10 mb-6 space-x-8 overflow-x-auto">'
  );
  
  fs.writeFileSync(path, code);
  console.log('Injected HealthCheckWidget');
} else {
  console.log('Already injected');
}
