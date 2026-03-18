"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, CreditCard, User, AlertCircle, Globe } from "lucide-react";

type Subscription = {
  id: string;
  user_id: string;
  status: string;
  price_id: string | null;
  current_period_end: string | null;
  created_at: string;
  country: string | null;
  amount_total: number | null;
  currency: string | null;
};

type JoinedSubscription = Subscription & {
  profiles?: {
    full_name: string | null;
    email?: string | null; // email might not exist in profile depending on setup, but let's try
  } | null;
};

export default function SubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<JoinedSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate total revenue, grouping by currency (usually 'eur' or 'usd')
  const revenueByCurrency = subscriptions.reduce((acc, sub) => {
    if (sub.amount_total && sub.currency && (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'completed' || sub.status === 'succeeded')) {
      const curr = sub.currency.toUpperCase();
      acc[curr] = (acc[curr] || 0) + (sub.amount_total / 100);
    }
    return acc;
  }, {} as Record<string, number>);

async function fetchSubscriptions() {
    setLoading(true);
    // Fetch subscriptions.
    // We try to join with profiles to get user info if possible.
    let { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        profiles ( full_name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
       // Fallback if foreign key doesn't exist
       const fallback = await supabase
         .from('subscriptions')
         .select('*')
         .order('created_at', { ascending: false });
       data = fallback.data;
       error = fallback.error as any;
    }

    if (!error && data) {
      setSubscriptions(data as JoinedSubscription[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading && subscriptions.length === 0) return <div className="p-10 text-slate-400">Načítavam odbery...</div>;

  return (
    <div className="py-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white mb-2">Správa predplatného</h2>
          <p className="text-slate-400">Zoznam aktuálnych odberateľov</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Celkové Tržby</span>
            <div className="flex gap-3">
              {Object.keys(revenueByCurrency).length === 0 ? (
                <span className="text-xl font-medium text-white font-mono">0.00 EUR</span>
              ) : (
                Object.entries(revenueByCurrency).map(([curr, total]) => (
                  <span key={curr} className="text-xl font-medium text-emerald-400 font-mono">
                    {total.toFixed(2)} {curr}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 border-b border-white/5">
              <tr>
                <th className="p-4 font-medium">Stav</th>
                <th className="p-4 font-medium">Používateľ</th>
                <th className="p-4 font-medium">Krajina</th>
                <th className="p-4 font-medium">Suma</th>
                <th className="p-4 font-medium">Koniec obdobia</th>
                <th className="p-4 font-medium">Kód</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    {sub.status === 'active' || sub.status === 'trialing' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {sub.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                        {sub.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white flex items-center gap-2">
                      <User size={14} className="text-slate-500" />
                      {sub.profiles?.full_name || sub.user_id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Globe size={14} className="text-slate-500" />
                      <span>{sub.country || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-emerald-400">
                    {sub.amount_total && sub.currency 
                      ? `${(sub.amount_total / 100).toFixed(2)} ${sub.currency.toUpperCase()}` 
                      : '-'}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-slate-500" />
                      <span>{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '-'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">
                    {sub.price_id || '-'}
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenašli sa žiadne odbery.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}