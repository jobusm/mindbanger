const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ldjibcxqjbrjsmfppyoi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkamliY3hxamJyanNtZnBweW9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMwNTAwOSwiZXhwIjoyMDY4ODgxMDA5fQ.SKL-_uKNIUM17e6OfyDD1Vctq6sXUCyUTm7QqGn_k4g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) { console.error('Error fetching users:', authErr); return; }
  
  const user = users.find(u => u.email === 'jobusmiro@gmail.com');
  if (user) {
      // First delete from profiles to avoid foreign key constraint issues
      const { error: profDelErr } = await supabase.from('profiles').delete().eq('id', user.id);
      if (profDelErr) {
          console.error('Error deleting from profiles:', profDelErr);
      }
      
      const { data, error: delErr } = await supabase.auth.admin.deleteUser(user.id);
      if (delErr) {
         console.error('Delete auth error:', delErr);
      } else {
         console.log('Successfully deleted user: jobusmiro@gmail.com (ID: ' + user.id + ')');
      }
  } else {
      console.log('User jobusmiro@gmail.com not found.');
  }
}
run();
