const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SignalsManager.tsx', 'utf8');

const target1 = '<label className="block text-xs text-amber-500 mb-2 font-bold uppercase tracking-wider flex items-center gap-2">\r\n                     <FileAudio size={14}/> Text Dňa (Hovorené)\r\n                  </label>';
const target2 = '<label className="block text-xs text-indigo-400 mb-2 font-bold uppercase tracking-wider flex items-center gap-2">\r\n                     <FileAudio size={14}/> Meditácia (Sprievodca)\r\n                  </label>';

const rep1 = <div className="flex justify-between items-center mb-2">\r
                     <label className="text-xs text-amber-500 font-bold uppercase tracking-wider flex items-center gap-2">\r
                        <FileAudio size={14}/> Text Dňa (Hovorené)\r
                     </label>\r
                     <button type="button" onClick={() => handleGenerateAudio('spoken_audio_url')} disabled={generatingAudioField !== null} className="bg-amber-900/50 disabled:opacity-50 hover:bg-amber-800 text-amber-300 px-2 py-1 rounded text-[10px] flex items-center gap-1 transition">\r
                        {generatingAudioField === 'spoken_audio_url' ? <span className="animate-pulse flex items-center gap-1"><Sparkles size={12}/> Generujem...</span> : <><Sparkles size={12}/> AI Hlas</>}\r
                     </button>\r
                  </div>;
                  
const rep2 = <div className="flex justify-between items-center mb-2">\r
                     <label className="text-xs text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-2">\r
                        <FileAudio size={14}/> Meditácia (Sprievodca)\r
                     </label>\r
                     <button type="button" onClick={() => handleGenerateAudio('meditation_audio_url')} disabled={generatingAudioField !== null} className="bg-indigo-900/50 disabled:opacity-50 hover:bg-indigo-800 text-indigo-300 px-2 py-1 rounded text-[10px] flex items-center gap-1 transition">\r
                        {generatingAudioField === 'meditation_audio_url' ? <span className="animate-pulse flex items-center gap-1"><Sparkles size={12}/> Generujem...</span> : <><Sparkles size={12}/> AI Hlas</>}\r
                     </button>\r
                  </div>;

if(code.includes(target1)) {
   code = code.replace(target1, rep1);
} else { console.log('target1 missing'); }

if(code.includes(target2)) {
   code = code.replace(target2, rep2);
} else { console.log('target2 missing'); }

let match1 = code.match(/const toastId = toast\.loading\([^\)]+\);/);
console.log('Match1: ', match1);
if (!code.includes('setGeneratingAudioField(field)')) {
  code = code.replace(
    /const toastId = toast\.loading\([^\)]+\);/,
    'setGeneratingAudioField(field);\r\n      const toastId = toast.loading(\'Generujem AI Hlas (ElevenLabs)...\');'
  );
  code = code.replace(
    /\} catch \(e: any\) \{\r?\n\s*toast\.error\(e\.message, \{ id: toastId \}\);\r?\n\s*\}/,
    '} catch (e: any) {\r\n          toast.error(e.message, { id: toastId });\r\n      } finally {\r\n          setGeneratingAudioField(null);\r\n      }'
  );
}

fs.writeFileSync('src/components/admin/SignalsManager.tsx', code, 'utf8');
