const fs = require('fs');
const files = [
  'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/app/app/archive/page.tsx',
  'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/components/admin/AdminPanel.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  fs.writeFileSync(f, content + '\n// trigger ts server update\n');
});
console.log('Touched files');
