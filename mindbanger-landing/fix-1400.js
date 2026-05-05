const fs = require('fs');
let code = fs.readFileSync('src/app/app/today/page.tsx', 'utf8');

code = code.replace(
  "      // If purchased after 14:00, add 1 day to start date\n      if (refHour >= 14) {\n          startDayDate.setDate(startDayDate.getDate() + 1);\n      }",
  "      // Disabled 14:00 rule so that Day 1 is always presented immediately upon sign up.\n      // if (refHour >= 14) {\n      //     startDayDate.setDate(startDayDate.getDate() + 1);\n      // }"
);

fs.writeFileSync('src/app/app/today/page.tsx', code);
console.log('Fixed 1400 rule!');
