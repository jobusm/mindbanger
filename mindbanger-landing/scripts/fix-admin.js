const fs = require('fs');
const path = 'src/components/admin/AdminPanel.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace('import ResetsManager from "./ResetsManager";', 'import ResetsManager from "@/components/admin/ResetsManager";');
code = code.replace('import HealthCheckWidget from "./HealthCheckWidget";', 'import HealthCheckWidget from "@/components/admin/HealthCheckWidget";');

fs.writeFileSync(path, code);
