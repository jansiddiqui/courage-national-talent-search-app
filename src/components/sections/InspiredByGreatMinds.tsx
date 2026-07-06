"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { RegisterCTA } from "@/components/shared/RegisterCTA";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  string,
  { color: string; bg: string; border: string; badgeBg: string; badgeText: string; shimmer: string }
> = {
  "Science & Innovation": {
    color: "from-[#0a1628] to-[#0d2347]",
    bg: "bg-[#0a1628]",
    border: "border-amber-400/20",
    badgeBg: "bg-amber-400/10",
    badgeText: "text-amber-300",
    shimmer: "via-amber-400/50",
  },
  "Entrepreneurship & Business": {
    color: "from-[#0f1f3d] to-[#162d56]",
    bg: "bg-[#0f1f3d]",
    border: "border-blue-400/20",
    badgeBg: "bg-blue-400/10",
    badgeText: "text-blue-300",
    shimmer: "via-blue-400/50",
  },
  "Public Leadership & Social Impact": {
    color: "from-[#111827] to-[#1e2f4d]",
    bg: "bg-[#111827]",
    border: "border-purple-400/20",
    badgeBg: "bg-purple-400/10",
    badgeText: "text-purple-300",
    shimmer: "via-purple-400/50",
  },
  "Sports Excellence": {
    color: "from-[#0c1f1a] to-[#0f2d23]",
    bg: "bg-[#0c1f1a]",
    border: "border-emerald-400/20",
    badgeBg: "bg-emerald-400/10",
    badgeText: "text-emerald-300",
    shimmer: "via-emerald-400/50",
  },
};

interface PersonalityCard {
  name: string;
  category: string;
  quote: string;
  initials: string;
  image?: string; // path in /images/great_minds/
}

const PERSONALITIES: PersonalityCard[] = [
  // Science & Innovation
  {
    name: "Dr. A.P.J. Abdul Kalam",
    category: "Science & Innovation",
    quote: "Dreams transform into achievements when curiosity meets dedication.",
    initials: "AK",
    image: "/images/great_minds/kalam.png",
  },
  {
    name: "Homi J. Bhabha",
    category: "Science & Innovation",
    quote: "Scientific thinking begins with asking questions.",
    initials: "HB",
  },
  {
    name: "Kalpana Chawla",
    category: "Science & Innovation",
    quote: "Great journeys start with the courage to explore.",
    initials: "KC",
  },
  {
    name: "Vikram Sarabhai",
    category: "Science & Innovation",
    quote: "Innovation starts with imagination.",
    initials: "VS",
  },
  // Entrepreneurship & Business
  {
    name: "Ratan Tata",
    category: "Entrepreneurship & Business",
    quote: "Leadership is built through values, vision, and perseverance.",
    initials: "RT",
  },
  {
    name: "Narayana Murthy",
    category: "Entrepreneurship & Business",
    quote: "Every success story starts with learning.",
    initials: "NM",
    image: "/images/great_minds/murthy.png",
  },
  {
    name: "Kiran Mazumdar-Shaw",
    category: "Entrepreneurship & Business",
    quote: "Believe in your ideas and never stop growing.",
    initials: "KS",
    image: "/images/great_minds/kiran.png",
  },
  {
    name: "Falguni Nayar",
    category: "Entrepreneurship & Business",
    quote: "Ambition and continuous learning create opportunities.",
    initials: "FN",
    image: "/images/great_minds/falguni.png",
  },
  // Public Leadership & Social Impact
  {
    name: "Dr. B.R. Ambedkar",
    category: "Public Leadership & Social Impact",
    quote: "Education is the foundation of progress.",
    initials: "BA",
    image: "/images/great_minds/ambedkar.png",
  },
  {
    name: "Savitribai Phule",
    category: "Public Leadership & Social Impact",
    quote: "Learning empowers individuals and transforms societies.",
    initials: "SP",
    image: "/images/great_minds/savitribai.png",
  },
  // Sports Excellence
  {
    name: "Sachin Tendulkar",
    category: "Sports Excellence",
    quote: "Excellence is achieved through discipline and dedication.",
    initials: "ST",
    image: "/images/great_minds/sachin.png",
  },
  {
    name: "P.V. Sindhu",
    category: "Sports Excellence",
    quote: "Success belongs to those who keep improving.",
    initials: "PS",
    image: "/images/great_minds/pvsindhu.png",
  },
  {
    name: "Neeraj Chopra",
    category: "Sports Excellence",
    quote: "Consistency turns potential into achievement.",
    initials: "NC",
  },
  {
    name: "Mary Kom",
    category: "Sports Excellence",
    quote: "Determination can overcome every challenge.",
    initials: "MK",
    image: "/images/great_minds/marykom.png",
  },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function MonogramAvatar({
  initials,
  category,
}: {
  initials: string;
  category: string;
}) {
  const gradients: Record<string, string> = {
    "Science & Innovation": "from-amber-500/20 to-amber-900/10 border-amber-500/30",
    "Entrepreneurship & Business": "from-blue-500/20 to-blue-900/10 border-blue-500/30",
    "Public Leadership & Social Impact": "from-purple-500/20 to-purple-900/10 border-purple-500/30",
    "Sports Excellence": "from-emerald-500/20 to-emerald-900/10 border-emerald-500/30",
  };
  const textColors: Record<string, string> = {
    "Science & Innovation": "text-amber-300",
    "Entrepreneurship & Business": "text-blue-300",
    "Public Leadership & Social Impact": "text-purple-300",
    "Sports Excellence": "text-emerald-300",
  };

  return (
    <div className={`w-full h-full relative flex items-center justify-center bg-gradient-to-br ${gradients[category]} border-2 rounded-2xl overflow-hidden`}>
      
      {/* Concentric space-radar style vectors */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-30 pointer-events-none">
        <div className={`absolute w-36 h-36 rounded-full border border-current opacity-10 animate-[ping_4s_infinite] ${textColors[category]}`} />
        <div className={`absolute w-24 h-24 rounded-full border border-current/25 ${textColors[category]}`} />
        <div className={`absolute w-14 h-14 rounded-full border border-current/40 border-dashed ${textColors[category]}`} />
        <div className={`absolute w-44 h-px rotate-45 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${textColors[category]}`} />
        <div className={`absolute w-44 h-px -rotate-45 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${textColors[category]}`} />
      </div>

      {/* Floating Monogram Glass Panel */}
      <div className="relative z-10 w-16 h-16 rounded-full bg-slate-950/60 border border-white/10 shadow-2xl backdrop-blur-md flex items-center justify-center transition-transform duration-300">
        <span className={`text-base font-black tracking-wider ${textColors[category]}`}>
          {initials}
        </span>
      </div>

    </div>
  );
}

function PersonCard({ person }: { person: PersonalityCard }) {
  const meta = CATEGORY_META[person.category];

  return (
    <div
      className={`group relative flex-shrink-0 w-[280px] md:w-auto rounded-3xl border ${meta.border} bg-gradient-to-br ${meta.color} overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/45 cursor-default`}
    >
      {/* Category-aligned colored shimmer line at top */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${meta.shimmer} to-transparent`} />

      {/* Portrait / Styled Placeholder Avatar */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-3xl bg-slate-950/20">
        {person.image ? (
          <Image
            src={person.image}
            alt={person.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 280px, 320px"
          />
        ) : (
          <MonogramAvatar initials={person.initials} category={person.category} />
        )}
        {/* Gradient shadow base overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e1f] via-slate-950/20 to-transparent" />
      </div>

      {/* Card Content details */}
      <div className="px-5 py-4.5 space-y-3.5">
        {/* Category badge */}
        <span
          className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${meta.badgeBg} ${meta.badgeText} border border-current/20`}
        >
          {person.category}
        </span>

        {/* Name */}
        <h3 className="font-black text-white text-base leading-tight">
          {person.name}
        </h3>

        {/* Quote */}
        <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-amber-400/50 pl-3 font-medium">
          &ldquo;{person.quote}&rdquo;
        </p>
      </div>

      {/* Category-aligned bottom highlight line */}
      <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${meta.shimmer} to-transparent`} />
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function InspiredByGreatMinds() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = 300;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-[#060e1f] py-20 md:py-28 overflow-hidden border-t border-b border-blue-950/30">

      {/* Background decorative grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-14 md:mb-18 space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" />
            Role Models & Inspiration
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Inspired By{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-black">
              Great Minds
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Every remarkable achievement begins with curiosity, learning, and
            the courage to dream.{" "}
            <span className="text-slate-300 font-bold block mt-1">
              Every leader, scientist, entrepreneur, athlete, and innovator was once a student.
            </span>
          </p>
        </div>

        {/* ── Desktop Grid (SaaS layout columns) ────────────────────────── */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {PERSONALITIES.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>

        {/* ── Mobile Carousel ───────────────────────────────────────────────── */}
        <div className="md:hidden relative mb-10">
          {/* Scroll container */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PERSONALITIES.map((p) => (
              <div key={p.name} className="snap-start flex-shrink-0">
                <PersonCard person={p} />
              </div>
            ))}
          </div>

          {/* Arrow controls */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Category Legend ───────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(CATEGORY_META).map(([cat, meta]) => (
            <span
              key={cat}
              className={`text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full ${meta.badgeBg} ${meta.badgeText} border border-current/20`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* ── Interactive Registration CTA ──────────────────────────────────── */}
        <div className="text-center space-y-5 mb-10 relative z-10">
          <p className="text-lg md:text-xl font-bold text-white leading-relaxed max-w-xl mx-auto">
            Who will be the next innovator, scientist, entrepreneur, leader, or champion?
          </p>
          <RegisterCTA
            unauthenticatedText="Discover Your Potential with CNTS"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-[#060e1f] font-black text-sm rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          />
        </div>

        {/* ── Educational Disclaimer ────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto border border-white/10 bg-white/5 rounded-2xl px-6 py-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            <span className="font-extrabold text-slate-300">
              Educational Disclaimer:{" "}
            </span>
            These personalities are featured solely as educational role models.
            CNTS does not claim any association or endorsement from them or
            their estates. Their journeys remind us that every great achiever
            was once a student with potential.
          </p>
        </div>

      </div>
    </section>
  );
}
