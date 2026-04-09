const fs = require('fs');
let c = fs.readFileSync('src/components/admin/IndividualRecordingsManager.tsx', 'utf8');

c = c.replace(/created_at: string;/g, 'created_at: string;\n    play_count?: number;');

c = c.replace(/{format\(new Date\(rec\.created_at\)[^}]*?\)}/g, (match) => {
    return match + ' <span className=\"ml-3 text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20\">Prehraté: {rec.play_count || 0}x</span>';
});

fs.writeFileSync('src/components/admin/IndividualRecordingsManager.tsx', c);
console.log('patched using stable regex');
