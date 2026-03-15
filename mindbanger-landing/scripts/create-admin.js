const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Chyba: Chýba NEXT_PUBLIC_SUPABASE_URL alebo SUPABASE_SERVICE_ROLE_KEY v .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin(email, password) {
  console.log(`\n👑 Vytváram, alebo povyšujem na administrátora: ${email}...`);

  // 1. Skús vytvoriť užívateľa s heslom (ak neexistuje, alebo len updatni heslo)
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId;

  if (createError) {
    if (createError.message.includes('already exists') || createError.message.includes('already been registered')) {
      console.log('✅ Užívateľ už existuje. Aktualizujem jeho heslo...');
      // Nájdi ID užívateľa
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingUser = listData.users.find(u => u.email === email);
      
      if (!existingUser) {
         console.error('❌ Nepodarilo sa nájsť užívateľa v systéme.');
         return;
      }
      userId = existingUser.id;

      // Updatni mu heslo aby sa mohol prihlásiť do adminu aj cez /admin/login
      await supabase.auth.admin.updateUserById(userId, { password });
      console.log('✅ Heslo pre používateľa bolo nastavené zadané heslo z tohto skriptu.');

    } else {
      console.error('❌ Nepodarilo sa vytvoriť/aktualizovať užívateľa:', createError.message);
      return;
    }
  } else {
    console.log('✅ Nový administrátorský užívateľ bol vytvorený.');
    userId = user.user.id;
  }

  // 2. Pre istotu nastavíme 'role' ='admin' do tabuľky profiles.
  console.log(`\n⏳ Nastavujem v tabuľke 'profiles' hodnotu 'role' na 'admin'...`);
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (profileError) {
    console.error('❌ Chyba pri zápise roly do profiles: ', profileError.message);
    console.log('\n⚠️ DÔLEŽITÉ UPOZORNENIE: Pravdepodobne v tabuľke "profiles" chýba stĺpec "role".');
    console.log('Prosím, choď do Supabase -> Table Editor -> profiles:');
    console.log('1. Pridaj stĺpec: Name = "role", Type = "text", Default value = "user".');
    console.log('2. Zopakuj spustenie tohto skriptu.');
  } else {
    console.log('🎉 HOTOVO! Užívateľ má nastavenú rolu administrátora a môže sa prihlásiť cez /admin/login s heslom: ' + password);
  }
}

// Spusti skript s argumentmi alebo tvojim mailom (tu ho mozes zmenit)
const adminEmail = process.argv[2] || "tvoj@email.sk"; // Tu doplň svoj email
const adminPassword = process.argv[3] || "MindbangerAdmin2026!"; // Extrémne silné heslo

createAdmin(adminEmail, adminPassword);
