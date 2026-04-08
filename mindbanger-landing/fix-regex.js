const fs = require('fs');
let c = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

c = c.replace(/interface AudioPlayerProps \{[^]*?\}/g, (match) => {
  return match.replace('}', '  recordingId?: string;\n}');
});

fs.writeFileSync('src/components/AudioPlayer.tsx', c);
console.log('patched regex');
