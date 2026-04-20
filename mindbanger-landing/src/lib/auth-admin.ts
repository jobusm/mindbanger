import { createClient } from './supabase-server';

const ADMIN_EMAILS = ['miroslav.jobus@gmail.com', 'jobusmiro@gmail.com']; // Zoznam adminov

export async function checkAdminAuth() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session || !session.user || !session.user.email) {
    return false;
  }

  return ADMIN_EMAILS.includes(session.user.email.toLowerCase());
}
