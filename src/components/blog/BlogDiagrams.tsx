"use client";

import React from "react";
import { 
  ArrowRight, 
  ArrowDown, 
  Brain, 
  Trophy, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Compass, 
  Lightbulb,
  Check,
  Zap
} from "lucide-react";

// --- COMPARISON BOX ---
interface ComparisonBoxProps {
  title?: string;
  left: {
    title: string;
    subtitle?: string;
    points: string[];
  };
  right: {
    title: string;
    subtitle?: string;
    points: string[];
  };
}

export const ComparisonBox: React.FC<ComparisonBoxProps> = ({ title, left, right }) => {
  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative">
        {/* Left Column - Traditional/Rote */}
        <div className="lg:col-span-5 bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md hover:border-rose-200">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                <BookOpen size={16} />
              </span>
              <h5 className="font-display font-bold text-base text-rose-950">
                {left.title}
              </h5>
            </div>
            {left.subtitle && (
              <p className="text-xs font-semibold text-rose-600 mb-4 uppercase tracking-wider">
                {left.subtitle}
              </p>
            )}
            <ul className="space-y-3">
              {left.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* VS Divider */}
        <div className="lg:col-span-2 flex lg:flex-col items-center justify-center py-2 lg:py-0">
          <div className="w-full h-[1px] lg:w-[1px] lg:h-full bg-slate-200 absolute z-0 hidden lg:block" />
          <div className="bg-slate-900 text-white font-display font-black text-xs md:text-sm px-4 py-2 rounded-full border-4 border-slate-50 relative z-10 shadow-sm flex items-center justify-center tracking-widest">
            VS
          </div>
        </div>

        {/* Right Column - Cognitive/Critical */}
        <div className="lg:col-span-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md hover:border-emerald-200">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                <Brain size={16} />
              </span>
              <h5 className="font-display font-bold text-base text-emerald-950">
                {right.title}
              </h5>
            </div>
            {right.subtitle && (
              <p className="text-xs font-semibold text-emerald-600 mb-4 uppercase tracking-wider">
                {right.subtitle}
              </p>
            )}
            <ul className="space-y-3">
              {right.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm">
                  <span className="p-0.5 bg-emerald-100 text-emerald-600 rounded-full mt-0.5 flex-shrink-0">
                    <Check size={10} className="stroke-[3]" />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COGNITIVE TRANSITION ---
interface Stage {
  name: string;
  subtitle: string;
  color: string;
  points: string[];
}

interface CognitiveTransitionProps {
  title?: string;
  stages: Stage[];
  transition: {
    title: string;
    description: string;
  };
}

export const CognitiveTransition: React.FC<CognitiveTransitionProps> = ({ title, stages, transition }) => {
  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}

      <div className="flex flex-col items-center">
        {/* Stage 1 - Concrete */}
        <div className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm transition-all hover:border-slate-300">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <h5 className="font-display font-bold text-slate-800 text-sm md:text-base">
              {stages[0].name} <span className="text-slate-500 font-normal">({stages[0].subtitle})</span>
            </h5>
          </div>
          <ul className="space-y-2 pl-5 list-disc text-slate-600 text-sm">
            {stages[0].points.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>

        {/* Transition Arrow / Inflection Point */}
        <div className="my-4 flex flex-col items-center relative z-10 w-full max-w-xl">
          <div className="w-[2px] h-6 bg-blue-200" />
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md text-xs font-semibold tracking-wider flex items-center gap-2 border border-blue-400">
            <Zap size={12} className="text-amber-300 fill-amber-300 animate-pulse" />
            <span>{transition.title}</span>
            <span className="text-blue-100 font-normal">({transition.description})</span>
          </div>
          <div className="w-[2px] h-6 bg-blue-200" />
          <ArrowDown size={16} className="text-blue-500 -mt-1.5" />
        </div>

        {/* Stage 2 - Formal */}
        <div className="w-full max-w-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 bg-blue-500 text-white rounded-full">
              <Compass size={12} />
            </span>
            <h5 className="font-display font-bold text-slate-900 text-sm md:text-base">
              {stages[1].name} <span className="text-blue-600 font-bold">({stages[1].subtitle})</span>
            </h5>
          </div>
          <ul className="space-y-2 pl-5 list-disc text-slate-700 text-sm">
            {stages[1].points.map((pt, i) => (
              <li key={i} className="marker:text-blue-500">{pt}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- PATHWAY MAPPING ---
interface Pathway {
  title: string;
  subtitle: string;
  color: "blue" | "emerald" | "purple";
  skills: string[];
}

interface PathwayMappingProps {
  title?: string;
  pathways: Pathway[];
}

export const PathwayMapping: React.FC<PathwayMappingProps> = ({ title, pathways }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50/70 border-blue-100 hover:border-blue-200 hover:shadow-blue-50",
      badge: "bg-blue-100 text-blue-800",
      icon: <GraduationCap className="text-blue-600" size={18} />
    },
    emerald: {
      bg: "bg-emerald-50/70 border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-50",
      badge: "bg-emerald-100 text-emerald-800",
      icon: <Award className="text-emerald-600" size={18} />
    },
    purple: {
      bg: "bg-purple-50/70 border-purple-100 hover:border-purple-200 hover:shadow-purple-50",
      badge: "bg-purple-100 text-purple-800",
      icon: <Compass className="text-purple-600" size={18} />
    }
  };

  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}

      <div className="space-y-6">
        {pathways.map((pw, idx) => {
          const cfg = colorMap[pw.color] || colorMap.blue;
          return (
            <div 
              key={idx} 
              className={`border rounded-2xl p-5 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${cfg.bg}`}
            >
              {/* Left side: Skills */}
              <div className="flex-1 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Required Cognitive Pillars
                </div>
                <div className="flex flex-wrap gap-2">
                  {pw.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Center connector */}
              <div className="hidden md:flex items-center justify-center text-slate-300">
                <ArrowRight size={20} className="stroke-[1.5]" />
              </div>
              <div className="flex md:hidden items-center justify-start text-slate-300">
                <ArrowDown size={16} className="stroke-[1.5]" />
              </div>

              {/* Right side: Pathway Destination */}
              <div className="w-full md:w-64 flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <div className={`p-2 rounded-lg bg-slate-50`}>
                  {cfg.icon}
                </div>
                <div>
                  <h6 className="font-display font-bold text-slate-900 text-sm leading-tight">
                    {pw.title}
                  </h6>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 uppercase tracking-wider ${cfg.badge}`}>
                    {pw.subtitle}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- BLOOMS TAXONOMY PYRAMID ---
interface Level {
  id: number;
  name: string;
  desc: string;
  focus: "school" | "scholarship" | "both";
}

interface BloomsTaxonomyPyramidProps {
  title?: string;
  levels: Level[];
  legends?: {
    school?: string;
    scholarship?: string;
  };
}

export const BloomsTaxonomyPyramid: React.FC<BloomsTaxonomyPyramidProps> = ({ title, levels, legends }) => {
  // Staggered widths for the central pyramid cards on desktop, full-width on mobile
  const cardWidths = [
    "w-full md:w-[50%]",
    "w-full md:w-[60%]",
    "w-full md:w-[70%]",
    "w-full md:w-[80%]",
    "w-full md:w-[90%]",
    "w-full"
  ];

  // Modern vibrant violet/indigo color palette
  const colors = [
    "from-violet-600 to-indigo-600 text-white shadow-violet-100", // 6. Create
    "from-indigo-500 to-indigo-600 text-white shadow-indigo-100", // 5. Evaluate
    "from-blue-500 to-blue-600 text-white shadow-blue-100",       // 4. Analyze
    "from-cyan-500 to-cyan-600 text-white shadow-cyan-100",       // 3. Apply
    "from-slate-400 to-slate-500 text-slate-900 shadow-slate-100", // 2. Understand
    "from-slate-300 to-slate-400 text-slate-800 shadow-slate-100"  // 1. Remember
  ];

  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}

      {/* Legend Block */}
      {legends && (
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-xs font-semibold">
          {legends.school && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>{legends.school}</span>
            </div>
          )}
          {legends.scholarship && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <span>{legends.scholarship}</span>
            </div>
          )}
        </div>
      )}

      {/* The Pyramid */}
      <div className="flex flex-col items-center gap-3">
        {levels.map((level, idx) => {
          const bg = colors[idx] || "from-slate-400 to-slate-500";
          const cardWidth = cardWidths[idx] || "w-full";

          const isScholarshipFocus = level.focus === "scholarship" || level.focus === "both";
          const isSchoolFocus = level.focus === "school" || level.focus === "both";

          return (
            <div 
              key={level.id} 
              className="w-full flex items-center justify-between gap-4 md:gap-6"
            >
              {/* Left Indicator (Scholarship) - Vertically aligned column */}
              <div className="hidden md:flex items-center justify-end w-28 text-right flex-shrink-0">
                {isScholarshipFocus ? (
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full tracking-wide uppercase">
                    Aptitude Focus
                  </span>
                ) : null}
              </div>

              {/* Central Column - Centers the staggered pyramid card */}
              <div className="flex-1 flex justify-center min-w-0">
                <div className={`${cardWidth} bg-gradient-to-r ${bg} px-5 py-3.5 rounded-2xl shadow-sm transition-all hover:scale-[1.02] flex items-center gap-4`}>
                  <span className="font-display font-black text-xl opacity-90 leading-none w-6 flex-shrink-0">
                    {level.id}
                  </span>
                  <div className="min-w-0">
                    <h5 className="font-display font-bold text-sm md:text-base leading-tight truncate">
                      {level.name}
                    </h5>
                    <p className="text-[11px] opacity-80 font-normal leading-tight mt-0.5 break-words">
                      {level.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Indicator (School) - Vertically aligned column */}
              <div className="hidden md:flex items-center justify-start w-28 text-left flex-shrink-0">
                {isSchoolFocus ? (
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full tracking-wide uppercase">
                    School Tests
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- COHORT BENCHMARK CHART ---
interface Dataset {
  label: string;
  data: number[];
  color: string;
}

interface CohortBenchmarkChartProps {
  title?: string;
  categories: string[];
  datasets: Dataset[];
}

export const CohortBenchmarkChart: React.FC<CohortBenchmarkChartProps> = ({ title, categories, datasets }) => {
  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}

      {/* Dataset Legends */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs font-semibold">
        {datasets.map((ds, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-600">
            <span className={`w-3 h-3 rounded ${ds.color}`} />
            <span>{ds.label}</span>
          </div>
        ))}
      </div>

      {/* The Chart Structure */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-2">
            <div className="text-xs md:text-sm font-bold text-slate-700">
              {cat}
            </div>
            <div className="space-y-1.5 bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-inner">
              {datasets.map((ds, dsIdx) => {
                const value = ds.data[catIdx];
                return (
                  <div key={dsIdx} className="flex items-center gap-3">
                    <span className="w-20 text-[10px] font-extrabold text-slate-500 truncate text-right">
                      {ds.label}
                    </span>
                    <div className="flex-1 bg-slate-200/60 h-4 rounded-md overflow-hidden relative shadow-sm">
                      <div 
                        className={`h-full ${ds.color} transition-all duration-500 rounded-r-md`}
                        style={{ width: `${value}%` }}
                      />
                      <span className="absolute inset-y-0 right-2 flex items-center text-[9px] font-extrabold text-slate-800">
                        {value}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
