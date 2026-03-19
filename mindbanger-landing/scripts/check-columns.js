
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('daily_signals')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  } else {
    // If no data, insert a dummy, check, then delete? Or just try to select the specific columns
    console.log('No data found, trying to select specific columns...');
    const { error: colError } = await supabase.from('daily_signals').select('spoken_audio_url, push_text').limit(1);
    if (colError) {
        console.log('Select error (likely missing columns):', colError.message);
    } else {
        console.log('Columns exist.');
    }
  }
}

check();
