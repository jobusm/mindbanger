const fs = require('fs');
let c = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

c = c.replace('{!compact && ({!compact && (<div', '{!compact && (<div');
c = c.replace('</div>)})} \r\n\r\n        <div className="flex-1', '</div>)}\r\n\r\n        <div className="flex-1');
c = c.replace('</div>)})} \n\n        <div className="flex-1', '</div>)}\n\n        <div className="flex-1');
c = c.replace('</div>)})} ', '</div>)}'); // Catch any trailing ones
c = c.replace('})}', ')}');

fs.writeFileSync('src/components/AudioPlayer.tsx', c);
console.log('Fixed');