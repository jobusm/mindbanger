const fs = require('fs');

let c = fs.readFileSync('src/app/login/page.tsx', 'utf8');

c = c.replace(/const translations = \{[\s\S]*?const t = translations\[lang\] \|\| translations.sk;/m, 
`const translations = {
  sk: {
    personalTab: 'Osobný účet',
    companyTab: 'Firemný účet',
    emailSubtitle: 'Prihlásenie emailom',
    codeSubtitle: 'Zadajte bezpečnostný kód',
    emailPlaceholder: 'Tvoj email',
    companyEmailPlaceholder: 'Pracovný email',
    getCodeBtn: 'Získať prístupový kód',
    codeSentTo: 'Kód sme odoslali na',
    codePlaceholder: 'Zadaj 6-miestny kód',
    verifyBtn: 'Overiť kód a vstúpiť',
    diffEmailText: 'Zadať iný email',
    backToHome: 'Späť na úvod',
    codeLenError: 'Kód musí mať presne 6 číslic.',
    codeSentSuccess: '6-miestny kód bol odoslaný na váš email.',
  },
  cz: {
    personalTab: 'Osobní účet',
    companyTab: 'Firemní účet',
    emailSubtitle: 'Přihlášení emailem',
    codeSubtitle: 'Zadejte bezpečnostní kód',
    emailPlaceholder: 'Tvůj email',
    companyEmailPlaceholder: 'Pracovní email',
    getCodeBtn: 'Získat přístupový kód',
    codeSentTo: 'Kód jsme odeslali na',
    codePlaceholder: 'Zadej 6-místný kód',
    verifyBtn: 'Ověřit kód a vstoupit',
    diffEmailText: 'Zadat jiný email',
    backToHome: 'Zpět na úvod',
    codeLenError: 'Kód musí mít přesně 6 číslic.',
    codeSentSuccess: '6-místný kód byl odeslán na váš email.',
  },
  en: {
    personalTab: 'Personal Account',
    companyTab: 'Company Account',
    emailSubtitle: 'Email Login',
    codeSubtitle: 'Enter security code',
    emailPlaceholder: 'Your email',
    companyEmailPlaceholder: 'Work email',
    getCodeBtn: 'Get access code',
    codeSentTo: 'We sent the code to',
    codePlaceholder: 'Enter 6-digit code',
    verifyBtn: 'Verify and Enter',
    diffEmailText: 'Enter different email',
    backToHome: 'Back to Home',
    codeLenError: 'Code must be exactly 6 digits.',
    codeSentSuccess: '6-digit code has been sent to your email.',
  }
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'sk' | 'cz' | 'en'>('sk');

  const initialMode = searchParams.get('type') === 'b2b' ? 'b2b' : 'personal';
  const [loginMode, setLoginMode] = useState<'personal' | 'b2b'>(initialMode);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    setLang((getLang() as 'sk' | 'cz' | 'en') || 'sk');
  }, []);

  const t = translations[lang] || translations.sk;`);

fs.writeFileSync('src/app/login/page.tsx', c);
