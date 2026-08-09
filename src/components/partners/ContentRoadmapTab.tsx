'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Video, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  PlayCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileText,
  Share2,
  Zap,
  Target,
  Bot,
  ExternalLink,
  Wand2,
  Globe,
  Sliders,
  MessageSquare,
  Mic,
  Scissors,
  Cpu
} from 'lucide-react';

interface ContentRoadmapTabProps {
  referralCode?: string;
  partnerName?: string;
}

interface TimelinePhase {
  phaseNumber: number;
  phaseName: string;
  dateRange: string;
  status: 'Active' | 'Upcoming' | 'Urgent' | 'Exam Day';
  statusColor: string;
  goalText: string;
  videoConcepts: {
    id: string;
    title: string;
    type: 'Reel / Short' | 'Long Video' | 'WhatsApp Broadcast' | 'Live Stream';
    hookText: string;
    scriptOutline: string;
    callToAction: string;
    recommendedPostingDays: string;
  }[];
}

export const ContentRoadmapTab: React.FC<ContentRoadmapTabProps> = ({
  referralCode = 'CNTSJN',
  partnerName = 'Partner'
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('v1');

  // VIDEO SUBMISSION MODAL & INLINE CARD INPUT STATE
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [submittingVideoTopic, setSubmittingVideoTopic] = useState<any | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');
  const [videoPlatformInput, setVideoPlatformInput] = useState<string>('Instagram Reel');
  const [videoNotesInput, setVideoNotesInput] = useState<string>('');
  const [isSubmittingVideo, setIsSubmittingVideo] = useState<boolean>(false);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  // INLINE CARD INPUT STATE FOR EVERY ROADMAP CARD
  const [cardInputs, setCardInputs] = useState<Record<string, string>>({});
  const [submittedMap, setSubmittedMap] = useState<Record<string, string>>({});
  const [submittingCardId, setSubmittingCardId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // FETCH EXISTING SUBMISSIONS ON MOUNT
  React.useEffect(() => {
    fetch(`/api/partner/video-submissions?referralCode=${encodeURIComponent(referralCode)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.submissions)) {
          const inputs: Record<string, string> = {};
          const map: Record<string, string> = {};
          data.submissions.forEach((sub: any) => {
            const topicId = sub.video_topic_id || sub.videoTopicId || 'v1';
            const url = sub.video_url || sub.videoUrl;
            if (url) {
              inputs[topicId] = url;
              map[topicId] = url;
            }
          });
          setCardInputs(prev => ({ ...inputs, ...prev }));
          setSubmittedMap(prev => ({ ...map, ...prev }));
        }
      })
      .catch(err => console.error('Error fetching video submissions:', err));
  }, [referralCode]);

  const handleInlineCardSubmit = async (video: any) => {
    const url = (cardInputs[video.id] || '').trim();
    if (!url) return;

    setSubmittingCardId(video.id);
    try {
      const res = await fetch('/api/partner/video-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode,
          videoTopicId: video.id,
          videoTitle: video.title,
          platform: url.includes('youtube') || url.includes('youtu.be') ? 'YouTube Short' : 'Instagram Reel',
          videoUrl: url,
          notes: `Inline roadmap card submission for ${video.title}`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedMap(prev => ({ ...prev, [video.id]: url }));
        setToastMsg(`🎉 Video link saved & submitted for admin verification!`);
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch (err) {
      console.error('Inline video submission error:', err);
    } finally {
      setSubmittingCardId(null);
    }
  };

  // MASTER AI PROMPT GENERATOR STATE
  const [promptLanguage, setPromptLanguage] = useState<string>('Hinglish');
  const [promptFormat, setPromptFormat] = useState<string>('Reel / Short (60 Sec)');
  const [promptAudience, setPromptAudience] = useState<string>('Parents of Class 5-8 Students');
  const [copiedMasterPrompt, setCopiedMasterPrompt] = useState<boolean>(false);

  const referralLink = `https://thecouragelibrary.com/register?ref=${referralCode}`;

  const copyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVideoSubmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrlInput.trim()) return;

    setIsSubmittingVideo(true);
    setSubmissionSuccessMsg(null);

    try {
      const res = await fetch('/api/partner/video-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode,
          videoTopicId: submittingVideoTopic?.id || selectedTopicId,
          videoTitle: submittingVideoTopic?.title || 'Partner Video Campaign',
          platform: videoPlatformInput,
          videoUrl: videoUrlInput.trim(),
          notes: videoNotesInput.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionSuccessMsg('🎉 Video link submitted successfully! Admin will review & award points shortly.');
        setTimeout(() => {
          setShowSubmitModal(false);
          setVideoUrlInput('');
          setVideoNotesInput('');
          setSubmissionSuccessMsg(null);
        }, 2200);
      }
    } catch (err) {
      console.error('Failed to submit video:', err);
    } finally {
      setIsSubmittingVideo(false);
    }
  };

  // FULL 8 VIDEO TOPICS ROADMAP LOOKUP
  const allTopics = [
    { id: 'v1', phase: 1, title: '🎬 Video #1: What is CNTS 2026? (National Talent Search Opportunity)', hook: '“Parents of Class 5, 6, 7 & 8 students, don’t scroll past this! India’s biggest talent search exam is here…”' },
    { id: 'v2', phase: 1, title: '🎬 Video #2: Why School Marks Are Not Enough For Your Child', hook: '“Getting 95% in school doesn’t guarantee competitive exam success. Here is why…”' },
    { id: 'v3', phase: 2, title: '🎬 Video #3: CNTS 2026 Complete Exam Pattern & Marks Breakdown', hook: '“Curious about what questions come in CNTS 2026? Here is the exact subject breakdown for Class 5-8…”' },
    { id: 'v4', phase: 2, title: '🎬 Video #4: How Class 5-8 Students Can Prepare in 10 Days', hook: '“3 simple tips to score top marks in Courage National Talent Search 2026…”' },
    { id: 'v5', phase: 3, title: '🚨 Video #5: URGENT: Only 3 Days Left to Register for CNTS 2026!', hook: '“LAST CHANCE! Registrations for CNTS 2026 close in 72 hours! Don’t let your child miss out…”' },
    { id: 'v6', phase: 3, title: '📲 Video #6: How to Register for CNTS in 60 Seconds (Mobile Demo)', hook: '“Step-by-step screen recording showing exactly how to register your student on mobile…”' },
    { id: 'v7', phase: 4, title: '🎟️ Video #7: CNTS 2026 Admit Cards Out Now! How to Download & Check Slot', hook: '“CNTS 2026 Admit Cards are LIVE! Here is how to download your hall ticket in 10 seconds…”' },
    { id: 'v8', phase: 5, title: '🏆 Video #8: Best of Luck to All CNTS 2026 Candidates Today!', hook: '“Today is the day! Best of luck to all Class 5-8 candidates taking CNTS 2026 across India…”' },
  ];

  const activeTopicObj = allTopics.find(t => t.id === selectedTopicId) || allTopics[0];

  // DYNAMIC MASTER AI PROMPT GENERATION (BASED ON SELECTED VIDEO TOPIC)
  const masterAiPrompt = `ACT AS A WORLD-CLASS EDUCATION CONTENT CREATOR & VIRAL SCRIPTWRITER.

Your task is to write a highly engaging, viral ${promptFormat} script in ${promptLanguage}.

TARGET AUDIENCE: ${promptAudience}.
SELECTED VIDEO TOPIC: "${activeTopicObj.title}"
RECOMMENDED OPENING HOOK: ${activeTopicObj.hook}
PROJECT & EVENT: Courage National Talent Search (CNTS) 2026 (Exam Date: 30 August 2026, Registration Fee: ₹99).

CORE OBJECTIVES & SCRIPT STRUCTURE:
1. OPENING HOOK (First 3 Seconds): Use or adapt the recommended hook: ${activeTopicObj.hook}
2. PAIN POINT / PROBLEM: Explain why school report card marks (95%) only test memory, whereas CNTS tests Critical Thinking, Logical Reasoning, Science & Mathematics.
3. SOLUTION & VALUE: Present CNTS 2026 as the ultimate national diagnostic assessment for Class 5-8 students. Mention national rank certificates & cognitive diagnostic reports.
4. CALL TO ACTION (CTA): Tell the viewer to click the link in bio/description using official referral code "${referralCode}" (${referralLink}).

PLEASE FORMAT THE OUTPUT WITH:
- Visual Scene Cues [Camera Angle & B-Roll Action]
- Word-for-Word Spoken Audio Script (in ${promptLanguage})
- On-Screen Text Overlay Captions
- Video Title & 5 High-Reach Trending Hashtags`;

  const copyMasterPrompt = () => {
    navigator.clipboard.writeText(masterAiPrompt);
    setCopiedMasterPrompt(true);
    setTimeout(() => setCopiedMasterPrompt(false), 2500);
  };

  const timelinePhases: TimelinePhase[] = [
    {
      phaseNumber: 1,
      phaseName: 'Phase 1: Talent Search & National Awareness Drive',
      dateRange: 'Aug 1 – Aug 15',
      status: 'Active',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      goalText: 'Introduce CNTS 2026, National Merit Recognition, and why Class 5–8 students must participate.',
      videoConcepts: [
        {
          id: 'v1',
          title: '🎬 Video #1: What is CNTS 2026? (National Talent Search Opportunity)',
          type: 'Reel / Short',
          hookText: '“Parents of Class 5, 6, 7 & 8 students, don’t scroll past this! India’s biggest talent search exam is here…”',
          scriptOutline: '1. Hook: Catch parents’ attention about Class 5-8 national talent search.\n2. Problem: School marks only test memory, not logic or critical thinking.\n3. Solution: Introduce CNTS 2026 (₹99 fee, Merit Recognition & National Profile Report).\n4. Call to Action: Click the link in bio/description to register before slots fill up!',
          callToAction: `Register for CNTS 2026 now using referral code ${referralCode}: ${referralLink}`,
          recommendedPostingDays: 'Post between Aug 1 – Aug 7'
        },
        {
          id: 'v2',
          title: '🎬 Video #2: Why School Marks Are Not Enough For Your Child',
          type: 'Reel / Short',
          hookText: '“Getting 95% in school doesn’t guarantee competitive exam success. Here is why…”',
          scriptOutline: '1. Highlight the gap between school exams and competitive exams like NTSE/Olympiads.\n2. Show how CNTS tests Logical Reasoning, Mathematics, Critical Thinking & Science.\n3. Explain the ₹99 fee and diagnostic report benefits.\n4. Call to Action: Register your child today.',
          callToAction: `Direct registration link: ${referralLink}`,
          recommendedPostingDays: 'Post between Aug 8 – Aug 15'
        }
      ]
    },
    {
      phaseNumber: 2,
      phaseName: 'Phase 2: Exam Pattern & Syllabus Walkthrough',
      dateRange: 'Aug 16 – Aug 22',
      status: 'Upcoming',
      statusColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      goalText: 'Educate parents & students on the 4 exam subjects, question format, and practice sample papers.',
      videoConcepts: [
        {
          id: 'v3',
          title: '🎬 Video #3: CNTS 2026 Complete Exam Pattern & Marks Breakdown',
          type: 'Long Video',
          hookText: '“Curious about what questions come in CNTS 2026? Here is the exact subject breakdown for Class 5-8…”',
          scriptOutline: '1. Break down the 4 subjects: Mathematics, Logical Reasoning, Science, Critical Thinking.\n2. Explain online mock exam interface and sample papers.\n3. Show how students can practice on Courage Academy.\n4. CTA: Register child now to get instant practice papers.',
          callToAction: `Official CNTS Registration & Sample Papers Link: ${referralLink}`,
          recommendedPostingDays: 'Post between Aug 16 – Aug 19'
        },
        {
          id: 'v4',
          title: '🎬 Video #4: How Class 5-8 Students Can Prepare in 10 Days',
          type: 'Reel / Short',
          hookText: '“3 simple tips to score top marks in Courage National Talent Search 2026…”',
          scriptOutline: '1. Tip 1: Practice 15 mins daily on Courage Academy.\n2. Tip 2: Focus on Logical Reasoning puzzles.\n3. Tip 3: Take the official online mock test.\n4. CTA: Register today for ₹99.',
          callToAction: `Start preparation now: ${referralLink}`,
          recommendedPostingDays: 'Post between Aug 20 – Aug 22'
        }
      ]
    },
    {
      phaseNumber: 3,
      phaseName: 'Phase 3: Registration Deadline Urgency (Final Push)',
      dateRange: 'Aug 23 – Aug 26',
      status: 'Urgent',
      statusColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      goalText: 'Create maximum FOMO & urgency as CNTS 2026 registrations reach closing deadline.',
      videoConcepts: [
        {
          id: 'v5',
          title: '🚨 Video #5: URGENT: Only 3 Days Left to Register for CNTS 2026!',
          type: 'Reel / Short',
          hookText: '“LAST CHANCE! Registrations for CNTS 2026 close in 72 hours! Don’t let your child miss out…”',
          scriptOutline: '1. Urgency Hook: Registrations closing in 3 days.\n2. Remind ₹99 fee, national rank certificate, and report.\n3. Show how fast mobile registration takes (60 seconds).\n4. Strong CTA: Click link in bio RIGHT NOW before portal closes!',
          callToAction: `URGENT: Register before deadline closes: ${referralLink}`,
          recommendedPostingDays: 'Post on Aug 23 - Aug 24'
        },
        {
          id: 'v6',
          title: '📲 Video #6: How to Register for CNTS in 60 Seconds (Mobile Demo)',
          type: 'Reel / Short',
          hookText: '“Step-by-step screen recording showing exactly how to register your student on mobile…”',
          scriptOutline: '1. Record screen: Open link -> Enter Name, Class, Phone -> Pay ₹99 -> Get Candidate ID.\n2. Show instant receipt and admit card confirmation.\n3. CTA: Link is in bio!',
          callToAction: `Register in 60 seconds: ${referralLink}`,
          recommendedPostingDays: 'Post on Aug 25 - Aug 26'
        }
      ]
    },
    {
      phaseNumber: 4,
      phaseName: 'Phase 4: Admit Card Release & Mock System Check',
      dateRange: 'Aug 27 – Aug 29',
      status: 'Upcoming',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      goalText: 'Ensure registered students download admit cards, verify candidate IDs, and complete system checks.',
      videoConcepts: [
        {
          id: 'v7',
          title: '🎟️ Video #7: CNTS 2026 Admit Cards Out Now! How to Download & Check Slot',
          type: 'Reel / Short',
          hookText: '“CNTS 2026 Admit Cards are LIVE! Here is how to download your hall ticket in 10 seconds…”',
          scriptOutline: '1. Announcement: Admit cards are live.\n2. Walkthrough: Enter Candidate ID -> Download Admit Card PDF.\n3. Remind exam date: Sunday, 30 August 2026.\n4. CTA: Check your admit card link!',
          callToAction: `Download Admit Card: https://thecouragelibrary.com/admit-card-portal`,
          recommendedPostingDays: 'Post on Aug 27 - Aug 29'
        }
      ]
    },
    {
      phaseNumber: 5,
      phaseName: 'Phase 5: CNTS 2026 National Exam Day!',
      dateRange: '30 August 2026',
      status: 'Exam Day',
      statusColor: 'bg-emerald-400 text-slate-950 font-black',
      goalText: 'Wish candidates good luck and drive 100% exam turnout across all registered students.',
      videoConcepts: [
        {
          id: 'v8',
          title: '🏆 Video #8: Best of Luck to All CNTS 2026 Candidates Today!',
          type: 'Reel / Short',
          hookText: '“Today is the day! Best of luck to all Class 5-8 candidates taking CNTS 2026 across India…”',
          scriptOutline: '1. Congratulations to all registered students.\n2. Exam guidelines: Stable internet connection, quiet room, Candidate ID ready.\n3. Result date announcement update.\n4. Encourage students in comments!',
          callToAction: `Access Exam Portal: https://thecouragelibrary.com/dashboard`,
          recommendedPostingDays: 'Post on Morning of Aug 30'
        }
      ]
    }
  ];

  // REAL BRAND SVG ICONS SUITE
  const aiToolsList = [
    {
      name: 'ChatGPT',
      type: 'Master Script Generation',
      badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      url: 'https://chatgpt.com',
      desc: 'Paste the Master Prompt to generate complete viral scripts in your language.',
      iconSvg: (
        <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      )
    },
    {
      name: 'Claude AI',
      type: 'High-Converting Copy',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      url: 'https://claude.ai',
      desc: 'Generates natural, humanized Hinglish & regional language scripts.',
      iconSvg: (
        <svg className="w-5 h-5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M5.636 18.364L18.364 5.636"/>
        </svg>
      )
    },
    {
      name: 'Google Gemini',
      type: 'Real-Time Insights',
      badgeBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      url: 'https://gemini.google.com',
      desc: 'Great for factual educational talking points and YouTube video titles.',
      iconSvg: (
        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/>
        </svg>
      )
    },
    {
      name: 'ElevenLabs',
      type: 'Realistic AI Voiceover',
      badgeBg: 'bg-purple-50 text-purple-600 border-purple-200',
      url: 'https://elevenlabs.io',
      desc: 'Generate ultra-realistic voiceovers in Hindi/English for your video reels.',
      iconSvg: (
        <Mic className="w-5 h-5 text-purple-600" />
      )
    },
    {
      name: 'CapCut / OpusClip',
      type: 'Auto-Captions & Shorts',
      badgeBg: 'bg-rose-50 text-rose-600 border-rose-200',
      url: 'https://www.capcut.com',
      desc: 'Auto-generate animated subtitles and edit 60-second shorts in 1 click.',
      iconSvg: (
        <Scissors className="w-5 h-5 text-rose-600" />
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-7 animate-fade-in pb-12 font-sans text-[#0F172A]">

      {/* FLOATING SUCCESS TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="bg-emerald-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-100 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> CNTS 2026 Official Video Campaign Calendar
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Content & Video Roadmap to Aug 30 Exam
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
              Use our Master AI Prompt Generator below to generate full video scripts in your language using ChatGPT, Claude, or Gemini!
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl shrink-0 text-right space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Official Exam Date</span>
            <span className="font-mono text-sm font-black text-indigo-700 flex items-center justify-end gap-1">
              📅 30 August 2026
            </span>
          </div>
        </div>

        {/* PHASE TAB SELECTOR — RESPONSIVE EQUAL ALIGNMENT */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {timelinePhases.map(p => (
            <button
              key={p.phaseNumber}
              type="button"
              onClick={() => setSelectedPhase(p.phaseNumber)}
              className={`py-2 px-3 rounded-2xl text-[11px] font-extrabold transition-all cursor-pointer text-center justify-center flex flex-col items-center gap-0.5 ${
                selectedPhase === p.phaseNumber
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span className="truncate w-full font-black">Phase {p.phaseNumber}</span>
              <span className="text-[10px] opacity-80 font-mono font-medium truncate w-full">{p.dateRange}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MASTER AI PROMPT SYSTEM & TOOL RECOMMENDER ENGINE */}
      <div id="master-prompt-generator" className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              <Bot className="w-4 h-4 text-indigo-600" /> Master AI Prompt Generator
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Generate 100% Perfect AI Video Scripts in Your Language
            </h2>
          </div>

          <button
            type="button"
            onClick={copyMasterPrompt}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
          >
            {copiedMasterPrompt ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMasterPrompt ? 'Master Prompt Copied!' : 'Copy Master AI Prompt'}</span>
          </button>
        </div>

        {/* PROMPT CONTROLS SELECTORS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Selector 1: Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" /> Target Language
            </label>
            <select
              value={promptLanguage}
              onChange={(e) => setPromptLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Hinglish">Hinglish (Hindi + English)</option>
              <option value="Hindi">Hindi (शुद्ध हिंदी)</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              <option value="Kannada">Kannada (কন্নড়)</option>
            </select>
          </div>

          {/* Selector 2: Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-indigo-600" /> Video Format
            </label>
            <select
              value={promptFormat}
              onChange={(e) => setPromptFormat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Reel / Short (60 Sec)">Instagram Reel / YouTube Short (60 Sec)</option>
              <option value="Long YouTube Video (3-5 Min)">Long YouTube Video (3–5 Min)</option>
              <option value="WhatsApp Broadcast Message">WhatsApp Broadcast Text & Audio Note</option>
            </select>
          </div>

          {/* Selector 3: Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Target Audience
            </label>
            <select
              value={promptAudience}
              onChange={(e) => setPromptAudience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Parents of Class 5-8 Students">Parents of Class 5–8 Students</option>
              <option value="Class 5-8 Students">Class 5–8 Students Directly</option>
              <option value="School Principals & Teachers">School Principals & Teachers</option>
              <option value="Coaching Institutes & Tutors">Coaching Institutes & Tutors</option>
            </select>
          </div>

          {/* Selector 4: Target Video Topic (All 8 Topics Intact) */}
          <div className="space-y-1.5 sm:col-span-3">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-indigo-600" /> Selected Video Topic (Choose Any of the 8 Topics)
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                const found = allTopics.find(t => t.id === e.target.value);
                if (found) setSelectedPhase(found.phase);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {allTopics.map(t => (
                <option key={t.id} value={t.id}>
                  [Phase {t.phase}] {t.title}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* GENERATED MASTER PROMPT DISPLAY BOX */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-5 border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-300 tracking-wider">
              Generated Master AI Prompt for {activeTopicObj.title.split(':')[0]}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-filled Code: <strong className="text-amber-300">{referralCode}</strong>
            </span>
          </div>

          <pre className="whitespace-pre-wrap font-mono text-xs text-indigo-200 leading-relaxed max-h-56 overflow-y-auto scrollbar-thin">
            {masterAiPrompt}
          </pre>
        </div>

        {/* RECOMMENDED AI TOOLS DISCOVERY SUITE WITH REAL BRAND SVG ICONS */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-indigo-600" /> Recommended AI Tools Suite
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {aiToolsList.map(tool => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 transition-all group flex flex-col justify-between h-full space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl border ${tool.badgeBg}`}>
                      {tool.iconSvg}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">{tool.name}</h4>
                    <span className="text-[10px] text-indigo-600 font-extrabold block mt-0.5">{tool.type}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed border-t border-slate-200/60 pt-2">
                  {tool.desc}
                </p>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* SELECTED PHASE DETAILED SEQUENCE */}
      {timelinePhases.filter(p => p.phaseNumber === selectedPhase).map(phase => (
        <div key={phase.phaseNumber} className="space-y-6 animate-fade-in">
          
          {/* Phase Header Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${phase.statusColor}`}>
                  ● {phase.status} ({phase.dateRange})
                </span>
                <h2 className="font-display text-xl font-bold text-slate-900">{phase.phaseName}</h2>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              <strong>Phase Objective:</strong> {phase.goalText}
            </p>
          </div>

          {/* Video Blueprint Cards (ALL 2 TOPICS INTACK PER PHASE) */}
          <div className="space-y-4">
            {phase.videoConcepts.map(video => {
              const isCurrentActive = selectedTopicId === video.id;
              return (
                <div 
                  key={video.id} 
                  className={`bg-white p-6 rounded-3xl border transition-all space-y-4 ${
                    isCurrentActive ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  
                  {/* Top Row: Video Title & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        {video.type} • {video.recommendedPostingDays}
                      </span>
                      <h3 className="font-display text-base font-bold text-slate-900">{video.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Button 1: Load into Master Prompt Generator */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTopicId(video.id);
                          setSelectedPhase(phase.phaseNumber);
                          document.getElementById('master-prompt-generator')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate Master Prompt</span>
                      </button>

                      {/* Button 2: Submit Published Video Link */}
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittingVideoTopic(video);
                          setShowSubmitModal(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Submit Video Link</span>
                      </button>

                      {/* Button 3: Copy Raw Outline Script */}
                      <button
                        type="button"
                        onClick={() => copyScript(video.id, `${video.title}\n\nHOOK:\n${video.hookText}\n\nSCRIPT OUTLINE:\n${video.scriptOutline}\n\nCALL TO ACTION:\n${video.callToAction}`)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 transition-colors cursor-pointer border border-slate-300"
                      >
                        {copiedId === video.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === video.id ? 'Copied' : 'Outline'}
                      </button>
                    </div>
                  </div>

                  {/* Video Hook Box */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                      🔥 Recommended Video Opening Hook (First 3 Seconds)
                    </span>
                    <p className="text-xs font-extrabold text-amber-950 italic">
                      {video.hookText}
                    </p>
                  </div>

                  {/* Script Outline */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      📝 Video Script Blueprint & Talking Points
                    </span>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                      {video.scriptOutline}
                    </pre>
                  </div>

                  {/* CTA & Referral Link Bar */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Video Description Call-to-Action Link</span>
                      <span className="font-mono text-xs text-amber-300 font-bold truncate block">{video.callToAction}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyScript(`${video.id}-cta`, video.callToAction)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedId === `${video.id}-cta` ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === `${video.id}-cta` ? 'Copied' : 'Copy CTA'}
                    </button>
                  </div>

                  {/* INLINE VIDEO LINK SUBMISSION FIELD IN EVERY CARD */}
                  <div className="p-4 rounded-2xl bg-[#0F172A] text-white space-y-2.5 border border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{submittedMap[video.id] ? 'Your Submitted Reel / Video Link' : 'Submit Your Published Video Link'}</span>
                      </label>
                      {submittedMap[video.id] && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Submitted & Under Review
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          placeholder="Paste your Instagram Reel / YouTube Short URL (e.g. https://instagram.com/reel/...)"
                          value={cardInputs[video.id] || ''}
                          onChange={e => setCardInputs(prev => ({ ...prev, [video.id]: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={submittingCardId === video.id || !(cardInputs[video.id] || '').trim()}
                        onClick={() => handleInlineCardSubmit(video)}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {submittingCardId === video.id ? (
                          <span>Saving...</span>
                        ) : submittedMap[video.id] ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-200" />
                            <span>Update Link</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4 text-emerald-200" />
                            <span>Submit Link</span>
                          </>
                        )}
                      </button>

                      {submittedMap[video.id] && (
                        <a
                          href={submittedMap[video.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                          <span>View Video</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ))}

      {/* FOOTER TIP CARD */}
      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
        <div className="font-extrabold flex items-center gap-1.5 text-emerald-900 text-sm">
          <Zap className="w-4 h-4 text-emerald-600" /> Pro Creator Strategy for CNTS 2026
        </div>
        <p className="text-emerald-900/80 font-medium leading-relaxed">
          Consistency is key! Post 2–3 short videos every week following this timeline sequence. Share your video links inside your WhatsApp groups and pin your CNTS referral link (<code className="font-mono font-bold text-emerald-950">{referralLink}</code>) in the comments!
        </p>
      </div>

      {/* VIDEO SUBMISSION MODAL FOR ADMIN REVIEW */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-scale-up relative">
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Track Campaign Video
              </span>
              <h3 className="font-display font-black text-xl text-slate-900">
                Submit Published Video Link
              </h3>
              <p className="text-xs text-slate-500">
                Submit your published video link so the admin team can verify views, award points, and feature your video!
              </p>
            </div>

            {submissionSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 text-center animate-fade-in">
                {submissionSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleVideoSubmissionSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Video Topic</label>
                  <input
                    type="text"
                    disabled
                    value={submittingVideoTopic?.title || 'CNTS Video Campaign'}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Platform</label>
                  <select
                    value={videoPlatformInput}
                    onChange={(e) => setVideoPlatformInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Instagram Reel">Instagram Reel</option>
                    <option value="YouTube Short">YouTube Short</option>
                    <option value="YouTube Long Video">YouTube Long Video (3-5 Min)</option>
                    <option value="WhatsApp Status / Broadcast">WhatsApp Status / Broadcast</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Published Video URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.instagram.com/reel/... or https://youtu.be/..."
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Notes / Views Count (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Posted at 6 PM, received 2,400 views & 15 registrations"
                    value={videoNotesInput}
                    onChange={(e) => setVideoNotesInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingVideo}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {isSubmittingVideo ? 'Submitting...' : 'Submit Video Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
