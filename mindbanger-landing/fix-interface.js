const fs = require('fs');
let c = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

c = c.replace(
  'compact?: boolean;\n}',
  'compact?: boolean;\n  recordingId?: string;\n}'
);

fs.writeFileSync('src/components/AudioPlayer.tsx', c);
console.log('interface fixed');
