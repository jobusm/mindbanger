'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

type SignalId = number | string;
type SignalType = 'daily' | 'onboarding' | 'corporate';

export default function CompleteButton({ 
  signalId, 
  label, 
  type = 'daily' 
}: { 
  signalId: SignalId; 
  label: string; 
  type?: SignalType 
}) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      
      let table = 'user_progress';
      if (type === 'onboarding') table = 'user_progress_onboarding';
      if (type === 'corporate') table = 'user_progress_corporate';

      const { data } = await supabase
        .from(table)
        .select('id')
        .eq('user_id', user.id)
        .eq('signal_id', signalId)
        .maybeSingle(); // Use maybeSingle to avoid 406 error if not found
        
      if (data) {
        setCompleted(true);
      }
    }
    checkStatus();
  }, [signalId, type]);

  async function handleComplete() {
    if (!userId) return;
    setLoading(true);

    let table = 'user_progress';
    if (type === 'onboarding') table = 'user_progress_onboarding';
    if (type === 'corporate') table = 'user_progress_corporate';

    const { error } = await supabase
      .from(table)
      .insert({
        user_id: userId,
        signal_id: signalId
      });

    if (!error) {
      setCompleted(true);
      toast.success('Completed!');
    } else {
        if (error.code === '23505') { // Unique violation
            setCompleted(true);
        } else {
            console.error(error);
            toast.error('Error saving progress');
        }
    }
    setLoading(false);
  }

  if (completed) {
    return (
      <button 
        disabled
        className="px-8 py-3 rounded-full bg-slate-800 text-slate-500 font-medium flex items-center gap-2 cursor-default border border-white/5"
      >
        <Check size={18} />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? '...' : label}
    </button>
  );
}
