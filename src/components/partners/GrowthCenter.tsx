'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Target 
} from 'lucide-react';
import { PartnerReputationAndAnalytics } from './PartnerReputationAndAnalytics';
import { AIStudio } from './AIStudio';
import { PaymentRulesTab } from './PaymentRulesTab';

interface GrowthCenterProps {
  audienceScale?: string;
}

export const GrowthCenter: React.FC<GrowthCenterProps> = ({ audienceScale }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tiers' | 'aistudio' | 'rules'>('tiers');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SUB-NAVBAR HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-2 border border-indigo-100">
            <Zap className="w-3.5 h-3.5" /> Partner Growth & Tools Suite
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Growth, Tiers & AI Viral Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your mobilization tier badge, generate AI promotional copy, and review honorarium policies.
          </p>
        </div>

        {/* SUB TAB SELECTOR */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 font-bold text-xs">
          <button
            onClick={() => setActiveSubTab('tiers')}
            className={`py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'tiers' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-500" /> Tiers & Badges
          </button>
          
          <button
            onClick={() => setActiveSubTab('aistudio')}
            className={`py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'aistudio' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-indigo-600" /> AI Studio
          </button>

          <button
            onClick={() => setActiveSubTab('rules')}
            className={`py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'rules' ? 'bg-white text-indigo-950 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Payment Rules
          </button>
        </div>
      </div>

      {/* SUB-TAB CONTENTS */}
      <div>
        {activeSubTab === 'tiers' && <PartnerReputationAndAnalytics />}
        {activeSubTab === 'aistudio' && <AIStudio />}
        {activeSubTab === 'rules' && <PaymentRulesTab audienceScale={audienceScale} />}
      </div>
    </div>
  );
};
