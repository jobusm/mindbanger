const fs = require('fs');
let content = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

content = content.replace(/const handleSendSingleInvite = async \(email: string\) => \{[\s\S]*?const handleSendAllPending = async \(\) => \{/m, \
  const handleSendSingleInvite = async (email: string, memberId: string) => {
      const emailLoading = toast.loading((lang === 'sk' || lang === 'cs') ? 'Odosielam pozvánku...' : 'Sending invite...');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await fetch('/api/b2b/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                orgId: localOrg.id,
                inviterName: user?.user_metadata?.full_name || 'Admin',        
                lang: lang
            })
        });

        const now = new Date().toISOString();
        await supabase.from('organization_members').update({ invite_sent_at: now }).eq('id', memberId);
        
        setMembers(members.map(m => m.id === memberId ? { ...m, invite_sent_at: now } : m));

        toast.success((lang === 'sk' || lang === 'cs') ? 'Pozvánka úspešne odoslaná.' : 'Invite successfully sent.', { id: emailLoading });
      } catch (err) {
         toast.error((lang === 'sk' || lang === 'cs') ? 'Odoslanie zlyhalo.' : 'Sending failed.', { id: emailLoading });
      }
  };

  const handleSendAllPending = async () => {\
);

content = content.replace(/const pendingMembers = members.filter\(m => m.status === 'invited'\);/m, "const pendingMembers = members.filter(m => m.status === 'invited' && !m.invite_sent_at);");

fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', content);
console.log("Replaced handleSendSingleInvite and handleSendAllPending headers.");
