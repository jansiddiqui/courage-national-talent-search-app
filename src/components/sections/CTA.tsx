import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { RegisterCTA } from "@/components/shared/RegisterCTA";

export default function CTA() {
  return (
    <section id="register" className="py-10 md:py-14 lg:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B1530] to-slate-950 border border-blue-900/30 shadow-2xl">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

          <div className="relative px-6 py-10 md:py-12 lg:py-14 text-center max-w-2xl mx-auto">
            {/* Registrations Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/[0.12] rounded-full mb-5">
              <CalendarDays size={12} className="text-blue-400" />
              <span className="text-white/80 text-[10px] md:text-xs font-semibold tracking-wide">
                Registrations Open · CNTS 2026 Founding Edition
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-tight tracking-tight mb-4">
              Discover what your child is{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                truly capable of.
              </span>
            </h2>

            {/* Description */}
            <p className="text-blue-200/80 text-xs md:text-sm leading-relaxed mb-8 max-w-lg mx-auto">
              Get your child&apos;s multi-dimensional cognitive analysis. Register in 3 minutes. Your child&apos;s talent profile awaits.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <RegisterCTA
                unauthenticatedText="Become a Founding Family"
                rightIcon={<ArrowRight size={14} />}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5 cursor-pointer border-none w-full sm:w-auto"
              />
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
              >
                Learn More First
              </Link>
            </div>

            {/* Subtext */}
            <p className="mt-4 text-slate-400 text-[10px] md:text-xs">
              Secure payment · Instant confirmation · Quick results in September 2026
            </p>

            {/* School CTA */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-slate-300 text-xs mb-3">
                Are you a school principal or coordinator?
              </p>
              <Link
                href="/for-schools"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                Explore School Partnership Program
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
