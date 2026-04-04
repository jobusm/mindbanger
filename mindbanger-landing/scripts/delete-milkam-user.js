const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function deleteAccount() {
  const email = 'jobus@seznam.cz';
  console.log('Finding user by email:', email);

  const { data: usersData, error: userErr } = await supabase.auth.admin.listUsers();
  if (userErr) {
    console.error('Error listing users:', userErr);
    return;
  }

  const user = usersData?.users?.find(u => u.email === email);
  if (user) {
    console.log('Found user with ID:', user.id);
    
    // Delete organization where user is owner or billing_email matches
    const { data: orgs, error: orgErr } = await supabase.from('organizations').select('id, name').eq('billing_email', email);
    if (orgs && orgs.length > 0) {
      for (const org of orgs) {
        console.log('Deleting organization:', org.name);
        // organization_members should be cascade deleted, but just in case:
        await supabase.from('organization_members').delete().eq('organization_id', org.id);
        const { error: delOrgErr } = await supabase.from('organizations').delete().eq('id', org.id);
        if (delOrgErr) console.error('Failed to delete org:', delOrgErr);
        else console.log('Successfully deleted organization:', org.name);
      }
    } else {
      console.log('No organization found with billing_email, searching by name...');
      const { data: orgsByName, error: orgNmErr } = await supabase.from('organizations').select('id, name').ilike('name', '%Milkam%');
      if (orgsByName && orgsByName.length > 0) {
        for (const org of orgsByName) {
          console.log('Deleting organization by name:', org.name);
          await supabase.from('organization_members').delete().eq('organization_id', org.id);
          const { error: delOrgNmErr } = await supabase.from('organizations').delete().eq('id', org.id);
          if (delOrgNmErr) console.error('Failed to delete org:', delOrgNmErr);
          else console.log('Successfully deleted organization:', org.name);
        }
      }
    }

    // Now delete the auth user (will cascade to profiles)
    console.log('Deleting user auth record for', email);
    const { error: authDelErr } = await supabase.auth.admin.deleteUser(user.id);
    if (authDelErr) console.error('Error deleting user:', authDelErr);
    else console.log('Successfully deleted user:', email);

  } else {
    console.log('User not found in auth.users by email. Will try to delete organization directly anyway.');
    const { data: orgs, error: orgNmErr } = await supabase.from('organizations').select('id, name').ilike('name', '%Milkam%');
    if (orgs && orgs.length > 0) {
        for (const org of orgs) {
            console.log('Deleting organization:', org.name);
            await supabase.from('organization_members').delete().eq('organization_id', org.id);
            await supabase.from('organizations').delete().eq('id', org.id);
            console.log('Deleted organization:', org.name);
        }
    }
  }
}

deleteAccount();
