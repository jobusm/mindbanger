'use client';

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

export default function Home() {
  return (
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
  );
}
