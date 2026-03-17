const fs = require('fs');
let c = fs.readFileSync('src/components/admin/SignalsManager.tsx', 'utf8');

c = c.replace(
  '  spoken_audio_url?: string | null;\r\n  language: string;',
  '  spoken_audio_url?: string | null;\r\n  push_text?: string | null;\r\n  language: string;'
).replace(
  '  spoken_audio_url?: string | null;\n  language: string;',
  '  spoken_audio_url?: string | null;\n  push_text?: string | null;\n  language: string;'
);

const pushField = `
            <div>
              <label className="block text-sm text-slate-400 mb-2">Text Push Notifikácie (Voliteľné)</label>
              <p className="text-xs text-slate-500 mb-2">Tento text sa odošle registrovaným používateľom na mobil/počítač, ak sú notifikácie zapnuté.</p>
              <textarea
                value={editingSignal.push_text || ''}
                onChange={e => setEditingSignal({...editingSignal, push_text: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                rows={2}
                placeholder="Napr: Dnešný signál je pripravený! Téma: ..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Fokus`;

c = c.replace(
  '<div className="grid md:grid-cols-2 gap-6">\r\n              <div>\r\n                <label className="block text-sm text-slate-400 mb-2">Fokus',
  pushField
).replace(
  '<div className="grid md:grid-cols-2 gap-6">\n              <div>\n                <label className="block text-sm text-slate-400 mb-2">Fokus',
  pushField
);

fs.writeFileSync('src/components/admin/SignalsManager.tsx', c);
console.log('Push text field added to SignalsManager.');
