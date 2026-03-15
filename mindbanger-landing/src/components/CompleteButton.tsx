'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Check } from 'lucide-react';

export default function CompleteButton({ signalId, label }: { signalId: number; label: string }) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if already completed on mount
  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      
      const { data } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('signal_id', signalId)
        .single();
        
      if (data) {
        setCompleted(true);
      }
    }
    checkStatus();
  }, [signalId, supabase]);

  const handleComplete = async () => {
    if (!userId || completed || loading) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        signal_id: signalId
      });
      
    if (!error) {
      setCompleted(true);
    }
    setLoading(false);
  };

  if (completed) {
    return (
      <button 
        disabled
        className="px-8 py-3 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 flex items-center space-x-2 transition-all"
      >
        <Check size={18} />
        <span>Completed</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleComplete}
      disabled={loading}
      className="px-8 py-3 rounded-full bg-white/5 text-slate-300 font-medium hover:bg-white/10 hover:text-white transition-colors border border-white/10 flex items-center justify-center min-w-[160px]"
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></span>
      ) : (
        label
      )}
    </button>
  );
}
