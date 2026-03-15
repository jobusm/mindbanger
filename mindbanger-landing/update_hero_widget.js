const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

content = content.replace(
  /<span>Today\'s Signal<\/span>/,
  "<span>{dict?.landing?.hero?.widgetTitle || \"Today's Signal\"}</span>"
);

content = content.replace(
  /Clarity<\/span>/,
  "{dict?.landing?.hero?.widgetBadge || 'Clarity'}</span>"
);

content = content.replace(
  /Simplify one thing today<\/h3>/,
  "{dict?.landing?.hero?.widgetHeadline || 'Simplify one thing today'}</h3>"
);

content = content.replace(
  /\"I return to clarity by returning to myself\.\"/,
  "{dict?.landing?.hero?.widgetQuote || '\"I return to clarity by returning to myself.\"'}"
);

content = content.replace(
  /Play Today\â€™s Audio/,
  "{dict?.landing?.hero?.widgetBtn || 'Play Today’s Audio'}"
);
content = content.replace(
  /Play Today\'s Audio/,
  "{dict?.landing?.hero?.widgetBtn || 'Play Today’s Audio'}"
);
content = content.replace(
  /Play Today’s Audio/,
  "{dict?.landing?.hero?.widgetBtn || 'Play Today’s Audio'}"
);

content = content.replace(
  /A new signal every day\. <br\/> A stronger inner direction over time\./,
  "{dict?.landing?.hero?.widgetFooter || 'A new signal every day. <br/> A stronger inner direction over time.'}"
);

fs.writeFileSync('src/components/HeroSection.tsx', content);
console.log('HeroSection widget text updated!');
