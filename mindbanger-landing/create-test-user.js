import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupTestUser() {
  const email = 'test@mindbanger.com';
  const password = 'Password123!';

  try {
    // 1. Vytvorenie admin uctu (s preskocenim email podmienky)
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test Member',
        preferred_language: 'sk',
        timezone: 'Europe/Bratislava'
      }
    });

    if (error && !error.message.includes('already registered')) {
        console.error('Error creating user:', error);
        return;
    }

    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = users.users.find(u => u.email === email);

    if (testUser) {
        // 2. Rucne nahodenie statusu "premium", aby nas pustilo do VIP zony
        await supabaseAdmin.from('profiles').update({ subscription_status: 'premium' }).eq('id', testUser.id);
        console.log('? TESTOVACI UZIVATEL PRIpraveny!');
        console.log('Email:', email);
        console.log('Heslo:', password);
    }
  } catch (err) {
    console.log(err);
  }
}
setupTestUser();
