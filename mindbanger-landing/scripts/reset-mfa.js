const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function resetMfa() {
  const email = "miroslav.jobus@gmail.com";
  console.log(`Vyhľadávam faktory pre: ${email}...`);
  
  const { data: listData } = await supabase.auth.admin.listUsers();
  const user = listData.users.find(u => u.email === email);
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  
  const { data: factors, error } = await supabase.auth.admin.mfa.listFactors({
    userId: user.id
  });
  
  if (error) {
    console.log("Chyba:", error);
    return;
  }
  
  if (!factors || factors.factors.length === 0) {
    console.log("Ziadne MFA faktory neboli najdene.");
    return;
  }
  
  console.log(`Nájdených ${factors.factors.length} faktorov. Mažem...`);
  
  for (const factor of factors.factors) {
    const { error: delErr } = await supabase.auth.admin.mfa.deleteFactor({
      userId: user.id,
      id: factor.id
    });
    if (delErr) {
      console.log(`Chyba pri mazani faktoru ${factor.id}:`, delErr);
    } else {
      console.log(`Faktor ${factor.id} bol vymazaný.`);
    }
  }
  
  console.log("Hotovo! Vyskúšaj sa prihlásiť znova a malo by to vygenerovať nový bezchybný QR kód.");
}

resetMfa();
