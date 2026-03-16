'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Mail } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/50 p-8 rounded-3xl border border-white/5">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>

        <h1 className="text-3xl font-serif text-white">Platba prebehla úspešne</h1>
        
        <p className="text-slate-300">
           Vitajte v Mindbanger Daily. Váš účet bol aktívovaný.
        </p>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto">
             <Mail size={24} />
          </div>
          <h2 className="text-xl font-medium text-white">Skontrolujte si e-mail</h2>
          <p className="text-slate-400 text-sm">
            Práve sme vám odoslali e-mail s odkazom na prihlásenie (Magic Link). 
            Kliknutím na tlačidlo v e-maile sa bezpečne prihlásite do svojho účtu a odomknete všetky funkcie.
          </p>
        </div>

        <button
          onClick={() => router.push('/login')}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-amber-500/20"
        >
          Už som klikol na email - prejsť na prihlásenie
        </button>
      </div>
    </div>
  );
}
