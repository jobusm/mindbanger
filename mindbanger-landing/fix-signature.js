const fs = require('fs');
let c = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

c = c.replace(
  'export default function AudioPlayer({ , recordingId }: AudioPlayerProps) {',
  'export default function AudioPlayer({ src, backgroundSrc, title, coverArt, author = "Mindbanger", compact = false, recordingId }: AudioPlayerProps) {'
);

fs.writeFileSync('src/components/AudioPlayer.tsx', c);
console.log('fixed signature');
