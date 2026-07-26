import { Globe2, GraduationCap, Building2, Languages, MonitorCheck, ShieldCheck, Award, PhoneCall, Zap } from "lucide-react";
import InteractiveIndiaMap from "./InteractiveIndiaMap";

export default function NationalMapSection() {
  return (
    <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-200 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">National Outreach</span>
          <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-slate-900 mt-1">
            A national initiative built for schools across India
          </h2>
          <p className="text-slate-600 text-xs md:text-sm mt-2">
            Supporting participating schools across urban centers, rural districts, government systems, and private boards.
          </p>
        </div>

        {/* Combined Map + Executive Infographic Dashboard Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm">
          
          {/* Left Column: Interactive Vector SVG Map Base Layer */}
          <div className="lg:col-span-7">
            <InteractiveIndiaMap />
          </div>

          {/* Right Column: Executive Infographic Panel */}
          <div className="lg:col-span-5 text-left space-y-4">
            
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                National Network Scale
              </span>
              <h3 className="font-display font-bold text-slate-900 text-base md:text-lg mt-1.5">
                Executive Reach Overview
              </h3>
            </div>

            {/* 2x3 Metric Infographic Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Metric 1: States & UTs */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-display font-extrabold text-blue-700">28 &amp; 8</span>
                  <Globe2 size={18} className="text-blue-600 shrink-0" />
                </div>
                <strong className="text-slate-900 text-xs font-bold block">States &amp; UTs</strong>
                <span className="text-slate-500 text-[10px] leading-tight">Pan-India coverage</span>
              </div>

              {/* Metric 2: Classes */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-display font-extrabold text-slate-900">5–8</span>
                  <GraduationCap size={18} className="text-slate-700 shrink-0" />
                </div>
                <strong className="text-slate-900 text-xs font-bold block">Target Cohort</strong>
                <span className="text-slate-500 text-[10px] leading-tight">Classes 5, 6, 7 &amp; 8</span>
              </div>

              {/* Metric 3: Affiliation Boards */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-display font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    CBSE · ICSE · State
                  </span>
                  <Building2 size={18} className="text-emerald-600 shrink-0" />
                </div>
                <strong className="text-slate-900 text-xs font-bold block">All School Boards</strong>
                <span className="text-slate-500 text-[10px] leading-tight">Universal syllabus alignment</span>
              </div>

              {/* Metric 4: Languages */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-display font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    English &amp; Hindi
                  </span>
                  <Languages size={18} className="text-indigo-600 shrink-0" />
                </div>
                <strong className="text-slate-900 text-xs font-bold block">Bilingual Medium</strong>
                <span className="text-slate-500 text-[10px] leading-tight">Dual language option</span>
              </div>

              {/* Metric 5: Online Format */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-display font-extrabold text-emerald-700">100%</span>
                  <MonitorCheck size={18} className="text-emerald-600 shrink-0" />
                </div>
                <strong className="text-slate-900 text-xs font-bold block">Online Testing</strong>
                <span className="text-slate-500 text-[10px] leading-tight">Automated computer lab delivery</span>
              </div>

              {/* Metric 6: Security */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-display font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    DPDP Act
                  </span>
                  <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                </div>
                <strong className="text-slate-900 text-xs font-bold block">AI Proctoring</strong>
                <span className="text-slate-500 text-[10px] leading-tight">Secure session encryption</span>
              </div>

            </div>

          </div>

        </div>

        {/* Executive Footnote Assurance Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 text-left">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <Award size={18} />
            </div>
            <div>
              <strong className="text-slate-900 text-xs font-bold block">National Digital Certificates</strong>
              <span className="text-slate-500 text-[10px]">Verifiable student &amp; school honors</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <PhoneCall size={18} />
            </div>
            <div>
              <strong className="text-slate-900 text-xs font-bold block">Dedicated Support Officer</strong>
              <span className="text-slate-500 text-[10px]">Assigned relationship lead for your school</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <strong className="text-slate-900 text-xs font-bold block">Zero Financial Load</strong>
              <span className="text-slate-500 text-[10px]">Fully funded testing lab infrastructure</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
