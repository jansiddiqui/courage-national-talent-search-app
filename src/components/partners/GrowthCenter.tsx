'use client';

import React, { useState } from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { AIStudio } from './AIStudio';
import { PaymentRulesTab } from './PaymentRulesTab';

interface GrowthCenterProps {
  audienceScale?: string;
  referralCode?: string;
  partnerName?: string;
}

export const GrowthCenter: React.FC<GrowthCenterProps> = ({
  audienceScale,
  referralCode = 'CNTSJN',
  partnerName = 'Jan Mohammad',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'aistudio' | 'rules'>('aistudio');

  return (
    <div className="space-y-8 animate-fade-in">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-3 py-1 rounded-full mb-2">
              <Zap className="w-3.5 h-3.5" /> Growth & Tools Suite
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              AI Viral Studio & Payment Rules
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Generate AI-powered promotional content and review your honorarium policy details.
            </p>
          </div>

          {/* SUB TAB SWITCHER */}
          <div className="flex bg-slate-800/80 border border-slate-700 p-1.5 rounded-2xl gap-1 font-bold text-xs shrink-0">
            <button
              onClick={() => setActiveSubTab('aistudio')}
              className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'aistudio'
                  ? 'bg-indigo-600 text-white shadow-lg font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Zap className="w-4 h-4" /> AI Studio
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                activeSubTab === 'aistudio' ? 'bg-white/20 text-white' : 'bg-amber-400/20 text-amber-300'
              }`}>AI</span>
            </button>

            <button
              onClick={() => setActiveSubTab('rules')}
              className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'rules'
                  ? 'bg-emerald-600 text-white shadow-lg font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Payment Rules
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB CONTENTS */}
      <div>
        {activeSubTab === 'aistudio' && (
          <AIStudio
            referralCode={referralCode}
            partnerName={partnerName}
            audienceScale={audienceScale}
          />
        )}
        {activeSubTab === 'rules' && (
          <PaymentRulesTab audienceScale={audienceScale} />
        )}
      </div>
    </div>
  );
};
