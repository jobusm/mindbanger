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
  
  // Quick translation helper for features
  const features = [
    { icon: BrainCircuit, title: t.features.f1, desc: lang === 'sk' ? "Mentálna jasnosť pre každodenné rozhodovanie." : "Mental clarity for daily decision making." },
    { icon: TrendingUp, title: t.features.f2, desc: lang === 'sk' ? "Menej vyhorenia, viac kreatívnej energie." : "Less burnout, more creative energy." },
    { icon: Users, title: t.features.f4, desc: lang === 'sk' ? "Prehľad o tom, ako sa vášmu tímu darí." : "Insights into how your team is thriving." },
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
                  {t.hero.subtitle}
               </p>

               <div className="space-y-6 pt-8 border-t border-white/10">
                  {features.map((f, i) => (
                    <div key={i} className="flex gap-4">
                       <f.icon className="text-amber-500 shrink-0" />
                       <div>
                          <h3 className="font-bold text-lg">{f.title}</h3>
                          <p className="text-slate-500">{f.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                  <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-4">{t.pricing.title}</h4>
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                         <CheckCircle2 size={16} className="text-amber-500" />
                         <span>{t.pricing.tier1} – €7.99 / seat {t.pricing.vatExcluded}</span>
                      </li>
                      <li className="flex items-center gap-3">
                         <CheckCircle2 size={16} className="text-green-500" />
                         <span className="text-green-400 font-bold">{t.pricing.tier2}</span>
                      </li>
                      <li className="flex items-center gap-3">
                         <CheckCircle2 size={16} className="text-amber-500" />
                         <span className="text-amber-400 font-bold">{t.pricing.tier3}</span>
                      </li>
                   </ul>
               </div>
            </div>

            {/* Right Form */}
            <div className="animate-slideUp delay-200">
               <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                  <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                  
                  <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">
                     {lang === 'sk' ? 'Začnite 14-dňovú skúšobnú verziu' : 'Start your 14-day free trial'}
                  </h3>
                  
                  <p className="text-slate-400 mb-8 relative z-10 leading-relaxed">
                     {lang === 'sk' 
                       ? 'Žiadna kreditná karta. Okamžitý prístup k firemnému dashboardu.' 
                       : 'No credit card required. Instant access to your company dashboard.'}
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