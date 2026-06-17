"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Star, ShieldCheck, ArrowRight, Brain, 
  FileDown, Compass, GraduationCap
} from "lucide-react";

interface DomainScore {
  name: string;
  score: number;
  percentile: number;
  rank: string;
  color: string;
  bg: string;
  accent: string;
  desc: string;
}

const domainScores: DomainScore[] = [
  {
    name: "Logical Reasoning",
    score: 92,
    percentile: 98,
    rank: "Top 2%",
    color: "bg-blue-600",
    bg: "bg-blue-50",
    accent: "text-blue-700 border-blue-100",
    desc: "Measures ability to identify abstract rules, make deductive inferences, and synthesize logic sequences.",
  },
  {
    name: "Creative Intelligence",
    score: 85,
    percentile: 94,
    rank: "Top 6%",
    color: "bg-emerald-500",
    bg: "bg-emerald-50",
    accent: "text-emerald-700 border-emerald-100",
    desc: "Evaluates divergent thinking, abstract relationship mapping, and speed of novel problem-solving.",
  },
  {
    name: "Numerical Aptitude",
    score: 81,
    percentile: 92,
    rank: "Top 8%",
    color: "bg-amber-500",
    bg: "bg-amber-50",
    accent: "text-amber-700 border-amber-100",
    desc: "Assesses understanding of mathematical relationships, logic patterns, and quantity-scale reasoning.",
  },
  {
    name: "Linguistic Aptitude",
    score: 88,
    percentile: 95,
    rank: "Top 5%",
    color: "bg-purple-500",
    bg: "bg-purple-50",
    accent: "text-purple-700 border-purple-100",
    desc: "Measures vocabulary comprehension, contextual inferences, and structural language logic.",
  },
  {
    name: "Spatial Visualization",
    score: 77,
    percentile: 88,
    rank: "Top 12%",
    color: "bg-rose-500",
    bg: "bg-rose-50",
    accent: "text-rose-700 border-rose-100",
    desc: "Evaluates ability to mentally rotate 3D geometries and conceptualize structural transformations.",
  },
  {
    name: "Cognitive Processing Speed",
    score: 86,
    percentile: 93,
    rank: "Top 7%",
    color: "bg-cyan-500",
    bg: "bg-cyan-50",
    accent: "text-cyan-700 border-cyan-100",
    desc: "Measures rapid pattern matching, visual scanning, and accuracy under structured time limits.",
  },
];

export default function SampleReportPage() {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);
    
    // Simulate generation & download of a sample PDF file
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      
      // Trigger native download helper using window
      const link = document.createElement("a");
      link.href = "/sample-papers/class7.pdf"; // Reuses a class7 PDF placeholder as mock report
      link.download = "CNTS_Sample_Talent_Profile_Priya_Sharma.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="dark" />

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <Star size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Report Blueprint
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Sample <span className="text-blue-400">Talent Report</span>.
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            This is a mock presentation of the multi-dimensional report parents receive. No single test mark can show your child&apos;s genius—we map it in detail.
          </p>

          <div className="pt-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl cursor-pointer disabled:opacity-50"
            >
              <FileDown size={16} />
              {downloading ? "Generating PDF..." : "Download Sample PDF Report"}
            </button>
            
            {downloadSuccess && (
              <p className="text-emerald-400 text-xs mt-2 animate-pulse">
                ✓ Report downloaded successfully!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Interactive Dashboard Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Student Identification header */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800">
              <Brain size={28} className="stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-xl text-slate-800">Priya Sharma</h2>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Founding Edition Candidate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Class 7 Student · Delhi · Roll ID: <span className="font-mono font-semibold">CNTS26-7890B</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
            <div className="text-center px-4 border-r border-slate-200">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Class Rank</span>
              <span className="font-display font-bold text-slate-800 text-base">State Rank #4</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Verifiable</span>
              <span className="font-display font-bold text-emerald-600 text-base flex items-center gap-1">
                <ShieldCheck size={14} /> QR Secure
              </span>
            </div>
          </div>
        </div>

        {/* Score Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Center: 6 Domain Assessments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg">Cognitive Domain Performance</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed analysis of cognitive aptitudes independent of school boards.
                </p>
              </div>

              <div className="space-y-6">
                {domainScores.map((domain) => (
                  <div key={domain.name} className="space-y-2 group">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-blue-800 transition-colors">
                          {domain.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal max-w-lg mt-0.5">
                          {domain.desc}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${domain.bg} ${domain.accent} border border-transparent`}>
                          {domain.rank}
                        </span>
                        <div className="text-sm font-bold text-slate-800 mt-1">{domain.score} / 100</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${domain.color} rounded-full transition-all duration-1000`} 
                        style={{ width: `${domain.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Metrics Overview */}
          <div className="space-y-8">
            
            {/* Overall Score Card */}
            <div className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden text-center flex flex-col items-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-4">
                Overall Aptitude
              </span>
              
              {/* Score donut ring */}
              <div className="relative w-28 h-28 mb-4">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" />
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke="#EFF6FF"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26 * 0.88} ${2 * Math.PI * 26}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-bold text-white text-3xl leading-none">88</span>
                  <span className="text-[9px] text-blue-200 font-semibold mt-0.5">Score</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-white text-sm">Top 3% Nationally</h4>
                <p className="text-[11px] text-blue-200/70 max-w-xs leading-normal">
                  Priya demonstrates advanced deductive capabilities and strong logic synthesis.
                </p>
              </div>
            </div>

            {/* Discovered Strengths Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider">
                Discovered Strengths
              </h3>
              <div className="space-y-2">
                {[
                  { title: "Deductive Synthesis", desc: "Fast identification of geometric pattern changes." },
                  { title: "Linguistic Logic", desc: "High reading contextual accuracy and logical syntax." },
                  { title: "Working Memory Capacity", desc: "Advanced speed in processing multi-variable math rules." },
                ].map((s) => (
                  <div key={s.title} className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl text-left">
                    <span className="font-bold text-slate-800 text-xs block">{s.title}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Learning Style & Careers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Learning Style Analysis */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
            <h3 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
              <GraduationCap className="text-blue-800 stroke-[1.75]" size={20} />
              Learning Style Assessment
            </h3>
            
            <div className="space-y-4">
              {/* Visual Visualizer */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Visual-Spatial Learner</span>
                  <span className="text-blue-800">45% (Primary)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-800 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              {/* Logical-Mathematical */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Logical-Mathematical Learner</span>
                  <span className="text-emerald-600">35%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

              {/* Kinesthetic / Auditory */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Auditory & Kinesthetic Learner</span>
                  <span className="text-amber-500">20%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>

              <div className="h-px bg-slate-100 my-4" />
              
              <div className="bg-blue-50/30 border border-blue-100/30 p-4 rounded-2xl">
                <span className="font-bold text-blue-900 text-xs block mb-1">Expert Diagnostic Insight</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Priya absorbs complex structures best when mapped out visually (diagrams, logic flows, charts). She struggles with long-form text memorization without a visual outline. Urge her to use mind maps, flow diagrams, and logical trees while preparing for science/math concepts.
                </p>
              </div>
            </div>
          </div>

          {/* Career Mapping */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
            <h3 className="font-display font-bold text-slate-800 text-lg flex items-center gap-2">
              <Compass className="text-emerald-700 stroke-[1.75]" size={20} />
              Recommended Career Clusters
            </h3>
            
            <p className="text-slate-500 text-xs leading-relaxed">
              Based on the alignment of Logical Reasoning and Creative Intelligence, Priya exhibits strong compatibility for multi-dimensional analytical tracks:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { title: "Systems Engineering", match: "94% Match", desc: "Designing complex computational architectures and data relationships." },
                { title: "Analytical Research", match: "89% Match", desc: "Synthesizing theoretical logical models in physical sciences." },
                { title: "Computational Logic", match: "87% Match", desc: "Drafting algorithms, software coding systems, and hardware design." },
                { title: "Design Architecture", match: "83% Match", desc: "Combining structural physics design with visual spatial aesthetics." },
              ].map((job) => (
                <div key={job.title} className="p-4 bg-slate-50 border border-slate-100/50 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 text-xs">{job.title}</span>
                    <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {job.match}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">{job.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* Call to action */}
      <section className="py-20 text-center bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900">
            Discover your child&apos;s profile for ₹99.
          </h3>
          <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
            CNTS helps you understand how your child is wired, how they learn best, and what careers fit their natural aptitudes.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-800/15 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Register Now – ₹99
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
