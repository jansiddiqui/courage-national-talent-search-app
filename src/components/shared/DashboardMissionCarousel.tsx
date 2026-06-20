"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, Users, Trophy, Check, Copy, Award, BookOpen, Share2, CheckCircle, HeartHandshake } from "lucide-react";

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
      title: "Help Us Reach More Bright Minds",
      icon: <HeartHandshake size={24} className="text-rose-500" />,
      text: "We are on a mission to discover talent all over India. We need your voluntary support to spread the word. Share your code with other parents.",
    },
    {
      title: "Exclusive Milestone Rewards",
      icon: <Award size={24} className="text-blue-500" />,
      text: "Unlock specific rewards: 3 Referrals = Premium Mock Test Pack. 5 Referrals = Advanced Cognitive Assessment Report. 10 Referrals = Full ₹99 Refund. 20 Referrals = Founding Ambassador Certificate.",
    },
    {
      title: "Track Your Courage Points",
      icon: <Trophy size={24} className="text-amber-500" />,
      text: "You earn escalating Courage Points for every successful referral. The higher your points, the faster you unlock your premium milestones and National Felicitation.",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className="bg-white rounded-3xl border border-blue-200 shadow-sm overflow-hidden flex flex-col">
      {/* Task Heading */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
            <HeartHandshake size={16} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-900">Task For Parents</h2>
            <p className="text-[10px] sm:text-xs text-blue-600/80 font-medium mt-0.5">Voluntary Mission to empower students nationwide</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-0 relative">
        {/* Background Mission Graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        {/* Left Side: Carousel & Stats */}
        <div className="flex-1 relative z-10 p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          
          <div className="relative min-h-[160px] sm:min-h-[130px] mb-6">
            {cards.map((card, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col justify-center ${
                  idx === activeIndex 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <h3 className="font-display font-bold text-slate-800 text-xl sm:text-2xl flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shadow-sm shrink-0">
                    {card.icon}
                  </div>
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-lg">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="flex items-center gap-1.5 mb-8 relative z-10">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "w-8 bg-blue-600" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
          
          {/* Collapsed Stats Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto relative z-10">
            <div className="w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Your Unique Code</span>
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <strong className="text-lg sm:text-xl font-mono text-slate-800 tracking-wider">
                  {registration_id}
                </strong>
                <button onClick={() => handleCopyCode(registration_id)} className="text-blue-600 hover:text-blue-800 p-2 rounded-lg bg-blue-100/50 hover:bg-blue-100 transition-colors" title="Copy Code">
                  {codeCopied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            
            <div className="w-full sm:w-px sm:h-10 bg-slate-200"></div>
            
            <div className="flex items-center justify-between sm:justify-start gap-6 w-full sm:w-auto">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Referrals</span>
                <strong className="text-2xl font-black text-slate-800">{referralsCount}</strong>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 block mb-1">Courage Points</span>
                <strong className="text-2xl font-black text-amber-500 flex items-center justify-end sm:justify-start gap-1.5">
                  <Sparkles size={18} />
                  {couragePoints}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Guide */}
        <div className="w-full lg:w-[360px] shrink-0 bg-slate-50/50 p-6 md:p-8 relative z-10 flex flex-col justify-center">
          
          <h4 className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <Share2 size={16} className="text-blue-600" />
            How You Can Help
          </h4>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <span className="text-xs font-bold">1</span>
              </div>
              <span className="text-sm text-slate-600 font-medium leading-relaxed">
                Put your child's Identity Card on your <strong className="text-slate-800">WhatsApp Status</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <span className="text-xs font-bold">2</span>
              </div>
              <span className="text-sm text-slate-600 font-medium leading-relaxed">
                Directly tell your close family and friends about CNTS
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <span className="text-xs font-bold">3</span>
              </div>
              <span className="text-sm text-slate-600 font-medium leading-relaxed">
                Share your unique referral code in social media groups
              </span>
            </li>
          </ul>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Hello! 👋\n\nI just enrolled my child in the Courage National Talent Search (CNTS) 2026. It's a brilliant national-level assessment focusing on logical reasoning, problem-solving, and cognitive aptitude for students in Classes 5–8.\n\nI highly recommend checking it out for your child too! It helps uncover their true learning potential.\n\nYou can learn more and register here:\nhttps://cnts.in\n\nWhen registering, please use my Referral Code: *${registration_id}*\n\nLet's encourage our kids together! 🚀`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full px-4 sm:px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl shadow-[#25D366]/25 active:scale-95 border border-[#1fa64f] group"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 fill-current drop-shadow-sm group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm sm:text-base font-bold tracking-wide leading-tight">Share on WhatsApp</span>
            <span className="text-[10px] sm:text-xs font-semibold text-white/80 tracking-wider">Spread the word</span>
          </div>
        </a>
          
        </div>
      </div>
    </div>
  );
}
