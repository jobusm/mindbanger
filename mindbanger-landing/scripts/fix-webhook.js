const fs = require('fs');
const path = 'c:/Users/miros/Documents/Mindbanger.com/mindbanger-landing/src/app/api/webhooks/stripe/route.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /const customerId = session\.customer as string;[\s\n\r]*if \(userId && subscriptionId\) \{/s,
  "const customerId = session.customer as string;\n" +
  "        const refCode = session.metadata?.refCode;\n" +
  "        const refMode = session.metadata?.refMode;\n" +
  "\n" +
  "        if (userId && subscriptionId) {"
);

fs.writeFileSync(path, code);
console.log('Fixed missing var declaration.');
