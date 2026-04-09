// src/components/VIPZonePreviewSection.tsx
'use client';

import React from 'react';
import { useDictionary } from './LanguageProvider';
import { Calendar, Save, Radio, BatteryCharging } from 'lucide-react';

const cards = [
  {
    icon: <Calendar size={28} />,
    title: 'Today',
    desc: 'Your daily signal, focus, affirmation and audio.',
  },
  {
    icon: <Save size={28} />,
    title: 'Archive',
    desc: 'Access previous daily signals anytime.',
  },
  {
    icon: <BatteryCharging size={28} />,
    title: 'Quick Resets',
    desc: 'Calm Reset, Focus Reset, Sleep Reset and more.',
  },
  {
    icon: <Radio size={28} />,
    title: 'Start Here',
    desc: 'Simple guidance on how to use the ritual for best results.',
  },
];

export default function VIPZonePreviewSection() {
  const { dict } = useDictionary();
  return (
    <section className="py-24 bg-slate-950 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-slate-950 to-indigo-900/10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
          {dict?.landing?.vipZone?.title || 'Inside the VIP Zone'}
        </h2>

        {/* Dashboard Placeholder Mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl rounded-t-3xl border-t border-x border-slate-700/50 bg-slate-900/80 shadow-2xl p-4 sm:p-8 backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row gap-6 items-start h-[300px] sm:h-[450px]">
            {/* Sidebar Mock */}
            <div className="hidden sm:flex flex-col w-1/4 h-full border-r border-slate-800 pr-6 gap-4 animate-pulse">
              <div className="w-full h-8 bg-slate-800 rounded-md"></div>
              <div className="w-3/4 h-6 bg-slate-800 rounded-md mt-6"></div>
              <div className="w-2/3 h-6 bg-slate-800 rounded-md"></div>
              <div className="w-4/5 h-6 bg-slate-800 rounded-md"></div>
            </div>
            
            {/* Main view Mock */}
            <div className="flex-1 w-full h-full flex flex-col gap-6 animate-pulse">
              {/* Header */}
              <div className="w-full flex justify-between items-center">
                <div className="w-1/3 h-10 bg-slate-800 rounded-md gap-2"></div>
                <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
              </div>
              {/* Player/Hero Mock */}
              <div className="w-full flex-1 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-slate-700/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                 <div className="text-slate-500 text-sm font-semibold tracking-wider uppercase z-10">[ Member Area Dashboard Screenshot Placeholder ]</div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mt-8 relative z-20">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-black/20"
            >
              <div className="w-12 h-12 mb-6 mx-auto rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{dict?.landing?.vipZone?.cards?.[idx]?.title || card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                {dict?.landing?.vipZone?.cards?.[idx]?.desc || card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
