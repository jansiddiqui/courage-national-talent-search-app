"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Star,
  Medal,
  Award,
  ShieldCheck,
  Sparkles,
  Users,
  BookOpen,
  Globe,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const kits = [
  {
    rank: "National",
    iconType: "trophy",
    color: "from-amber-400 to-yellow-500",
    borderColor: "border-amber-200",
    bgColor: "bg-amber-50",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    level: "Top 100 National Rankers",
    title: "National Excellence Kit",
    desc: "Awarded to candidates displaying stellar logical reasoning indices and multi-dimensional verbal capabilities across all participating states.",
    rewards: [
      "Physical Gold Excellence Medal",
      "Certified National Talent Profile Certificate",
      "₹5,000 Research Grant Coupon for advanced training modules",
      "Exclusive 'National Achiever' digital profile badge",
      "Priority invite to CNTS Annual Excellence Conclave",
    ],
  },
  {
    rank: "State",
    iconType: "medal",
    color: "from-slate-300 to-slate-400",
    borderColor: "border-slate-200",
    bgColor: "bg-slate-50",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    level: "Top 50 Rankers in Each State",
    title: "State Excellence Kit",
    desc: "Recognizing regional logical excellence and conceptual proficiency across individual states, inspiring local learning communities.",
    rewards: [
      "Physical Silver Regional Excellence Medal",
      "Certified State Talent Profile Certificate",
      "₹2,000 Research Grant Coupon",
      "'Regional Star' digital profile badge",
      "State Topper Recognition Letter to School Principal",
    ],
  },
  {
    rank: "School",
    iconType: "award",
    color: "from-orange-300 to-amber-400",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    level: "Rank 1, 2 & 3 in Each School",
    title: "School Topper Kit",
    desc: "Supporting localized learning growth within participating schools to inspire logical curiosity and academic confidence at the grassroots.",
    rewards: [
      "Physical School Topper Bronze Medal",
      "School Topper Certificate of Merit",
      "'School Champion' digital profile badge",
      "Recognition mention on school's CNTS achievement board",
    ],
  },
];

const statsData = [
  { icon: Users, label: "Students Participating", value: "10,000+", color: "text-blue-600" },
  { icon: Globe, label: "States Represented", value: "28+", color: "text-emerald-600" },
  { icon: BookOpen, label: "Schools Registered", value: "500+", color: "text-violet-600" },
  { icon: Trophy, label: "Excellence Kits Awarded", value: "3 Tiers", color: "text-amber-600" },
];

export default function AchieversPage() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero */}
      <div className="bg-slate-900 text-white pt-36 pb-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,#1e3a8a,transparent_55%)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,#92400e,transparent_50%)] opacity-20" />
        {/* Floating medal orbs */}
        <div className="absolute top-16 right-12 w-24 h-24 rounded-full bg-amber-400/10 blur-2xl animate-float" />
        <div className="absolute bottom-8 left-16 w-16 h-16 rounded-full bg-blue-500/10 blur-xl animate-float-slow" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
            <Star size={13} className="fill-amber-400 animate-spin-slow" />
            CNTS Hall of Fame
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight text-white mb-4 leading-tight">
            Achievers &amp;{" "}
            <span className="gradient-text-amber">Excellence Kits</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Every candidate who gives their best is rewarded. Exceptional performance earns
            custom physical medals, national recognition, and exclusive digital honors.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-4">
              <div className={`p-3 bg-slate-50 rounded-xl ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="font-display font-bold text-xl text-slate-900">{value}</div>
                <div className="text-[11px] text-slate-500 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full">

        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <Sparkles size={11} />
            Recognition Framework
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-3">
            Three Tiers of Recognition
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Performance across national, state, and school levels is rewarded with unique physical
            and digital honors — each designed to stand out on any profile.
          </p>
        </div>

        {/* Kit cards */}
        <div className="space-y-8 mb-16">
          {kits.map((kit, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl border ${kit.borderColor} shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300`}
            >
              <div className="grid md:grid-cols-5 gap-0">
                {/* Left accent */}
                <div className={`md:col-span-2 ${kit.bgColor} p-8 md:p-10 flex flex-col justify-center`}>
                  <div className="mb-4">
                    {kit.iconType === "trophy" && <Trophy size={48} className="text-amber-500" />}
                    {kit.iconType === "medal" && <Medal size={48} className="text-slate-450" />}
                    {kit.iconType === "award" && <Award size={48} className="text-orange-600" />}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider mb-3 w-fit ${kit.badgeColor}`}>
                    {kit.level}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-slate-900 leading-tight mb-2">
                    {kit.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {kit.desc}
                  </p>
                </div>

                {/* Right: rewards */}
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Medal size={14} className="text-slate-400" />
                    Included in Kit
                  </h4>
                  <ul className="space-y-3">
                    {kit.rewards.map((reward, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-3 text-sm">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">{reward}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Participation note */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-6 md:p-8 flex gap-4 mb-16">
          <ShieldCheck size={24} className="text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Official Academic Recognition Standards</h4>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              CNTS is committed to pure academic excellence. All awards are verifiable through our
              Certificate Verification Portal. We focus on recognizing cognitive achievement, not
              promoting cash prizes — in line with modern national educational standards.
            </p>
          </div>
        </div>

        {/* Participation reward section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 text-center mb-16 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5">
            <Award size={11} />
            Participation Reward
          </div>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mb-3">
            Every Registered Candidate Gets
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            Completing the assessment is an achievement on its own. Every candidate who appears
            for the CNTS exam receives a verified participation certificate.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Award, label: "Participation Certificate", sub: "Digitally verifiable via /verify" },
              { icon: BookOpen, label: "Cognitive Talent Profile", sub: "Personalized strength report" },
              { icon: ShieldCheck, label: "CNTS Founding Member Badge", sub: "Exclusive 2026 edition" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-700 shadow-sm border border-slate-200/50 mb-3">
                  <item.icon size={20} />
                </div>
                <div className="font-bold text-slate-800 text-xs">{item.label}</div>
                <div className="text-[10px] text-slate-450 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-800/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative space-y-3 max-w-lg mx-auto mb-8">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-4 border border-white/10">
              <Trophy size={28} />
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white">
              Unlock Your Award Slot
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              All registered Class 5–8 candidates are automatically evaluated for all three
              recognition tiers. Register before slots fill up.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-800 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-800/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles size={15} />
              Register Now (₹99)
            </Link>
            <Link
              href="/prepare"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen size={15} />
              View Preparation Guide
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
