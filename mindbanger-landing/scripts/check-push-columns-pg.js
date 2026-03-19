
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkColumns() {
    // We can't query information_schema directly via JS client usually unless exposed, 
    // but often we can just try to select the columns we expect and see if it errors.
    
    const expectedColumns = ['id', 'user_id', 'endpoint', 'p256dh', 'auth', 'created_at'];
    console.log(`Checking for columns: ${expectedColumns.join(', ')} in 'push_subscriptions' table...`);

    const { data, error } = await supabase
        .from('push_subscriptions')
        .select(expectedColumns.join(', '))
        .limit(1);

    if (error) {
        console.error('Error selecting columns:', error.message);
        if (error.message.includes('column') && error.message.includes('does not exist')) {
            console.error('Some columns are missing!');
        } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
             console.error('Table "push_subscriptions" does not exist!');
        }
    } else {
        console.log('Success! All checked columns exist.');
        // If data is returned, we can see the keys
        if (data.length > 0) {
            console.log('Found row keys:', Object.keys(data[0]));
        } else {
             console.log('Table exists and columns are valid (query returned no rows but no error).');
        }
    }
}

checkColumns();
