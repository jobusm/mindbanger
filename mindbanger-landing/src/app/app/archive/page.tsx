import React from 'react';
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export const revalidate = 0; // Vždy dynamické kvôli prepočtu dní a časového zámku

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Zistiť profil používateľa (jazyk + dátum registrácie pre časový zámok)
  const { data: profile } = await supabase
    .from('profiles')
    .select('preferred_language, created_at')
    .eq('id', session?.user.id)
    .single();

  const userLang = profile?.preferred_language || 'en';
  
  // Získať dátum, od ktorého má používateľ prístup (Temporal Content Lock)
  // Ak existuje predplatné s earlier date, dalo by sa zobrať to, ale pre jednoduchosť berieme vytvorenie profilu.
  const accessStartDate = new Date(profile?.created_at || Date.now());
  const formattedLockDate = accessStartDate.toISOString().split('T')[0];

  // Dnešný dátum pre obmedzenie do kedy zobrazovať (nepredbiehať)
  const today = new Date().toISOString().split('T')[0];

  // Načítať archív s obmedzeniami
  const { data: signals, error } = await supabase
    .from('daily_signals')
    .select('id, date, theme, title, signal_text')
    .eq('language', userLang)
    .eq('is_published', true)
    .gte('date', formattedLockDate) // Zamknutie: len od momentu začiatku subscribu (registrácie)
    .lte('date', today) // Neukazovať záznamy v budúcnosti
    .order('date', { ascending: false });

  // Naformátovať dátum pre zobrazenie UI hlavičky
  const formatter = new Intl.DateTimeFormat(userLang, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="py-2 md:py-6 space-y-8">
      
      {/* Header */}
      <header className="space-y-4 mb-10">
         <h1 className="text-3xl md:text-4xl font-serif text-white">
           The Vault
         </h1>
         <p className="text-slate-400 max-w-lg leading-relaxed">
           Vývoj mentálnej jasnosti nie je lineárny. Prístup máte zabezpečený ku všetkým resetom od prvého dňa vášho predplatného.
         </p>
      </header>

      {/* Grid of Past Signals */}
      {signals && signals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal) => (
            <Link href={`/app/archive/${signal.id}`} key={signal.id} className="group block">
              <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 h-full hover:bg-slate-800/80 transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(234,179,8,0.05)] relative overflow-hidden flex flex-col">
                
                {/* Jemný glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/0 group-hover:bg-amber-500/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500/80 group-hover:text-amber-400 transition-colors">
                    {signal.theme}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatter.format(new Date(signal.date))}
                  </span>
                </div>
                
                <h3 className="text-xl font-serif text-white mb-3 group-hover:text-amber-50 transition-colors">
                  {signal.title}
                </h3>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-6 mt-1 flex-grow">
                  {signal.signal_text}
                </p>

                <div className="flex items-center text-amber-500/70 text-sm font-medium mt-auto group-hover:text-amber-400 transition-colors">
                  Read reset <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl p-12 text-center flex flex-col justify-center items-center h-[300px]">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-2xl">
            🕰️
          </div>
          <h2 className="text-xl font-serif text-white mb-2">Vaša knižnica je zatiaľ prázdna</h2>
          <p className="text-slate-400 max-w-sm text-sm">
            Temporal Content Lock aktívny. Vaša cesta a archív začínajú plynúť dnešným dňom. Každý ďalší deň tu nájdete predošlé rituály, ktoré môžete kedykoľvek zopakovať.
          </p>
        </div>
      )}
    </div>
  );
}