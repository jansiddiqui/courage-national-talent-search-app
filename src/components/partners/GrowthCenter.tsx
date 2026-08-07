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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-indigo-600" /> Growth & Tools Suite
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              AI Viral Studio & Payment Rules
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Generate AI-powered promotional content and review your honorarium policy details.
            </p>
          </div>

          {/* SUB TAB SWITCHER */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 font-bold text-xs shrink-0 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveSubTab('aistudio')}
              className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'aistudio'
                  ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> AI Studio
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                activeSubTab === 'aistudio' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>AI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('rules')}
              className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'rules'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Payment Rules
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
