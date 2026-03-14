import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import MobileNavBar from '@/components/MobileNavBar';

// This is a minimal protected layout wrapper
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Ziskaj usera zo session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (!session || sessionError) {
    redirect('/login');
  }

  // 2. Over ci ma user aktivne clenstvo
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', session.user.id)
    .single();

  const isPremium = profile?.subscription_status === 'premium';

  if (!isPremium) {
    // Ak nema zive predplatne, zablokujeme ho a posleme obnovit predplatne
    redirect('/checkout');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans pb-[80px] md:pb-0 pt-0 md:pt-16 selection:bg-amber-500/30">
      
      {/* Vlozime PWA Navigaciu */}
      <MobileNavBar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto p-4 md:px-8 md:py-10 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
