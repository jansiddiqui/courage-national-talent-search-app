"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, Users, Trophy, Check, Copy, Award, BookOpen } from "lucide-react";

export function DashboardMissionCarousel({
  registration_id,
  referralsCount,
  handleCopyCode,
  codeCopied
}: {
  registration_id: string;
  referralsCount: number;
  handleCopyCode: (code: string) => void;
  codeCopied: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    {
      title: "Help Us Reach Every Student",
      icon: <Users size={24} className="text-blue-500" />,
      text: "As a Founding Parent, you are a vital pillar of the Courage Library. Help us extend this opportunity to more bright minds across India.",
    },
    {
      title: "Spread the Mission",
      icon: <Sparkles size={24} className="text-amber-500" />,
      text: "We are on a mission to discover and nurture true talent. Your recommendation helps us find students who need this platform the most.",
    },
    {
      title: "Be Our Ambassador",
      icon: <Award size={24} className="text-emerald-500" />,
      text: "When you share your child's Identity Card, you actively contribute to our vision of accessible, high-quality assessments for all.",
    },
    {
      title: "National Recognition",
      icon: <Trophy size={24} className="text-purple-500" />,
      text: "We will formally felicitate the Top 10 parents across India who make the greatest contribution to expanding the Courage Library mission.",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="bg-white rounded-3xl border border-blue-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex-1 relative z-10 w-full flex flex-col justify-between">
        <div className="relative min-h-[160px] sm:min-h-[120px] md:min-h-[140px] mb-4">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-center ${
                idx === activeIndex 
                  ? "opacity-100 translate-y-0 pointer-events-auto" 
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <h3 className="font-display font-bold text-slate-800 text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 shadow-sm shrink-0">
                  {card.icon}
                </div>
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg font-medium pr-4">
                {card.text}
              </p>
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex items-center gap-1.5 mt-2 mb-4">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-6 bg-blue-600" : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
        
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Your Referral Code</span>
            <strong className="text-lg font-mono text-slate-800 tracking-wider flex items-center gap-2">
              {registration_id}
              <button onClick={() => handleCopyCode(registration_id)} className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors" title="Copy Code">
                {codeCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </strong>
          </div>
          <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Students Referred</span>
            <strong className="text-2xl font-bold text-blue-700">{referralsCount}</strong>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto shrink-0 relative z-10 flex flex-col gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `My child has registered for the Courage National Talent Search (CNTS) 2026.\n\nCNTS focuses on logical reasoning, problem-solving, and cognitive aptitude for students in Classes 5–8.\n\nIf you're interested, you can learn more here:\nhttps://www.thecouragelibrary.com\n\nReferral Code: ${registration_id}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="w-full md:w-auto px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-[14px] flex flex-col items-center justify-center gap-0.5 transition-all shadow-md hover:shadow-lg shadow-[#25D366]/20 active:scale-95 border border-[#1fa64f]"
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 fill-current drop-shadow-sm" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            <span className="text-base font-bold tracking-wide">Send WhatsApp Message</span>
          </div>
          <span className="text-[10px] font-semibold text-white/80">FORWARD LINK TO FRIENDS</span>
        </a>
      </div>
    </div>
  );
}
