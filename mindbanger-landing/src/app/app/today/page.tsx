import React from 'react';
import { createClient } from '@/lib/supabase-server';
import { getSecureAudioUrl } from '@/lib/cloudflare-r2';
import AudioPlayer from '@/components/AudioPlayer';

export const revalidate = 0; // Ensure fresh data on every load for 'today'

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Get user profile for name, language and timezone
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, preferred_language, timezone')
    .eq('id', session?.user.id)
    .single();

  const userLang = profile?.preferred_language || 'en';
  const firstName = profile?.full_name?.split(' ')[0] || 'Member';
  const userTimezone = profile?.timezone || 'UTC';

  // Get localized today's date in YYYY-MM-DD format based on user's timezone
  const now = new Date();
  const optionsForDate: Intl.DateTimeFormatOptions = { 
    timeZone: userTimezone, year: 'numeric', month: '2-digit', day: '2-digit' 
  };
  
  // Format returns MM/DD/YYYY or DD.MM.YYYY differently. We need to parse parts to build YYYY-MM-DD reliably
  const parts = new Intl.DateTimeFormat('en-CA', optionsForDate).formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const today = `${year}-${month}-${day}`;

  // Fetch today's signal
  const { data: signal } = await supabase
    .from('daily_signals')
    .select('*')
    .eq('date', today)
    .single();

  let audioSignatureUrl = '';
  if (signal?.audio_url) {
    // Generate 1-hour secure presigned URL from Cloudflare R2
    audioSignatureUrl = await getSecureAudioUrl(signal.audio_url);
  }

  // Format date for display
  const displayDate = new Intl.DateTimeFormat(userLang, {
    timeZone: userTimezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(now);

  return (
    <div className="py-2 md:py-6 space-y-8">
      
      {/* Header */}
      <header className="space-y-1">
         <h1 className="text-3xl md:text-4xl font-serif text-white">
           Good morning, {firstName}.
         </h1>
         <p className="text-slate-400 capitalize">{displayDate}</p>
      </header>

      {/* Main Signal Card */}
      {signal ? (
        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-2xl">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Theme Badge */}
          <div className="mb-6 inline-block">
              <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
                {signal.theme}
              </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Today's Signal
          </h2>
          
          <div className="prose prose-invert prose-slate max-w-none mb-10 text-slate-300 leading-relaxed text-lg">
            <p>{signal.focus}</p>
          </div>

          {/* Audio Player Injection */}
          {audioSignatureUrl && (
            <div className="mb-10">
              <AudioPlayer 
                src={audioSignatureUrl} 
                title={`Daily Reset • ${signal.theme}`} 
              />
            </div>
          )}

          {/* Focus & Affirmation Block */}
          <div className="grid md:grid-cols-2 gap-4">
            {signal.focus && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">Today's Focus</h3>
                <p className="text-slate-200 font-medium">{signal.focus}</p>
              </div>
            )}
            
            {signal.affirmation && (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-amber-500/10 text-8xl font-serif leading-none">"</div>
                <h3 className="text-xs text-amber-500 uppercase tracking-widest mb-2">Affirmation</h3>
                <p className="text-amber-100/90 italic">"{signal.affirmation}"</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-10 text-center flex flex-col justify-center items-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">?</span>
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">Tuning the frequency...</h2>
          <p className="text-slate-400 max-w-sm">
            Today's signal hasn't been broadcasted yet. Check back a little later for your daily reset.
          </p>
        </div>
      )}

      {/* Done Button */}
      {signal && (
        <div className="pt-4 flex justify-center pb-8">
          <button className="px-8 py-3 rounded-full bg-white/5 text-slate-300 font-medium hover:bg-white/10 hover:text-white transition-colors border border-white/10">
            Mark as Completed
          </button>
        </div>
      )}

    </div>
  );
}
