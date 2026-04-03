import React from 'react';
import { getDictionary } from '@/lib/i18n';
import B2BRegistrationForm from '@/components/b2b/B2BRegistrationForm';
import { CheckCircle2, TrendingUp, Users, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default async function B2BPage(props: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  const lang = (searchParams.lang === 'sk' ? 'sk' : 'en') as 'sk' | 'en';
  const dict = getDictionary(lang);
  const t = dict.b2b;
  
  const businessBenefits = [
    { icon: BrainCircuit, title: lang === 'sk' ? "Vyššia psychická odolnosť" : "Higher mental resilience", desc: lang === 'sk' ? "– lepšie zvládanie stresu, tlaku a pracovného tempa" : "– better management of stress, pressure, and work pace" },
    { icon: TrendingUp, title: lang === 'sk' ? "Lepší fokus a výkon" : "Better focus and performance", desc: lang === 'sk' ? "– menej mentálneho chaosu, viac koncentrácie na úlohy" : "– less mental chaos, more concentration on tasks" },
    { icon: Users, title: lang === 'sk' ? "Prevencia vyčerpania a poklesu motivácie" : "Burnout and motivation drop prevention", desc: lang === 'sk' ? "– pravidelné mentálne nastavenie pomáha udržať energiu" : "– regular mindset tuning helps maintain energy" },
    { icon: CheckCircle2, title: lang === 'sk' ? "Atraktívny unikátny sociálny benefit" : "Unique attractive social benefit", desc: lang === 'sk' ? "– moderný a hodnotný benefit, ktorý firma poskytuje nad rámec bežných výhod" : "– modern and valuable benefit provided beyond standard perks" },
    { icon: Users, title: lang === 'sk' ? "Podpora lojality a vzťahu k firme" : "Support loyalty and culture", desc: lang === 'sk' ? "– zamestnanci cítia, že firme záleží aj na ich vnútornom nastavení, nie len výkone" : "– employees feel the company cares about their mental state, not just performance" },
    { icon: TrendingUp, title: lang === 'sk' ? "Silný employer branding" : "Strong employer branding", desc: lang === 'sk' ? "– firma pôsobí moderne, ľudsky a progresívne" : "– company appears modern, human, and progressive" },
    { icon: CheckCircle2, title: lang === 'sk' ? "Dostupná a transparentná cena" : "Accessible pricing", desc: lang === 'sk' ? "– od 6,49€ / mesiac / zamestnanca, bez skrytých poplatkov" : "– from €6.49 / month / employee, no hidden fees" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      
      {/* Simple Header */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <Link href="/" className="text-2xl font-serif tracking-tighter hover:opacity-80 transition-opacity">
              Mindbanger<span className="text-amber-500">.</span>
           </Link>
           <div className="flex gap-4">
              <Link href="/b2b?lang=en" className={`text-sm font-medium ${lang === 'en' ? 'text-white' : 'text-slate-500'}`}>EN</Link>
              <Link href="/b2b?lang=sk" className={`text-sm font-medium ${lang === 'sk' ? 'text-white' : 'text-slate-500'}`}>SK</Link>
           </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-10 animate-slideUp">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase">
                  <CurrentDate lang={lang} />
               </div>
               
               <h1 className="text-5xl md:text-7xl font-serif leading-[1.1]">
                  {t.hero.title}
               </h1>
               
               <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                  {t.hero.subtitle.replace(/reset/gi, 'mindset')}
               </p>

               <div className="space-y-6 pt-8 border-t border-white/10">
                  <h3 className="text-3xl font-bold font-serif text-white mb-6">
                     {lang === 'sk' ? 'Výhody pre biznis:' : 'Business Benefits:'}
                  </h3>
                  {businessBenefits.map((f, i) => (
                    <div key={i} className="flex gap-4">
                       <f.icon className="text-amber-500 shrink-0 mt-1" />
                       <div>
                          <h4 className="font-bold text-lg text-white">{f.title}</h4>
                          <p className="text-slate-400">{f.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-50" />
                  <h3 className="text-2xl font-bold font-serif text-white mb-4 relative z-10">
                     {lang === 'sk' ? 'Prínos pre zamestnancov:' : 'Employee Benefits:'}
                  </h3>
                  <div className="text-slate-300 leading-relaxed space-y-4 relative z-10">
                     {lang === 'sk' ? (
                       <>
                         <p className="font-bold text-white text-lg">Mindbanger pre zamestnanca nie je len ďalší firemný benefit.</p>
                         <p className="text-lg">Je to pár minút denne, ktoré mu pomôžu lepšie zvládať tlak, pokojnejšie začínať deň, viac sa sústrediť a cítiť sa lepšie nielen v práci, ale aj mimo nej. Je to benefit, ktorý má reálny dopad na mentálnu pohodu, energiu a životnú spokojnosť v práci aj mimo nej.</p>
                       </>
                     ) : (
                       <>
                         <p className="font-bold text-white text-lg">Mindbanger for an employee is not just another corporate perk.</p>
                         <p className="text-lg">It's a few minutes a day that help them handle pressure better, start the day more calmly, focus more deeply, and feel better not only at work but also outside of it. It's a benefit with a real impact on mental well-being, energy, and life satisfaction in and out of work.</p>
                       </>
                     )}
                  </div>
               </div>
            </div>

            {/* Right Form */}
            <div className="animate-slideUp delay-200 lg:sticky lg:top-32">
               <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                  <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />

                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">
                     {lang === 'sk' ? 'Vytvorenie účtu je zdarma' : 'Creating an account is free'}
                  </h3>

                  <p className="text-slate-400 mb-8 relative z-10 leading-relaxed">
                     {lang === 'sk' 
                       ? 'Bezplatne vám založíme firemný účet v systéme a budete si v ňom môcť spravovať balíky pre svojich zamestnancov.' 
                       : 'We will create a free company account where you can easily manage packages for your employees.'}
                  </p>

                  <Link 
                     href="/b2b/register" 
                     className="w-full block text-center py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg relative z-10 transition-all transform hover:scale-[1.02]"
                  >
                     {lang === 'sk' ? 'Vytvoriť firemný účet' : 'Create Company Account'}
                  </Link>

                  <p className="text-xs text-center text-slate-500 mt-4 relative z-10">
                     {lang === 'sk' ? 'Už máte účet?' : 'Already have an account?'} <Link href="/login" className="text-amber-500 hover:underline">{lang === 'sk' ? 'Prihlásiť sa' : 'Login'}</Link>
                  </p>
               </div>
            </div>

         </div>
      </main>

    </div>
  );
}

function CurrentDate({ lang }: { lang: 'en' | 'sk' }) {
    const today = new Date().toLocaleDateString(lang === 'sk' ? 'sk-SK' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    return <>{today}</>;
}