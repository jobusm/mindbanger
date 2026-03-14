// src/components/VIPZonePreviewSection.tsx
'use client';

import React from 'react';
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
  return (
    <section className="py-24 bg-slate-950 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-slate-950 to-indigo-900/10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
          Inside the VIP Zone
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-black/20"
            >
              <div className="w-12 h-12 mb-6 mx-auto rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
