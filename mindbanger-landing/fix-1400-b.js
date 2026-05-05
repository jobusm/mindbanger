const fs = require('fs');
let code = fs.readFileSync('src/app/app/today/page.tsx', 'utf8');

code = code.replace(
  "          if (refHour >= 14) {\n                startDayDate.setDate(startDayDate.getDate() + 1);\n            }",
  "          // if (refHour >= 14) {\n          //      startDayDate.setDate(startDayDate.getDate() + 1);\n          // }"
);

fs.writeFileSync('src/app/app/today/page.tsx', code);
console.log('Fixed 1400 rule again!');
