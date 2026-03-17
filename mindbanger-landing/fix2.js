const fs = require('fs');
let c = fs.readFileSync('src/components/AudioPlayer.tsx', 'utf8');

c = c.replace('{!compact && ({!compact && (<div', '{!compact && (<div');
c = c.replace('</div>)})}', '</div>)}');

// Fix the flex container
c = c.replace(
  '<div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 \r\nrelative z-10 w-full">',
  '<div className={`flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full ${compact ? \\'sm:items-center\\' : \\'sm:items-end\\'}`}>'
);
c = c.replace(
  '<div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 \nrelative z-10 w-full">',
  '<div className={`flex flex-col sm:flex-row items-center gap-5 relative z-10 w-full ${compact ? \\'sm:items-center\\' : \\'sm:items-end\\'}`}>'
);

fs.writeFileSync('src/components/AudioPlayer.tsx', c);
console.log('Fixed');