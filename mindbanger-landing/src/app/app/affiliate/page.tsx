import React from 'react';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import AffiliateTracker from '@/components/AffiliateTracker';
import { ArrowUpRight, Users, Wallet, Check, Play, Download, Image as ImageIcon } from 'lucide-react';
import CopyLink from '@/components/CopyLink';
import { SupabaseClient } from '@supabase/supabase-js';

// We just make everyone an affiliate directly.
async function ensureAffiliate(supabase: SupabaseClient, userId: string) {
  const { data: existing } = await supabase
    .from('affiliates')
    .select('id, paypal_email')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing;
  }

  const { data: newAffiliate } = await supabase
    .from('affiliates')
    .insert([{ user_id: userId }])
    .select()
    .single();

  return newAffiliate;
}

export default async function AffiliateDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const affiliate = await ensureAffiliate(supabase, user.id);

  // Stats dummy for now
  const { count: pendingRefA = 0 } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('affiliate_id', affiliate.id)
    .eq('commission_model', 'second_month')
    .eq('status', 'pending');

  const { count: activeRefB = 0 } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('affiliate_id', affiliate.id)
    .eq('commission_model', 'lifetime_20')
    .eq('status', 'paid'); // Paid indicates active recurring
    
  const { data: materials } = await supabase
    .from('affiliate_materials')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-serif text-white">Partner Program</h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Share Mindbanger with your audience and earn. Choose the model that works best for you. 
          Your unique links are ready to use instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model A */}
        <div className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-amber-500/10 transition-colors">
            <ArrowUpRight size={120} className="w-24 h-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold tracking-wider uppercase rounded-full border border-amber-500/20">
              Box 1: The Fast 100%
            </span>
            <h2 className="text-2xl font-bold text-white">100% of 2nd Month</h2>
            <p className="text-slate-400 text-sm h-12">
              You get 100% commission for the user's second month. Best for quick, high-ticket conversions upfront.
            </p>
            <div className="pt-4">
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Your Referral Link (Ref A)</label>
              <CopyLink link={`https://mindbanger.com/checkout?refMode=A&refCode=${user.id}`} />
            </div>
          </div>
        </div>

        {/* Model B */}
        <div className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-indigo-500/10 transition-colors">
            <ArrowUpRight size={120} className="w-24 h-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-wider uppercase rounded-full border border-indigo-500/20">
              Box 2: Lifetime 20%
            </span>
            <h2 className="text-2xl font-bold text-white">20% Recurring</h2>
            <p className="text-slate-400 text-sm h-12">
              Earn 20% commission on every payment for the life of the customer. Build true passive income.
            </p>
            <div className="pt-4">
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Your Referral Link (Ref B)</label>
              <CopyLink link={`https://mindbanger.com/checkout?refMode=B&refCode=${user.id}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center space-x-2 text-slate-500 mb-2">
            <Users size={16} />
            <span className="text-sm">Pending Model A</span>
          </div>
          <div className="text-2xl font-bold text-white">{pendingRefA}</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center space-x-2 text-slate-500 mb-2">
            <Users size={16} />
            <span className="text-sm">Active Model B</span>
          </div>
          <div className="text-2xl font-bold text-white">{activeRefB}</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center space-x-2 text-slate-500 mb-2">
            <Wallet size={16} />
            <span className="text-sm">Unpaid Balance</span>
          </div>
          <div className="text-2xl font-bold text-amber-500">€0.00</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center space-x-2 text-slate-500 mb-2">
            <Check size={16} />
            <span className="text-sm">Total Earned</span>
          </div>
          <div className="text-2xl font-bold text-emerald-500">€0.00</div>
        </div>
      </div>

      {/* Promo Library */}
      <div className="pt-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Promo knižnica</h2>
          <p className="text-slate-400">
            Stiahnite si pripravené materiály pre vaše kampane.
          </p>
        </div>

        {materials && materials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {materials.map((item) => (
              <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-xl overflow-hidden flex flex-col group relative">
                <div className="aspect-video bg-black/50 relative flex items-center justify-center overflow-hidden">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800/50">
                      <Play className="mb-2 w-12 h-12 text-white/20 group-hover:text-amber-500/50 transition-colors" />
                      <span className="text-xs font-medium uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full border border-white/5">Video Vizuál</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white/80 border border-white/10">
                    {item.resolution || item.type}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 pb-16">
                  <h3 className="font-semibold text-white/90 line-clamp-2" title={item.title}>{item.title}</h3>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                    <span className="capitalize">{item.language}</span>
                    <span>&bull;</span>
                    <span className="capitalize">{item.type}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full bg-white text-black hover:bg-slate-200 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Download size={16} />
                    <span>Stiahnuť</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/40 border border-white/5 rounded-xl text-slate-500">
            Zatiaľ nie sú k dispozícii žiadne promo materiály.
          </div>
        )}
      </div>

    </div>
  );
}