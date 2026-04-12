// src/components/VIPZonePreviewSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
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
        <div className="relative mx-auto mt-16 max-w-4xl rounded-3xl border border-slate-800/80 bg-slate-950/40 shadow-2xl p-4 md:p-8 backdrop-blur-md overflow-hidden min-h-[550px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-amber-900/10 pointer-events-none" />
          
          {/* Decorative glowing orb behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Floating UI Container */}
          <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-6 z-10">
            
            {/* Top Notification Bar Fake */}
            <div className="w-full max-w-lg mx-auto bg-[#0a0a0a]/90 border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-2xl backdrop-blur-xl transform transition-transform hover:-translate-y-1 hover:shadow-amber-500/10 duration-500 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-950/40 flex items-center justify-center text-amber-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <div className="text-left">
                  <p className="text-[13px] sm:text-sm font-bold text-white leading-tight">Začni deň s čistou hlavou</p>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Aktivuj si denné Mindsety ešte dnes.</p>
                </div>
              </div>
              <Link href="/join" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-full text-slate-950 font-bold text-xs shrink-0 hidden xs:block cursor-pointer transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                Odoberať Mindsety
              </Link>
            </div>

            {/* Content Stack - Desktop Side-by-side overlap, Mobile Stack */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center mt-2">
              
              {/* Moja Sila Card (Slightly behind, shifted left) */}
              <div className="w-full max-w-sm md:absolute md:-left-8 md:top-6 bg-[#161a29]/90 border border-slate-700/60 rounded-2xl p-6 text-left shadow-2xl backdrop-blur-xl transform transition-all hover:scale-105 duration-500 z-20 hover:z-40">
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-3">Dnešné zameranie</p>
                <h3 className="text-2xl font-semibold text-white tracking-wide">Moja sila</h3>
              </div>

              {/* Audio Player Card (Front & Center) */}
              <div className="w-full max-w-[420px] bg-[#111625]/95 border border-slate-700/60 rounded-[2rem] p-6 sm:p-8 text-left shadow-2xl backdrop-blur-xl md:ml-32 mt-[-20px] md:mt-24 z-30 transform transition-all hover:scale-[1.02] duration-500 hover:border-slate-600/80">
                <div className="inline-flex items-center px-4 py-1 rounded-full border border-amber-600/30 bg-amber-950/30 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
                  Sebavedomie
                </div>
                
                <h2 className="text-4xl sm:text-[2.75rem] font-serif text-white mb-8 tracking-tight leading-none text-shadow-sm">Sebavedomie</h2>
                
                {/* The Player Box Component */}
                <Link href="/join" className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-slate-600 transition-colors shadow-inner block">
                  <div className="flex-1 pr-4">
                    <h4 className="text-white font-bold text-[15px] mb-1">Vypočuť si text</h4>
                    <p className="text-slate-400 text-xs mb-3 font-medium">Mindbanger</p>
                    <div className="flex items-center gap-3 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-slate-400 font-medium">0:00</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                        <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">2:33</span>
                    </div>
                  </div>
                  
                  {/* Circular Play Button */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-slate-800/80 border-2 border-slate-700 flex items-center justify-center text-amber-500 group-hover:scale-105 group-hover:border-amber-500/50 transition-all shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-90 group-hover:opacity-100"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                </Link>

                {/* Simulated text snippet */}
                <div className="mt-8 space-y-3 opacity-60 pointer-events-none select-none">
                  <div className="h-2 w-full bg-slate-800 rounded-full"></div>
                  <div className="h-2 w-[90%] bg-slate-800 rounded-full"></div>
                  <div className="h-2 w-[75%] bg-slate-800 rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
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
