"use client";
import React, { useState } from "react";
import SignalsManager from "./SignalsManager";
import OnboardingManager from "./OnboardingManager";
import SubscriptionsManager from "./SubscriptionsManager";
import ResetsManager from "@/components/admin/ResetsManager";
import AffiliateManager from "./AffiliateManager";
import PayoutsManager from "./PayoutsManager";
import B2BManager from "./B2BManager";
import MessagesManager from "@/components/admin/MessagesManager";
import { Radio, Users, RefreshCw, Megaphone, DollarSign, Rocket, Briefcase, MessageSquare } from "lucide-react";
import HealthCheckWidget from "@/components/admin/HealthCheckWidget";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'signals' | 'onboarding' | 'subscriptions' | 'resets' | 'affiliate' | 'payouts' | 'b2b' | 'messages'>('signals');

  return (
    <>
      <HealthCheckWidget />
      <div className="flex border-b border-white/10 mb-6 space-x-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('signals')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'signals' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Radio size={20} />
          <span className="font-medium">Denné Signály</span>
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'onboarding' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Rocket size={20} />
          <span className="font-medium">Onboarding (Prvých 7 dní)</span>
        </button>
        <button
          onClick={() => setActiveTab('resets')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'resets' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <RefreshCw size={20} />
          <span className="font-medium">Manažér Resetov</span>
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'subscriptions' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users size={20} />
          <span className="font-medium">Predplatné & Užívatelia</span>
        </button>
        <button
          onClick={() => setActiveTab('affiliate')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'affiliate'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone size={20} />
          <span className="font-medium">Affiliate & Promo</span>
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'payouts'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign size={20} />
          <span className="font-medium">Žiadosti o Výplatu</span>
        </button>
        <button
          onClick={() => setActiveTab('b2b')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'b2b'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase size={20} />
          <span className="font-medium">B2B Klienti</span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'messages'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare size={20} />
          <span className="font-medium">Správy</span>
        </button>
      </div>

      {activeTab === 'signals' && <SignalsManager />}
      {activeTab === 'onboarding' && <OnboardingManager />}
      {activeTab === 'resets' && <ResetsManager />}
      {activeTab === 'subscriptions' && <SubscriptionsManager />}
      {activeTab === 'affiliate' && <AffiliateManager />}
      {activeTab === 'payouts' && <PayoutsManager />}
      {activeTab === 'b2b' && <B2BManager />}
      {activeTab === 'messages' && <MessagesManager />}
    </>
  );
}

// trigger ts server update
