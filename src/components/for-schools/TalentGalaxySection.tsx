/* eslint-disable react/no-unescaped-entities */
"use client";

import { Sparkles, Compass, Eye, Calculator, MessageSquareCode, Network } from "lucide-react";

export default function TalentGalaxySection() {
  const domains = [
    {
      name: "Logical Reasoning",
      icon: Network,
      color: "text-blue-600 border-blue-200 bg-blue-50/60",
      desc: "Deductive & inductive logic, cause-effect relationship analysis."
    },
    {
      name: "Spatial Analysis",
      icon: Compass,
      color: "text-indigo-600 border-indigo-200 bg-indigo-50/60",
      desc: "3D geometry rotation, visual orientation, and structural visualization."
    },
    {
      name: "Pattern Recognition",
      icon: Eye,
      color: "text-emerald-600 border-emerald-200 bg-emerald-50/60",
      desc: "Identifying sequences, matrix trends, and abstract visual patterns."
    },
    {
      name: "Numerical Logic",
      icon: Calculator,
      color: "text-amber-600 border-amber-200 bg-amber-50/60",
      desc: "Conceptual mathematical reasoning beyond standard formulaic memory."
    },
    {
      name: "Verbal & Analytical",
      icon: MessageSquareCode,
      color: "text-purple-600 border-purple-200 bg-purple-50/60",
      desc: "Contextual comprehension, statement evaluation, and critical reading."
    }
  ];

  return (
    <section className="bg-white text-slate-900 py-16 md:py-20 px-6 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800 mb-3">
            <Sparkles size={14} className="text-amber-600" /> Aptitude Constellation Framework
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-1">
            Mapping Student Cognitive Aptitude
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-2 leading-relaxed">
            Standard examinations test memory retention under time pressure. CNTS evaluates 5 interconnected dimensions of core cognitive ability.
          </p>
        </div>

        {/* Light Constellation Canvas Stage */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column - SVG Constellation Vector Web */}
            <div className="lg:col-span-6 relative h-64 md:h-80 flex items-center justify-center bg-white rounded-2xl border border-slate-200 p-4">
              <svg viewBox="0 0 400 300" className="w-full h-full text-blue-600">
                <line x1="200" y1="50" x2="80" y2="150" stroke="#1E40AF" strokeWidth="1.5" opacity="0.3" />
                <line x1="200" y1="50" x2="320" y2="150" stroke="#1E40AF" strokeWidth="1.5" opacity="0.3" />
                <line x1="80" y1="150" x2="130" y2="250" stroke="#1E40AF" strokeWidth="1.5" opacity="0.3" />
                <line x1="320" y1="150" x2="270" y2="250" stroke="#1E40AF" strokeWidth="1.5" opacity="0.3" />
                <line x1="130" y1="250" x2="270" y2="250" stroke="#1E40AF" strokeWidth="1.5" opacity="0.3" />
                <line x1="200" y1="50" x2="200" y2="170" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                {/* Node 1: Logical Reasoning */}
                <g transform="translate(200, 50)">
                  <circle r="7" fill="#1E40AF" />
                  <circle r="14" fill="#1E40AF" opacity="0.2" className="animate-ping" />
                  <text x="0" y="-14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F172A">Logical Reasoning</text>
                </g>

                {/* Node 2: Numerical Logic */}
                <g transform="translate(80, 150)">
                  <circle r="6" fill="#F59E0B" />
                  <text x="-12" y="20" fontSize="10" fontWeight="bold" fill="#334155">Numerical</text>
                </g>

                {/* Node 3: Spatial Analysis */}
                <g transform="translate(320, 150)">
                  <circle r="6" fill="#4F46E5" />
                  <text x="-10" y="20" fontSize="10" fontWeight="bold" fill="#334155">Spatial</text>
                </g>

                {/* Node 4: Pattern Recognition */}
                <g transform="translate(130, 250)">
                  <circle r="6" fill="#10B981" />
                  <text x="-25" y="20" fontSize="10" fontWeight="bold" fill="#334155">Pattern Match</text>
                </g>

                {/* Node 5: Verbal & Analytical */}
                <g transform="translate(270, 250)">
                  <circle r="6" fill="#9333EA" />
                  <text x="-15" y="20" fontSize="10" fontWeight="bold" fill="#334155">Verbal Aptitude</text>
                </g>

                {/* Center Core */}
                <g transform="translate(200, 170)">
                  <circle r="5" fill="#10B981" />
                  <text x="0" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#10B981">Cognitive Synthesis</text>
                </g>
              </svg>
            </div>

            {/* Right Column - 5 Domain Breakdown Cards */}
            <div className="lg:col-span-6 space-y-2.5 text-left">
              {domains.map((dom) => (
                <div key={dom.name} className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${dom.color}`}>
                  <dom.icon size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs md:text-sm mb-0.5">{dom.name}</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{dom.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
