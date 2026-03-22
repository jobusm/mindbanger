import React from 'react';
import { createClient } from '@/lib/supabase-server';
import { getSecureAudioUrl } from '@/lib/cloudflare-r2';
import AudioPlayer from '@/components/AudioPlayer';
import { getDictionary } from '@/lib/i18n';
import CompleteButton from '@/components/CompleteButton';

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
  
  const dict = getDictionary(userLang);
  const t = dict.today || { goodMorning: 'Good morning', todaysSignal: "{t.todaysSignal}", dailyReset: 'Daily Reset', todaysFocus: "{t.todaysFocus}", affirmation: 'Affirmation', tuning: '{t.tuning}', notBroadcasted: "{t.notBroadcasted}", markCompleted: '{t.markCompleted}' };

  // Get localized today's date in YYYY-MM-DD format based on user's timezone
  const now = new Date();
  const optionsForDate: Intl.DateTimeFormatOptions = {
    timeZone: userTimezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', hour12: false
  };
  
  // Parse current date parts in User TZ
  const parts = new Intl.DateTimeFormat('en-CA', optionsForDate).formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const today = `${year}-${month}-${day}`;

  // --- ONBOARDING LOGIC START ---
  let finalSignal = null;
  let isOnboardingWait = false;

  // 1. Get Subscription Created At
  // Note: We need the subscription creation time to determine Day 1
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('created_at, status')
    .eq('user_id', session?.user.id)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: true }) // Get the FIRST active subscription
    .limit(1)
    .single();

  const referenceDateString = subscription?.created_at || profile?.created_at; // Fallback to profile creation if no sub found (e.g. admin/free)

  if (referenceDateString) {
      // 2. Convert Reference Date to User TZ
      const refDate = new Date(referenceDateString);
      const refParts = new Intl.DateTimeFormat('en-CA', optionsForDate).formatToParts(refDate);
      const refYear = refParts.find(p => p.type === 'year')?.value;
      const refMonth = refParts.find(p => p.type === 'month')?.value;
      const refDay = refParts.find(p => p.type === 'day')?.value;
      const refHour = parseInt(refParts.find(p => p.type === 'hour')?.value || '0');

      // 3. Determine Start Day (Day 1)
      // If purchase was after 14:00 (2 PM), Day 1 starts TOMORROW.
      // Otherwise Day 1 is TODAY.
      const startDayDate = new Date(`${refYear}-${refMonth}-${refDay}T00:00:00`);
      
      // If purchased after 14:00, add 1 day to start date
      if (refHour >= 14) {
          startDayDate.setDate(startDayDate.getDate() + 1);
      }

      // 4. Calculate Current Day Number
      const currentDayDate = new Date(`${year}-${month}-${day}T00:00:00`);
      const diffTime = currentDayDate.getTime() - startDayDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const dayNumber = diffDays + 1; // 1-based index

      console.log(`User Day: ${dayNumber} (RefHour: ${refHour}, StartDate: ${startDayDate.toISOString().split('T')[0]})`);

      if (dayNumber < 1) {
          // Waiting for start (Day 0)
          isOnboardingWait = true;
      } else {
          // 5. Try Fetch Onboarding Signal
          const { data: onboardingSignal } = await supabase
            .from('onboarding_signals')
            .select('*')
            .eq('day_number', dayNumber)
            .eq('language', userLang)
            .single();

          if (onboardingSignal) {
              finalSignal = onboardingSignal;
          }
      }
  }

  // Fallback to Calendar Signal if not in onboarding wait list AND no onboarding signal found (or past sequence)
  if (!finalSignal && !isOnboardingWait) {
     const { data: dailySignal } = await supabase
        .from('daily_signals')
        .select('*')
        .eq('date', today)
        .eq('language', userLang)
        .single();
     finalSignal = dailySignal;
  }
  
  const signal = finalSignal; // Align variable name

  // --- ONBOARDING LOGIC END ---

  let mainAudioUrl = '';
  let backgroundAudioUrl = '';
  
  // Logic for audio tracks: 
  // If meditation_audio_url exists, it is the Voice track, and audio_url is the Background Music.
  // If only audio_url exists, it is treated as the full track (legacy or pre-mixed).
  
  if (signal?.meditation_audio_url) {
    mainAudioUrl = await getSecureAudioUrl(signal.meditation_audio_url);
    if (signal.audio_url) {
      backgroundAudioUrl = await getSecureAudioUrl(signal.audio_url);
    }
  } else if (signal?.audio_url) {
    mainAudioUrl = await getSecureAudioUrl(signal.audio_url);
  }

  let spokenAudioUrl = '';
  if (signal?.spoken_audio_url) {
    spokenAudioUrl = await getSecureAudioUrl(signal.spoken_audio_url);
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
           {t.goodMorning}, {firstName}.
         </h1>
         <p className="text-slate-400 capitalize">{displayDate}</p>
      </header>

      {/* Focus Block - Moved Up below Header */}
      {signal && signal.focus_text && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg">
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">{t.todaysFocus}</h3>
          <p className="text-slate-200 font-medium text-lg">{signal.focus_text}</p>
        </div>
      )}

      {/* Main Signal Card */}
      {signal ? (
        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-2xl">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Theme Badge */}
          <div className="mb-6 inline-block">
              <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
                {signal.day_number ? `Deň ${signal.day_number}` : signal.theme}
              </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
             {signal.day_number ? signal.theme : t.todaysSignal}
          </h2>

          {/* Spoken Audio Player */}
          {spokenAudioUrl && (
            <div className="mb-8">
              <AudioPlayer
                src={spokenAudioUrl}
                title={t.listenToText || "Text dňa"}
                author="Mindbanger"
                compact={true}
              />
            </div>
          )}

          <div className="prose prose-invert prose-slate max-w-none mb-10 text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
            {signal.signal_text}
          </div>

          {/* Audio Player Injection */}
          {mainAudioUrl && (
            <div className="mb-10">
              <AudioPlayer 
                src={mainAudioUrl} 
                backgroundSrc={backgroundAudioUrl}
                title={`${t.dailyReset} • ${signal.theme}`}
              />
            </div>
          )}

        </div>
      ) : (
        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-10 text-center flex flex-col justify-center items-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">{isOnboardingWait ? "⏳" : "?"}</span>
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">
            {isOnboardingWait ? (userLang === 'sk' ? "Tvoja cesta začína zajtra" : "Your journey starts tomorrow") : t.tuning}
          </h2>
          <p className="text-slate-400 max-w-sm">
            {isOnboardingWait 
               ? (userLang === 'sk' 
                  ? "Pripravujeme tvoj prvý signál. Skontroluj aplikáciu zajtra ráno, bude to stáť za to." 
                  : "We are preparing your first signal. Check back tomorrow morning, it will be worth it.")
               : t.notBroadcasted}
          </p>
        </div>
      )}
      
      {/* Affirmation Block - Below Signal Card */}
      {signal && signal.affirmation && (
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute -right-4 -bottom-4 text-amber-500/10 text-8xl font-serif leading-none">"</div>
          <h3 className="text-xs text-amber-500 uppercase tracking-widest mb-2">{t.affirmation}</h3>
          <p className="text-amber-100/90 italic text-lg">"{signal.affirmation}"</p>
        </div>
      )}

      {/* Done Button */}
      {signal && (
        <div className="pt-4 flex justify-center pb-8">
          <CompleteButton signalId={signal.id} label={t.markCompleted} />
        </div>
      )}

    </div>
  );
}
