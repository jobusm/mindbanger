import fs from 'fs';

let content = fs.readFileSync('src/components/organization/OrganizationDashboard.tsx', 'utf8');

// Update handleBulkTextSubmit
const oldBulkCode = 
      // Fire invitations in sequence to avoid rate-limits
      for (const email of foundEmails) {
          if (members.some(m => m.email.toLowerCase() === email)) {
              console.warn('Skipping existing local member:', email);
              failCount++;
              continue; // Skip existing
          }

          try {
              const { data, error } = await supabase
                  .from('organization_members')
                  .insert({
                      organization_id: localOrg.id,
                      email: email,
                      role: 'member',
                      status: 'invited'
                  })
                    .select(\id, email, role, status, created_at, user_id\)
                  .single();

              if (error) {
                  console.error('Bulk Insert Error:', error);
                  failCount++;
                  continue;
              }

              setMembers(prev => [data as any, ...prev]);
              successCount++;

          } catch (err) {
              console.error('Insert loop error:', err);
              failCount++;
          }
      }
;

const newBulkCode = 
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
                  .select(\id, email, role, status, created_at, user_id\);

              if (error) {
                  console.error('Bulk Upsert Error:', error);
                  failCount += newMembersToInsert.length;
              } else if (data && data.length > 0) {
                  // Add successfully inserted rows to state
                  setMembers(prev => [...(data as any), ...prev]);
                  successCount += data.length;
                  // Emails that were in foundEmails but skipped by DB are counted as fails
                  failCount += foundEmails.length - data.length;
              } else {
                  failCount += foundEmails.length;
              }
          } else {
              // All emails were already in the local state
              failCount += foundEmails.length;
          }
      } catch (err) {
          console.error('Bulk insert try-catch error:', err);
          failCount += foundEmails.length;
      }
;

if (content.includes(oldBulkCode.trim())) {
    console.log("Replacing bulk code...");
    content = content.replace(oldBulkCode, newBulkCode);
} else {
    console.log("OLD BULK CODE NOT FOUND (might be slightly different whitespace)");
    
    // Fallback: extract the whole loop and replace it using regex
    const regex = /\/\/\s*Fire invitations in sequence[\s\S]*?catch\s*\([^)]*\)\s*{\s*console.error\('Insert loop error:',\s*err\);\s*failCount\+\+;\s*}\s*}/g;
    
    if (regex.test(content)) {
        console.log("Found using regex!");
        content = content.replace(regex, newBulkCode.trim());
    } else {
        console.log("REGEX FAILED TO FIND BULK CODE");
    }
}

// Update handleInvite
const oldInviteCode = 
        // 1. Create Invite Record
        const { data, error } = await supabase
          .from('organization_members')
          .insert({
            organization_id: localOrg.id,
            email: inviteEmail.toLowerCase(),
            role: 'member',
            status: 'invited'
          })
          .select(\
            id,
            email,
            role,
            status,
            created_at,
            user_id
          \)
          .single();

        if (error) throw error;
;

const newInviteCode = 
        // 1. Create Invite Record (UPSERT to avoid 409 errors in console)
        const { data, error } = await supabase
          .from('organization_members')
          .upsert({
            organization_id: localOrg.id,
            email: inviteEmail.toLowerCase(),
            role: 'member',
            status: 'invited'
          }, { onConflict: 'organization_id,email', ignoreDuplicates: true })
          .select(\
            id,
            email,
            role,
            status,
            created_at,
            user_id
          \)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
            // Already existed (ignored by DB rules)
            toast.error(t.alreadyMember);
            setLoading(false);
            return;
        }
;

if (content.includes(oldInviteCode.trim())) {
    console.log("Replacing invite code...");
    content = content.replace(oldInviteCode, newInviteCode);
} else {
    // fallback regex replacement
    const regexInvite = /\/\/\s*1\.\s*Create Invite Record\s*const\s*{\s*data,\s*error\s*}\s*=\s*await\s*supabase\s*\.from\('organization_members'\)\s*\.insert\([\s\S]*?\.single\(\);\s*if\s*\(error\)\s*throw\s*error;/g;
    
    if(regexInvite.test(content)) {
        console.log("Found invite using regex!");
        content = content.replace(regexInvite, newInviteCode.trim());
    } else {
        console.log("REGEX FAILED TO FIND INVITE CODE");
    }
}

fs.writeFileSync('src/components/organization/OrganizationDashboard.tsx', content);
console.log('Update finished.');
