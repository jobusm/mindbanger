const fs = require('fs');
let code = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

const regexSingle = /const handleSendSingleInvite = async \(email: string\) => \{[^]*?toast\.error\(\(lang === 'sk' \|\| lang === 'cs'\) \? 'Odoslanie zlyhalo\.' : 'Sending failed\.', \{ id: emailLoading \}\);\s*\}\s*\};/m;

const newSingle = \  const handleSendSingleInvite = async (email: string, memberId: string) => {
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

        // DB update
        const now = new Date().toISOString();
        await supabase.from('organization_members').update({ invite_sent_at: now }).eq('id', memberId);
        
        // UI update
        setMembers(members.map(m => m.id === memberId ? { ...m, invite_sent_at: now } : m));

        toast.success((lang === 'sk' || lang === 'cs') ? 'Pozvánka úspešne odoslaná.' : 'Invite successfully sent.', { id: emailLoading });
      } catch (err) {
         toast.error((lang === 'sk' || lang === 'cs') ? 'Odoslanie zlyhalo.' : 'Sending failed.', { id: emailLoading });
      }
  };\;

if (code.match(regexSingle)) {
    code = code.replace(regexSingle, newSingle);
    console.log('Fixed single invite function');
} else {
    console.log('Could not match single invite regex');
}

fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', code);
