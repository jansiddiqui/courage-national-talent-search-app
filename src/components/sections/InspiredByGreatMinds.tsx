"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  string,
  { color: string; bg: string; border: string; badgeBg: string; badgeText: string }
> = {
  "Science & Innovation": {
    color: "from-[#0a1628] to-[#0d2347]",
    bg: "bg-[#0a1628]",
    border: "border-amber-400/30",
    badgeBg: "bg-amber-400/10",
    badgeText: "text-amber-300",
  },
  "Entrepreneurship & Business": {
    color: "from-[#0f1f3d] to-[#162d56]",
    bg: "bg-[#0f1f3d]",
    border: "border-blue-400/30",
    badgeBg: "bg-blue-400/10",
    badgeText: "text-blue-300",
  },
  "Public Leadership & Social Impact": {
    color: "from-[#111827] to-[#1e2f4d]",
    bg: "bg-[#111827]",
    border: "border-purple-400/30",
    badgeBg: "bg-purple-400/10",
    badgeText: "text-purple-300",
  },
  "Sports Excellence": {
    color: "from-[#0c1f1a] to-[#0f2d23]",
    bg: "bg-[#0c1f1a]",
    border: "border-emerald-400/30",
    badgeBg: "bg-emerald-400/10",
    badgeText: "text-emerald-300",
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
    "Science & Innovation":
      "from-amber-500/30 to-amber-700/20 border-amber-400/40",
    "Entrepreneurship & Business":
      "from-blue-500/30 to-blue-700/20 border-blue-400/40",
    "Public Leadership & Social Impact":
      "from-purple-500/30 to-purple-700/20 border-purple-400/40",
    "Sports Excellence":
      "from-emerald-500/30 to-emerald-700/20 border-emerald-400/40",
  };
  const textColors: Record<string, string> = {
    "Science & Innovation": "text-amber-300",
    "Entrepreneurship & Business": "text-blue-300",
    "Public Leadership & Social Impact": "text-purple-300",
    "Sports Excellence": "text-emerald-300",
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradients[category]} border-2 rounded-2xl`}
    >
      <span className={`text-3xl font-black tracking-widest ${textColors[category]}`}>
        {initials}
      </span>
    </div>
  );
}

function PersonCard({ person }: { person: PersonalityCard }) {
  const meta = CATEGORY_META[person.category];

  return (
    <div
      className={`group relative flex-shrink-0 w-[280px] md:w-auto rounded-3xl border ${meta.border} bg-gradient-to-br ${meta.color} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 cursor-default`}
    >
      {/* Subtle gold shimmer line at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Portrait */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-3xl">
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-3">
        {/* Category badge */}
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${meta.badgeBg} ${meta.badgeText} border border-current/20`}
        >
          {person.category}
        </span>

        {/* Name */}
        <h3 className="font-black text-white text-base leading-tight">
          {person.name}
        </h3>

        {/* Quote */}
        <p className="text-slate-300 text-xs leading-relaxed italic border-l-2 border-amber-400/50 pl-3">
          "{person.quote}"
        </p>
      </div>

      {/* Bottom shimmer */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
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
    <section className="relative bg-[#060e1f] py-20 md:py-28 overflow-hidden">

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-14 md:mb-18 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={12} />
            Role Models & Inspiration
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Inspired By{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Great Minds
            </span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Every remarkable achievement begins with curiosity, learning, and
            the courage to dream.{" "}
            <span className="text-slate-300 font-semibold">
              Every leader, scientist, entrepreneur, athlete, and innovator was
              once a student.
            </span>
          </p>
        </div>

        {/* ── Desktop Grid (3 × 2 + overflow rows) ────────────────────────── */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-12">
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
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
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
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${meta.badgeBg} ${meta.badgeText} border border-current/20`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-5 mb-10">
          <p className="text-lg md:text-xl font-semibold text-white leading-relaxed max-w-xl mx-auto">
            Who will be the next innovator, scientist, entrepreneur, leader, or
            champion?
          </p>
          <Link
            href="https://thecouragelibrary.com/cnts"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-[#060e1f] font-black text-sm rounded-2xl shadow-lg shadow-amber-400/20 transition-all duration-300 hover:shadow-amber-400/40 hover:scale-105 active:scale-95"
          >
            <Sparkles size={16} />
            Discover Your Potential with CNTS
          </Link>
        </div>

        {/* ── Educational Disclaimer ────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto border border-white/10 bg-white/5 rounded-2xl px-6 py-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">
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
