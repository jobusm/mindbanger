const fs = require('fs');

const updateDict = (langPath, updates) => {
  const content = fs.readFileSync(langPath, 'utf8');
  const d = JSON.parse(content);
  
  // Recursively assign updates to d
  const applyUpdates = (target, src) => {
    for (const key in src) {
      if (typeof src[key] === 'object' && src[key] !== null && !Array.isArray(src[key])) {
        if (!target[key]) target[key] = {};
        applyUpdates(target[key], src[key]);
      } else {
        target[key] = src[key];
      }
    }
  };
  
  applyUpdates(d, updates);
  fs.writeFileSync(langPath, JSON.stringify(d, null, 2), 'utf8');
};

// --- EN UPDATES ---
updateDict('src/dictionaries/en.json', {
  landing: {
    navbar: {
      joinSub: "Start Membership"
    },
    hero: {
      titlePart1: "If you do not set your ",
      titleHighlight: "mind,",
      titlePart2: " the world will do it for you.",
      subtitle: "Mindbanger Daily helps you begin the day with clarity, emotional steadiness, and intentional direction.",
      quote: "\"The way your mind is set begins to shape your reality.\"",
      widgetTitle: "Today's Signal",
      widgetBadge: "Clarity",
      widgetHeadline: "Simplify one thing today.",
      widgetQuote: "\"You do not need to solve everything. You need one clear next step.\"",
      widgetBtn: "Play Today's Audio Preview",
      widgetFooter: "A new daily signal. A calmer and stronger inner direction over time.",
      subtitleDesc: "Mindbanger Daily helps you begin the day with clarity, emotional steadiness, and intentional direction.",
      subtitleAuthor: "Created by hypnotherapist and life coach Miroslav Jobus.",
      cta: "Start Membership"
    },
    dailyRitual: {
      title: "What you receive each day inside Mindbanger Daily",
      features: [
        { title: "Theme of the Day", desc: "A clear emotional and mental direction for the day ahead." },
        { title: "Daily Mind Signal", desc: "A short guided message to help reset your mindset from within." },
        { title: "Today’s Focus", desc: "One simple shift to carry into your real day." },
        { title: "Daily Affirmation", desc: "A reinforcing statement that helps anchor your inner state." },
        { title: "Audio Reset", desc: "A short voice-led reset for calm, focus, and reconnection." }
      ]
    },
    interactivePreview: {
      title: "Which one do you need most today?",
      options: [
        { keyword: "Clarity", desc: "Less mental noise. One true direction." },
        { keyword: "Courage", desc: "One honest step can change more than endless overthinking." },
        { keyword: "Reset", desc: "You do not have to carry yesterday into today." }
      ],
      buttonActive: "Start Your Daily Reset",
      buttonInactive: "Start Your Daily Reset",
      footerLine: "Whatever pulls you in first, that is often where your mind needs support most."
    },
    howItWorks: {
      title: "How Mindbanger Daily works",
      steps: [
        { title: "1. Start your membership", desc: "Join in under a minute and get immediate access to your daily ritual." },
        { title: "2. Receive your daily signal", desc: "Each day brings a new theme, a short mindset signal, a focus, an affirmation, and an audio reset." },
        { title: "3. Build your inner direction over time", desc: "With consistent daily use, your mind becomes calmer, clearer, and stronger." }
      ]
    },
    benefits: {
      title: "Mindbanger Daily is for you if you want to…",
      items: [
        "Start the day with more clarity instead of chaos",
        "Quiet overthinking and inner pressure",
        "Feel calmer, more focused, and more grounded",
        "Strengthen your mindset in a simple daily way",
        "Reconnect with yourself before the day pulls you away",
        "Move through life with more inner direction"
      ]
    },
    vipZone: {
      title: "Inside the Member Area",
      cards: [
        { title: "Today", desc: "Your daily signal, focus, affirmation, and audio reset in one place." },
        { title: "Archive", desc: "Return to past signals anytime you need them." },
        { title: "Quick Resets", desc: "Short guided resets for calm, focus, sleep, and emotional reset." },
        { title: "Start Here", desc: "Simple guidance to help you get the most from the ritual from day one." }
      ]
    },
    about: {
      badge: "Created by Miroslav Jobus",
      role: "Hypnotherapist, life coach, and mental performance guide",
      quote1: "“Mindbanger Daily was created for people who do not want to drift into the day unconsciously.",
      quote2: "It is a simple daily ritual designed to help you return to yourself, steady your mind, and move forward with more intention.”",
      span1: "",
      span2: "",
      span3: "",
      span4: ""
    },
    pricing: {
      title1: "One simple membership.",
      title2: "One powerful daily ritual.",
      planName: "Mindbanger Daily",
      price: "€7.99",
      period: " / month",
      vatExcluded: "VAT may apply based on your country.",
      subtitle: "A small monthly cost for a stronger daily mind.",
      features: [
        "Daily mind signal",
        "Daily focus",
        "Daily affirmation",
        "Daily audio reset",
        "Archive access",
        "Bonus quick resets"
      ],
      cancelText: "Cancel anytime. No long-term commitment.",
      cta: "Start Membership"
    },
    b2bCta: {
      title: "Bring calm, focus, and mental resilience to your team",
      desc: "Mindbanger for Teams helps companies support employee well-being with a modern daily mental reset designed to reduce stress, improve focus, and strengthen resilience.",
      btn: "Explore Mindbanger for Teams"
    },
    faq: {
      title: "Questions",
      faqs: [
        { q: "What exactly do I receive each day?", a: "Each day you receive a theme, a short mindset signal, one practical focus, a reinforcing affirmation, and a short audio reset." },
        { q: "Is this a meditation app?", a: "No. Mindbanger Daily is a guided daily mental ritual for clarity, calm, and inner direction." },
        { q: "How long does the daily ritual take?", a: "Only a few minutes. It is designed to fit into real daily life." },
        { q: "Can I cancel anytime?", a: "Yes. You can cancel your membership anytime." },
        { q: "Do I get access to past days?", a: "Yes. Members can return to past signals through the archive." },
        { q: "Is the content in English?", a: "Yes. English is currently the main version." },
        { q: "Who is Mindbanger Daily for?", a: "It is for people who want less mental chaos, more clarity, and a stronger inner direction in daily life." },
        { q: "Is this therapy or medical treatment?", a: "No. Mindbanger Daily is a personal development and mental well-being tool. It is not a substitute for therapy, diagnosis, or medical care." }
      ]
    },
    finalCta: {
      badge: "Set your mind. Shape your day.",
      title1: "Set your mind.",
      title2: "Shape your day.",
      quote: "\"A few minutes a day can change the way you move through everything else.\"",
      footer: "Start Mindbanger Daily",
      cta: "Start Membership"
    }
  }
});

// --- SK UPDATES ---
updateDict('src/dictionaries/sk.json', {
  landing: {
    navbar: {
      joinSub: "Začať členstvo"
    },
    hero: {
      titlePart1: "Ak si nenastavíte ",
      titleHighlight: "myseľ,",
      titlePart2: " svet to urobí za vás.",
      subtitle: "Mindbanger Daily vám pomôže začať deň s jasnosťou, emočnou stabilitou a vedomým zameraním.",
      quote: "\"Spôsob, akým je vaša myseľ nastavená, začína formovať vašu realitu.\"",
      widgetTitle: "Dnešný Signál",
      widgetBadge: "Jasnosť",
      widgetHeadline: "Zjednodušte si dnes jednu vec.",
      widgetQuote: "\"Nepotrebujete vyriešiť všetko. Potrebujete jeden jasný ďalší krok.\"",
      widgetBtn: "Prehrať dnešné audio (ukážka)",
      widgetFooter: "Nový denný signál. Pokojnejšie a silnejšie vnútorné smerovanie.",
      subtitleDesc: "Mindbanger Daily vám pomôže začať deň s jasnosťou, emočnou stabilitou a vedomým zameraním.",
      subtitleAuthor: "Vytvorené hypnoterapeutom a životným koučom Miroslavom Jobusom.",
      cta: "Začať členstvo"
    },
    dailyRitual: {
      title: "Čo získate každý deň v Mindbanger Daily",
      features: [
        { title: "Téma dňa", desc: "Jasné emočné a mentálne smerovanie pre nasledujúci deň." },
        { title: "Denný signál pre myseľ", desc: "Krátka vedená správa, ktorá pomôže resetovať vaše nastavenie zvnútra." },
        { title: "Dnešné zameranie", desc: "Jeden jednoduchý posun, ktorý si odnesiete do reálneho dňa." },
        { title: "Denná afirmácia", desc: "Posilňujúce vyhlásenie, ktoré pomáha ukotviť váš vnútorný stav." },
        { title: "Audio reset", desc: "Krátky hlasom vedený reset pre pokoj, sústredenie a spojenie so sebou." }
      ]
    },
    interactivePreview: {
      title: "Čo dnes potrebujete najviac?",
      options: [
        { keyword: "Jasnosť", desc: "Menej mentálneho hluku. Jeden skutočný smer." },
        { keyword: "Odvaha", desc: "Jeden úprimný krok dokáže zmeniť viac ako nekonečné premýšľanie." },
        { keyword: "Reset", desc: "Dnes je šanca zahodiť ťarchu včerajška." }
      ],
      buttonActive: "Začať váš denný reset",
      buttonInactive: "Začať váš denný reset",
      footerLine: "Čokoľvek vás pritiahne ako prvé, presne tam vaša myseľ často najviac potrebuje podporu."
    },
    howItWorks: {
      title: "Ako Mindbanger Daily funguje",
      steps: [
        { title: "1. Začnite svoje členstvo", desc: "Pridajte sa za necelú minútu a získajte okamžitý prístup k vášmu dennému rituálu." },
        { title: "2. Prijmite svoj denný signál", desc: "Každý deň prináša novú tému, krátky signál pre nastavenie mysle, zameranie, afirmáciu a audio reset." },
        { title: "3. Budujte si vnútorné smerovanie", desc: "S dôsledným každodenným používaním sa vaša myseľ stane pokojnejšou, jasnejšou a silnejšou." }
      ]
    },
    benefits: {
      title: "Mindbanger Daily je pre vás, ak chcete…",
      items: [
        "Začať deň s väčšou jasnosťou namiesto chaosu",
        "Utišiť premýšľanie a vnútorný tlak",
        "Cítiť sa pokojnejšie, sústredenejšie a uzemnenejšie",
        "Posilniť si nastavenie mysle jednoduchým denným spôsobom",
        "Spojiť sa opäť so sebou skôr, než vás strhne deň",
        "Kráčať životom s jasnejším vnútorným smerovaním"
      ]
    },
    vipZone: {
      title: "Vo vnútri Členskej Zóny",
      cards: [
        { title: "Dnes", desc: "Váš denný signál, zameranie, afirmácia a audio reset na jednom mieste." },
        { title: "Archív", desc: "Vráťte sa k minulým signálom kedykoľvek ich potrebujete." },
        { title: "Rýchle resety", desc: "Krátke vedené resety pre pokoj, sústredenie, spánok a emočný reset." },
        { title: "Začnite tu", desc: "Jednoduchý návod, ako získať z rituálu od prvého dňa to najlepšie." }
      ]
    },
    about: {
      badge: "Vytvoril Miroslav Jobus",
      role: "Hypnoterapeut, životný kouč a sprievodca mentálnym výkonom",
      quote1: "„Mindbanger Daily bol vytvorený pre ľudí, ktorí sa nechcú po dni len tak nevedome vlečieť.",
      quote2: "Je to jednoduchý denný rituál navrhnutý tak, aby vám pomohol vrátiť sa k sebe, ustáliť myseľ a napredovať s väčším zámerom.“",
      span1: "",
      span2: "",
      span3: "",
      span4: ""
    },
    pricing: {
      title1: "Jedno jednoduché členstvo.",
      title2: "Jeden silný denný rituál.",
      planName: "Mindbanger Daily",
      price: "€7.99",
      period: " / mesiac",
      vatExcluded: "DPH môže byť účtovaná na základe vašej krajiny.",
      subtitle: "Nízke mesačné náklady pre silnejšiu myseľ každý deň.",
      features: [
        "Denný signál pre myseľ",
        "Denné zameranie",
        "Denná afirmácia",
        "Denný audio reset",
        "Prístup do archívu",
        "Bonusové rýchle resety"
      ],
      cancelText: "Zrušte kedykoľvek. Žiadne dlhodobé záväzky.",
      cta: "Začať členstvo"
    },
    b2bCta: {
      title: "Prineste do svojho tímu pokoj, sústredenie a mentálnu odolnosť",
      desc: "Mindbanger for Teams pomáha firmám podporiť duševnú pohodu zamestnancov pomocou moderného denného resetu mysle navrhnutého na zníženie stresu, zlepšenie sústredenia a posilnenie odolnosti.",
      btn: "Objavte Mindbanger pre firmy"
    },
    faq: {
      title: "Otázky",
      faqs: [
        { q: "Čo presne dostanem každý deň?", a: "Každý deň dostanete tému, krátky signál na nastavenie mysle, jedno praktické zameranie, posilňujúcu afirmáciu a krátky audio reset." },
        { q: "Ide o meditačnú aplikáciu?", a: "Nie. Mindbanger Daily je sprevádzaný denný mentálny rituál pre jasnosť, pokoj a vnútorné smerovanie." },
        { q: "Ako dlho trvá denný rituál?", a: "Len niekoľko minút. Je navrhnutý tak, aby zapadol do skutočného každodenného života." },
        { q: "Môžem to kedykoľvek zrušiť?", a: "Áno. Svoje členstvo môžete kedykoľvek zrušiť." },
        { q: "Mám prístup k predchádzajúcim dňom?", a: "Áno. Členovia sa môžu cez archív kedykoľvek vrátiť k predošlým signálom." },
        { q: "Je obsah v angličtine?", a: "Áno. Angličtina je momentálne hlavná verzia. Vo vašom profile si ale môžete zvoliť rodný jazyk textov aj audia." },
        { q: "Pre koho je Mindbanger Daily určený?", a: "Je pre ľudí, ktorí chcú menej mentálneho chaosu, viac jasnosti a silnejšie vnútorné smerovanie v bežnom živote." },
        { q: "Ide o terapiu alebo lekársku liečbu?", a: "Nie. Mindbanger Daily je nástroj osobného rozvoja a duševnej psychohygieny. Nie je to náhrada terapie, diagnózy ani odbornej opatery." }
      ]
    },
    finalCta: {
      badge: "Nastavte svoju myseľ. Formujte svoj deň.",
      title1: "Nastavte svoju myseľ.",
      title2: "Formujte svoj deň.",
      quote: "„Niekoľko minút denne môže zmeniť spôsob, akým prechádzate všetkým ostatným.“",
      footer: "Začať Mindbanger Daily",
      cta: "Začať členstvo"
    }
  }
});

// --- CS UPDATES ---
updateDict('src/dictionaries/cs.json', {
  landing: {
    navbar: {
      joinSub: "Začít členství"
    },
    hero: {
      titlePart1: "Pokud si nenastavíte ",
      titleHighlight: "mysl,",
      titlePart2: " svět to udělá za vás.",
      subtitle: "Mindbanger Daily vám pomůže začít den s jasností, emoční stabilitou a vědomým zaměřením.",
      quote: "\"Způsob, jakým je vaše mysl nastavena, začíná formovat vaši realitu.\"",
      widgetTitle: "Dnešní Signál",
      widgetBadge: "Jasnost",
      widgetHeadline: "Zjednodušte si dnes jednu věc.",
      widgetQuote: "\"Nepotřebujete vyřešit vše. Potřebujete jeden jasný další krok.\"",
      widgetBtn: "Přehrát dnešní audio (ukázka)",
      widgetFooter: "Nový denní signál. Klidnější a silnější vnitřní směřování.",
      subtitleDesc: "Mindbanger Daily vám pomůže začít den s jasností, emoční stabilitou a vědomým zaměřením.",
      subtitleAuthor: "Vytvořeno hypnoterapeutem a životním koučem Miroslavem Jobusem.",
      cta: "Začít členství"
    },
    dailyRitual: {
      title: "Co získáte každý den v Mindbanger Daily",
      features: [
        { title: "Téma dne", desc: "Jasné emoční a mentální směřování pro následující den." },
        { title: "Denní signál pro mysl", desc: "Krátká vedená zpráva, která pomůže resetovat vaše nastavení zevnitř." },
        { title: "Dnešní zaměření", desc: "Jeden jednoduchý posun, který si odnesete do reálného dne." },
        { title: "Denní afirmace", desc: "Posilující prohlášení, které pomáhá ukotvit váš vnitřní stav." },
        { title: "Audio reset", desc: "Krátký hlasem vedený reset pro klid, soustředění a spojení se sebou." }
      ]
    },
    interactivePreview: {
      title: "Co dnes potřebujete nejvíce?",
      options: [
        { keyword: "Jasnost", desc: "Méně mentálního hluku. Jeden skutečný směr." },
        { keyword: "Odvaha", desc: "Jeden upřímný krok dokáže změnit víc než nekonečné přemýšlení." },
        { keyword: "Reset", desc: "Dnes je šance zahodit tíhu včerejška." }
      ],
      buttonActive: "Začít váš denní reset",
      buttonInactive: "Začít váš denní reset",
      footerLine: "Cokoliv vás přitáhne jako první, přesně tam vaše mysl často nejvíc potřebuje podporu."
    },
    howItWorks: {
      title: "Jak Mindbanger Daily funguje",
      steps: [
        { title: "1. Začněte své členství", desc: "Přidejte se za necelou minutu a získejte okamžitý přístup k vašemu dennímu rituálu." },
        { title: "2. Přijměte svůj denní signál", desc: "Každý den přináší novou tématu, krátký signál pro nastavení mysli, zaměření, afirmaci a audio reset." },
        { title: "3. Budujte si vnitřní směřování", desc: "S důsledným každodenním používáním se vaše mysl stane klidnější, jasnější a silnější." }
      ]
    },
    benefits: {
      title: "Mindbanger Daily je pro vás, pokud chcete…",
      items: [
        "Začít den s větší jasností namísto chaosu",
        "Utišit přemýšlení a vnitřní tlak",
        "Cítit se klidněji, soustředěněji a uzemněněji",
        "Posílit si nastavení mysli jednoduchým denním způsobem",
        "Spojit se opět se sebou dřív, než vás strhne den",
        "Kráčet životem s jasnějším vnitřním směřováním"
      ]
    },
    vipZone: {
      title: "Uvnitř Členské Zóny",
      cards: [
        { title: "Dnes", desc: "Váš denní signál, zaměření, afirmace a audio reset na jednom místě." },
        { title: "Archiv", desc: "Vraťte se k minulým signálům kdykoli je potřebujete." },
        { title: "Rychlé resety", desc: "Krátké vedené resety pro klid, soustředění, spánek a emoční reset." },
        { title: "Začněte zde", desc: "Jednoduchý návod, jak získat z rituálu od prvního dne to nejlepší." }
      ]
    },
    about: {
      badge: "Vytvořil Miroslav Jobus",
      role: "Hypnoterapeut, životní kouč a průvodce mentálním výkonem",
      quote1: "„Mindbanger Daily byl vytvořen pro lidi, kteří se nechtějí po dni jen tak nevědomě vlečt.",
      quote2: "Je to jednoduchý denní rituál navržený tak, aby vám pomohl vrátit se k sobě, ustálit mysl a postupovat s větším záměrem.“",
      span1: "",
      span2: "",
      span3: "",
      span4: ""
    },
    pricing: {
      title1: "Jedno jednoduché členství.",
      title2: "Jeden silný denní rituál.",
      planName: "Mindbanger Daily",
      price: "€7.99",
      period: " / měsíc",
      vatExcluded: "DPH může být účtována na základě vaší země.",
      subtitle: "Nízké měsíční náklady pro silnější mysl každý den.",
      features: [
        "Denní signál pro mysl",
        "Denní zaměření",
        "Denní afirmace",
        "Denní audio reset",
        "Přístup do archivu",
        "Bonusové rychlé resety"
      ],
      cancelText: "Zrušte kdykoli. Žádné dlouhodobé závazky.",
      cta: "Začít členství"
    },
    b2bCta: {
      title: "Přineste do svého týmu klid, soustředění a mentální odolnost",
      desc: "Mindbanger for Teams pomáhá firmám podpořit duševní pohodu zaměstnanců pomocí moderního denního resetu mysli navrženého ke snížení stresu, zlepšení soustředění a posílení odolnosti.",
      btn: "Objevte Mindbanger pro firmy"
    },
    faq: {
      title: "Otázky",
      faqs: [
        { q: "Co přesně dostanu každý den?", a: "Každý den dostanete téma, krátký signál k nastavení mysli, jedno praktické zaměření, posilující afirmaci a krátký audio reset." },
        { q: "Jedná se o meditační aplikaci?", a: "Ne. Mindbanger Daily je doprovázený denní mentální rituál pro jasnost, klid a vnitřní směřování." },
        { q: "Jak dlouho trvá denní rituál?", a: "Jen několik minut. Je navržen tak, aby zapadl do skutečného každodenního života." },
        { q: "Mohu to kdykoli zrušit?", a: "Ano. Své členství můžete kdykoli zrušit." },
        { q: "Mám přístup k předchozím dnům?", a: "Ano. Členové se mohou přes archiv kdykoli vrátit k předešlým signálům." },
        { q: "Je obsah v angličtině?", a: "Ano. Angličtina je momentálně hlavní verze. Ve vašem profilu si však můžete zvolit rodný jazyk textů i audia." },
        { q: "Pro koho je Mindbanger Daily určen?", a: "Je pro lidi, kteří chtějí méně mentálního chaosu, více jasnosti a silnější vnitřní směřování v běžném životě." },
        { q: "Jedná se o terapii nebo lékařskou léčbu?", a: "Ne. Mindbanger Daily je nástroj osobního rozvoje a duševní psychohygieny. Není to náhrada terapie, diagnózy ani odborné péče." }
      ]
    },
    finalCta: {
      badge: "Nastavte svou mysl. Formujte svůj den.",
      title1: "Nastavte svou mysl.",
      title2: "Formujte svůj den.",
      quote: "„Několik minut denně může změnit způsob, jakým procházíte vším ostatním.“",
      footer: "Začít Mindbanger Daily",
      cta: "Začít členství"
    }
  }
});

console.log("Dictionary update logic complete.");
