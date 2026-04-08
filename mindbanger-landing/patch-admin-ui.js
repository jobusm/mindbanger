const fs = require('fs');
let c = fs.readFileSync('src/components/admin/IndividualRecordingsManager.tsx', 'utf8');

c = c.replace(
  'audio_url: string;\n    created_at: string;\n}',
  'audio_url: string;\n    created_at: string;\n    play_count?: number;\n}'
);

c = c.replace(
  '{format(new Date(rec.created_at), "d. MMMM yyyy HH:mm", { locale: sk })}\n                                                </div>',
  '{format(new Date(rec.created_at), "d. MMMM yyyy HH:mm", { locale: sk })}\n                                                    <span className="ml-3 text-indigo-400 font-medium">Prehraté: {rec.play_count || 0}x</span>\n                                                </div>'
);

fs.writeFileSync('src/components/admin/IndividualRecordingsManager.tsx', c);
console.log('admin UI updated');
