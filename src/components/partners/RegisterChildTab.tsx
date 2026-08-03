'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  Check,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface RegisterChildTabProps {
  partnerName?: string;
  partnerCode?: string;
}

export const RegisterChildTab: React.FC<RegisterChildTabProps> = ({
  partnerName = 'Jan Mohammad',
  partnerCode = 'CNTSJN'
}) => {
  const [childName, setChildName] = useState('');
  const [classGrade, setClassGrade] = useState('Class 6');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('Lucknow');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-300">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-slate-950 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <GraduationCap className="w-4 h-4" /> Partner Dual-Role Privileges
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-950">
            Register My Child (100% Waived)
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-900 mt-1">
            As an official Courage Partner ({partnerName}), enroll your own children in CNTS 2026 with ₹0 fee.
          </p>
        </div>

        <div className="bg-slate-950 text-white p-4 rounded-2xl shrink-0 text-center border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Registration Fee</span>
          <span className="font-mono text-2xl font-black text-emerald-400">₹0 FREE</span>
          <span className="text-[10px] text-slate-400 block font-mono">₹99 Waived for Partner</span>
        </div>
      </div>

      {/* REGISTRATION FORM CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" /> Child Registration Details
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your child's information for official CNTS 2026 admit card generation.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Child's Full Name *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Mohd Rayan" 
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grade / Class *
                  </label>
                  <select 
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / District *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lucknow" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current School Name *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. St. Xavier's High School" 
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* PRIVILEGE BADGE */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">Applied Partner Code: <strong className="font-mono text-amber-900">{partnerCode}</strong></span>
              </div>
              <span className="bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[10px]">
                100% Waived (₹0)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-400" /> Complete ₹0 Child Registration
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="font-display text-2xl font-bold text-slate-900">
              Registration Successful!
            </h3>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              <strong>{childName}</strong> ({classGrade}) has been registered under your Courage Partner profile (<strong>{partnerCode}</strong>) with ₹0 fee.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-950 max-w-md mx-auto font-bold">
              CNTS Candidate ID: CNTS-2026-CH-{Math.floor(1000 + Math.random() * 9000)}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setSubmitted(false)}
                className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Register Another Child
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
