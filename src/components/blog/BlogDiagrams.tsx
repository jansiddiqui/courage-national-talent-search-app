"use client";

import React from "react";
import {
  ArrowRight,
  ArrowDown,
  Brain,
  GraduationCap,
  Award,
  BookOpen,
  Compass,
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
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-base md:text-xl text-slate-800 mb-6 tracking-tight leading-snug">
          {title}
        </h4>
      )}

      {/* ── Mobile: stacked ── Desktop: 3-col grid (left | VS | right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_52px_1fr] items-stretch gap-4 lg:gap-0">

        {/* Left card */}
        <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 md:p-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-start gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg flex-shrink-0 mt-0.5">
              <BookOpen size={14} />
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
          <ul className="space-y-2 mt-1">
            {left.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span className="leading-snug">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* VS Divider */}
        <div className="flex lg:flex-col items-center justify-center gap-0">
          {/* Mobile horizontal lines */}
          <div className="flex items-center w-full lg:hidden gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="bg-slate-900 text-white font-display font-black text-xs px-4 py-2 rounded-full shadow tracking-widest flex-shrink-0">
              VS
            </div>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          {/* Desktop vertical lines */}
          <div className="hidden lg:flex flex-col items-center w-full h-full">
            <div className="flex-1 w-px bg-slate-200" />
            <div className="bg-slate-900 text-white font-display font-black text-xs px-3 py-2.5 rounded-full shadow tracking-widest my-3 flex-shrink-0">
              VS
            </div>
            <div className="flex-1 w-px bg-slate-200" />
          </div>
        </div>

        {/* Right card */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 md:p-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-start gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg flex-shrink-0 mt-0.5">
              <Brain size={14} />
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
          <ul className="space-y-2 mt-1">
            {right.points.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
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
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-base md:text-xl text-slate-800 mb-6 tracking-tight leading-snug">
          {title}
        </h4>
      )}

      <div className="flex flex-col items-center gap-0">
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

        {/* Connector */}
        <div className="flex flex-col items-center my-3 w-full max-w-xl">
          <div className="w-px h-5 bg-blue-200" />
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow text-xs font-semibold flex items-center gap-2 flex-wrap justify-center text-center">
            <Zap size={12} className="text-amber-300 fill-amber-300 animate-pulse flex-shrink-0" />
            <span className="font-bold">{transition.title}</span>
            <span className="text-blue-100 font-normal">({transition.description})</span>
          </div>
          <div className="w-px h-5 bg-blue-200" />
          <ArrowDown size={16} className="text-blue-500 -mt-1.5" />
        </div>

        {/* Stage 2 */}
        <div className="w-full max-w-xl bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-2xl p-5 shadow-sm">
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
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-base md:text-xl text-slate-800 mb-6 tracking-tight leading-snug">
          {title}
        </h4>
      )}

      <div className="space-y-4">
        {pathways.map((pw, idx) => {
          const cfg = colorMap[pw.color] || colorMap.blue;
          return (
            <div
              key={idx}
              className={`border rounded-2xl p-4 md:p-5 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center gap-4 ${cfg.bg}`}
            >
              {/* Skills */}
              <div className="flex-1 min-w-0 space-y-2">
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
              <div className="text-slate-300 flex-shrink-0">
                <ArrowRight size={18} className="hidden md:block stroke-[1.5]" />
                <ArrowDown size={16} className="md:hidden stroke-[1.5]" />
              </div>

              {/* Destination — no fixed width, flex-shrink-0 so it doesn't collapse */}
              <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl border border-slate-200/80 shadow-sm flex-shrink-0 md:max-w-[220px]">
                <div className="p-2 rounded-lg bg-slate-50 flex-shrink-0">
                  {cfg.icon}
                </div>
                <div>
                  <h6 className="font-display font-bold text-slate-900 text-sm leading-snug">
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
  // Central card width: wider at base (idx 5), narrower at peak (idx 0)
  // On mobile always full width
  const cardWidths = [
    "lg:w-[40%]",   // 6 — narrowest
    "lg:w-[52%]",   // 5
    "lg:w-[64%]",   // 4
    "lg:w-[76%]",   // 3
    "lg:w-[88%]",   // 2
    "lg:w-[100%]",  // 1 — widest
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
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-sm md:text-xl text-slate-800 mb-5 tracking-tight leading-snug break-words">
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
      <div className="flex flex-col items-center gap-2">
        {levels.map((level, idx) => {
          const bg = colors[idx] || "from-slate-400 to-slate-500";
          const cw = cardWidths[idx] || "lg:w-full";
          const isAptitude = level.focus === "scholarship" || level.focus === "both";
          const isSchool = level.focus === "school" || level.focus === "both";

          return (
            // Full-width row for proper badge alignment; center column holds the card
            <div key={level.id} className="w-full flex items-center justify-center gap-2 md:gap-4">

              {/* Left badge — fixed width, desktop only */}
              <div className="hidden lg:flex items-center justify-end w-32 flex-shrink-0">
                {isAptitude ? (
                  <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full tracking-wide uppercase whitespace-nowrap">
                    Aptitude Focus
                  </span>
                ) : (
                  <span className="block w-px" />
                )}
              </div>

              {/* Central card */}
              <div className={`w-full ${cw} bg-gradient-to-r ${bg} px-4 py-3.5 rounded-2xl shadow-sm hover:scale-[1.01] transition-transform flex items-center gap-3`}>
                <span className="font-display font-black text-xl opacity-90 leading-none flex-shrink-0 w-7">
                  {level.id}
                </span>
                <div>
                  <h5 className="font-display font-bold text-sm md:text-base leading-tight">
                    {level.name}
                  </h5>
                  <p className="text-[11px] opacity-85 font-normal leading-snug mt-0.5 whitespace-normal">
                    {level.desc}
                  </p>
                </div>
              </div>

              {/* Right badge — fixed width, desktop only */}
              <div className="hidden lg:flex items-center justify-start w-32 flex-shrink-0">
                {isSchool ? (
                  <span className="text-[9px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full tracking-wide uppercase whitespace-nowrap">
                    School Tests
                  </span>
                ) : (
                  <span className="block w-px" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-only legend below */}
      {legends && (
        <div className="flex lg:hidden flex-wrap justify-center gap-4 mt-5 text-[10px] font-bold">
          {legends.school && (
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
              {legends.school}
            </span>
          )}
          {legends.scholarship && (
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
              {legends.scholarship}
            </span>
          )}
        </div>
      )}
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
    <div className="my-8 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
      {title && (
        <h4 className="text-center font-display font-bold text-base md:text-xl text-slate-800 mb-6 tracking-tight leading-snug">
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

      {/* Chart */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-2">
            <div className="text-xs md:text-sm font-bold text-slate-700">{cat}</div>
            <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-xl p-3">
              {datasets.map((ds, dsIdx) => {
                const value = ds.data[catIdx];
                return (
                  <div key={dsIdx} className="flex items-center gap-3 min-w-0">
                    {/* Full label, never truncated */}
                    <span className="flex-shrink-0 w-32 md:w-40 text-[10px] md:text-xs font-bold text-slate-500 text-right leading-tight">
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
