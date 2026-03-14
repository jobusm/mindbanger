import postgres from 'postgres';

const connectionString = 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const sql = postgres(connectionString, { ssl: 'require' });

async function createTestUserDirect() {
  try {
    const email = 'test@mindbanger.com';
    // Obycajny select pre najdenie id podla emailu
    const users = await sql\SELECT * FROM auth.users WHERE email = \\;
    
    if(users.length > 0) {
      const u = users[0];
      await sql\UPDATE public.profiles SET subscription_status = 'premium' WHERE id = \\;
      console.log('Test user was already present, explicitly set to premium.');
    } else {
       console.log('Go to the checkout, fill the test email and pay with test card, much easier!');
    }
  } catch(e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
createTestUserDirect();
