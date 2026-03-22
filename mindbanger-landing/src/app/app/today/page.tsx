import React from 'react';
import { createClient } from '@/lib/supabase-server';
import { getSecureAudioUrl } from '@/lib/cloudflare-r2';
import { getDictionary } from '@/lib/i18n';
import TodayClientView from '@/components/app/TodayClientView';

export const revalidate = 0; // Ensure fresh data on every load for 'today'

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Get user profile for name, language and timezone
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, preferred_language, timezone, created_at')
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
  let personalSignal = null;
  let isOnboardingWait = false;
  let personalSignalType: 'daily' | 'onboarding' = 'daily';

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
              personalSignal = onboardingSignal;
              personalSignalType = 'onboarding';
          }
      }
  }

  // Fallback to Calendar Signal if not in onboarding wait list AND no onboarding signal found (or past sequence)
  if (!personalSignal && !isOnboardingWait) {
     const { data: dailySignal } = await supabase
        .from('daily_signals')
        .select('*')
        .eq('date', today)
        .eq('language', userLang)
        .single();
     personalSignal = dailySignal;
     personalSignalType = 'daily';
  }
  // --- ONBOARDING LOGIC END ---

  // --- CORPORATE LOGIC START ---
  let corporateSignal = null;
  let corporateName = '';

  // Check if user is member of an organization
  const { data: memberData } = await supabase
    .from('organization_members')
    .select(`
      organization_id,
      organizations (
        name,
        industry
      )
    `)
    .eq('user_id', session?.user.id)
    .eq('status', 'active')
    .single();

  if (memberData && memberData.organizations) {
      if (typeof memberData.organizations === 'object' && 'name' in memberData.organizations) {
        // @ts-expect-error - Type narrowing issue
         corporateName = memberData.organizations.name; 
      }
      
      // Fetch Corporate Signal
      // Policies handle filtering by org_id or industry match for the user
      // We prioritize specific Org signal over Industry signal
      const { data: corpSignals } = await supabase
        .from('corporate_signals')
        .select('*')
        .eq('date', today)
        .eq('language', userLang)
        .eq('is_published', true);

      if (corpSignals && corpSignals.length > 0) {
          // Find best match: specific org > industry > generic (null org, null industry)
          // 1. Specific Org Match
          const orgMatch = corpSignals.find((s: any) => s.organization_id === memberData.organization_id);
          
          if (orgMatch) {
              corporateSignal = orgMatch;
          } else {
              // 2. Industry Match
             // @ts-expect-error - Type narrowing issue
              const industry = memberData.organizations.industry;
               const industryMatch = corpSignals.find((s: any) => !s.organization_id && s.industry === industry);
               if (industryMatch) {
                   corporateSignal = industryMatch;
               } else {
                   // 3. Generic Global Fallback (no org, no industry)
                   const globalMatch = corpSignals.find((s: any) => !s.organization_id && !s.industry);
                   if (globalMatch) {
                       corporateSignal = globalMatch;
                   }
               }
          }
      }
  }
  // --- CORPORATE LOGIC END ---


  // --- AUDIO URL RESOLUTION HELPERS ---
  const resolveAudioUrls = async (signal: any) => {
      if (!signal) return null;
      
      let mainAudioUrl = '';
      let backgroundAudioUrl = '';
      
      if (signal.meditation_audio_url) {
        mainAudioUrl = await getSecureAudioUrl(signal.meditation_audio_url);
        if (signal.audio_url) {
          backgroundAudioUrl = await getSecureAudioUrl(signal.audio_url);
        }
      } else if (signal.audio_url) {
        mainAudioUrl = await getSecureAudioUrl(signal.audio_url);
      }
    
      let spokenAudioUrl = '';
      if (signal.spoken_audio_url) {
        spokenAudioUrl = await getSecureAudioUrl(signal.spoken_audio_url);
      }

      return {
          ...signal,
          main_audio_url_signed: mainAudioUrl,
          background_audio_url_signed: backgroundAudioUrl,
          spoken_audio_url_signed: spokenAudioUrl
      };
  };

  const personalSignalWithUrls = personalSignal ? await resolveAudioUrls(personalSignal) : null;
  const corporateSignalWithUrls = corporateSignal ? await resolveAudioUrls(corporateSignal) : null;

  // Enhance signals with type for tracking completion
  if (personalSignalWithUrls) {
      personalSignalWithUrls.type = personalSignalType;
  }
  if (corporateSignalWithUrls) {
      corporateSignalWithUrls.type = 'corporate';
  }

  // Format date for display
  const displayDate = new Intl.DateTimeFormat(userLang, {
    timeZone: userTimezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(now);

  return (
    <TodayClientView 
        userLang={userLang}
        firstName={firstName}
        t={t}
        displayDate={displayDate}
        personalSignal={personalSignalWithUrls}
        corporateSignal={corporateSignalWithUrls}
        isOnboardingWait={isOnboardingWait}
        corporateName={corporateName}
    />
  );
}
