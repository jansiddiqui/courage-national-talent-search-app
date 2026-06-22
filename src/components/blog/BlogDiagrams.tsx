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
  Zap,
} from "lucide-react";

// =============================================================
// COMPARISON BOX
// =============================================================
interface ComparisonBoxProps {
  title?: string;
  left: { title: string; subtitle?: string; points: string[] };
  right: { title: string; subtitle?: string; points: string[] };
}

export const ComparisonBox: React.FC<ComparisonBoxProps> = ({ title, left, right }) => {
  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}

      {/* Stack on mobile, side-by-side on lg */}
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 items-stretch">

        {/* Left Column */}
        <div className="flex-1 bg-rose-50/60 border border-rose-100 rounded-2xl lg:rounded-r-none lg:rounded-l-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg flex-shrink-0">
              <BookOpen size={16} />
            </span>
            <h5 className="font-display font-bold text-sm md:text-base text-rose-950 leading-tight">
              {left.title}
            </h5>
          </div>
          {left.subtitle && (
            <p className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider">
              {left.subtitle}
            </p>
          )}
          <ul className="space-y-2.5 mt-1">
            {left.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span className="leading-snug">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* VS Divider — horizontal on mobile, vertical on desktop */}
        <div className="flex lg:flex-col items-center justify-center py-4 lg:py-0 lg:px-0">
          {/* Mobile: horizontal line + badge */}
          <div className="flex items-center w-full lg:hidden gap-3">
            <div className="flex-1 h-[1px] bg-slate-200" />
            <div className="bg-slate-900 text-white font-display font-black text-xs px-4 py-2 rounded-full shadow-sm tracking-widest flex-shrink-0">
              VS
            </div>
            <div className="flex-1 h-[1px] bg-slate-200" />
          </div>
          {/* Desktop: vertical divider + badge */}
          <div className="hidden lg:flex flex-col items-center gap-0 h-full">
            <div className="flex-1 w-[1px] bg-slate-200" />
            <div className="bg-slate-900 text-white font-display font-black text-xs px-3 py-2.5 rounded-full shadow-sm tracking-widest my-3 flex-shrink-0">
              VS
            </div>
            <div className="flex-1 w-[1px] bg-slate-200" />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 bg-emerald-50/60 border border-emerald-100 rounded-2xl lg:rounded-l-none lg:rounded-r-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg flex-shrink-0">
              <Brain size={16} />
            </span>
            <h5 className="font-display font-bold text-sm md:text-base text-emerald-950 leading-tight">
              {right.title}
            </h5>
          </div>
          {right.subtitle && (
            <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
              {right.subtitle}
            </p>
          )}
          <ul className="space-y-2.5 mt-1">
            {right.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm">
                <span className="p-0.5 bg-emerald-100 text-emerald-600 rounded-full mt-0.5 flex-shrink-0">
                  <Check size={10} className="stroke-[3]" />
                </span>
                <span className="leading-snug">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// COGNITIVE TRANSITION
// =============================================================
interface Stage {
  name: string;
  subtitle: string;
  color: string;
  points: string[];
}

interface CognitiveTransitionProps {
  title?: string;
  stages: Stage[];
  transition: { title: string; description: string };
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
        {/* Stage 1 */}
        <div className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 flex-shrink-0" />
            <h5 className="font-display font-bold text-slate-800 text-sm md:text-base leading-tight">
              {stages[0].name}{" "}
              <span className="text-slate-500 font-normal">({stages[0].subtitle})</span>
            </h5>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-slate-600 text-sm">
            {stages[0].points.map((pt, i) => (
              <li key={i} className="leading-snug">{pt}</li>
            ))}
          </ul>
        </div>

        {/* Inflection connector */}
        <div className="my-4 flex flex-col items-center w-full max-w-xl">
          <div className="w-[2px] h-6 bg-blue-200" />
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md text-xs font-semibold tracking-wider flex items-center gap-2 border border-blue-400 text-center">
            <Zap size={12} className="text-amber-300 fill-amber-300 animate-pulse flex-shrink-0" />
            <span>{transition.title}</span>
            <span className="text-blue-100 font-normal hidden sm:inline">({transition.description})</span>
          </div>
          <div className="w-[2px] h-6 bg-blue-200" />
          <ArrowDown size={16} className="text-blue-500 -mt-1.5" />
        </div>

        {/* Stage 2 */}
        <div className="w-full max-w-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 bg-blue-500 text-white rounded-full flex-shrink-0">
              <Compass size={12} />
            </span>
            <h5 className="font-display font-bold text-slate-900 text-sm md:text-base leading-tight">
              {stages[1].name}{" "}
              <span className="text-blue-600 font-bold">({stages[1].subtitle})</span>
            </h5>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-slate-700 text-sm">
            {stages[1].points.map((pt, i) => (
              <li key={i} className="leading-snug marker:text-blue-500">{pt}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// PATHWAY MAPPING
// =============================================================
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
      bg: "bg-blue-50/70 border-blue-100 hover:border-blue-200",
      badge: "bg-blue-100 text-blue-800",
      icon: <GraduationCap className="text-blue-600" size={18} />,
    },
    emerald: {
      bg: "bg-emerald-50/70 border-emerald-100 hover:border-emerald-200",
      badge: "bg-emerald-100 text-emerald-800",
      icon: <Award className="text-emerald-600" size={18} />,
    },
    purple: {
      bg: "bg-purple-50/70 border-purple-100 hover:border-purple-200",
      badge: "bg-purple-100 text-purple-800",
      icon: <Compass className="text-purple-600" size={18} />,
    },
  };

  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}

      <div className="space-y-5">
        {pathways.map((pw, idx) => {
          const cfg = colorMap[pw.color] || colorMap.blue;
          return (
            <div
              key={idx}
              className={`border rounded-2xl p-4 md:p-5 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center gap-4 ${cfg.bg}`}
            >
              {/* Skills tags */}
              <div className="flex-1 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Required Cognitive Pillars
                </div>
                <div className="flex flex-wrap gap-2">
                  {pw.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="text-slate-300">
                <ArrowRight size={18} className="hidden md:block stroke-[1.5]" />
                <ArrowDown size={16} className="md:hidden stroke-[1.5]" />
              </div>

              {/* Destination */}
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm min-w-0 md:w-60">
                <div className="p-2 rounded-lg bg-slate-50 flex-shrink-0">
                  {cfg.icon}
                </div>
                <div className="min-w-0">
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

// =============================================================
// BLOOM'S TAXONOMY PYRAMID
// =============================================================
interface Level {
  id: number;
  name: string;
  desc: string;
  focus: "school" | "scholarship" | "both";
}

interface BloomsTaxonomyPyramidProps {
  title?: string;
  levels: Level[];
  legends?: { school?: string; scholarship?: string };
}

export const BloomsTaxonomyPyramid: React.FC<BloomsTaxonomyPyramidProps> = ({ title, levels, legends }) => {
  // On desktop the central card shrinks toward the top (pyramid shape).
  // On mobile ALL cards are full width so text never truncates.
  const cardWidths = [
    "md:w-[45%]",  // 6 — narrowest (top)
    "md:w-[55%]",  // 5
    "md:w-[65%]",  // 4
    "md:w-[75%]",  // 3
    "md:w-[88%]",  // 2
    "md:w-[100%]", // 1 — widest (base)
  ];

  const colors = [
    "from-violet-600 to-indigo-600 text-white",
    "from-indigo-500 to-indigo-600 text-white",
    "from-blue-500 to-blue-600 text-white",
    "from-cyan-500 to-cyan-600 text-white",
    "from-slate-400 to-slate-500 text-slate-900",
    "from-slate-300 to-slate-400 text-slate-800",
  ];

  return (
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm overflow-hidden">
      {title && (
        <h4 className="text-center font-display font-bold text-base md:text-xl text-slate-800 mb-5 tracking-tight">
          {title}
        </h4>
      )}

      {/* Legend */}
      {legends && (
        <div className="flex flex-wrap justify-center gap-3 mb-6 text-xs font-semibold">
          {legends.school && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span>{legends.school}</span>
            </div>
          )}
          {legends.scholarship && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
              <span>{legends.scholarship}</span>
            </div>
          )}
        </div>
      )}

      {/* Pyramid rows */}
      <div className="flex flex-col items-center gap-2.5">
        {levels.map((level, idx) => {
          const bg = colors[idx] || "from-slate-400 to-slate-500";
          const cardWidth = cardWidths[idx] || "md:w-full";
          const isAptitude = level.focus === "scholarship" || level.focus === "both";
          const isSchool = level.focus === "school" || level.focus === "both";

          return (
            <div key={level.id} className="w-full flex items-center justify-center gap-3">

              {/* Left badge — desktop only, fixed width column */}
              <div className="hidden md:block w-28 text-right flex-shrink-0">
                {isAptitude && (
                  <span className="inline-block text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full tracking-wide uppercase whitespace-nowrap">
                    Aptitude Focus
                  </span>
                )}
              </div>

              {/* Central card — full width on mobile, staggered on desktop */}
              <div className={`w-full ${cardWidth} bg-gradient-to-r ${bg} px-4 py-3 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform flex items-center gap-3 min-w-0`}>
                <span className="font-display font-black text-xl opacity-90 leading-none w-7 flex-shrink-0">
                  {level.id}
                </span>
                <div className="min-w-0 flex-1">
                  <h5 className="font-display font-bold text-sm md:text-base leading-tight">
                    {level.name}
                  </h5>
                  <p className="text-[11px] opacity-80 font-normal leading-snug mt-0.5 whitespace-normal">
                    {level.desc}
                  </p>
                </div>
              </div>

              {/* Right badge — desktop only, fixed width column */}
              <div className="hidden md:block w-28 text-left flex-shrink-0">
                {isSchool && (
                  <span className="inline-block text-[9px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full tracking-wide uppercase whitespace-nowrap">
                    School Tests
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-only legend below pyramid */}
      <div className="flex md:hidden flex-wrap justify-center gap-3 mt-5 text-[10px] font-bold">
        {legends?.school && (
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> {legends.school}
          </span>
        )}
        {legends?.scholarship && (
          <span className="flex items-center gap-1.5 text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> {legends.scholarship}
          </span>
        )}
      </div>
    </div>
  );
};

// =============================================================
// COHORT BENCHMARK CHART
// =============================================================
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
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
      {title && (
        <h4 className="text-center font-display font-bold text-lg md:text-xl text-slate-800 mb-6 tracking-tight">
          {title}
        </h4>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs font-semibold">
        {datasets.map((ds, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-600">
            <span className={`w-3 h-3 rounded flex-shrink-0 ${ds.color}`} />
            <span>{ds.label}</span>
          </div>
        ))}
      </div>

      {/* Chart rows */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-2">
            <div className="text-xs md:text-sm font-bold text-slate-700">{cat}</div>
            <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-xl p-3">
              {datasets.map((ds, dsIdx) => {
                const value = ds.data[catIdx];
                return (
                  <div key={dsIdx} className="flex items-center gap-3 min-w-0">
                    {/* Label — never truncated, wraps naturally on small screens */}
                    <span className="w-28 md:w-36 text-[10px] md:text-xs font-bold text-slate-500 text-right leading-tight flex-shrink-0 pr-1">
                      {ds.label}
                    </span>
                    {/* Bar */}
                    <div className="flex-1 bg-slate-200/60 h-5 rounded-lg overflow-hidden relative shadow-inner min-w-0">
                      <div
                        className={`h-full ${ds.color} transition-all duration-700 rounded-r-lg`}
                        style={{ width: `${Math.min(value, 100)}%` }}
                      />
                      <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-extrabold text-slate-800 pointer-events-none">
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
