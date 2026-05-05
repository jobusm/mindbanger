@
const fs = require('fs');
let code = fs.readFileSync('src/app/app/today/page.tsx', 'utf8');

const replaceStr = \          if (onboardingSignal) {
              personalSignal = onboardingSignal;
              personalSignalType = 'onboarding';
          } else if (!hasAccess) {
              // If they don't have premium and missed onboarding (e.g. past Day 1), FORCE show Day 1 as a free sample
              const { data: fallbackOnboarding } = await supabase
                .from('onboarding_signals')
                .select('*')
                .eq('day_number', 1)
                .eq('language', userLang)
                .single();

              if (fallbackOnboarding) {
                  personalSignal = fallbackOnboarding;
                  personalSignalType = 'onboarding';
              }
          }\;

code = code.replace(
    \          if (onboardingSignal) {
              personalSignal = onboardingSignal;
              personalSignalType = 'onboarding';
          }\,
    replaceStr
);

fs.writeFileSync('src/app/app/today/page.tsx', code);
console.log('Forced Day 1 fallback!');
@
