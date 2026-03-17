const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ldjibcxqjbrjsmfppyoi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkamliY3hxamJyanNtZnBweW9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMwNTAwOSwiZXhwIjoyMDY4ODgxMDA5fQ.SKL-_uKNIUM17e6OfyDD1Vctq6sXUCyUTm7QqGn_k4g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers();
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
  
  if (authErr) console.error('Auth error:', authErr.message);
  
  console.log('=== USERS IN AUTH ===');
  if (users) {
      users.forEach(u => console.log(u.email, '| confirmed:', !!u.email_confirmed_at, '| created:', new Date(u.created_at).toLocaleString()));
  }

  console.log('\n=== USERS IN PROFILES (DB) ===');
  if (profiles) {
      profiles.forEach(p => console.log(p.id, '| email from id:', users.find(u => u.id === p.id)?.email, '| status:', p.subscription_status, '| name:', p.full_name));
  }
}
run();
