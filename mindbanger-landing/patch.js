const fs = require('fs');
let text = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

// 1. Remove auto-email from handleInvite
const removeAutoEmailRegex = /\/\/ 3\. Send Email Invite[\s\S]*?catch \(e\) \{[\s\S]*?toast\.error\(\(lang === 'sk' \|\| lang === 'cs'\) \? 'Pozvánka vytvorená, ale email zlyhal\.' : 'Invite created, but email failed\.'\);\s*\}/i;
if (text.match(removeAutoEmailRegex)) {
  text = text.replace(removeAutoEmailRegex, "// Email sending is now a separate manual step via 'Send Pending Invites' or the mail icon.");
  console.log("Auto-email removed from handleInvite");
} else {
    // try looser
    const regex2 = /\/\/ 3\. Send Email Invite[\s\S]*?Email Invite/i;
    // ... we can just find fetch to api/b2b/invite ...
}

fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', text);
