import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Ziskaj usera zo session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  // 2. Skontroluj, ci ma uzivatel rolu 'admin'
  // POZNAMKA: Aby to fungovalo, musime mat v `profiles` stlpec `role`
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md text-center">
          <h1 className="text-xl text-red-500 font-bold mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">You need administrator rights to enter this section.</p>
          <a href="/" className="px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition">Return to home</a>
        </div>
      </div>
    );
  }

  // 3. Ak ma spravnu rolu, vrati admin layout (uz bez Premium / Checkout logiky)
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
      <nav className="border-b border-white/5 bg-slate-900/50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-serif font-bold text-amber-500">Mindbanger Admin</span>
          <span className="text-sm text-slate-400">Logged in as: {session.user.email}</span>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
