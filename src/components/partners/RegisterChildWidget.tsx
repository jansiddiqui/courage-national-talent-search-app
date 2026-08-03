'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Award,
  Check
} from 'lucide-react';

interface RegisterChildWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName?: string;
  partnerCode?: string;
}

export const RegisterChildWidget: React.FC<RegisterChildWidgetProps> = ({
  isOpen,
  onClose,
  partnerName = 'Jan Mohammad',
  partnerCode = 'CNTSJN'
}) => {
  const [childName, setChildName] = useState('');
  const [classGrade, setClassGrade] = useState('Class 6');
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('Lucknow');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-slide-up my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">Register Your Child</h3>
              <span className="text-xs text-slate-500">100% Founding Partner Waiver Applied</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">✕</button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Partner Dual-Role Benefit
              </div>
              <p>As a verified Courage Partner ({partnerCode}), your child receives a 100% waiver for CNTS 2026 examination fee & full brain diagnostic report.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Child's Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={childName}
                onChange={e => setChildName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class / Grade *</label>
                <select
                  value={classGrade}
                  onChange={e => setClassGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option>Class 5</option>
                  <option>Class 6</option>
                  <option>Class 7</option>
                  <option>Class 8</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">School Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Delhi Public School, Lucknow"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn-primary text-xs py-3 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md cursor-pointer"
              >
                Confirm CNTS 2026 Child Registration (₹0 Waiver)
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="font-display font-bold text-2xl text-slate-900">Registration Confirmed 🎉</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              <strong>{childName}</strong> ({classGrade}) is successfully registered for Courage National Talent Search 2026 under Founding Partner Code <strong>{partnerCode}</strong>.
            </p>

            <div className="bg-slate-900 text-white p-4 rounded-2xl text-left text-xs font-mono space-y-1">
              <div>Candidate ID: <span className="text-amber-300">CNTS-2026-{Math.floor(100000 + Math.random() * 900000)}</span></div>
              <div>School: {schoolName}</div>
              <div>Waiver Status: <span className="text-emerald-400 font-bold">100% Fee Waived (Partner)</span></div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="btn-primary text-xs py-2.5 px-6"
            >
              Done & Return to Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
