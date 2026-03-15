// src/components/Footer.tsx
'use client';
import { useDictionary } from './LanguageProvider';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const { dict } = useDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 bg-slate-950 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <Link href="/" className="text-white font-serif text-xl font-bold tracking-wide">
            Mindbanger Daily
          </Link>
          <p className="text-xs text-slate-500 max-w-xs text-center md:text-left">
            {dict?.landing?.footer?.tagline || 'Daily signals for clarity, calm & focus.'}
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-sm text-slate-400">
          <Link href="/login" className="hover:text-white transition-colors">{dict?.landing?.footer?.login || 'Login'}</Link>
          <Link href="/join" className="hover:text-white transition-colors">{dict?.landing?.footer?.join || 'Join'}</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">{dict?.landing?.footer?.privacy || 'Privacy'}</Link>
          <Link href="/terms" className="hover:text-white transition-colors">{dict?.landing?.footer?.terms || 'Terms'}</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-600">
          &copy; {year} Mindbanger Daily.
        </div>
      </div>
    </footer>
  );
}
