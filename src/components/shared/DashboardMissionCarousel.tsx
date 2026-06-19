"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, Users, Trophy, Check, Copy, Award, BookOpen, Share2, CheckCircle } from "lucide-react";

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

  // Calculate escalating Courage Points
  const couragePoints = useMemo(() => {
    let points = 0;
    for (let i = 1; i <= referralsCount; i++) {
      if (i === 1) points += 500;
      else if (i === 2) points += 700;
      else if (i === 3) points += 1000;
      else if (i === 4) points += 1500;
      else if (i === 5) points += 2000;
      else points += 2500;
    }
    return points;
  }, [referralsCount]);

  const cards = [
    {
      title: "Your Impact Matters",
      icon: <Users size={24} className="text-amber-500" />,
      text: "We rely on parents like you to reach bright minds. Every recommendation you make is measured in Courage Points, starting with 500 points for your first contribution.",
    },
    {
      title: "A Token of Gratitude",
      icon: <Award size={24} className="text-blue-500" />,
      text: "As a gesture of our deep appreciation, parents with high impact scores will receive the Courage Kit—a premium collection of academic resources and merchandise.",
    },
    {
      title: "National Felicitation",
      icon: <Trophy size={24} className="text-purple-500" />,
      text: "We want to honor those who stand by us. The Top 10 contributing parents across India will be formally felicitated as National Ambassadors of our mission.",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="bg-white rounded-3xl border border-blue-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative overflow-hidden">
      {/* Background Mission Graphics */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute -bottom-10 -left-10 text-blue-50/50 pointer-events-none transform -rotate-12">
        <BookOpen size={180} />
      </div>
      <div className="absolute top-10 right-1/4 text-amber-50/50 pointer-events-none">
        <Sparkles size={120} />
      </div>
      
      <div className="flex-1 relative z-10 w-full flex flex-col justify-between">
        {/* Inner Header */}
        <div className="mb-6 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <Sparkles size={12} className="text-blue-600" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-600">Your Mission</h2>
        </div>

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
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg font-medium pr-4 relative z-10">
                {card.text}
              </p>
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex items-center gap-1.5 mt-2 mb-4 relative z-10">
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
        
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto relative z-10 shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Your Referral Code</span>
            <strong className="text-lg font-mono text-slate-800 tracking-wider flex items-center gap-2">
              {registration_id}
              <button onClick={() => handleCopyCode(registration_id)} className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors" title="Copy Code">
                {codeCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </strong>
          </div>
          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Referrals</span>
              <strong className="text-2xl font-bold text-slate-800">{referralsCount}</strong>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            <div className="text-right flex-1 sm:flex-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block mb-1">Impact Score</span>
              <strong className="text-2xl font-bold text-amber-600 flex items-center justify-end gap-1">
                <Sparkles size={16} />
                {couragePoints}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[320px] shrink-0 relative z-10 flex flex-col gap-4">
        {/* Ways to Contribute Guide */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-blue-100 shadow-sm">
          <h4 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <Share2 size={16} className="text-blue-600" />
            Ways to Multiply Impact
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-600 font-semibold leading-relaxed">
                Post the Identity Card above on your <strong className="text-slate-800">WhatsApp Status</strong>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-600 font-semibold leading-relaxed">
                Forward the link directly to close family and friends
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-600 font-semibold leading-relaxed">
                Share your referral code in social media groups
              </span>
            </li>
          </ul>
        </div>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `My child has registered for the Courage National Talent Search (CNTS) 2026.\n\nCNTS focuses on logical reasoning, problem-solving, and cognitive aptitude for students in Classes 5–8.\n\nIf you're interested, you can learn more here:\nhttps://www.thecouragelibrary.com\n\nReferral Code: ${registration_id}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="w-full px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl flex flex-col items-center justify-center gap-1 transition-all shadow-md hover:shadow-lg shadow-[#25D366]/20 active:scale-95 border border-[#1fa64f]"
        >
          <div className="flex items-center justify-center gap-2.5 w-full">
            <svg className="w-5 h-5 shrink-0 fill-current drop-shadow-sm" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            <span className="text-base font-bold tracking-wide whitespace-nowrap">Share on WhatsApp</span>
          </div>
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Forward to Friends</span>
        </a>
      </div>
    </div>
  );
}
