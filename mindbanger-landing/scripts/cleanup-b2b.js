require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanup() {
  const emailsToClear = [
    'jobus@seznam.cz',
    'jobus.test@seznam.cz',
    'test@example.com',
    'miroslav.jobus@gmail.com'
  ];

  console.log("Fetching all users...");
  const { data: usersData, error: err } = await supabase.auth.admin.listUsers();
  if (err) {
      console.error("Error fetching users:", err);
      return;
  }

  for (const email of emailsToClear) {
      const user = usersData.users.find(u => u.email === email);
      if (user) {
          console.log(`Deleting user ${user.email} (ID: ${user.id})...`);
          
          // delete profile if exists
          await supabase.from('profiles').delete().eq('id', user.id);
          
          const { error: deleteErr } = await supabase.auth.admin.deleteUser(user.id);
          if (deleteErr) {
              console.error(`Failed to delete user ${user.email}:`, deleteErr); 
          } else {
              console.log(`Successfully deleted user ${user.email}.`);
          }
      } else {
          console.log(`User ${email} not found.`);
      }
  }
  
  // Also look for organization
  const { data: orgs } = await supabase.from('organizations').select('*').ilike('name', '%Milkam%');
  if (orgs && orgs.length > 0) {
      for (const org of orgs) {
          console.log(`Deleting organization ${org.name}...`);
          await supabase.from('organizations').delete().eq('id', org.id);
          console.log("Deleted org.");
      }
  } else {
      console.log("No organization containing 'Milkam' found.");
  }
}

cleanup();