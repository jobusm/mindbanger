"use client";
import React, { useState } from "react";
import SignalsManager from "./SignalsManager";
import SubscriptionsManager from "./SubscriptionsManager";
import ResetsManager from "./ResetsManager";
import { Radio, Users, RefreshCw } from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'signals' | 'subscriptions' | 'resets'>('signals');

  return (
    <>
      <div className="flex border-b border-white/10 mb-2 space-x-8">
        <button
          onClick={() => setActiveTab('signals')}
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors ${
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
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors ${
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
          className={`pb-4 flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === 'subscriptions' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users size={20} />
          <span className="font-medium">Predplatné & Užívatelia</span>
        </button>
      </div>

      {activeTab === 'signals' && <SignalsManager />}
      {activeTab === 'resets' && <ResetsManager />}
      {activeTab === 'subscriptions' && <SubscriptionsManager />}
    </>
  );
}
