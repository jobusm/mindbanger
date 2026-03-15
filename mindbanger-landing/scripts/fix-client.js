const fs = require('fs');
const files = [
  'src/components/admin/AffiliateManager.tsx',
  'src/components/admin/PayoutsManager.tsx',
  'src/components/admin/ResetsManager.tsx',
  'src/components/admin/SignalsManager.tsx',
  'src/components/admin/SubscriptionsManager.tsx'
];
files.forEach(p => {
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/import toast from 'react-hot-toast';[\s\S]*?"use client";/, '"use client";\nimport toast from \'react-hot-toast\';');
  fs.writeFileSync(p, c);
});
