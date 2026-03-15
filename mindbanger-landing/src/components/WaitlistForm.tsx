'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const language = navigator.language.slice(0, 2); // 'en', 'sk', 'cs'
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Failed to join. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in zoom-in-95 duration-300">
        <CheckCircle className="text-green-400 w-10 h-10 mb-3" />
        <h3 className="text-green-100 font-bold text-lg mb-1">You are on the list!</h3>
        <p className="text-green-200/70 text-sm text-center">
          We will let you know as soon as the next wave opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-3">
      <div className="relative flex items-center w-full max-w-md mx-auto md:mx-0">
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="w-full pl-5 pr-32 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="absolute right-1 top-1 bottom-1 px-6 rounded-full bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 text-slate-900 font-bold flex items-center justify-center disabled:opacity-75 transition-all hover:scale-105"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Join <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center md:text-left pl-4">{errorMsg}</p>
      )}
      <p className="text-xs text-slate-500 text-center md:text-left pl-4">We are currently accepting a limited number of members.</p>
    </form>
  );
}