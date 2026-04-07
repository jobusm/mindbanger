const fs = require('fs');
let text = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

// 1. the auto sending in handleInvite
const rgx = /\/\/\s*3\.\s*Send Email Invite[\s\S]*?toast\.error\(\(lang === 'sk' \|\| lang === 'cs'\) \? 'Pozvánk.*?'\);\s*\}/i;
const matched = text.match(/\/\/\s*3\.\s*Send Email Invite[\s\S]*?toast\.error\([\s\S]*?\);\s*\}/);

if (matched) {
  text = text.replace(matched[0], "// Note: Email sending is a manual step now.");
  console.log("Removed auto-send.");
} else {
  console.log("NOT MATCHED");
}
fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', text);
