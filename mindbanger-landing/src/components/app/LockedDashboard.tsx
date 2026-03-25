'use client';

import React from 'react';
import { Lock, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LockedDashboardProps {
  title?: string;
  lang?: string;
}

export default function LockedDashboard({ title = "Today's Mindset", lang = 'en' }: LockedDashboardProps) {
  const router = useRouter();
  
  const translations = {
    en: {
      title: "Unlock Today's Mindset",
      subtitle: "Join Mindbanger Premium to access daily guided sessions.",
      button: "Unlock Access",
      preview: "This content is exclusive for premium members."
    },
    sk: {
      title: "Odomkni Dnešný Mindset",
      subtitle: "Pripoj sa k Mindbanger Premium a získaj prístup k denným nahrávkam.",
      button: "Aktivovať Premium",
      preview: "Tento obsah je dostupný len pre členov s aktívnym predplatným."
    },
    cs: {
      title: "Odemkni Dnešní Mindset",
      subtitle: "Připoj se k Mindbanger Premium a získej přístup k denním nahrávkám.",
      button: "Aktivovat Premium",
      preview: "Tento obsah je dostupný pouze pro členy s aktivním předplatným."
    }
  };

  const t = translations[lang as keyof typeof translations] || translations['en'];

  return (
    <div className="space-y-6">
      {/* Blurred / Locked Card */}
      <div className="border border-amber-500/20 bg-slate-900 status-locked relative overflow-hidden rounded-xl shadow-lg">
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-amber-500/10 p-4 rounded-full mb-4 ring-1 ring-amber-500/20">
                <Lock className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">{t.title}</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-xs">{t.subtitle}</p>
            <button 
                onClick={() => router.push('/checkout')} 
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-full px-8 py-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 inline-flex items-center justify-center"
            >
                <CreditCard className="w-4 h-4 mr-2" />
                {t.button}
            </button>
        </div>

        {/* Content Placeholder (Blurred) */}
        <div className="p-6">
          <div className="text-2xl font-serif text-white/30 blur-sm select-none mb-2">
             {title}
          </div>
          <div className="text-sm text-slate-500 blur-sm select-none mb-6">Based on your focus for today</div>
          <div className="space-y-4 blur-sm select-none opacity-50">
             <div className="h-4 bg-slate-800 rounded w-3/4"></div>
             <div className="h-4 bg-slate-800 rounded w-full"></div>
             <div className="h-4 bg-slate-800 rounded w-5/6"></div>
             <div className="h-32 bg-slate-900 rounded-lg border border-white/5 mt-4"></div>
          </div>
        </div>
      </div>
      
      {/* Additional Teaser Elements */}
      <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none blur-[1px]">
         <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 h-32"></div>
         <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 h-32"></div>
      </div>
    </div>
  );
}
