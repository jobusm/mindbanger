
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  console.log('Checking daily_signals...');
  
  // 1. Check schema (columns)
  const { data: oneRow, error: schemaError } = await supabase
    .from('daily_signals')
    .select('*')
    .limit(1);

  if (schemaError) {
      console.error('Schema check error:', schemaError);
  } else if (oneRow && oneRow.length > 0) {
      console.log('Columns:', Object.keys(oneRow[0]));
  } else {
      console.log('No rows found to inspect columns, but query succeeded.');
  }

  // 2. Check content (count by status)
  const { count: draftCount } = await supabase.from('daily_signals').select('*', { count: 'exact', head: true }).eq('status', 'draft');
  const { count: generatedCount } = await supabase.from('daily_signals').select('*', { count: 'exact', head: true }).eq('status', 'generated');
  const { count: publishedCount } = await supabase.from('daily_signals').select('*', { count: 'exact', head: true }).eq('status', 'published');
  
  console.log('Counts:', { draft: draftCount, generated: generatedCount, published: publishedCount });

  // 3. List recent published signals with date
  const { data: recent, error: listError } = await supabase
    .from('daily_signals')
    .select('id, date, status, language')
    .eq('status', 'published')
    .order('date', { ascending: false })
    .limit(5);

  if (listError) {
    console.error('List error:', listError);
  } else {
    console.log('Recent published signals:', recent);
  }

  // 4. Check user profile creation date (for context)
  // Just grab first profile to see format
  const { data: profile } = await supabase.from('profiles').select('id, created_at').limit(1).single();
  console.log('Example profile created_at:', profile?.created_at, 'formatted:', profile?.created_at?.split('T')[0]);
}

check();
