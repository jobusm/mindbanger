import fs from 'fs';

let content = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

const regex = /\/\/\s*Fire invitations in sequence[\s\S]*?catch\s*\([^)]*\)\s*{\s*console.error\('Insert loop error:',\s*err\);\s*failCount\+\+;\s*}\s*}/g;

const newBulkCode = \
      // Bulk insert all at once, ignoring duplicates via database constraint
      try {
          const newMembersToInsert = foundEmails
              .filter(email => !members.some(m => m.email.toLowerCase() === email))
              .map(email => ({
                  organization_id: localOrg.id,
                  email: email,
                  role: 'member',
                  status: 'invited'
              }));

          if (newMembersToInsert.length > 0) {
              const { data, error } = await supabase
                  .from('organization_members')
                  .upsert(newMembersToInsert, { onConflict: 'organization_id,email', ignoreDuplicates: true })
                  .select('id, email, role, status, created_at, user_id');

              if (error) {
                  console.error('Bulk Upsert Error:', error);
                  failCount += newMembersToInsert.length;
              } else if (data && data.length > 0) {
                  // Add successfully inserted rows to state
                  setMembers(prev => [...(data as any), ...prev]);
                  successCount += data.length;
                  // Emails that were in foundEmails but skipped by DB are counted as fails
                  failCount += newMembersToInsert.length - data.length;
              } else {
                  failCount += newMembersToInsert.length;
              }
          } else {
              // no new emails to insert
          }
      } catch (err) {
          console.error('Bulk insert try-catch error:', err);
          failCount += foundEmails.length;
      }
\;

if (regex.test(content)) {
    console.log("Found BULK using regex!");
    content = content.replace(regex, newBulkCode.trim());
} else {
    console.log("REGEX FAILED TO FIND BULK CODE");
}


const regexInvite = /\/\/\s*1\.\s*Create Invite Record\s*const\s*{\s*data,\s*error\s*}\s*=\s*await\s*supabase\s*\.from\('organization_members'\)\s*\.insert\([\s\S]*?\.single\(\);\s*if\s*\(error\)\s*throw\s*error;/g;

const newInviteCode = \
        // 1. Create Invite Record (UPSERT to avoid 409 errors in console)
        const { data, error } = await supabase
          .from('organization_members')
          .upsert({
            organization_id: localOrg.id,
            email: inviteEmail.toLowerCase(),
            role: 'member',
            status: 'invited'
          }, { onConflict: 'organization_id,email', ignoreDuplicates: true })
          .select('id, email, role, status, created_at, user_id')
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
            toast.error(t.alreadyMember);
            setLoading(false);
            return;
        }
\;

if(regexInvite.test(content)) {
    console.log("Found INVITE using regex!");
    content = content.replace(regexInvite, newInviteCode.trim());
} else {
    console.log("REGEX FAILED TO FIND INVITE CODE");
}

fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', content);
console.log('Done!');
