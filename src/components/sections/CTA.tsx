import { ArrowRight, Sparkles, CalendarDays } from "lucide-react";
import Link from "next/link";
import { RegisterCTA } from "@/components/shared/RegisterCTA";

export default function CTA() {
  return (
    <section id="register" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden mesh-dark noise">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-50/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-50/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative px-8 py-16 lg:py-20 text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8">
              <CalendarDays size={13} className="text-amber-400" />
              <span className="text-white/80 text-xs font-semibold">
                Registrations Open · CNTS 2026 Founding Edition
              </span>
            </div>

            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Discover what your
              <br />
              child is{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                truly capable of.
              </span>
            </h2>

            <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Get your child&apos;s multi-dimensional cognitive analysis. Register in 3 minutes. Your child&apos;s talent profile awaits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <RegisterCTA
                unauthenticatedText="Start Your Child's Registration"
                rightIcon={<ArrowRight size={16} />}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 hover:bg-blue-50 text-sm font-bold rounded-2xl shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              />
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-200 text-base"
              >
                Learn More First
              </Link>
            </div>

            <p className="mt-6 text-blue-300/70 text-sm">
              Secure payment · Instant confirmation · Quick results in July 2026
            </p>

            {/* School CTA */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-blue-200 text-sm mb-4">
                Are you a school principal or coordinator?
              </p>
              <Link
                href="/for-schools"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
              >
                Explore School Partnership Program
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
