const fs = require('fs');
let c = fs.readFileSync('src/app/app/settings/page.tsx', 'utf8');

c = c.replace(
  "import { useDictionary } from '@/lib/i18n-client';",
  "import { useDictionary } from '@/lib/i18n-client';\nimport PushNotificationToggle from '@/components/push/PushNotificationToggle';"
);

c = c.replace(
  '      <form onSubmit={handleSave} className="space-y-6">\r\n        {/* Name */}',
  '      <div className="mb-10">\n        <h2 className="text-xl font-serif text-white mb-4">Notifikácie</h2>\n        <PushNotificationToggle />\n      </div>\n\n      <form onSubmit={handleSave} className="space-y-6">\n        <h2 className="text-xl font-serif text-white mb-4">Profil</h2>\n        {/* Name */}'
).replace(
  '      <form onSubmit={handleSave} className="space-y-6">\n        {/* Name */}',
  '      <div className="mb-10">\n        <h2 className="text-xl font-serif text-white mb-4">Notifikácie</h2>\n        <PushNotificationToggle />\n      </div>\n\n      <form onSubmit={handleSave} className="space-y-6">\n        <h2 className="text-xl font-serif text-white mb-4">Profil</h2>\n        {/* Name */}'
);

fs.writeFileSync('src/app/app/settings/page.tsx', c);
console.log('Settings updated');