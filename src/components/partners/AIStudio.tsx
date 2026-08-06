'use client';

import React, { useState, useRef } from 'react';
import {
  Zap, Sparkles, Copy, Check, MessageSquare, Share2,
  Video, Mail, Mic, RefreshCw, Send, Layers,
  AlertTriangle, Loader2
} from 'lucide-react';

interface AIStudioProps {
  referralCode?: string;
  partnerName?: string;
  audienceScale?: string;
}

const formats = [
  { name: 'WhatsApp Broadcast', icon: MessageSquare, badge: 'High Conversion', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { name: 'Telegram Post', icon: Send, badge: 'Community', badgeColor: 'bg-blue-100 text-blue-700' },
  { name: 'LinkedIn Editorial', icon: Share2, badge: 'Professional', badgeColor: 'bg-indigo-100 text-indigo-700' },
  { name: 'X (Twitter) Thread', icon: Share2, badge: 'Viral', badgeColor: 'bg-slate-100 text-slate-700' },
  { name: 'Instagram Reel Script', icon: Video, badge: 'Video', badgeColor: 'bg-pink-100 text-pink-700' },
  { name: 'Carousel 6-Slide Outline', icon: Layers, badge: 'Graphics', badgeColor: 'bg-violet-100 text-violet-700' },
  { name: 'Email Newsletter', icon: Mail, badge: 'Longform', badgeColor: 'bg-amber-100 text-amber-700' },
  { name: 'Seminar Speech Notes', icon: Mic, badge: 'Institutional', badgeColor: 'bg-rose-100 text-rose-700' },
];

const tones = ['Inspirational', 'Urgent', 'Friendly & Casual', 'Professional', 'Storytelling', 'Data-Driven'];
const languages = ['Hinglish', 'Hindi', 'English', 'Urdu', 'Bengali'];
const audiences = ['Students & Parents', 'School Teachers', 'College Networks', 'WhatsApp Parent Groups', 'LinkedIn Educators'];

export const AIStudio: React.FC<AIStudioProps> = ({
  referralCode = 'CNTSJN',
  partnerName = 'Jan Mohammad',
  audienceScale,
}) => {
  const [selectedFormat, setSelectedFormat] = useState('WhatsApp Broadcast');
  const [selectedTone, setSelectedTone] = useState('Inspirational');
  const [selectedLanguage, setSelectedLanguage] = useState('Hinglish');
  const [targetAudience, setTargetAudience] = useState('Students & Parents');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  const referralUrl = `https://thecouragelibrary.com/register?ref=${referralCode}`;

  const defaultOutput = `📢 *BIG OPPORTUNITY FOR STUDENTS IN CLASS 5-8!*

Did you know that top national talent search exams disburse merit scholarships worth lakhs every year, but over 70% of students miss out simply because they didn't know the dates?

Courage Library has officially launched the **Courage National Talent Search 2026 (CNTS)**.

✨ **Key Benefits:**
• National Merit Recognition
• Official Talent Certificate
• Personal Cognitive Skill Diagnostic Report

Apply today using my official Courage Partner link:
👉 ${referralUrl}

Let's ensure no deserving student stays behind!`;

  const [generatedOutput, setGeneratedOutput] = useState(defaultOutput);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/partner/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: selectedFormat,
          tone: selectedTone,
          language: selectedLanguage,
          audience: targetAudience,
          referralCode,
          partnerName,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedOutput(data.content);
      setGenerationCount(c => c + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedOutput)}`;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* CONFIG PANEL */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" /> Configure Your Content
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Select format, tone, language, and audience — then generate.</p>
          </div>
          {generationCount > 0 && (
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-full font-bold">
              {generationCount} generated this session
            </span>
          )}
        </div>

        {/* Format Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Content Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {formats.map(({ name, icon: Icon, badge, badgeColor }) => (
              <button
                key={name}
                onClick={() => setSelectedFormat(name)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  selectedFormat === name
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-400'
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${selectedFormat === name ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>{badge}</span>
                </div>
                <span className={`text-xs font-bold leading-tight block ${selectedFormat === name ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone / Language / Audience selects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Tone</label>
            <select
              value={selectedTone}
              onChange={e => setSelectedTone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800"
            >
              {tones.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Language</label>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800"
            >
              {languages.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Target Audience</label>
            <select
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800"
            >
              {audiences.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
            isGenerating
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white hover:shadow-indigo-200 hover:shadow-xl hover:scale-[1.01]'
          }`}
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating with Gemini AI...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate {selectedFormat} with AI</>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-rose-800">Generation Failed</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-700 cursor-pointer text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* OUTPUT PANEL */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Output Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-slate-300 font-mono">Generated Output — {selectedFormat}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-mono">ref: {referralCode}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[220px] relative">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                <Sparkles className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm text-slate-400 font-medium">Gemini AI is crafting your {selectedLanguage} content...</p>
              <p className="text-xs text-slate-500">Tailored for {targetAudience} • {selectedTone} tone</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed">
              {generatedOutput}
            </pre>
          )}
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Open in WhatsApp
            </a>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} /> Regenerate
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all shadow"
          >
            {copied ? <><Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Content</>}
          </button>
        </div>
      </div>

      {/* Partner Code Footer */}
      <div className="text-center text-xs text-slate-400 font-mono bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4">
        Your content always includes: <strong className="text-indigo-700">{referralCode}</strong> →{' '}
        <code className="text-slate-600">{referralUrl}</code>
      </div>
    </div>
  );
};
