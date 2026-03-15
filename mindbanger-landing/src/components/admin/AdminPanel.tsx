"use client";
import React, { useState } from "react";
import SignalsManager from "./SignalsManager";
import SubscriptionsManager from "./SubscriptionsManager";
import ResetsManager from "./ResetsManager";
import AffiliateManager from "./AffiliateManager";
import { Radio, Users, RefreshCw, Megaphone } from "lucide-react";
import HealthCheckWidget from "./HealthCheckWidget";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'signals' | 'subscriptions' | 'resets' | 'affiliate'>('signals');

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
      </div>

      {activeTab === 'signals' && <SignalsManager />}
      {activeTab === 'resets' && <ResetsManager />}
      {activeTab === 'subscriptions' && <SubscriptionsManager />}
      {activeTab === 'affiliate' && <AffiliateManager />}
    </>
  );
}
