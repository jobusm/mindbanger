// src/components/InteractivePreviewSection.tsx
'use client';

import React, { useState } from 'react';
import { useDictionary } from './LanguageProvider';
import { Focus, Zap, RefreshCw } from 'lucide-react';

const options = [
  {
    keyword: 'Clarity',
    desc: 'You need less noise and one true direction.',
    icon: <Focus size={32} />,
    color: 'from-blue-600 to-cyan-500',
  },
  {
    keyword: 'Courage',
    desc: 'A small honest step can change more than overthinking.',
    icon: <Zap size={32} />,
    color: 'from-amber-500 to-orange-600',
  },
  {
    keyword: 'Reset',
    desc: 'Today is a chance to release yesterday’s weight.',
    icon: <RefreshCw size={32} />,
    color: 'from-purple-600 to-pink-500',
  },
];

export default function InteractivePreviewSection() {
  const { dict } = useDictionary();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-900 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-12">
        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
          {dict?.landing?.interactivePreview?.title || 'Choose the word that pulls you in first'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-8 px-4">
          {options.map((opt, idx) => {
            const isActive = active === idx;
            return (
              <div
                key={idx}
                onClick={() => setActive(idx)}
                className={`cursor-pointer rounded-2xl p-8 relative overflow-hidden transition-all duration-500 border group ${
                  isActive 
                    ? 'border-white/40 bg-white/10 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                    : 'border-white/5 bg-slate-800/20 hover:bg-slate-800/40 hover:border-white/20'
                }`}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                {isActive && <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-20`} />}

                <div className="relative z-10 flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-full bg-slate-950/50 border border-white/10 ${isActive ? 'text-white' : 'text-slate-400'} group-hover:scale-110 transition-transform duration-300`}>
                    {opt.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{dict?.landing?.interactivePreview?.options?.[idx]?.keyword || opt.keyword}</h3>
                  <p className={`text-sm leading-relaxed ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                    {dict?.landing?.interactivePreview?.options?.[idx]?.desc || opt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`pt-8 transition-all duration-500 transform ${active ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-2'}`}>
          <button className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all transform hover:scale-105">
            {active !== null 
              ? (dict?.landing?.interactivePreview?.buttonActive?.replace('{active}', dict?.landing?.interactivePreview?.options?.[active]?.keyword || options[active].keyword) || `Unlock the full daily signal for ${options[active].keyword}`) 
              : (dict?.landing?.interactivePreview?.buttonInactive || 'Unlock the full daily signal')}
          </button>
        </div>
      </div>
    </section>
  );
}
