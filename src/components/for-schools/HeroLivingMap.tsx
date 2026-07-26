/* eslint-disable react/no-unescaped-entities */
"use client";

import { Building, ArrowRight, Download, ShieldCheck, MapPin, PhoneCall } from "lucide-react";

export default function HeroLivingMap() {
  return (
    <section className="bg-[#050B18] text-white pt-8 pb-20 px-6 relative overflow-hidden border-b border-slate-800">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-10">
          
          {/* Official Cohort Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-950/80 border border-blue-800/80 rounded-full text-xs font-bold text-blue-300 mb-6 shadow-inner">
            <Building size={14} className="text-blue-400" />
            <span>Official Institutional Partnership Cohort — 2026 Academic Session</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-6 leading-tight">
            Discover Potential Beyond Marks: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              CNTS 2026: India's National Academic Network
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mx-auto mb-8">
            An invitation to Indian school leaders to evaluate student cognitive intelligence, logical reasoning, and conceptual understanding in Classes 5–8 at zero administrative cost.
          </p>

          {/* Dual Action Dock Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href="#inquiry-form"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl text-base flex items-center gap-2 shadow-lg shadow-blue-900/40 hover:shadow-blue-600/50 transition-all hover:-translate-y-0.5 active:translate-y-0 min-h-[50px]"
            >
              Request Founding Partner Kit <ArrowRight size={18} />
            </a>
            <a
              href="#official-documents"
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold py-4 px-8 rounded-xl text-base flex items-center gap-2 transition-all min-h-[50px]"
            >
              <Download size={18} className="text-slate-400" /> Access Official Documents
            </a>
          </div>

          {/* Human Reassurance Note */}
          <div className="inline-flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-sm">
            <ShieldCheck size={16} className="text-blue-400 shrink-0" />
            <span>Every partnership request is personally reviewed by the CNTS Academic Partnerships Team.</span>
          </div>

        </div>

        {/* Living Vector India Map Visualization Stage */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-10 relative overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">Interactive Geographic Footprint</span>
              <h3 className="text-lg md:text-xl font-display font-bold text-white mt-0.5">
                Regional Coordination Hubs &amp; Board Coverage
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span> Metros</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Regional Hubs</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative h-80 md:h-[420px] w-full flex items-center justify-center bg-[#070E22] rounded-2xl border border-slate-800/80 p-4">
            <svg viewBox="0 0 500 550" className="w-full h-full text-blue-500 fill-current">
              {/* Detailed India Map Paths */}
              <path d="M 230,50 Q 250,30 270,50 T 290,90 T 320,120 T 380,150 T 420,180 T 410,230 T 360,260 T 310,290 T 270,350 T 220,430 T 200,480 T 180,430 T 160,350 T 130,290 T 100,240 T 110,180 T 140,130 T 190,80 Z" opacity="0.18" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M 220,60 Q 240,40 260,60 T 280,100 T 310,130 T 370,160 T 400,190 T 390,230 T 350,260 T 300,290 T 260,340 T 210,410 T 195,460 T 180,410 T 160,340 T 135,290 T 115,240 T 120,190 T 150,140 T 190,90 Z" opacity="0.08" />
              
              {/* Andaman & Nicobar Islands */}
              <g transform="translate(420, 420)">
                <circle r="3" fill="#3B82F6" opacity="0.6" />
                <circle r="3" cy="12" fill="#3B82F6" opacity="0.6" />
                <circle r="3" cy="24" fill="#3B82F6" opacity="0.6" />
                <text x="10" y="15" fontSize="8" fill="#94A3B8">A&amp;N Islands</text>
              </g>

              {/* Lakshadweep Islands */}
              <g transform="translate(110, 420)">
                <circle r="3" fill="#3B82F6" opacity="0.6" />
                <circle r="3" cy="10" fill="#3B82F6" opacity="0.6" />
                <text x="-55" y="8" fontSize="8" fill="#94A3B8">Lakshadweep</text>
              </g>

              {/* North-East Hub Node */}
              <g transform="translate(410, 180)">
                <circle r="6" fill="#10B981" />
                <circle r="12" fill="#10B981" opacity="0.25" className="animate-ping" />
                <text x="14" y="4" fontSize="10" fontWeight="bold" fill="#F8FAFC">Guwahati Hub</text>
              </g>

              {/* Regional Coordination Hub Nodes */}
              <g transform="translate(210, 160)">
                <circle r="8" fill="#3B82F6" />
                <circle r="16" fill="#3B82F6" opacity="0.3" className="animate-ping" />
                <text x="14" y="4" fontSize="11" fontWeight="bold" fill="#FFFFFF">Delhi-NCR Hub</text>
              </g>

              <g transform="translate(150, 310)">
                <circle r="8" fill="#3B82F6" />
                <circle r="16" fill="#3B82F6" opacity="0.3" className="animate-ping" style={{ animationDelay: '0.5s' }} />
                <text x="14" y="4" fontSize="11" fontWeight="bold" fill="#FFFFFF">Mumbai Hub</text>
              </g>

              <g transform="translate(195, 410)">
                <circle r="9" fill="#10B981" />
                <circle r="18" fill="#10B981" opacity="0.35" className="animate-ping" style={{ animationDelay: '1s' }} />
                <text x="14" y="4" fontSize="11" fontWeight="bold" fill="#FFFFFF">Bengaluru Hub</text>
              </g>

              <g transform="translate(340, 250)">
                <circle r="8" fill="#3B82F6" />
                <circle r="16" fill="#3B82F6" opacity="0.3" className="animate-ping" style={{ animationDelay: '0.7s' }} />
                <text x="-75" y="4" fontSize="11" fontWeight="bold" fill="#FFFFFF">Kolkata Hub</text>
              </g>

              <g transform="translate(225, 330)">
                <circle r="7" fill="#3B82F6" />
                <text x="12" y="4" fontSize="10" fontWeight="bold" fill="#E2E8F0">Hyderabad Hub</text>
              </g>

              <g transform="translate(165, 325)">
                <circle r="6" fill="#F59E0B" />
                <text x="-55" y="14" fontSize="9" fill="#CBD5E1">Pune Hub</text>
              </g>

              <g transform="translate(190, 130)">
                <circle r="6" fill="#F59E0B" />
                <text x="-70" y="2" fontSize="9" fill="#CBD5E1">Chandigarh</text>
              </g>

              <g transform="translate(280, 210)">
                <circle r="6" fill="#F59E0B" />
                <text x="10" y="2" fontSize="9" fill="#CBD5E1">Patna Hub</text>
              </g>

              <g transform="translate(195, 460)">
                <circle r="6" fill="#F59E0B" />
                <text x="10" y="2" fontSize="9" fill="#CBD5E1">Kochi Hub</text>
              </g>

              {/* Connecting Flow Lines */}
              <line x1="210" y1="160" x2="150" y2="310" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <line x1="210" y1="160" x2="340" y2="250" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <line x1="150" y1="310" x2="195" y2="410" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <line x1="225" y1="330" x2="195" y2="410" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
              <line x1="340" y1="250" x2="410" y2="180" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            </svg>
          </div>

          {/* Factual Coverage Matrix Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-left text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin size={16} className="text-blue-400 shrink-0" />
              <span><strong>28 States &amp; 8 UTs</strong> Supported</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Building size={16} className="text-emerald-400 shrink-0" />
              <span><strong>Urban &amp; Rural</strong> School Access</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <ShieldCheck size={16} className="text-blue-400 shrink-0" />
              <span><strong>CBSE, ICSE, State &amp; IB</strong> Boards</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <PhoneCall size={16} className="text-amber-400 shrink-0" />
              <span><strong>Regional Support Officers</strong> Assigned</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
