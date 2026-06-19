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
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="bg-white rounded-3xl border border-amber-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex-1 relative z-10 w-full min-h-[160px] flex flex-col justify-between">
        <div className="relative h-28">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                idx === activeIndex 
                  ? "opacity-100 translate-y-0 pointer-events-auto" 
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <h3 className="font-display font-bold text-slate-800 text-2xl flex items-center gap-2 mb-3">
                {card.icon}
                {card.title}
              </h3>
              <p className="text-base text-slate-600 leading-relaxed max-w-lg font-medium">
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
                idx === activeIndex ? "w-6 bg-amber-500" : "w-1.5 bg-slate-200"
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
          className="w-full md:w-auto px-6 py-4 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl text-sm font-bold text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#25D366]/20 active:scale-95"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.019-5.101-2.871-6.958C16.612 1.943 14.137 1.94 12.01 1.94c-5.44 0-9.866 4.414-9.869 9.848-.002 1.71.453 3.382 1.32 4.874L2.44 21.908l5.207-1.366z"/>
            </svg>
            Send WhatsApp Message
          </div>
          <span className="text-[10px] font-medium opacity-90">Forward link to friends</span>
        </a>
      </div>
    </div>
  );
}
