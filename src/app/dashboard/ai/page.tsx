"use client";

import { usePortal } from "@/contexts/PortalContext";
import { Sparkles, MessageSquare, Bot, HelpCircle, Lock, BookOpen } from "lucide-react";

export default function AiPage() {
  const { activeCandidate } = usePortal();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">AI Assistant</h1>
        <p className="text-slate-500 text-sm mt-1">Smart learning recommendations and query resolution</p>
      </div>

      {/* Coming Soon Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden text-center space-y-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles size={28} className="text-indigo-300" />
          </div>
          <h2 className="font-display font-bold text-2xl">Cognitive AI Guide</h2>
          <p className="text-blue-200 text-xs mt-1 max-w-md mx-auto leading-relaxed">
            We're building an AI-powered assistant to help interpret performance profiles, explain specific assessment questions, and recommend tailored child learning pathways.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-indigo-200 rounded-full text-[10px] font-bold uppercase tracking-wide">
          <Lock size={12} /> Coming Soon
        </div>
      </div>

      {/* Planned capabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Bot, title: "Report Interpretation", desc: "Interact with AI to understand cognitive bar charts and learning metrics." },
          { icon: HelpCircle, title: "Explain Questions", desc: "Step-by-step guidance on sample questions and logical practice items." },
          { icon: BookOpen, title: "Study Recommendations", desc: "Tailored daily schedules and worksheets based on weak areas." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <div className="w-9 h-9 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Icon size={17} />
            </div>
            <h3 className="text-xs font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
