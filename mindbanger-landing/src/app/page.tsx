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
import { LanguageProvider } from '@/components/LanguageProvider';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('user-lang')?.value || 'en';
  
  let dict = {};
  try {
    const dictPath = path.join(process.cwd(), 'src/dictionaries', lang + '.json');
    dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  } catch (e) {
    try {
      const fallbackPath = path.join(process.cwd(), 'src/dictionaries', 'en.json');
      dict = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    } catch(err) {}
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
      </main>
    </LanguageProvider>
  );
}
