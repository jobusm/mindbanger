// src/app/join/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, Loader2, Sparkles, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function JoinPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  
  // Consents
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  useEffect(() => {
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
      if (!termsAccepted || !gdprAccepted) {
        throw new Error('Please accept the Terms and Privacy Policy to continue.');
      }

      // 1. Send code via our API (handling user creation if new)
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          options: {
             data: {
               terms_accepted: termsAccepted,
               privacy_policy_accepted: gdprAccepted,
               consents_timestamp: new Date().toISOString()
             }
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Failed to initialize signup.');
      }

      setStep('otp');
      setMessage({ type: 'success', text: 'Check your email for the 6-digit code.' });
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
        type: 'magiclink'
      });

      if (error) throw error;
      
      // onAuthStateChange handles redirect
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Incorrect or expired code.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-amber-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-block text-2xl font-serif font-bold text-white hover:text-amber-400 transition-colors">
            Mindbanger Daily
          </Link>
          <p className="text-amber-400/80 uppercase tracking-widest text-xs font-bold">Free Signup</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl text-white font-serif mb-6 text-center">
            {step === 'email' ? 'Create Your Account' : 'Verify Your Email'}
          </h1>
          
          {message && (
            <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-200 border border-red-500/20' : 'bg-green-500/10 text-green-200 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                   <>
                     Start Free
                     <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </>
                )}
              </button>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer transition-colors"
                    />
                  </div>
                  <span className="text-xs text-slate-400 leading-tight group-hover:text-slate-300 transition-colors">
                    I agree to the <Link href="/terms" className="text-amber-500 hover:underline" target="_blank">Terms of Service</Link>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      required
                      checked={gdprAccepted}
                      onChange={(e) => setGdprAccepted(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer transition-colors"
                    />
                  </div>
                  <span className="text-xs text-slate-400 leading-tight group-hover:text-slate-300 transition-colors">
                    I accept the <Link href="/privacy" className="text-amber-500 hover:underline" target="_blank">Privacy Policy</Link> and data processing.
                  </span>
                </label>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Enter 6-digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">Code sent to {email}</p>
              </div>
              
              <button 
                type="submit" 
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enter App'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-slate-400 text-sm hover:text-white transition-colors"
              >
                Change Email
              </button>
            </form>
          )}
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-sm">
          Already a member? <Link href="/login" className="text-amber-500 hover:text-amber-400">Log In</Link>
        </p>
      </div>
    </div>
  );
}