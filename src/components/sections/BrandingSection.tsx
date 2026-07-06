import React from "react";
import { Shield } from "lucide-react";

export default function BrandingSection() {
  return (
    <section className="py-6 bg-white">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-sm">
                Official Program of Courage Library
              </h4>
              <p className="text-[10px] text-slate-550 font-medium">
                National registry verified talent discovery and assessment initiative.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 tracking-wide">
            <span className="flex items-center gap-1">✓ CBSE</span>
            <span className="text-slate-350">|</span>
            <span className="flex items-center gap-1">✓ ICSE</span>
            <span className="text-slate-350">|</span>
            <span className="flex items-center gap-1">✓ State Boards</span>
          </div>
        </div>
        <div className="mt-2.5 text-center">
          <p className="text-[9px] text-slate-400 font-medium leading-normal max-w-2xl mx-auto">
            *CNTS is an independent initiative operated by Courage Library and is not affiliated with government NTSE programs.
          </p>
        </div>
      </div>
    </section>
  );
}
