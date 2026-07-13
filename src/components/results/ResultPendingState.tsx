"use client";

import { Loader2, AlertCircle } from "lucide-react";

interface ResultPendingStateProps {
  status: "PENDING" | "PROCESSING" | "FAILED" | "RETRY_PENDING";
}

export default function ResultPendingState({ status }: ResultPendingStateProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center max-w-xl w-full space-y-6 shadow-sm animate-scale-in">
      {status === "FAILED" ? (
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
      ) : (
        <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-800" size={44} />
        </div>
      )}

      <h2 className="font-display font-bold text-2xl text-slate-900">
        {status === "FAILED" ? "Report Compilation Blocked" : "Compiling Talent Report..."}
      </h2>

      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        {status === "FAILED"
          ? "Our automated grading engine encountered an evaluation exception. Administrators have been notified to re-trigger compilation. Your raw score is preserved."
          : "We are processing the cognitive metrics, resolving All India rankings, and generating your Talent DNA mapping. This takes a few seconds."}
      </p>

      <div className="py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-xl inline-flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
        <span className="w-2 h-2 rounded-full bg-blue-800 animate-ping" />
        Processing State: {status}
      </div>
    </div>
  );
}
