'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, KeyRound, Loader2, Sparkles, UserCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Helper for translations
const getLang = () => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )user-lang=([^;]+)'));
    if (match) return match[2];
  }
  return 'sk'; // default
};

const translations = {
  sk: {
    personalTab: 'Osobný úèet',
    companyTab: 'Firemný úèet',
    emailSubtitle: 'Prihlásenie emailom',
    codeSubtitle: 'Zadajte bezpeènostný kód',
    emailPlaceholder: 'Tvoj email',
    companyEmailPlaceholder: 'Pracovný email',
    getCodeBtn: 'Získa prístupový kód',
    codeSentTo: 'Kód sme odoslali na',
    codePlaceholder: 'Zadaj 6-miestny kód',
    verifyBtn: 'Overi kód a vstúpi',
    diffEmailText: 'Zada iný email',
    backToHome: 'Spä na úvod',
    codeLenError: 'Kód musí ma presne 6 èíslic.',
    codeSentSuccess: '6-miestny kód bol odoslaný na vá email.',
  },
  cz: {
    personalTab: 'Osobní úèet',
    companyTab: 'Firemní úèet',
    emailSubtitle: 'Pøihláení emailem',
    codeSubtitle: 'Zadejte bezpeènostní kód',
    emailPlaceholder: 'Tvùj email',
    companyEmailPlaceholder: 'Pracovní email',
    getCodeBtn: 'Získat pøístupový kód',
    codeSentTo: 'Kód jsme odeslali na',
    codePlaceholder: 'Zadej 6-místný kód',
    verifyBtn: 'Ovìøit kód a vstoupit',
    diffEmailText: 'Zadat jiný email',
    backToHome: 'Zpìt na úvod',
    codeLenError: 'Kód musí mít pøesnì 6 èíslic.',
    codeSentSuccess: '6-místný kód byl odeslán na vá email.',
  },
  en: {
    personalTab: 'Personal Account',
    companyTab: 'Company Account',
    emailSubtitle: 'Email login',
    codeSubtitle: 'Enter security code',
    emailPlaceholder: 'Your email',
    companyEmailPlaceholder: 'Work email',
    getCodeBtn: 'Get access code',
    codeSentTo: 'We sent the code to',
    codePlaceholder: 'Enter 6-digit code',
    verifyBtn: 'Verify code and enter',
    diffEmailText: 'Enter a different email',
    backToHome: 'Back to home',
    codeLenError: 'Code must be exactly 6 digits.',
    codeSentSuccess: 'A 6-digit code has been sent to your email.',
  }
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'sk' | 'cz' | 'en'>('sk');
  
  const initialMode = searchParams.get('type') === 'b2b' ? 'b2b' : 'personal';
  const [loginMode, setLoginMode] = useState<'personal' | 'b2b'>(initialMode);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    setLang((getLang() as 'sk' | 'cz' | 'en') || 'sk');
  }, []);

  const t = translations[lang] || translations.sk;

  // Track session dynamically
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = loginMode === 'b2b' ? '/app/organization' : '/app/today';
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = loginMode === 'b2b' ? '/app/organization' : '/app/today';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loginMode]);

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
      setMessage({ type: 'success', text: t.codeSentSuccess });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setMessage({ type: 'error', text: t.codeLenError });
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
      
      // The onAuthStateChange listener will redirect the user.
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Incorrect or expired code.' });
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto">
      <div className="text-center mb-8 space-y-2">
        <Link href="/" className="inline-block text-2xl font-serif font-bold text-white hover:text-amber-400 transition-colors">
          Mindbanger Daily
        </Link>
        <p className="text-slate-400 text-sm">
          {step === 'email' ? t.emailSubtitle : t.codeSubtitle}
        </p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {/* Toggle tabs */}
        <div className="flex bg-slate-950/50 border border-slate-700/50 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setLoginMode('personal')}
            className={"flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all " + (loginMode === 'personal' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50')}
          >
            <UserCircle size={16} />
            {t.personalTab}
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('b2b')}
            className={"flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all " + (loginMode === 'b2b' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50')}
          >
            <Building2 size={16} />
            {t.companyTab}
          </button>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            {message && (
              <div className={"p-4 rounded-lg text-sm " + (message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20')}>
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
                  placeholder={loginMode === 'personal' ? t.emailPlaceholder : t.companyEmailPlaceholder}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all" 
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={18} /> {t.getCodeBtn}</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {message && (
              <div className={"p-4 rounded-lg text-sm " + (message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20')}>
                {message.text}
              </div>
            )}
            <div className="space-y-4">
              <p className="text-sm text-slate-400 text-center mb-4">
                {t.codeSentTo} <strong className="text-white">{email}</strong>
              </p>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                  <KeyRound size={18} />
                </div>
                <input type="text" placeholder={t.codePlaceholder} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required maxLength={6} className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-center tracking-widest text-lg font-mono" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={20} className="animate-spin" /> : t.verifyBtn}
            </button>
            <div className="pt-2 text-center">
               <button type="button" onClick={() => setStep('email')} className="text-xs text-slate-500 hover:text-white transition-colors">{t.diffEmailText}</button>
            </div>
          </form>
        )}

        {step === 'email' && (
           <div className="mt-6 text-center">
             <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">{t.backToHome}</Link>
           </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <Suspense fallback={<div className="flex justify-center flex-col items-center h-full relative z-10 w-full max-w-md mx-auto"><Loader2 className="animate-spin text-amber-500 w-8 h-8"/></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
