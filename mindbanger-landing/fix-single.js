const fs = require('fs');
const file = 'src/components/organization/OrganizationDashboard.tsx';
let txt = fs.readFileSync(file, 'utf8');

const tOld = 'const handleSendSingleInvite = async (email: string) => {';
const tNew = 'const handleSendSingleInvite = async (email: string, memberId: string) => {';

if (txt.includes(tOld)) {
  txt = txt.replace(
    /const handleSendSingleInvite = async \(email: string\) => \{[\s\S]*?catch \(error\) \{[\s\S]*?console\.error\([^)]+\);[\s\S]*?\} finally \{[\s\S]*?setSendingSingle\(false\);[\s\S]*?\}[\s\S]*?\};/m,
    const handleSendSingleInvite = async (email: string, memberId: string) => {
    try {
      setSendingSingle(true);
      const res = await fetch('/api/b2b/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, orgId: organization.id })
      });
      if (!res.ok) throw new Error('Failed to send invite');
      
      const now = new Date().toISOString();
      await supabase
        .from('organization_members')
        .update({ invite_sent_at: now })
        .eq('id', memberId);

      setMembers(m => m.map(x => x.id === memberId ? { ...x, invite_sent_at: now } : x));
      
      alert(dict.b2b.invites.successSingle);
    } catch (error) {
      console.error('Error sending invite:', error);
      alert(dict.b2b.invites.error);
    } finally {
      setSendingSingle(false);
    }
  };
  );
  
  // Also we need to update the button 
  txt = txt.replace(
    /onClick=\{\(\) => handleSendSingleInvite\(member\.email\)\}/g,
    \onClick={() => handleSendSingleInvite(member.email, member.id)}\
  );
  
  // update Tooltip content from Pozvaù / Send Invite to Resend / Pozvaù znova based on invite_sent_at
  // Let's replace the whole tooltip logic in the members list map
  txt = txt.replace(
    /<TooltipContent>\s*<p>\{dict\.b2b\.dashboard\.members\.sendInvite\}\<\/p>\s*<\/TooltipContent>/g,
    \<TooltipContent>
                              <p>{member.invite_sent_at ? dict.b2b.dashboard.members.resendInvite || 'Pozvaù znova' : dict.b2b.dashboard.members.sendInvite}</p>
                            </TooltipContent>\
  );
  
  fs.writeFileSync(file, txt);
  console.log('Fixed single invite');
} else {
  console.log('handleSendSingleInvite string not found in file');
}
