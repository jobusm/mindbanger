require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteOrg() {
  const { data: users, error: err } = await supabase.auth.admin.listUsers();
  console.log("Dostupne emaily:");
  users.users.forEach(u => console.log(u.email));

  const emailToFind = 'jobus.test@seznam.cz'; // Change to the correct one if needed
  const targetUser = users.users.find(u => u.email === 'test@example.com' || u.email === 'jobus@seznam.cz'); 
  
  if (targetUser) {
      console.log(`Mazem usera ${targetUser.email} (ID: ${targetUser.id})`);
      await supabase.auth.admin.deleteUser(targetUser.id);
      console.log("Deleted.");
  } else {
      console.log("Zadajte email usera na vymazanie do skriptu.");
  }
}

deleteOrg();