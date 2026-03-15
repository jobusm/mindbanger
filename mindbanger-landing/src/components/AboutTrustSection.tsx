// src/components/AboutTrustSection.tsx
'use client';

import React from 'react';
import { User } from 'lucide-react';
import { useDictionary } from './LanguageProvider';

export default function AboutTrustSection() {
  const { dict } = useDictionary();
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 px-6 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-indigo-900/10 via-slate-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10 text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 border border-white/5 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
          <div className="bg-slate-700/50 rounded-full p-6 text-slate-300">
             <User size={64} strokeWidth={1} />
          </div>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-amber-500 font-medium tracking-wide text-sm uppercase">{dict?.landing?.about?.badge}</p>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">Miroslav Jobus</h2>
          <p className="text-lg md:text-xl text-slate-400 font-light italic">
            {dict?.landing?.about?.role}
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm relative">
          <p className="text-slate-300 leading-relaxed text-lg md:text-xl font-light">
            "{dict?.landing?.about?.quote1} <span className="text-white font-medium">{dict?.landing?.about?.span1}</span>{dict?.landing?.about?.quote2}<span className="text-white font-medium">{dict?.landing?.about?.span2}</span>{dict?.landing?.about?.quote3}<span className="text-white font-medium">{dict?.landing?.about?.span3}</span>{dict?.landing?.about?.quote4}<span className="text-white font-medium">{dict?.landing?.about?.span4}</span>{dict?.landing?.about?.quote5}"
          </p>
        </div>
      </div>
    </section>
  );
}
