import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DailyRitualSection from '@/components/DailyRitualSection';
import InteractivePreviewSection from '@/components/InteractivePreviewSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import BenefitsSection from '@/components/BenefitsSection';
import VIPZonePreviewSection from '@/components/VIPZonePreviewSection';
import AboutTrustSection from '@/components/AboutTrustSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { LanguageProvider } from '@/components/LanguageProvider';
import { cookies, headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

export default async function Home(props: any) {
  const searchParams = await (props?.searchParams || Promise.resolve({}));
  const headersList = await headers();
  const country = typeof searchParams.country === "string" ? searchParams.country : (headersList.get("x-vercel-ip-country") || "SK");

  const cookieStore = await cookies();
  const lang = cookieStore.get('user-lang')?.value || 'en';
  
  let dict: any = {};
  try {
    const dictPath = path.join(process.cwd(), 'src/dictionaries', lang + '.json');
    dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  } catch (e) {
    try {
      const fallbackPath = path.join(process.cwd(), 'src/dictionaries', 'en.json');
      dict = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    } catch(err) {}
  }

  // Dynamic Pricing Logic based on Geo-Location
  let dynamicPrice = '7,99€'; // Default to EUR
  
  if (country === 'GB' || country === 'UK') {
    dynamicPrice = '£7.99';
  } else if (!['AT', 'BE', 'HR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'].includes(country)) {
    // If not in UK and not in EU... make it USD
    dynamicPrice = '$8.99';
  }

  if (dict?.landing?.pricing) {
    dict.landing.pricing.price = dynamicPrice;
  }

  return (
    <LanguageProvider dict={dict}>
      <main className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30 selection:text-amber-100">
        <Navbar />
        <HeroSection />
        <DailyRitualSection />
        <InteractivePreviewSection />
        <HowItWorksSection />
        <BenefitsSection />
        <VIPZonePreviewSection />
        <AboutTrustSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
        <Footer />
        {dict.cookieBanner && <CookieBanner dict={dict.cookieBanner} />}
      </main>
    </LanguageProvider>
  );
}
