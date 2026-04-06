const fs = require('fs');
let content = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

const regexSuccess = /if \(!res\.ok\) throw new Error\('API Error'\);\s*sentCount\+\+;\s*\} catch\(err\)/m;
content = content.replace(regexSuccess, \
              if (!res.ok) throw new Error('API Error');
              
              const now = new Date().toISOString();
              await supabase.from('organization_members').update({ invite_sent_at: now }).eq('id', m.id);
              m.invite_sent_at = now; 
              
              sentCount++;
          } catch(err)
\);

content = content.replace(/if \(failCount === 0\) \{/m, \
      setMembers([...members]);
      if (failCount === 0) {\
);

content = content.replace(/handleSendSingleInvite\(member\.email\)/g, "handleSendSingleInvite(member.email, member.id)");

content = content.replace(/\{members\.some\(m => m\.status === 'invited'\) && \(/g, "{members.some(m => m.status === 'invited' && !m.invite_sent_at) && (");

content = content.replace(/\{\(lang === 'sk' \|\| lang === 'cs'\) \? 'Pozvaný' : 'Invited'\}/g, "{(lang === 'sk' || lang === 'cs') ? (member.invite_sent_at ? 'Odoslané' : 'Pozvaný') : (member.invite_sent_at ? 'Sent' : 'Invited')}");

fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', content);
console.log("Rest finished.");
