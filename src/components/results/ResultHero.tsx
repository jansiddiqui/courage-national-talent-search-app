"use client";

import { Trophy, Award } from "lucide-react";
import { CandidateIdentityCard } from "@/components/shared/CandidateIdentityCard";

interface ResultHeroProps {
  candidate: any;
  result: any;
  verificationToken?: string;
  onViewCertificate: () => void;
}

export default function ResultHero({ candidate, result, verificationToken, onViewCertificate }: ResultHeroProps) {
  return (
    <div className="space-y-6 w-full">
      {/* Standardized Candidate Identity Card */}
      <CandidateIdentityCard candidate={{
        student_name: candidate.student_name,
        student_class: candidate.student_class,
        state: candidate.state,
        registration_id: candidate.cnts_id || candidate.registration_id,
        payment_status: candidate.payment_status,
        photo_url: `/api/photo/${candidate.cnts_id || candidate.registration_id}`
      }} />

      {/* Result Header & Overall Standing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <Trophy size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
              {candidate.student_name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              ID: <strong className="font-mono text-slate-800 font-bold">{candidate.cnts_id || candidate.registration_id}</strong>
            </p>
          </div>
        </div>

        {result.percentile !== undefined ? (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 font-sans">
            National Percentile: {Number(result.percentile).toFixed(2)}%
          </span>
        ) : (
          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-100 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 font-sans">
            Percentile available after cohort finalization
          </span>
        )}
      </div>

      {/* Candidate School Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-500">
        <div>School: <strong className="text-slate-800">{candidate.school_name} ({candidate.school_city})</strong></div>
        <div>Class: <strong className="text-slate-800">Class {candidate.student_class}</strong></div>
        <div>District: <strong className="text-slate-800">{candidate.district}</strong></div>
        <div>State: <strong className="text-slate-800">{candidate.state}</strong></div>
      </div>

      {/* Ranks Dashboard (Visible only if computed) */}
      {result.national_rank ? (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">National Rank</span>
            <strong className="text-2xl font-bold text-blue-900">#{result.national_rank}</strong>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State Rank</span>
            <strong className="text-2xl font-bold text-indigo-900">#{result.state_rank}</strong>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs font-semibold text-slate-500">
          Rankings are calculated following cohort finalization.
        </div>
      )}
    </div>
  );
}
