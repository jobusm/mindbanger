'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. We force a small delay to let Stripe Webhook process the event
    // 2. We can try to refresh the session or check db profile
    const verifyAccess = async () => {
      try {
         // Cakanie aby webhook stihol updatnut DB
         await new Promise(r => setTimeout(r, 2500));
         
         const { data: { session } } = await supabase.auth.getSession();
         if (!session) {
            router.push('/login');
            return;
         }

         // Redirect to dashboard
         router.push('/app/today');

      } catch (err) {
         console.error(err);
      }
    };

    verifyAccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/50 p-8 rounded-3xl border border-white/5">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
           <CheckCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-serif text-white">Payment Successful</h1>
        <p className="text-slate-400">
           Welcome to Mindbanger Daily. We're setting up your member area...
        </p>

        {loading && (
          <div className="flex justify-center pt-8">
             <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        )}
      </div>
    </div>
  );
}
