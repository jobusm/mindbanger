const fs = require('fs');
let c = fs.readFileSync('src/app/app/my-audio/page.tsx', 'utf8');
c = c.replace(
  /<AudioPlayer\s+src=\{rec.secureUrl\}\s+title=\{rec.title\}\s+author="Mindbanger OsobnÃ© Audio"\s+\/>/g,
  '<AudioPlayer\n                                   src={rec.secureUrl}\n                                   title={rec.title}\n                                   author="Mindbanger Osobné Audio"\n                                   recordingId={rec.id}\n                                />'
);
c = c.replace(/author="Mindbanger OsobnÃ© Audio"/g, 'author="Mindbanger Osobné Audio"\n                                   recordingId={rec.id}');
fs.writeFileSync('src/app/app/my-audio/page.tsx', c);
console.log('my-audio updated');
