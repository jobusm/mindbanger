const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Chyba: Chýba NEXT_PUBLIC_SUPABASE_URL alebo SUPABASE_SERVICE_ROLE_KEY v .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndFixAdmin(email) {
  console.log(`\n🔍 Kontrolujem užívateľa: ${email}...`);

  const { data: listData } = await supabase.auth.admin.listUsers();
  const existingUser = listData.users.find(u => u.email === email);

  if (!existingUser) {
     console.error('❌ Nepodarilo sa nájsť užívateľa v systéme (v auth.users).');
     return;
  }
  const userId = existingUser.id;
  console.log(`✅ Užívateľ nájdený, ID: ${userId}`);

  // Upsert (Vytvor alebo aktualizuj) profil s rolou admin
  console.log(`⏳ Prepisujem/Vytváram profil s rolou 'admin'...`);
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      role: 'admin'
    }, { onConflict: 'id' });

  if (profileError) {
    console.error('❌ Chyba pri zápise roly do profiles: ', profileError.message);
  } else {
    console.log('🎉 HOTOVO! Profil bol úspešne prepojený a rola "admin" je natvrdo nastavená.');
  }
}

const adminEmail = process.argv[2] || "miroslav.jobus@gmail.com";
checkAndFixAdmin(adminEmail);
