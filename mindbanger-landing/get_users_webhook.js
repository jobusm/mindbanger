const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ldjibcxqjbrjsmfppyoi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkamliY3hxamJyanNtZnBweW9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMwNTAwOSwiZXhwIjoyMDY4ODgxMDA5fQ.SKL-_uKNIUM17e6OfyDD1Vctq6sXUCyUTm7QqGn_k4g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').limit(20);
  console.log('\n=== USERS IN PROFILES ===');
  if (profiles) {
      profiles.forEach(p => console.log(p.id, '| status:', p.subscription_status, '| created:', new Date(p.created_at).toLocaleString()));
  }
}
run();
