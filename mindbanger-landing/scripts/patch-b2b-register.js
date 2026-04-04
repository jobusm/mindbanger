const fs = require('fs');
const file = 'src/app/b2b/register/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace('import { Building2, User, Mail, Lock, CheckCircle2, Loader2, ArrowRight } from \'lucide-react\';', 
\import { Building2, User, Mail, Lock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import B2BLanguageSwitcher from '@/components/b2b/B2BLanguageSwitcher';\);

txt = txt.replace(/const lang = searchParams\?\.get\('lang'\) \|\| 'sk';/, 
\const paramLang = searchParams?.get('lang');
  const [lang, setLangState] = useState<'sk' | 'cs' | 'en'>((paramLang === 'sk' || paramLang === 'cs' || paramLang === 'en') ? paramLang : 'en');
  
  React.useEffect(() => {
    if (!paramLang) {
      const cookies = document.cookie.split('; ');
      const langCookie = cookies.find(c => c.startsWith('user-lang='));
      if (langCookie) {
         const val = langCookie.split('=')[1];
         if (['sk', 'cs', 'en'].includes(val)) setLangState(val as any);
      }
    }
  }, [paramLang]);
\);

// Also add Language Switcher near the header
txt = txt.replace(/<span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">\\s*Mindbanger <span className="text-white">B2B<\\/span>\\s*<\\/span>/g,
\<span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
  Mindbanger <span className="text-white">B2B</span>
</span>
<div className="ml-auto">
  <B2BLanguageSwitcher initialLang={lang} />
</div>\);

fs.writeFileSync(file, txt);
