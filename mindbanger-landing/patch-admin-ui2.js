const fs = require('fs');
let c = fs.readFileSync('src/components/admin/IndividualRecordingsManager.tsx', 'utf8');

c = c.replace(
  'created_at: string;\n}',
  'created_at: string;\n    play_count?: number;\n}'
);

const renderOld = '{format(new Date(rec.created_at), \"d. MMMM yyyy HH:mm\", { locale: sk })}\\n                                                </div>';
const renderNew = '{format(new Date(rec.created_at), \"d. MMMM yyyy HH:mm\", { locale: sk })}\\n                                                    <span className=\"ml-3 text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20\">Prehrat\u00E9: {rec.play_count || 0}x</span>\\n                                                </div>';

c = c.replace(renderOld, renderNew);

fs.writeFileSync('src/components/admin/IndividualRecordingsManager.tsx', c);
console.log('patched admin UI successfully');
