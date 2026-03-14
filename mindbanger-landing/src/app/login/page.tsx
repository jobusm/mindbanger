// src/app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isProcessingHash, setIsProcessingHash] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    // 1. Skontrolujeme, či na stránku prichádza hash fragment z e-mailu
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      setIsProcessingHash(true);
    }

    // 2. Vynútime aby si Supabase okamžite "zjedol" token z URL a vytvoril session a cookies
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Používame window.location.href pre "hard" redirect,
        // aby sa nové cookies spoľahlivo stihli preniesť na bezpečný server v /app
        window.location.href = '/app/today';
      }
    });

    // Záchytná sieť pre akékoľvek iné zmeny auth stavu
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/app/today';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Zavoláme NAŠU BEZPEČNÚ API CESTU pre odoslanie Magic Linku
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Server nedokázal odoslať email.');
      }

      setMessage({ type: 'success', text: 'Magický link bol odoslaný. Skontroluj si schránku!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Nepodarilo sa odoslať magický link.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-block text-2xl font-serif font-bold text-white hover:text-amber-400 transition-colors">
            Mindbanger Daily
          </Link>
          <p className="text-slate-400 text-sm">
            Sign in via Magic Link (No passwords required)
          </p>
        </div>

        {isProcessingHash ? (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl text-center space-y-4">
            <Loader2 size={32} className="animate-spin text-amber-500 mx-auto" />
            <p className="text-slate-300 font-medium font-serif">Overujem prístupový kód...</p>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleAuth} className="space-y-6">

            {message && (
              <div className={`p-4 rounded-lg text-sm ${
                message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Send Magic Link
                  <Sparkles size={18} />
                </>
              )}
            </button>
          </form>
             <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                Back to home
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
