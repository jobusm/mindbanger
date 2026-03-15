// src/components/FinalCTASection.tsx
'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import WaitlistForm from './WaitlistForm';

export default function FinalCTASection() {
  return (
    <section className="py-32 bg-slate-950 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/80 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[20%] right-[30%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-700 delay-100">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-full px-4 py-1 text-sm text-amber-300 font-medium mb-4">
          <Sparkles size={14} />
          <span>Start your daily reset</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
          Set your mind.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Shape your day.</span>
        </h2>

        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto italic">
          "The way your mind is set begins to shape your reality."
        </p>

        <div className="pt-8 max-w-md mx-auto">
          <WaitlistForm />
        </div>

        <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase">Join Mindbanger Daily Waitlist</p>
      </div>
    </section>
  );
}
