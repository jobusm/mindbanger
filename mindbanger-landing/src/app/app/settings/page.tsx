'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string;
    preferred_language: string;
    timezone: string;
  } | null>(null);

  // Známe časové pásma pre zjednodušenie (dali by sa natiahnuť z Intl.supportedValuesOf('timeZone'))
  const timezones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC', 'Europe/Bratislava', 'Europe/Prague', 'Europe/London', 'America/New_York'];

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          preferred_language: data.preferred_language || 'en',
          timezone: data.timezone || 'UTC'
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          preferred_language: profile.preferred_language,
          timezone: profile.timezone
        })
        .eq('id', user.id);
    }
    setSaving(false);
    router.refresh(); // Obnovenie SSR dát
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="text-white p-6">Načítavam nastavenia...</div>;

  return (
    <div className="py-2 md:py-6 space-y-8 max-w-2xl">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif text-white">Nastavenia účtu</h1>
        <p className="text-slate-400">Prispôsobte si svoj Mindbanger zážitok.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6 bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-white/5">
        
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Vaše Meno</label>
          <input
            type="text"
            value={profile?.full_name || ''}
            onChange={e => setProfile({...profile!, full_name: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Jazyk obsahu</label>
          <select
            value={profile?.preferred_language || 'en'}
            onChange={e => setProfile({...profile!, preferred_language: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
          >
            <option value="en">Angličtina (English)</option>
            <option value="sk">Slovenčina (Slovak)</option>
            <option value="cs">Čeština (Czech)</option>
          </select>
          <p className="text-xs text-slate-500">Určuje v akom jazyku dostanete denný signál.</p>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Moje Časové Pásmo</label>
          <select
            value={profile?.timezone || 'UTC'}
            onChange={e => setProfile({...profile!, timezone: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500">Dôležité, ak cestujete. Pomáha nám odomknúť dnešný obsah presne pre váš lokálny čas.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 mt-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {saving ? 'Ukladám...' : <><Save size={18} /> Uložiť nastavenia</>}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-500/5 p-6 rounded-[2rem] border border-red-500/10 space-y-4">
        <h3 className="text-red-400 font-medium">Správa odberu & Odhlásenie</h3>
        <p className="text-sm text-slate-400">Tu si môžete spravovať svoju kartu, faktúry cez Stripe alebo sa odhlásiť z aplikácie.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button className="px-6 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors border border-slate-700">
            Spravovať Predplatné v Stripe
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors border border-red-500/20 flex flex-row items-center justify-center gap-2"
          >
            <LogOut size={16}/> Odhlásiť sa
          </button>
        </div>
      </div>
      
    </div>
  );
}