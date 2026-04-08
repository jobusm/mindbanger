const fs = require('fs');
let code = fs.readFileSync('src/components/admin/SignalsManager.tsx', 'utf8');

const rep1 = <div className="flex justify-between items-center mb-2">\r\n                     <label className="text-xs text-amber-500 font-bold uppercase tracking-wider flex items-center gap-2">\r\n                        <FileAudio size={14}/> Text Dňa (Hovorené)\r\n                     </label>\r\n                     <button type="button" onClick={() => handleGenerateAudio('spoken_audio_url')} disabled={generatingAudioField !== null} className="bg-amber-900/50 disabled:opacity-50 hover:bg-amber-800 text-amber-300 px-2 py-1 rounded text-[10px] flex items-center gap-1 transition">\r\n                        {generatingAudioField === 'spoken_audio_url' ? <span className="animate-pulse flex items-center gap-1"><Sparkles size={12}/> Generujem...</span> : <><Sparkles size={12}/> AI Hlas</>}\r\n                     </button>\r\n                  </div>;

const rep2 = <div className="flex justify-between items-center mb-2">\r\n                     <label className="text-xs text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-2">\r\n                        <FileAudio size={14}/> Meditácia (Sprievodca)\r\n                     </label>\r\n                     <button type="button" onClick={() => handleGenerateAudio('meditation_audio_url')} disabled={generatingAudioField !== null} className="bg-indigo-900/50 disabled:opacity-50 hover:bg-indigo-800 text-indigo-300 px-2 py-1 rounded text-[10px] flex items-center gap-1 transition">\r\n                        {generatingAudioField === 'meditation_audio_url' ? <span className="animate-pulse flex items-center gap-1"><Sparkles size={12}/> Generujem...</span> : <><Sparkles size={12}/> AI Hlas</>}\r\n                     </button>\r\n                  </div>;

code = code.replace(/<label[^>]*>\s*<FileAudio[^>]*> Text Dňa \(Hovorené\)\r?\n\s*<\/label>/, rep1);
code = code.replace(/<label[^>]*>\s*<FileAudio[^>]*> Meditácia \(Sprievodca\)\r?\n\s*<\/label>/, rep2);

fs.writeFileSync('src/components/admin/SignalsManager.tsx', code, 'utf8');
