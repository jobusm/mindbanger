'use client';

import React from 'react';
import { useDictionary } from './LanguageProvider';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import Image from 'next/image';

export default function AboutContent() {
  const { dict } = useDictionary();
  const t = dict?.aboutPage;

  if (!t) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif text-white tracking-tight hover:opacity-80 transition-opacity">
              Mindbanger <span className="text-amber-500">Daily</span>
            </Link>
            <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
               <ArrowLeft size={16} className="mr-2" /> {t.back}
            </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
           
           {/* Header */}
           <header className="text-center space-y-6">
              <div className="relative inline-flex items-center justify-center w-36 h-36 rounded-full bg-slate-900 border border-white/10 text-slate-400 mb-4 shadow-2xl overflow-hidden">
                 <Image 
                   src="/miro-profile.jpg" 
                   alt="Miroslav Jobus" 
                   fill
                   className="object-cover"
                   priority
                 />
                 {/* Fallback if image fails to load or during dev */}
                 <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center bg-slate-800 -z-10">
                    <User size={64} strokeWidth={1} />
                 </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-white">{t.title}</h1>
              <p className="text-xl text-amber-500/90 font-medium tracking-wide uppercase">{t.role}</p>
           </header>

           {/* Content */}
           <div className="prose prose-invert prose-lg max-w-none space-y-8 leading-relaxed text-slate-300 font-light">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-white first-letter:mr-3 first-letter:float-left">
                {t.p1}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 my-12 items-stretch">
                 <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-colors">
                    <h3 className="text-xl font-serif text-white mb-4">{t.h1}</h3>
                    <p className="text-base">{t.p2}</p>
                 </div>
                 <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-colors">
                   <h3 className="text-xl font-serif text-white mb-4">{t.h2}</h3>
                   <p className="text-base">{t.p3}</p>
                 </div>
              </div>

              <p>
                {t.p4}
              </p>
              
              <blockquote className="border-l-4 border-amber-500 pl-6 py-2 my-8 text-xl font-serif text-white italic bg-gradient-to-r from-amber-500/10 to-transparent rounded-r-lg">
                „{t.quote}“
              </blockquote>
           </div>

           {/* CTA */}
           <div className="text-center pt-12 border-t border-white/10">
              <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-colors shadow-lg hover:shadow-white/20">
                {t.back}
              </Link>
           </div>
           
           {/* Footer */}
           <footer className="text-center text-slate-500 text-sm py-12">
             &copy; {new Date().getFullYear()} Miroslav Jobus & Mindbanger. All rights reserved.
           </footer>

        </div>
      </main>
    </div>
  );
}