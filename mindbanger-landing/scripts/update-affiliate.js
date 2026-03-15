const fs = require('fs');
let code = fs.readFileSync('src/app/app/affiliate/page.tsx', 'utf8');

code = code.replace(
  "import { ArrowUpRight, Copy, Users, Wallet, Check, Play, Download, Image as ImageIcon } from 'lucide-react';",
  "import { ArrowUpRight, Users, Wallet, Check, Play, Download, Image as ImageIcon } from 'lucide-react';\nimport CopyLink from '@/components/CopyLink';"
);

// Replace Model A input block
code = code.replace(
  /<div className="flex bg-black\/40 border border-white\/10 rounded-lg p-1">[\s\S]*?<\/div>\s*<\/div>/,
  '<CopyLink link={`https://mindbanger.com/checkout?refMode=A&refCode=${user.id}`} />\n            </div>'
);

// Replace Model B input block (the remaining one)
code = code.replace(
  /<div className="flex bg-black\/40 border border-white\/10 rounded-lg p-1">[\s\S]*?<\/div>\s*<\/div>/,
  '<CopyLink link={`https://mindbanger.com/checkout?refMode=B&refCode=${user.id}`} />\n            </div>'
);

fs.writeFileSync('src/app/app/affiliate/page.tsx', code);