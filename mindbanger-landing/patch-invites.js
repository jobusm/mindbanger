const fs = require('fs');

let content = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

const oldSingle = \
  const handleSendSingleInvite = async (email: string) => {
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
        toast.success((lang === 'sk' || lang === 'cs') ? 'Pozvánka úspešne odoslaná.' : 'Invite successfully sent.', { id: emailLoading });
      } catch (err) {
         toast.error((lang === 'sk' || lang === 'cs') ? 'Odoslanie zlyhalo.' : 'Sending failed.', { id: emailLoading });
      }
  };
\;

const newSingle = \
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
        
        // Update DB
        const now = new Date().toISOString();
        await supabase.from('organization_members').update({ invite_sent_at: now }).eq('id', memberId);
        
        // Update UI
        setMembers(members.map(m => m.id === memberId ? { ...m, invite_sent_at: now } : m));
        
        toast.success((lang === 'sk' || lang === 'cs') ? 'Pozvánka úspešne odoslaná.' : 'Invite successfully sent.', { id: emailLoading });
      } catch (err) {
         toast.error((lang === 'sk' || lang === 'cs') ? 'Odoslanie zlyhalo.' : 'Sending failed.', { id: emailLoading });
      }
  };
\;

const regexSingle = /const handleSendSingleInvite = async\s*\([^\{]*{\s*const emailLoading = toast\.loading[\s\S]*?\} catch\s*\(\w+\)\s*\{\s*toast\.error[\s\S]*?\}\s*\};/m;
if(regexSingle.test(content)) {
    content = content.replace(regexSingle, newSingle.trim());
} else {
    console.log("Could not find handleSendSingleInvite!");
}

const oldBulk = \
  const handleSendAllPending = async () => {
      const pendingMembers = members.filter(m => m.status === 'invited');      
\;

const newBulkRegex = /const handleSendAllPending = async \(\) => \{\s*const pendingMembers = members\.filter\(m => m\.status === 'invited'\);/m;
const newBulkRepl = \
  const handleSendAllPending = async () => {
      const pendingMembers = members.filter(m => m.status === 'invited' && !m.invite_sent_at);
\;

if (newBulkRegex.test(content)) {
    content = content.replace(newBulkRegex, newBulkRepl.trim());
} else {
    console.log("Could not find handleSendAllPending init!");
}

const updateBulkSuccessRegex = /if \(!res\.ok\) throw new Error\('API Error'\);\s*sentCount\+\+;\s*\} catch\(err\)/m;
const updateBulkSuccessRepl = \
              if (!res.ok) throw new Error('API Error');
              
              const now = new Date().toISOString();
              await supabase.from('organization_members').update({ invite_sent_at: now }).eq('id', m.id);
              m.invite_sent_at = now; // update local pointer before state sync
              
              sentCount++;
          } catch(err)
\;

if(updateBulkSuccessRegex.test(content)) {
    content = content.replace(updateBulkSuccessRegex, updateBulkSuccessRepl.trim());
}

const stateSyncBulkRegex = /if \(failCount === 0\) \{/m;
const stateSyncBulkRepl = \
      // Update UI state for all successfully sent ones
      setMembers([...members]); // forces re-render with updated m.invite_sent_at pointers
      
      if (failCount === 0) {\;

if(stateSyncBulkRegex.test(content)) {
    content = content.replace(stateSyncBulkRegex, stateSyncBulkRepl.trim());
}

const mailButtonRegex = /<button[\s\S]*?onClick=\{\(\) => handleSendSingleInvite\(member\.email\)\}[\s\S]*?<\/button>/m;
const mailButtonRepl = \
                                            <button
                                               onClick={() => handleSendSingleInvite(member.email, member.id)}
                                               disabled={loading}
                                               className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                               title={(lang === 'sk' || lang === 'cs') ? 'Odosla email s pozvánkou' : 'Send Invite Email'}
                                            >
                                               <Mail size={18} />
                                            </button>
\;

if (mailButtonRegex.test(content)) {
    content = content.replace(mailButtonRegex, mailButtonRepl.trim());
}

const statusTextRegex = /\{\(lang === 'sk' \|\| lang === 'cs'\) \? 'Pozvaný' : 'Invited'\}/m;
const statusTextRepl = \
                            {(lang === 'sk' || lang === 'cs') ? (member.invite_sent_at ? 'Odoslané' : 'Pozvaný') : (member.invite_sent_at ? 'Sent' : 'Invited')}
\;
if (statusTextRegex.test(content)) {
    content = content.replace(statusTextRegex, statusTextRepl.trim());
}

const oldJSXHeaderRegex = /\{members\.some\(m => m\.status === 'invited'\) && \(/m;
const newJSXHeaderRepl = \{members.some(m => m.status === 'invited' && !m.invite_sent_at) && (\;
if (oldJSXHeaderRegex.test(content)) {
    content = content.replace(oldJSXHeaderRegex, newJSXHeaderRepl.trim());
}


fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', content);
console.log("Dashboard UI script finished.");
