import React from "react";
import { User } from "lucide-react";

interface CandidateIdentityCardProps {
  candidate: {
    student_name: string;
    student_class: string;
    state: string;
    registration_id: string;
    payment_status: string;
    photo_url?: string;
  };
}

export function CandidateIdentityCard({ candidate }: CandidateIdentityCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl border border-indigo-900/40 p-6 sm:p-8 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-800/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] font-display font-extrabold text-4xl sm:text-5xl tracking-widest text-white/5 uppercase select-none pointer-events-none whitespace-nowrap">
        Founding Edition 2026
      </div>

      <div className="relative space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 sm:pb-6 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-sm">
              <img src="/images/logo.png" alt="CNTS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight leading-none">CNTS</h4>
              <span className="text-[9px] sm:text-[10px] text-blue-400 font-black tracking-wider uppercase whitespace-nowrap block mt-1">Founding Edition 2026</span>
            </div>
          </div>
          <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 text-center whitespace-nowrap">
            Identity Card
          </span>
        </div>

        {/* Body Info */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 sm:gap-6 items-center">
          <div className="col-span-1 border border-white/10 rounded-xl bg-white/5 aspect-[3/4] flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:border-white/20 transition-colors">
            <img 
              src={candidate.photo_url || `/api/photo/${candidate.registration_id}`} 
              alt="Candidate Photo" 
              className="w-full h-full object-cover rounded-xl z-10 relative" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }} 
            />
            <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-white/5">
              <User size={24} className="text-white/20" />
              <span className="text-[6px] sm:text-[8px] text-white/30 uppercase font-bold tracking-wider mt-2">Affix Photo</span>
            </div>
          </div>

          <div className="col-span-3 sm:col-span-4 space-y-4 sm:space-y-5 pl-2 sm:pl-4">
            <div>
              <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">Candidate Name</span>
              <strong className="text-white text-base sm:text-xl font-semibold truncate block tracking-wide">{candidate.student_name}</strong>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">Class</span>
                <strong className="text-white text-sm sm:text-base font-semibold">Class {candidate.student_class}</strong>
              </div>
              <div>
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-0.5">State</span>
                <strong className="text-white text-sm sm:text-base font-semibold truncate block">{candidate.state}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Premium Footer Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col sm:flex-row">
          <div className="flex-1 divide-y divide-white/10">
            <div className="grid grid-cols-2 divide-x divide-white/10">
              <div className="p-3 sm:p-4 text-center bg-white/[0.02]">
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Candidate ID</span>
                <strong className="text-amber-400 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider block truncate">{candidate.registration_id}</strong>
              </div>
              <div className="p-3 sm:p-4 text-center bg-white/[0.02]">
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Enrollment Status</span>
                <strong className="text-emerald-400 text-[10px] sm:text-xs font-semibold block uppercase tracking-wider mt-0.5">{candidate.payment_status === "PAID" ? "Enrolled / Active" : "Pending"}</strong>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/10">
              <div className="p-3 sm:p-4 text-center">
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Exam Date</span>
                <strong className="text-white text-xs sm:text-sm font-bold">19 July 2026</strong>
              </div>
              <div className="p-3 sm:p-4 text-center">
                <span className="text-[8px] sm:text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Slot Venue</span>
                <strong className="text-white text-xs sm:text-sm font-bold">Online / Portal</strong>
              </div>
            </div>
          </div>
          {/* Smart QR Referral Code */}
          <div className="w-full sm:w-32 bg-white flex flex-col items-center justify-center p-3 shrink-0">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.thecouragelibrary.com/register?ref=${candidate.registration_id}&color=1e3a8a`}
              alt="Scan to Register"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <span className="text-[7px] sm:text-[8px] font-bold text-blue-900 mt-2 uppercase tracking-widest text-center leading-tight">
              Scan to Register <br/>
              <span className="text-amber-600">Your Child</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
