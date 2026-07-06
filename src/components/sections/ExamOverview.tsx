"use client";

import { useState } from "react";
import { Clock, BookOpen, Monitor, CalendarDays, FileQuestion, Languages, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TIMELINE_LABELS } from "@/config/timeline";
import { 
  EXAM_DOMAINS, 
  EXAM_MODE,
  SUB_JUNIOR_QUESTIONS,
  JUNIOR_QUESTIONS,
  SUB_JUNIOR_DURATION,
  JUNIOR_DURATION
} from "@/config/exam";

const subjects = [
  { name: EXAM_DOMAINS[0].name, topics: "Logical Reasoning, Analogy, Series, Spatial Pattern", weight: "25%" },
  { name: EXAM_DOMAINS[1].name, topics: "Conceptual Arithmetic, Number Logic, Patterns", weight: "25%" },
  { name: EXAM_DOMAINS[2].name, topics: "Reading Comprehension, Vocabulary, Sentence Logic", weight: "25%" },
  { name: EXAM_DOMAINS[3].name, topics: "Critical Reasoning, Cause & Effect, Information Synthesis", weight: "25%" },
];

const getExamCards = () => [
  { icon: FileQuestion, label: "Total Questions", value: `${SUB_JUNIOR_QUESTIONS} / ${JUNIOR_QUESTIONS} MCQs`, color: "text-blue-700 bg-gradient-to-br from-blue-50 to-blue-100/50" },
  { icon: Clock, label: "Duration", value: `${SUB_JUNIOR_DURATION} / ${JUNIOR_DURATION}`, color: "text-indigo-700 bg-gradient-to-br from-indigo-50 to-indigo-100/50" },
  { icon: Languages, label: "Medium", value: "Hindi & English", color: "text-sky-700 bg-gradient-to-br from-sky-50 to-sky-100/50" },
  { icon: Monitor, label: "Mode", value: EXAM_MODE, color: "text-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-100/30" },
  { icon: CalendarDays, label: "Exam Date", value: TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', ''), color: "text-cyan-700 bg-gradient-to-br from-cyan-50 to-cyan-100/50" },
  { icon: BookOpen, label: "Eligible Classes", value: "5, 6, 7 & 8", color: "text-slate-700 bg-gradient-to-br from-slate-100 to-slate-200/50" },
];

export default function ExamOverview() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const examCards = getExamCards();
  
  // Dashboard-focused blue color schemes for each subject
  const subjectColors = [
    { bar: "bg-blue-600", stroke: "#2563EB", fillClass: "fill-blue-600", borderClass: "border-l-blue-600", bgHover: "from-blue-50/30", short: "Reasoning" },
    { bar: "bg-indigo-600", stroke: "#4F46E5", fillClass: "fill-indigo-600", borderClass: "border-l-indigo-600", bgHover: "from-indigo-50/30", short: "Analysis" },
    { bar: "bg-sky-500", stroke: "#0EA5E9", fillClass: "fill-sky-500", borderClass: "border-l-sky-500", bgHover: "from-sky-50/30", short: "Language" },
    { bar: "bg-cyan-500", stroke: "#06B6D4", fillClass: "fill-cyan-500", borderClass: "border-l-cyan-500", bgHover: "from-cyan-50/30", short: "Aptitude" },
  ];

  // Midpoint coordinates for labeling 25% on each of the 4 quadrants of the donut chart
  const percentLabelCoords = [
    { x: 105.35, y: 34.65 },  // Top-Right Segment center (-45 deg)
    { x: 105.35, y: 105.35 }, // Bottom-Right Segment center (45 deg)
    { x: 34.65, y: 105.35 },  // Bottom-Left Segment center (135 deg)
    { x: 34.65, y: 34.65 }    // Top-Left Segment center (225 deg)
  ];

  return (
    <section id="exam" className="py-10 md:py-14 lg:py-16 mesh-bg">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Exam Overview
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Thoughtfully designed.
            <br />
            <span className="gradient-text">Fairly evaluated.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            CNTS maps every question to a specific cognitive parameter to discover your child&apos;s potential.
          </p>
        </div>

        {/* 6 Key Specification Cards on Top */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 items-stretch">
          {examCards.map((card) => (
            <div 
              key={card.label} 
              className="bg-gradient-to-b from-white to-slate-50/20 hover:to-slate-50/50 border border-slate-200/60 hover:border-blue-400/50 p-4 rounded-2xl flex flex-col justify-between min-h-[105px] h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group card-glow"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 truncate">
                  {card.label}
                </span>
                <div className={`w-7 h-7 rounded-lg ${card.color} flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover:scale-105`}>
                  <card.icon size={13} className="stroke-[2.5]" />
                </div>
              </div>
              <div className="font-display font-extrabold text-slate-800 text-xs md:text-sm mt-3 leading-tight">
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Panel: Syllabus & Circular Chart */}
        <div className="bg-white rounded-[32px] border border-slate-200/70 shadow-xl shadow-slate-100/30 p-6 md:p-8 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Syllabus Breakdown (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-display font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                    Subject Breakdown
                  </h3>
                  <span className="text-[10px] text-blue-700 font-extrabold tracking-wider uppercase bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
                    CNTS 2026 Syllabus
                  </span>
                </div>
                
                <div className="divide-y divide-slate-100/50">
                  {subjects.map((s, idx) => {
                    const c = subjectColors[idx];
                    const isActive = activeIdx === idx;
                    
                    return (
                      <div 
                        key={s.name} 
                        className={`py-4.5 flex items-center justify-between gap-4 rounded-xl px-4 -mx-4 transition-all duration-300 cursor-pointer border-l-4 border-transparent ${
                          isActive 
                            ? `bg-slate-50/80 ${c.borderClass} translate-x-1.5 shadow-sm` 
                            : 'hover:bg-slate-50/50'
                        }`}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onMouseLeave={() => setActiveIdx(null)}
                      >
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          {/* Gamified Number Badge */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs border transition-all duration-300 shrink-0 mt-0.5 ${
                            isActive 
                              ? `${c.bar} border-transparent text-white shadow-sm scale-105` 
                              : 'bg-slate-50 border-slate-200 text-slate-455'
                          }`}>
                            0{idx + 1}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1 truncate">
                              {s.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                              {s.topics}
                            </p>
                          </div>
                        </div>
                        
                        {/* Interactive Side Chevron Indicator */}
                        <div className="flex items-center shrink-0 pr-1">
                          <ChevronRight 
                            size={16} 
                            className={`transition-all duration-300 ${
                              isActive ? 'translate-x-0.5 opacity-100 stroke-[3.2]' : 'opacity-25 translate-x-0'
                            }`} 
                            style={{ color: c.stroke }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Info Banner + Call to Action button */}
              <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] block">Negative marking</span>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium max-w-sm">
                    None. All questions carry equal marks. CNTS rewards what students know, not what they guess.
                  </p>
                </div>
                <Link
                  href="/academy"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 group shrink-0"
                >
                  Explore Learning Academy
                  <ArrowRight size={13} className="stroke-[2.5] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: Circular Graph with Premium Shadows & Hover Opacities */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center py-8 bg-gradient-to-br from-slate-55/80 via-slate-50/40 to-white rounded-[28px] border border-slate-200/60 p-8 min-h-[340px] shadow-sm relative overflow-hidden">
              <h4 className="font-display font-bold text-slate-500 text-[10px] uppercase tracking-widest mb-6 text-center">
                Weightage Distribution
              </h4>
              
              <div className="relative w-full max-w-[230px] aspect-square flex items-center justify-center">
                {/* SVG Donut Chart with expanded size and segment labels */}
                <svg width="100%" height="100%" viewBox="0 0 140 140" className="transition-all duration-300">
                  <defs>
                    {/* Glow filter for active segment */}
                    <filter id="glow-segment" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={activeIdx !== null ? subjectColors[activeIdx].stroke : "#3B82F6"} floodOpacity="0.25" />
                    </filter>
                    {/* Shadow for center circular panel */}
                    <filter id="center-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.08" />
                    </filter>
                  </defs>

                  {/* Rotated group so segments start at 12 o'clock */}
                  <g transform="rotate(-90 70 70)">
                    {subjectColors.map((color, idx) => {
                      const isActive = activeIdx === idx;
                      const isAnyActive = activeIdx !== null;
                      
                      // Radius 50 -> Circumference = 314.159 -> 25% = 78.54
                      // Optimized stroke width and opacity for high contrast selection
                      const strokeDasharray = "74.54 314.159";
                      const strokeDashoffset = -(idx * 78.54);
                      
                      return (
                        <circle
                          key={idx}
                          cx="70"
                          cy="70"
                          r="50"
                          fill="transparent"
                          stroke={color.stroke}
                          strokeWidth={isActive ? 25 : isAnyActive ? 14 : 20}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          opacity={isActive ? 1.0 : isAnyActive ? 0.35 : 0.9}
                          filter={isActive ? "url(#glow-segment)" : undefined}
                          className="transition-all duration-300 cursor-pointer origin-center"
                          onMouseEnter={() => setActiveIdx(idx)}
                          onMouseLeave={() => setActiveIdx(null)}
                        />
                      );
                    })}
                  </g>

                  {/* Percentage text rendered directly on top of the segments */}
                  {percentLabelCoords.map((coord, idx) => {
                    const isActive = activeIdx === idx;
                    const isAnyActive = activeIdx !== null;
                    return (
                      <text
                        key={idx}
                        x={coord.x}
                        y={coord.y + 1}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        opacity={isActive ? 1.0 : isAnyActive ? 0.25 : 0.9}
                        className="text-[8px] font-black font-mono fill-white pointer-events-none transition-all duration-300"
                      >
                        25%
                      </text>
                    );
                  })}
                  
                  {/* Center Text (Not rotated) - Ring is wider, center radius is 35 */}
                  <circle cx="70" cy="70" r="35" fill="#ffffff" filter="url(#center-shadow)" />
                  
                  {activeIdx === null ? (
                    <>
                      <text x="70" y="68" textAnchor="middle" alignmentBaseline="middle" className="font-display font-black fill-slate-800 text-xs">
                        4 Domains
                      </text>
                      <text x="70" y="82" textAnchor="middle" alignmentBaseline="middle" className="font-sans font-black fill-blue-600 text-[8px] tracking-widest uppercase">
                        100% Total
                      </text>
                    </>
                  ) : (
                    <>
                      <text x="70" y="68" textAnchor="middle" alignmentBaseline="middle" className={`font-display font-black text-lg ${subjectColors[activeIdx].fillClass}`}>
                        25%
                      </text>
                      <text x="70" y="82" textAnchor="middle" alignmentBaseline="middle" className="font-sans font-black fill-slate-400 text-[8px] tracking-widest uppercase">
                        {subjectColors[activeIdx].short}
                      </text>
                    </>
                  )}
                </svg>
              </div>
              
              <p className="text-[10px] text-slate-400 font-bold text-center mt-6 tracking-widest font-mono uppercase">
                Interactive Weightage Wheel
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
