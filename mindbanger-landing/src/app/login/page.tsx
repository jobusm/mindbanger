// src/app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    // Force Supabase to immediately read the session if it exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/app/today';
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/app/today';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Failed to send the email code.');
      }

      setStep('otp');
      setMessage({ type: 'success', text: 'A 6-digit code has been sent to your email.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setMessage({ type: 'error', text: 'Code must be exactly 6 digits.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'magiclink' // or email
      });

      if (error) throw error;
      
      // onAuthStateChange presmeruje na /app/today
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Incorrect or expired code.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-block text-2xl font-serif font-bold text-white hover:text-amber-400 transition-colors">
            Mindbanger Daily
          </Link>
          <p className="text-slate-400 text-sm">
            {step === 'email' ? 'Email login' : 'Enter security code'}
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                  {message.text}
                </div>
              )}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input type="email" placeholder="Tvoj email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={18} /> Get access code</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                  {message.text}
                </div>
              )}
              <div className="space-y-4">
                <p className="text-sm text-slate-400 text-center mb-4">
                  We sent the code to <strong className="text-white">{email}</strong>
                </p>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                    <KeyRound size={18} />
                  </div>
                  <input type="text" placeholder="Enter 6-digit code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required maxLength={6} className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-center tracking-widest text-lg font-mono" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify code and enter'}
              </button>
              <div className="pt-2 text-center">
                 <button type="button" onClick={() => setStep('email')} className="text-xs text-slate-500 hover:text-white transition-colors">Enter a different email</button>
              </div>
            </form>
          )}

          {step === 'email' && (
             <div className="mt-6 text-center">
               <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">Back to home</Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
