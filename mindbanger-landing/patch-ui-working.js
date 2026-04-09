const fs = require('fs');
let c = fs.readFileSync('src/components/admin/IndividualRecordingsManager.tsx', 'utf8');

c = c.replace(/\{format\(new Date\(rec.created_at\), [^\}]+?\)\}?\}/g, (match) => {
    return match + ' <span className=\"text-indigo-400 font-medium ml-2\">&#8226; Prehraté: {rec.play_count || 0}x</span>';
});

fs.writeFileSync('src/components/admin/IndividualRecordingsManager.tsx', c);
console.log('patched using exact block');
