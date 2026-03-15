const fs = require('fs');

const file = 'src/app/app/settings/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(
  "import { useRouter } from 'next/navigation';",
  "import { useRouter } from 'next/navigation';\nimport { useDictionary } from '@/lib/i18n-client';"
);

txt = txt.replace(
  "export default function SettingsPage() {",
  "export default function SettingsPage() {\n  const { dict } = useDictionary();"
);

txt = txt.replace(
  /<div className="text-white p-6">[^<]+<\/div>/,
  '<div className="text-white p-6">{dict.settings?.loading || "Loading..."}</div>'
);

txt = txt.replace(
  /<h1 className="text-3xl font-serif text-white">[^<]+<\/h1>/,
  '<h1 className="text-3xl font-serif text-white">{dict.settings?.title}</h1>'
);
txt = txt.replace(
  /<p className="text-slate-400">[^<]+<\/p>/,
  '<p className="text-slate-400">{dict.settings?.subtitle}</p>'
);

// Jazyk obsahu
txt = txt.replace(
  /<label className="block text-sm font-medium text-slate-300">Jazyk obsa[^<]+<\/label>/,
  '<label className="block text-sm font-medium text-slate-300">{dict.settings?.languageLabel}</label>'
);
txt = txt.replace(
  /<option value="en">[^<]+<\/option>/,
  '<option value="en">{dict.settings?.langEn}</option>'
);
txt = txt.replace(
  /<option value="sk">[^<]+<\/option>/,
  '<option value="sk">{dict.settings?.langSk}</option>'
);
txt = txt.replace(
  /<option value="cs">[^<]+<\/option>/,
  '<option value="cs">{dict.settings?.langCs}</option>'
);
// Vaše Meno
txt = txt.replace(
  /<label className="block text-sm font-medium text-slate-300">Va[^<]+<\/label>/,
  '<label className="block text-sm font-medium text-slate-300">{dict.settings?.nameLabel}</label>'
);

txt = txt.replace(
  /<p className="text-xs text-slate-500">Ur[^<]+<\/p>/,
  '<p className="text-xs text-slate-500">{dict.settings?.languageDesc}</p>'
);

txt = txt.replace(
  /<label className="block text-sm font-medium text-slate-300">Moje[^<]+<\/label>/,
  '<label className="block text-sm font-medium text-slate-300">{dict.settings?.timezoneLabel}</label>'
);
txt = txt.replace(
  /<p className="text-xs text-slate-500">D[^<]+<\/p>/,
  '<p className="text-xs text-slate-500">{dict.settings?.timezoneDesc}</p>'
);

txt = txt.replace(
  /\{saving \? 'Uklad[^']+' : <><Save size=\{18\} \/> Ulo[^<]+<\/>\}/,
  '{saving ? dict.settings?.savingBtn : <><Save size={18} /> {dict.settings?.saveBtn}</>}'
);

txt = txt.replace(
  /<h3 className="text-red-400 font-medium">Spr[^<]+<\/h3>/,
  '<h3 className="text-red-400 font-medium">{dict.settings?.dangerZone}</h3>'
);
txt = txt.replace(
  /<p className="text-sm text-slate-400">Tu si m[^<]+<\/p>/,
  '<p className="text-sm text-slate-400">{dict.settings?.dangerDesc}</p>'
);

txt = txt.replace(
  /Spravova[^\n\r]+ v Stripe/,
  '{dict.settings?.manageStripe}'
);
txt = txt.replace(
  /Odhl[^<]+ sa/,
  '{dict.settings?.logoutBtn}'
);

fs.writeFileSync(file, txt);
