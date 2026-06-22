import { Shield, Sparkles } from "lucide-react";

export default function BrandingSection() {
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-150">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-150 text-blue-700 rounded-xl">
            <Shield size={22} />
          </div>
          <h3 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Official Program Identity
          </h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
          <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed">
            <strong>Courage National Talent Search (CNTS) is an official program operated by Courage Library.</strong>
          </p>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
            The program is designed to identify, assess, and recognize student talent through structured national-level assessments and talent profiling initiatives. Courage Library oversees and manages all operational aspects of the platform, including student registrations, secure payment processing, bilingual syllabus curation, mock assessments, performance diagnostics, and credential distribution.
          </p>
          <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-blue-600" />
              Official Registry Verified
            </span>
            <span className="text-slate-300">|</span>
            <span>Parent Operator: Courage Library</span>
          </div>
        </div>
      </div>
    </section>
  );
}
