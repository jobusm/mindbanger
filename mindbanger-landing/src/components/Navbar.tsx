'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useDictionary } from './LanguageProvider';

export default function Navbar() {
  const { dict } = useDictionary();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/5 py-4'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-serif text-2xl tracking-wide font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400"
        >
          Mindbanger
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
            {dict?.landing?.navbar?.login || 'Login'}
          </Link>
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold text-sm hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all transform hover:scale-105">
            {dict?.landing?.navbar?.join || 'Join Now'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col space-y-4 animate-in slide-in-from-top-2">
          <Link
            href="/login"
            className="text-gray-300 hover:text-white py-2 text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {dict?.landing?.navbar?.login || 'Login'}
          </Link>
          <button
            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {dict?.landing?.navbar?.join || 'Join Now'}
          </button>
        </div>
      )}
    </nav>
  );
}