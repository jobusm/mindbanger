const fs = require('fs');
let c = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

c = c.replace(/const playedOnceRef = useRef\(false\);/, ''); // remove if exists
c = c.replace(
  'const bgAudioRef = useRef<HTMLAudioElement | null>(null);',
  'const bgAudioRef = useRef<HTMLAudioElement | null>(null);\n  const playedOnceRef = useRef(false);'
);

c = c.replace(/audioRef\.current\.play\(\);/g, (match) => {
  return "audioRef.current.play();\n        if (recordingId && !playedOnceRef.current) {\n            playedOnceRef.current = true;\n            fetch('/api/user/recordings/track-play', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recordingId }) }).catch(console.error);\n        }";
});

fs.writeFileSync('src/components/AudioPlayer.tsx', c);
console.log('patched playlogic regex');
