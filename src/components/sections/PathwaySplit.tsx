"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, School, User, Award, BarChart3, FileSpreadsheet } from "lucide-react";

export default function PathwaySplit() {
  const parentBenefits = [
    "Know your child's real strengths",
    "Discover their hidden talents",
    "Get a Detailed Brain Strength Report",
    "Win a verified national certificate",
  ];

  const schoolBenefits = [
    "Recognize talented students",
    "Manage student lists easily",
    "Register students in bulk (Excel)",
    "Get detailed school report card",
  ];

  const schoolFeatures = [
    "School Discount Codes",
    "School Login Dashboard",
    "Excel Upload & Export",
    "Class-wise Strength Reports",
  ];

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-[#F8FAFF] relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Choose Your Pathway
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">
            How would you like to <span className="gradient-text">participate</span>?
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Whether registering your child individually or conducting a talent evaluation across your entire school, we have a streamlined path for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: For Parents & Guardians */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-blue-900/[0.02] flex flex-col justify-between hover:shadow-xl hover:shadow-blue-900/[0.05] hover:-translate-y-1 transition-all duration-300 group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-800 border border-blue-100">
                  <User size={22} className="stroke-[2px]" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-800 font-bold text-[10px] uppercase tracking-wider">
                  <Sparkles size={11} className="fill-amber-400 text-amber-500" />
                  Direct Registration
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-2xl text-slate-900">
                  For Parents & Guardians
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Help your child stand out. Secure an individual seat to receive a diagnostic evaluation of reasoning and critical learning skills.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <h4 className="text-[11px] font-extrabold text-slate-450 uppercase tracking-widest mb-4">
                  Key Outcomes
                </h4>
                <ul className="space-y-3.5">
                  {parentBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/register"
                className="w-full py-4 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-800/10 hover:shadow-blue-700/20"
              >
                Register Your Child — ₹99
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: For Schools & Educators */}
          <div className="bg-slate-950 text-white rounded-3xl border border-slate-900 p-8 shadow-2xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                  <School size={22} className="stroke-[2px]" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-slate-300 font-bold text-[10px] uppercase tracking-wider">
                  Partner Schools
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-2xl text-white">
                  For School Leaders & Coordinator
                </h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  Evaluate logical competence at scale. Register your institution to conduct the assessment across classrooms.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                  Value & Benefits
                </h4>
                <ul className="space-y-3.5">
                  {schoolBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-slate-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">
                  Included Features
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-400">
                  {schoolFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/for-schools"
                className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                Access School Dashboard
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
