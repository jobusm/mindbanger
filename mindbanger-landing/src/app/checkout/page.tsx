'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDictionary } from '@/lib/i18n-client';
import { useEffect } from 'react';

function CheckoutContent() {
  const { dict, lang, mounted } = useDictionary();
  const t = dict.checkout;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const refMode = searchParams.get('refMode');
  const refCode = searchParams.get('refCode');
  const inviteCode = searchParams.get('invite');

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      // 1. Beta tester with invite code
      if (inviteCode === 'beta2026') {
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }
      
      // 2. Returning users (already have session but needs renew)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthorized(true);
        if (session.user.email) setEmail(session.user.email);
      } else {
        router.push('/'); // Dead-end protection
      }
      setCheckingAuth(false);
    }
    
    checkAccess();
  }, [inviteCode, router]);

  if (checkingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
        <p>Checking access or Redirecting to waitlist...</p>
      </div>
    );
  }

  const handleCheckoutFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Create or log in the user quickly
      let userId: string | undefined;
      
      // Get ref if exists in browser
      const referredBy = typeof window !== 'undefined' ? localStorage.getItem('mindbanger_ref') : null;
      
      let localTimezone = 'UTC';
      if (typeof window !== 'undefined') {
        localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: firstName,
            referred_by: referredBy,
            preferred_language: lang,
            timezone: localTimezone
          }
        }
      });

      if (signUpError) {
        // Sometimes the user is already registered, try to log them in
        if (signUpError.message.includes('already registered') || signUpError.status === 400) {
           const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
             email,
             password
           });
           if (signInError) throw new Error('Account exists with a different password. Please log in first.');
           userId = signInData.user?.id;
        } else {
           throw signUpError;
        }
      } else {
        userId = signUpData.user?.id;
      }

      if (!userId) {
        throw new Error("Could not create or identify user.");
      }

      // 2. Start Stripe Checkout
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId, refMode, refCode }),
      });

      const { url, error: stripeError } = await res.json();
      
      if (stripeError) throw new Error(stripeError);
      if (!url) throw new Error("Could not redirect to payment gateway.");

      // 3. Redirect to Stripe
      window.location.href = url;

    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row p-6 md:p-0 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-slate-950 to-[#0a0f1c] pointer-events-none" />
      
      {/* Left Pane - Summary */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-md w-full space-y-8">
           <Link href="/" className="text-xl font-serif font-bold text-white hover:text-amber-400 transition-colors">
            Mindbanger Daily
          </Link>
          
          <div className="space-y-4">
             <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">
               {t.title}
             </h1>
             <p className="text-slate-400">{t.subtitle}</p>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden">
            <h3 className="text-lg font-medium text-amber-500 uppercase tracking-widest mb-2">{t.productInfo}</h3>
            <div className="text-5xl font-bold text-white mb-6">
              {t.price}<span className="text-xl text-slate-400 font-medium font-serif normal-case ml-2">{t.perMonth}</span>
            </div>
            <div className="space-y-4 text-left">
              {t.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-slate-300">
                  <Check size={18} className="text-amber-500 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="max-w-md w-full">
           <h2 className="text-2xl font-bold text-white mb-6">{t.formTitle}</h2>
           
           <form onSubmit={handleCheckoutFlow} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg text-sm ${
                message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">{t.firstName}</label>
                <input
                  type="text"
                  placeholder={t.firstNamePlaceholder}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">{t.email}</label>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">{t.password}</label>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 text-slate-900 font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t.processing}
                </>
              ) : (
                <>
                  {t.submit}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 font-medium pt-2">
              {t.cancelAnytime}
            </p>
          </form>
          
          <div className="mt-8 text-center border-t border-slate-800 pt-6">
             <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                {t.alreadyHaveAccount}
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
