
const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SubscriptionsManager.tsx', 'utf8');

code = code.replace(
  '<th className=\"p-4 font-medium\">Koniec obdobia</th>',
  '<th className=\"p-4 font-medium\">Dátum reg.</th>\\n                  <th className=\"p-4 font-medium\">Koniec obdobia</th>'
);

code = code.replace(
  'colSpan={5}',
  'colSpan={6}'
);

code = code.replace(
  '<td className=\"p-4 whitespace-nowrap\">\\n                      <div className=\"flex items-center space-x-2\">\\n                        <Calendar size={14} className=\"text-slate-500\" />\\n                        <span>{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : \'-\'}</span>\\n                      </div>\\n                    </td>',
  '<td className=\"p-4 whitespace-nowrap\">\\n                      <div className=\"flex items-center space-x-2 text-slate-400\">\\n                        <Calendar size={14} className=\"text-slate-500\" />\\n                        <span>{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : \'-\'}</span>\\n                      </div>\\n                    </td>\\n                    <td className=\"p-4 whitespace-nowrap\">\\n                      <div className=\"flex items-center space-x-2\">\\n                        <Calendar size={14} className=\"text-slate-500\" />\\n                        <span>{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : \'-\'}</span>\\n                      </div>\\n                    </td>'
);

fs.writeFileSync('src/components/admin/SubscriptionsManager.tsx', code);
console.log('Patched th and td');

