'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Copy, 
  Check, 
  MessageSquare, 
  Share2, 
  Video, 
  FileText, 
  Mail, 
  Mic, 
  RefreshCw,
  Send,
  Layers
} from 'lucide-react';

export const AIStudio: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>('WhatsApp Broadcast');
  const [selectedTone, setSelectedTone] = useState<string>('Inspirational');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Hinglish');
  const [targetAudience, setTargetAudience] = useState<string>('Students & Parents');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>(
    `📢 *BIG OPPORTUNITY FOR STUDENTS IN CLASS 5-12!*

Did you know that top national talent search exams disburse merit scholarships worth lakhs every year, but over 70% of students miss out simply because they didn't know the dates?

Courage Library has officially launched the **Courage National Talent Search 2026 (CNTS)**.

✨ **Key Benefits:**
• 100% Merit Scholarships
• Official Talent Certificate
• Personal Skill Diagnostic Report

Apply today using my official Courage Partner link:
👉 https://thecouragelibrary.com/register?ref=RAHUL2026

Let's ensure no deserving student stays behind!`
  );
  const [copied, setCopied] = useState<boolean>(false);

  const formats = [
    { name: 'WhatsApp Broadcast', icon: MessageSquare, badge: 'High Conversion' },
    { name: 'Telegram Post', icon: Send, badge: 'Community' },
    { name: 'LinkedIn Editorial', icon: Share2, badge: 'Professional' },
    { name: 'X (Twitter) Thread', icon: Share2, badge: 'Viral' },
    { name: 'Instagram Reel Script', icon: Video, badge: 'Video' },
    { name: 'Carousel 6-Slide Outline', icon: Layers, badge: 'Graphics' },
    { name: 'Email Newsletter', icon: Mail, badge: 'Longform' },
    { name: 'Seminar Speech Notes', icon: Mic, badge: 'Institutional' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (selectedFormat === 'Instagram Reel Script') {
        setGeneratedOutput(
          `🎬 **REEL SCRIPT: 3 Secrets to Unlock National Scholarships**

[0:00 - 0:03] HOOK (Show text on screen):
"Stop scrolling if you have a brother, sister, or student in Class 5 to 12!"

[0:03 - 0:15] BODY:
"Every year, thousands of students lose out on merit scholarships not because they aren't smart—but because they miss the deadline for national talent search exams."

[0:15 - 0:30] SOLUTION:
"Courage Library's CNTS 2026 is officially open! It tests core problem-solving and offers 100% tuition waivers plus official national ranking."

[0:30 - 0:45] CALL TO ACTION:
"Click the link in my bio to register through my Courage Partner link or comment 'SCHOLARSHIP' below and I'll send you the direct form!"`
        );
      } else if (selectedFormat === 'LinkedIn Editorial') {
        setGeneratedOutput(
          `As educators and mentors, we often discuss bridge gaps in Indian secondary education.

One of the most persistent issues isn't aptitude—it's access to structured scholarship diagnostic tests in Tier-2 & Tier-3 cities.

I am proud to collaborate as an official Courage Partner with Courage Library for the Courage National Talent Search 2026 (CNTS).

Why this matters for your school or network:
1. Standardized merit assessment mapped to national standards.
2. 100% tuition waivers for top performers.
3. Institutional analytics for participating schools.

If you are a school principal, teacher, or parent network leader, let's connect students to this opportunity.

Official Link: https://thecouragelibrary.com/register?ref=RAHUL2026

#Education #CouragePartner #ScholarshipsIndia #Pedagogy`
        );
      } else if (selectedFormat === 'Carousel 6-Slide Outline') {
        setGeneratedOutput(
          `🖼️ **CAROUSEL OUTLINE: How CNTS 2026 Unlocks Student Potential**

Slide 1: [Title] 5 Things Every Parent Should Know About CNTS 2026 🎓
Slide 2: [Problem] Standard school marks don't always reveal deep analytical talent.
Slide 3: [Solution] CNTS tests critical thinking, logic, and core subject mastery.
Slide 4: [Reward] Top scorers win 100% Merit Scholarships & National Mentorship.
Slide 5: [Proof] Over 250,000+ students already impacted across 1,400+ schools.
Slide 6: [CTA] Swipe up or link in bio to register via Courage Partner Code: RAHULEDU`
        );
      } else {
        setGeneratedOutput(
          `📢 *${selectedFormat.toUpperCase()} GENERATED CONTENT* (${selectedLanguage})

Theme: Educational Opportunity & CNTS 2026
Tone: ${selectedTone}

Every student deserves a fair chance to shine nationally. Through Courage Library, Class 5-12 students can now take the Courage National Talent Search 2026.

👉 Register here: https://courage.org/p/rahuledu`
        );
      }
      setIsGenerating(false);
    }, 600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="bg-[#0F172A] text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-amber-400/30">
              <Zap className="w-3.5 h-3.5" /> AI Partner Copilot Studio
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Multi-Format AI Content Generator
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Generate high-converting educational broadcasts, scripts, carousel outlines, and articles customized for Indian students & parents.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              AI
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Model Status</span>
              <span className="text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Ready (100% Free)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STUDIO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT CONFIGURATION PANEL */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. Select Content Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map(fmt => {
                const Icon = fmt.icon;
                const active = selectedFormat === fmt.name;
                return (
                  <button
                    key={fmt.name}
                    onClick={() => setSelectedFormat(fmt.name)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      active 
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm font-semibold' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {fmt.badge}
                      </span>
                    </div>
                    <span className="text-xs">{fmt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tone</label>
              <select
                value={selectedTone}
                onChange={e => setSelectedTone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:ring-2 focus:ring-indigo-600"
              >
                <option>Inspirational</option>
                <option>Institutional & Formal</option>
                <option>Urgent & Direct</option>
                <option>Storytelling</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:ring-2 focus:ring-indigo-600"
              >
                <option>Hinglish</option>
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full btn-primary text-sm py-3.5 shadow-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generating Content...' : `Generate ${selectedFormat}`}
          </button>
        </div>

        {/* RIGHT GENERATED OUTPUT PANEL */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="font-bold text-sm text-slate-900">
                  AI Output: <span className="text-indigo-600">{selectedFormat}</span>
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {selectedLanguage} • {selectedTone}
              </span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap min-h-[320px] shadow-inner border border-slate-800">
              {generatedOutput}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Partner Code: <code className="text-amber-600 font-bold">RAHULEDU</code> included
            </span>
            <button
              onClick={copyToClipboard}
              className="btn-primary text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Copy Generated Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
