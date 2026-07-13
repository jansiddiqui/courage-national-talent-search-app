"use client";

import { X, Award, ShieldCheck } from "lucide-react";

interface CertificatePreviewProps {
  candidate: any;
  result: any;
  verificationToken?: string;
  onClose: () => void;
}

export default function CertificatePreview({ candidate, result, verificationToken, onClose }: CertificatePreviewProps) {
  const getCertificateTitle = (percentile: number) => {
    if (percentile >= 95) return "Certificate of Exceptional Merit";
    if (percentile >= 85) return "Certificate of Merit";
    return "Certificate of Participation";
  };

  const getCertificateSubtitle = (percentile: number) => {
    if (percentile >= 95) return "Awarded for securing a national percentile in the top 5% category.";
    if (percentile >= 85) return "Awarded for securing a national percentile in the top 15% category.";
    return "Awarded for active participation and cognitive assessment completion.";
  };

  const verLink = verificationToken 
    ? `https://thecouragelibrary.com/verify/${candidate.cnts_id || candidate.registration_id}?token=${verificationToken}`
    : `https://thecouragelibrary.com/verify/${candidate.cnts_id || candidate.registration_id}`;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border-8 border-slate-900 rounded-3xl p-8 max-w-2xl w-full relative space-y-6 shadow-2xl animate-scale-in text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-655 cursor-pointer border-none bg-transparent"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto">
          <Award size={36} className="fill-amber-500/10" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Courage National Talent Search 2026</span>
          <h2 className="font-serif font-bold text-3xl text-slate-900 leading-tight">
            {getCertificateTitle(result.percentile || 0)}
          </h2>
          <p className="text-xs text-slate-500 italic max-w-md mx-auto">
            {getCertificateSubtitle(result.percentile || 0)}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Proudly Presented To</span>
          <strong className="text-xl font-bold text-slate-900 block">{candidate.student_name}</strong>
          <span className="text-xs text-slate-500 block">Class {candidate.student_class} | {candidate.school_name}</span>
        </div>

        <div className="h-px bg-slate-100 my-4" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <div className="text-left space-y-1 text-[10px] text-slate-400 font-mono">
            <div>Verification ID: <span className="font-bold text-slate-600">{candidate.cnts_id || candidate.registration_id}</span></div>
            <div>Hash: <span className="font-bold text-slate-600">{verificationToken?.substring(0, 16) || "VAL_MOCK_HASH"}</span></div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 font-sans shrink-0">
            <ShieldCheck size={12} className="text-emerald-500" />
            Registry Checked
          </div>
        </div>

        <div className="pt-4 no-print">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer border-none"
          >
            Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
