const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SignalsManager.tsx', 'utf8');

// Match label and following button EXACTLY using wildcards to cross newlines and existing dom nodes
const r1 = /(<label[^>]*>(?:[\s\S]*?)Text D[^a-z]+a \(Hovoren.\)(?:[\s\S]*?)<\/label>)\s*<button[\s\S]*?<\/button>/i;
const m1 = code.match(r1);
if (m1) {
    const wrappedStr = '<div className="flex justify-between items-center mb-2">\r\n                     ' + m1[1].replace('mb-2 ', '') + '\r\n                     <button type="button" onClick={() => handleGenerateAudio(\\'spoken_audio_url\\')} disabled={generatingAudioField !== null} className="bg-amber-900/50 disabled:opacity-50 hover:bg-amber-800 text-amber-300 px-2 py-1 rounded text-[10px] flex items-center gap-1 transition">\r\n                        {generatingAudioField === \\'spoken_audio_url\\' ? <span className="animate-pulse flex items-center gap-1"><Sparkles size={12}/> Generujem...</span> : <><Sparkles size={12}/> AI Hlas</>}\r\n                     </button>\r\n                  </div>';
    code = code.replace(r1, wrappedStr);
    console.log('Replaced r1');
} else { console.log('Failed to match r1'); }

const r2 = /(<label[^>]*>(?:[\s\S]*?)Medit[^a-z]+cia \(Sprievodca\)(?:[\s\S]*?)<\/label>)\s*<button[\s\S]*?<\/button>/i;
const m2 = code.match(r2);
if(m2) {
    const wrappedStr2 = '<div className="flex justify-between items-center mb-2">\r\n                     ' + m2[1].replace('mb-2 ', '') + '\r\n                     <button type="button" onClick={() => handleGenerateAudio(\\'meditation_audio_url\\')} disabled={generatingAudioField !== null} className="bg-indigo-900/50 disabled:opacity-50 hover:bg-indigo-800 text-indigo-300 px-2 py-1 rounded text-[10px] flex items-center gap-1 transition">\r\n                        {generatingAudioField === \\'meditation_audio_url\\' ? <span className="animate-pulse flex items-center gap-1"><Sparkles size={12}/> Generujem...</span> : <><Sparkles size={12}/> AI Hlas</>}\r\n                     </button>\r\n                  </div>';
    code = code.replace(r2, wrappedStr2);
    console.log('Replaced r2');
} else { console.log('Failed to match r2'); }

// Fix 1: State
if (!code.includes('const [generatingAudioField, setGeneratingAudioField]')) {
  code = code.replace(
    'const [generatingId, setGeneratingId] = useState<string | null>(null);',
    'const [generatingId, setGeneratingId] = useState<string | null>(null);\r\n  const [generatingAudioField, setGeneratingAudioField] = useState<\\'spoken_audio_url\\' | \\'meditation_audio_url\\' | null>(null);'
  );
}

// Fix 2: Logic
if (!code.includes('setGeneratingAudioField(field)')) {
  code = code.replace(
    /const toastId = toast\.loading\([^\)]+\);/,
    'setGeneratingAudioField(field);\r\n      const toastId = toast.loading(\\'Generujem AI Hlas...\\');'
  );
  code = code.replace(
    /catch \(e: any\) \{\r?\n\s*toast\.error\(e\.message, \{ id: toastId \}\);\r?\n\s*\}/,
    'catch (e: any) {\r\n          toast.error(e.message, { id: toastId });\r\n      } finally {\r\n          setGeneratingAudioField(null);\r\n      }'
  );
}

if (!code.includes('Sparkles')) {
  code = code.replace('{ FileAudio, Headphones', '{ FileAudio, Headphones, Sparkles');
}

fs.writeFileSync('src/components/admin/SignalsManager.tsx', code, 'utf8');

