"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ContentCMS } from "@/domains/academy/content/ContentCMS";
import { localProgressRepository } from "@/domains/academy/core/repositories/LocalRepository";
import { LearningService } from "@/domains/academy/core/services/LearningService";
import { ProgressService } from "@/domains/academy/core/services/ProgressService";
import { eventBus } from "@/domains/academy/core/EventBus";
import { StudentProgress, TopicContent, Question, LearningSession } from "@/domains/academy/core/types";
import FlashcardEngine, { Flashcard } from "@/components/academy/FlashcardEngine";
import MemoryLab from "@/components/academy/MemoryLab";
import MistakeLab from "@/components/academy/MistakeLab";
import { Brain } from "lucide-react";
import { 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  Printer, 
  CheckCircle2, 
  XCircle,
  HelpCircle as QuestionIcon,
  Sparkles,
  BookMarked,
  Info,
  Menu,
  X,
  Compass,
  Users,
  Home,
  Target,
  AlertCircle,
  Trophy,
  Zap
} from "lucide-react";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || "applied-math";
  const activeTab = (params.tab as string) || "learn";

  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<LearningSession | null>(null);
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");
  
  // Challenge corner states
  const [revealedChallenges, setRevealedChallenges] = useState<Record<string, boolean>>({});
  
  // Quiz widget state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [recMessage, setRecMessage] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Confetti particles for mini celebration
  const [confetti, setConfetti] = useState<{ id: number; left: number; top: number; color: string }[]>([]);
  
  // AI tutor simulated state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Premium Learning Overhaul states
  const [activeStage, setActiveStage] = useState<string>("start");
  const [revisionMode, setRevisionMode] = useState<boolean>(false);
  const [flashcardOpen, setFlashcardOpen] = useState<boolean>(false);
  const [showSimplerExamplePopup, setShowSimplerExamplePopup] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Services
  const learningService = new LearningService(localProgressRepository, eventBus);
  const progressService = new ProgressService(localProgressRepository);

  useEffect(() => {
    const initWorkspace = async () => {
      // 1. Fetch content
      const topicData = ContentCMS.getTopic(slug);
      if (!topicData) {
        router.push("/academy/mathematics");
        return;
      }
      setTopic(topicData);
      
      const qList = ContentCMS.getTopicQuestions(slug);
      setQuestions(qList);

      // 2. Fetch progress & session
      const prog = await localProgressRepository.getProgress();
      setProgress(prog);
      setSelectedLanguage((prog.profile.preferredLanguage as "en" | "hi") || "en");

      const activeSession = await learningService.startSession(slug);
      setSession(activeSession);
    };
    initWorkspace();

    // Cleanup session on unmount
    return () => {
      if (session) {
        learningService.endSession(session);
      }
    };
  }, [slug]);

  // Streak timer trigger check
  const handleAnswerSubmit = async (optionIdx: number) => {
    if (selectedOption !== null || !session || !topic || questions.length === 0) return;

    const currentQuestion = questions[currentQIndex];
    const correct = currentQuestion.correctIndex === optionIdx;
    
    setSelectedOption(optionIdx);
    setIsCorrect(correct);
    setShowExplanation(true);

    const xpReward = correct ? 50 : 10;
    if (correct) {
      setQuizScore(prev => prev + 1);
      triggerConfetti();
    }

    const { session: updatedSession, nextStepRecommendation } = await learningService.submitAnswer(
      session,
      slug,
      currentQuestion.id,
      currentQuestion.skill,
      correct,
      xpReward
    );

    setSession(updatedSession);
    setRecMessage(nextStepRecommendation);
    
    // Auto-update student achievements/badges after save
    const prog = await localProgressRepository.getProgress();
    setProgress(prog);
  };

  const nextQuestion = async () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setShowHint(false);
    setHintIndex(0);

    if (currentQIndex === questions.length - 1) {
      setQuizFinished(true);
      // Mark topic fully completed on path
      await learningService.completeTopic(slug);
    } else {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizFinished(false);
    setQuizScore(0);
    setRecMessage("");
    setShowHint(false);
    setHintIndex(0);
  };

  const handleBookmarkToggle = async () => {
    if (!topic) return;
    await progressService.toggleBookmark(slug);
    const updated = await localProgressRepository.getProgress();
    setProgress(updated);
  };

  const triggerConfetti = () => {
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6"];
    const particles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      top: Math.random() * 20 - 10, // top position offset
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 3000);
  };

  // Simulated AI tutor triggers
  const triggerAiTutor = (actionType: "easier" | "explain" | "harder") => {
    setAiLoading(true);
    setAiResponse(null);
    setTimeout(() => {
      setAiLoading(false);
      if (actionType === "explain") {
        setAiResponse(
          selectedLanguage === "en" 
            ? "💡 AI Explanation: Let's break this pattern down. Imagine walking on a grid. Each turn adds exactly 90 degrees to your current displacement. Try drawing it on paper step-by-step!"
            : "💡 एआई स्पष्टीकरण: आइए इस पैटर्न को समझें। कल्पना करें कि आप एक ग्रिड पर चल रहे हैं। प्रत्येक मोड़ आपके वर्तमान विस्थापन में ठीक 90 डिग्री जोड़ता है। इसे कागज पर बनाने का प्रयास करें!"
        );
      } else if (actionType === "easier") {
        setAiResponse(
          selectedLanguage === "en"
            ? "💡 AI Easier Example: If standard patterns seem hard, check: 10, 20, 30... here the gap is a constant +10. Start with adding fixed numbers first."
            : "💡 एआई आसान उदाहरण: यदि मानक पैटर्न कठिन लगते हैं, तो जांचें: 10, 20, 30... यहां अंतर एक स्थिर +10 है।"
        );
      }
    }, 1200);
  };

  // Learning Journey Stages config
  const stages = [
    { id: "start", name: { en: "Mission Start", hi: "शुरुआत" } },
    { id: "concept", name: { en: "Understand", hi: "अवधारणा" } },
    { id: "explore", name: { en: "Explore", hi: "अन्वेषण" } },
    { id: "practice", name: { en: "Practice Board", hi: "अभ्यास" } },
    { id: "master", name: { en: "Master Class", hi: "मास्टर" } },
    { id: "challenge", name: { en: "Olympiad", hi: "चुनौती" } },
    { id: "revision", name: { en: "Revision", hi: "रिवीजन" } }
  ];

  // Map blocks to stages dynamically
  const getStageBlocks = (stageId: string) => {
    if (!topic) return [];
    switch (stageId) {
      case "start":
        return topic.blocks.filter(b => b.id.includes("hook"));
      case "concept":
        return topic.blocks.filter(b => b.id.includes("eli10"));
      case "explore":
        return topic.blocks.filter(b => b.id.includes("life") || b.type === "diagram" || b.type === "table" || b.type === "tip");
      case "practice":
        return topic.blocks.filter(b => b.type === "recipe" || (b.type === "example" && (b.id.includes("ex1") || b.id.includes("ex2") || b.id.includes("ex3"))));
      case "master":
        return topic.blocks.filter(b => b.type === "warning" || (b.type === "example" && (b.id.includes("ex4") || b.id.includes("ex5") || b.id.includes("ex6"))));
      case "challenge":
        return topic.blocks.filter(b => b.type === "challenge" || (b.type === "example" && (b.id.includes("ex7") || b.id.includes("ex8"))));
      case "revision":
        return topic.blocks.filter(b => b.type === "summary" || b.type === "parent-note");
      default:
        return [];
    }
  };

  const companionMessages: Record<string, { en: string; hi: string }> = {
    start: { 
      en: "Welcome! Let's kick off this topic with a fun riddle. Read the Curiosity Hook carefully!", 
      hi: "स्वागत है! आइए इस विषय की शुरुआत एक मजेदार पहेली से करें। जिज्ञासा हुक को ध्यान से पढ़ें!" 
    },
    concept: { 
      en: "Concepts are the foundation! Read the ELI10 card. I've explained it like you're 10 years old.", 
      hi: "अवधारणाएं सबसे महत्वपूर्ण हैं! ELI10 कार्ड पढ़ें। मैंने इसे ऐसे समझाया है जैसे आप 10 साल के हों।" 
    },
    explore: { 
      en: "Great observation! Let's explore the Pattern Library to understand the core schemes.", 
      hi: "शानदार अवलोकन! मुख्य योजनाओं को समझने के लिए आइए पैटर्न लाइब्रेरी का अन्वेषण करें।" 
    },
    practice: { 
      en: "Time to get our hands dirty! Follow the recipe steps to solve the Easy progressive examples.", 
      hi: "अब अभ्यास का समय है! आसान प्रगतिशील उदाहरणों को हल करने के लिए रेसिपी स्टेप्स का पालन करें।" 
    },
    master: { 
      en: "Let's push further! Study these Medium examples and watch out for common pitfalls.", 
      hi: "आइए और आगे बढ़ें! इन मध्यम स्तर के उदाहरणों का अध्ययन करें और सामान्य गलतियों से बचें।" 
    },
    challenge: { 
      en: "You're doing amazing! Attempt the Olympiad progressive cases and test yourself in the Challenge Corner.", 
      hi: "आप अद्भुत काम कर रहे हैं! ओलंपियाड स्तर के उदाहरणों का प्रयास करें और स्वयं का परीक्षण करें।" 
    },
    revision: { 
      en: "Perfect journey! Let's review the summary card. Parents, make sure to read the offline home activity!", 
      hi: "उत्कृष्ट यात्रा! आइए समरी कार्ड का रिवीजन करें। माता-पिता, घरेलू गतिविधि को जरूर पढ़ें!" 
    }
  };

  const translateBlocksToFlashcards = (): Flashcard[] => {
    if (!topic) return [];
    const activeBlocks = getStageBlocks(activeStage);
    
    return activeBlocks.map(block => {
      let title = block.type.toUpperCase();
      let frontContent = "";
      let backContent = "";
      let backDetails: React.ReactNode = undefined;
      
      if (block.type === "callout") {
        const meta = (block.metadata || {}) as any;
        const labelMap: Record<string, {en: string, hi: string}> = {
          idea: { en: "ELI10 Concept", hi: "सरल अवधारणा" },
          life: { en: "Real-Life Link", hi: "वास्तविक जीवन" },
          warn: { en: "Watch Out!", hi: "सावधान रहें!" },
          secret: { en: "Secret Trick", hi: "सीक्रेट ट्रिक" },
          detective: { en: "Curiosity Hook", hi: "जिज्ञासा पहेली" }
        };
        title = labelMap[meta.icon || "spark"]?.[selectedLanguage] || "Concept";
        frontContent = selectedLanguage === "en" ? "Read Concept Definition" : "अवधारणा की परिभाषा पढ़ें";
        backContent = block.content[selectedLanguage];
      } else if (block.type === "recipe") {
        title = selectedLanguage === "en" ? "Method Recipe" : "हल करने की रेसिपी";
        frontContent = block.content[selectedLanguage];
        const meta = (block.metadata || {}) as any;
        const steps = meta.steps || [];
        
        // Plain text value for voice synthesis
        backContent = steps.map((st: any, i: number) => `Step ${i + 1}: ${st[selectedLanguage]}`).join(". ");
        
        backDetails = (
          <div className="space-y-3 text-left">
            {steps.map((st: any, i: number) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                <p className="text-xs text-slate-200 font-semibold leading-relaxed">{st[selectedLanguage]}</p>
              </div>
            ))}
          </div>
        );
      } else if (block.type === "example") {
        title = selectedLanguage === "en" ? "Solved Example" : "हल किया गया उदाहरण";
        const parts = block.content[selectedLanguage].split("\n");
        const titleLine = parts.find((l: string) => l.startsWith("Level:") || l.startsWith("स्तर:"));
        frontContent = titleLine ? titleLine.replace("Level:", "").replace("स्तर:", "").trim() : "View Example Question";
        
        // Plain text value for voice synthesis
        backContent = parts
          .filter((l: string) => !l.trim().startsWith("Level:") && !l.trim().startsWith("स्तर:"))
          .map((l: string) => l.trim())
          .join(" ");

        backDetails = (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {parts.map((line: string, i: number) => {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith("Level:") || trimmed.startsWith("स्तर:")) return null;
              if (trimmed.startsWith("Student Thinking:") || trimmed.startsWith("छात्र की सोच:")) {
                return <p key={i} className="text-xs text-blue-400 font-bold">{trimmed}</p>;
              }
              if (trimmed.startsWith("Incorrect Method:") || trimmed.startsWith("गलत तरीका:")) {
                return <p key={i} className="text-xs text-rose-400 font-semibold">{trimmed}</p>;
              }
              if (trimmed.startsWith("Correct Method:") || trimmed.startsWith("सही तरीका:")) {
                return <p key={i} className="text-xs text-emerald-400 font-semibold">{trimmed}</p>;
              }
              if (trimmed.startsWith("Shortcut:") || trimmed.startsWith("शॉर्टकट:")) {
                return <p key={i} className="text-xs text-amber-400 font-bold">{trimmed}</p>;
              }
              return <p key={i} className="text-[11px] text-slate-300 leading-relaxed">{trimmed}</p>;
            })}
          </div>
        );
      } else if (block.type === "challenge") {
        title = selectedLanguage === "en" ? "Quiz Challenge" : "चुनौती प्रश्न";
        frontContent = block.content[selectedLanguage];
        const meta = (block.metadata || {}) as any;
        const solution = meta.solution?.[selectedLanguage] || "";
        
        backContent = solution;

        backDetails = (
          <div className="space-y-3 text-left">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[9px] font-bold uppercase">Solution</span>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">{solution}</p>
          </div>
        );
      } else if (block.type === "summary") {
        title = selectedLanguage === "en" ? "1-Minute Revision" : "रैपिड रिवीजन";
        frontContent = block.content[selectedLanguage];
        const meta = (block.metadata || {}) as any;
        const points = meta.points || [];
        
        backContent = points.map((pt: any) => pt[selectedLanguage]).join(". ");

        backDetails = (
          <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-200">
            {points.map((pt: any, i: number) => (
              <li key={i}>{pt[selectedLanguage]}</li>
            ))}
          </ul>
        );
      } else if (block.type === "parent-note") {
        title = selectedLanguage === "en" ? "Note for Parents" : "माता-पिता के लिए";
        frontContent = block.content[selectedLanguage];
        const meta = (block.metadata || {}) as any;
        const homeActivity = meta.homeActivity?.[selectedLanguage] || "";
        backContent = homeActivity;
      } else if (block.type === "diagram") {
        title = selectedLanguage === "en" ? "Concept Diagram" : "तार्किक चित्र";
        frontContent = block.content[selectedLanguage];
        const meta = (block.metadata || {}) as any;
        
        let desc = "";
        if (meta.type === "grid") {
          desc = selectedLanguage === "en"
            ? `Sequence pattern nodes: ` + meta.nodes.map((n: any) => n.label[selectedLanguage]).join(" -> ")
            : `श्रृंखला अनुक्रम: ` + meta.nodes.map((n: any) => n.label[selectedLanguage]).join(" -> ");
        } else if (meta.type === "flowchart") {
          desc = selectedLanguage === "en"
            ? `Logical analogy bridge: ${meta.nodes[0]?.label[selectedLanguage]} relates to ${meta.nodes[1]?.label[selectedLanguage]} as ${meta.nodes[2]?.label[selectedLanguage]} is compared.`
            : `सादृश्य संबंध: ${meta.nodes[0]?.label[selectedLanguage]} का संबंध ${meta.nodes[1]?.label[selectedLanguage]} से है वैसे ही जैसे ${meta.nodes[2]?.label[selectedLanguage]} की तुलना की जाती है।`;
        }
        backContent = desc;

        backDetails = (
          <div className="space-y-4 py-2 flex flex-col items-center">
            {meta.type === "grid" && (
              <div className="flex gap-2 items-center overflow-x-auto max-w-full pb-2">
                {meta.nodes.map((node: any, idx: number) => {
                  const isGap = node.id.startsWith("gap_");
                  return (
                    <div 
                      key={idx}
                      className={`px-3 py-2 rounded-lg font-black text-xs ${
                        isGap ? "bg-amber-950 border border-amber-800 text-amber-400 animate-pulse" : "bg-slate-800 text-white border border-slate-700"
                      }`}
                    >
                      {node.label[selectedLanguage]}
                    </div>
                  );
                })}
              </div>
            )}
            {meta.type === "flowchart" && (
              <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="font-bold text-xs">{meta.nodes[0]?.label[selectedLanguage]}</span>
                <span className="text-[10px] text-slate-400 font-mono">({meta.nodes[1]?.label[selectedLanguage]})</span>
                <span className="font-bold text-xs">{meta.nodes[2]?.label[selectedLanguage]}</span>
              </div>
            )}
          </div>
        );
      }
      
      return {
        id: block.id,
        type: (block.type === "example" || block.type === "challenge" || block.type === "summary") ? block.type as any : "concept",
        title,
        frontContent,
        backContent,
        backDetails
      };
    });
  };

  const shareChallenge = () => {
    if (!topic) return;
    const shareText = `I just scored ${quizScore}/${questions.length} on the ${topic.title.en} challenge in CNTS Academy! Can you beat my score? Attempt the challenge here: https://thecouragelibrary.com/academy/mathematics/${slug}/practice?ref=challenge`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2000);
    }
    
    window.open(url, "_blank");
  };

  if (!topic || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderBlock = (block: any) => {
    if (block.type === "heading") {
      return (
        <h3 key={block.id} className="text-2xl font-black font-display text-slate-800 border-b border-slate-50 pb-2">
          {block.content[selectedLanguage]}
        </h3>
      );
    }
    
    if (block.type === "paragraph") {
      return (
        <p key={block.id} className="text-slate-600 leading-relaxed text-base">
          {block.content[selectedLanguage]}
        </p>
      );
    }

    if (block.type === "tip") {
      return (
        <div key={block.id} className="bg-blue-50/50 border-l-4 border-blue-800 rounded-r-2xl p-6">
          <h4 className="font-extrabold text-blue-800 text-sm uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <Lightbulb size={16} /> Quick Trick
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed">
            {block.content[selectedLanguage]}
          </p>
        </div>
      );
    }

    if (block.type === "example") {
      const contentText = block.content[selectedLanguage] || "";
      const lines = contentText.split("\n");
      
      return (
        <div key={block.id} className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 my-6 space-y-4 shadow-xs">
          {lines.map((line: string, idx: number) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className="h-2" />;

            // 1. Header parsing (Level: X | Example Y)
            if (trimmed.startsWith("Level:") || trimmed.startsWith("स्तर:")) {
              const parts = trimmed.split("|");
              const levelPart = parts[0].replace("Level:", "").replace("स्तर:", "").trim();
              const titlePart = parts[1] ? parts[1].trim() : "";

              // Determine level theme
              const isEasy = levelPart.toLowerCase().includes("easy") || levelPart.includes("आसान");
              const isHard = levelPart.toLowerCase().includes("hard") || levelPart.includes("कठिन");
              
              let badgeBg = "bg-emerald-50 border-emerald-100 text-emerald-800";
              if (isHard) {
                badgeBg = "bg-rose-50 border-rose-100 text-rose-800";
              } else if (!isEasy) { // Medium
                badgeBg = "bg-amber-50 border-amber-100 text-amber-800";
              }

              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 pb-3 border-b border-slate-200/60">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${badgeBg} w-fit`}>
                    {levelPart}
                  </span>
                  <h5 className="font-extrabold text-sm sm:text-base text-slate-800">
                    {titlePart}
                  </h5>
                </div>
              );
            }

            // 2. Student Thinking
            if (trimmed.startsWith("Student Thinking:") || trimmed.startsWith("छात्र की सोच:")) {
              const text = trimmed.replace("Student Thinking:", "").replace("छात्र की सोच:", "").trim();
              return (
                <div key={idx} className="bg-blue-50/50 border-l-4 border-blue-600 rounded-r-xl p-4 flex gap-3 items-start">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
                    <Lightbulb size={14} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-0.5">
                      {selectedLanguage === "en" ? "Student Thinking" : "छात्र की सोच"}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">{text}</p>
                  </div>
                </div>
              );
            }

            // 3. Incorrect Method
            if (trimmed.startsWith("Incorrect Method:") || trimmed.startsWith("गलत तरीका:")) {
              const text = trimmed.replace("Incorrect Method:", "").replace("गलत तरीका:", "").trim();
              return (
                <div key={idx} className="bg-rose-50/50 border-l-4 border-rose-600 rounded-r-xl p-4 flex gap-3 items-start">
                  <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
                    <XCircle size={14} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-rose-800 uppercase tracking-wider mb-0.5">
                      {selectedLanguage === "en" ? "Common Wrong Attempt" : "गलत तरीका"}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">{text}</p>
                  </div>
                </div>
              );
            }

            // 4. Correct Method
            if (trimmed.startsWith("Correct Method:") || trimmed.startsWith("सही तरीका:")) {
              const text = trimmed.replace("Correct Method:", "").replace("सही तरीका:", "").trim();
              return (
                <div key={idx} className="bg-emerald-50/50 border-l-4 border-emerald-600 rounded-r-xl p-4 flex gap-3 items-start">
                  <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
                      {selectedLanguage === "en" ? "Correct Approach" : "सही तरीका"}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">{text}</p>
                  </div>
                </div>
              );
            }

            // 5. Shortcut
            if (trimmed.startsWith("Shortcut:") || trimmed.startsWith("शॉर्टकट:")) {
              const text = trimmed.replace("Shortcut:", "").replace("शॉर्टकट:", "").trim();
              return (
                <div key={idx} className="bg-amber-50/50 border-l-4 border-amber-500 rounded-r-xl p-4 flex gap-3 items-start">
                  <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">
                      {selectedLanguage === "en" ? "Super Shortcut" : "शॉर्टकट"}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">{text}</p>
                  </div>
                </div>
              );
            }

            // 6. Normal line (can be bullet points)
            const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
            return (
              <p key={idx} className={`text-xs sm:text-sm text-slate-600 leading-relaxed font-medium ${isBullet ? "pl-4 list-item list-disc list-inside" : ""}`}>
                {isBullet ? trimmed.substring(1).trim() : trimmed}
              </p>
            );
          })}
        </div>
      );
    }

    // Visual diagrams renderer
    if (block.type === "diagram" && block.metadata) {
      const metadata = block.metadata as any;
      return (
        <div key={block.id} className="py-6 border-y border-slate-100 my-8">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
            {block.content[selectedLanguage]}
          </p>
          
          {/* Number Series animation pipeline */}
          {metadata.type === "grid" && (
            <div className="flex flex-nowrap items-center justify-start sm:justify-center gap-2 sm:gap-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-4 sm:p-8 max-w-lg mx-auto overflow-x-auto scrollbar-none">
              {metadata.nodes.map((node: any) => {
                const isGap = node.id.startsWith("gap_");
                return (
                  <div 
                    key={node.id} 
                    className={`shrink-0 flex items-center justify-center font-black transition-all ${
                      isGap 
                        ? "text-[10px] sm:text-xs font-mono text-blue-800 animate-pulse" 
                        : "w-10 h-10 sm:w-12 sm:h-12 bg-white border border-slate-200 shadow-sm rounded-lg sm:rounded-xl text-slate-800 text-sm sm:text-lg animate-float-slow"
                    }`}
                  >
                    {node.label[selectedLanguage]}
                  </div>
                );
              })}
            </div>
          )}

          {/* Analogy comparative logical bridges */}
          {metadata.type === "flowchart" && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-4 sm:p-8 max-w-lg mx-auto">
              <div className="px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-xl font-mono font-black text-slate-800">
                {metadata.nodes[0].label[selectedLanguage]}
              </div>
              <span className="text-slate-400 text-xs font-mono font-bold">
                {metadata.nodes[1].label[selectedLanguage]}
              </span>
              <div className="px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-xl font-mono font-black text-slate-800">
                {metadata.nodes[2].label[selectedLanguage]}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (block.type === "warning") {
      return (
        <div key={block.id} className="bg-rose-50 border-l-4 border-rose-600 rounded-r-2xl p-6 my-4 shadow-xs">
          <h4 className="font-extrabold text-rose-800 text-sm uppercase tracking-wide flex items-center gap-1.5 mb-2">
            <XCircle size={16} /> Warning / ध्यान दें
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
            {block.content[selectedLanguage]}
          </p>
        </div>
      );
    }

    if (block.type === "table" && block.metadata) {
      const tableMeta = block.metadata as any;
      
      // If it is a 3-column category pattern table, render as swipeable Flashcard Book!
      if (tableMeta.headers.length === 3) {
        const containerId = `flashcard-deck-${block.id}`;
        return (
          <div key={block.id} className="my-8 space-y-4">
            <div className="flex justify-between items-center px-1">
              <div>
                <span className="text-[9px] text-blue-800 font-black uppercase tracking-wider block">Interactive Book</span>
                <h5 className="font-extrabold text-slate-800 text-sm">
                  {selectedLanguage === "en" ? "Swipe Pattern Flashcards" : "पैटर्न फ़्लैशकार्ड स्वाइप करें"}
                </h5>
              </div>
              
              {/* Scroll Navigation controls */}
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const el = document.getElementById(containerId);
                    if (el) el.scrollBy({ left: -300, behavior: "smooth" });
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95 border border-slate-200/50"
                >
                  <ArrowLeft size={14} />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById(containerId);
                    if (el) el.scrollBy({ left: 300, behavior: "smooth" });
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95 border border-slate-200/50"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div 
              id={containerId}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 pb-4 scrollbar-none scroll-smooth"
            >
              {tableMeta.rows.map((row: any[], rowIdx: number) => {
                const category = row[0][selectedLanguage];
                const description = row[1][selectedLanguage];
                const example = row[2][selectedLanguage];
                
                return (
                  <div 
                    key={rowIdx}
                    className="min-w-[270px] sm:min-w-[320px] max-w-sm flex-1 bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm snap-center flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-150 pb-2.5 mb-4">
                        <span className="text-[10px] text-blue-800 font-extrabold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                          {category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {rowIdx + 1} / {tableMeta.rows.length}
                        </span>
                      </div>

                      <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed mb-4">
                        {description}
                      </p>
                    </div>

                    <div className="bg-amber-50/60 border border-dashed border-amber-200 rounded-xl p-3.5 mt-2">
                      <span className="block text-[8px] font-bold text-amber-800 uppercase tracking-widest mb-1">Example / उदाहरण</span>
                      <p className="font-mono font-bold text-[11px] sm:text-xs text-slate-800 leading-normal">
                        {example}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // Otherwise render standard Table
      return (
        <div key={block.id} className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs my-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {tableMeta.headers.map((h: any, i: number) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h[selectedLanguage]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {tableMeta.rows.map((row: any[], i: number) => (
                <tr key={i}>
                  {row.map((cell: any, j: number) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-700">
                      {cell[selectedLanguage]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (block.type === "callout") {
      const meta = (block.metadata || {}) as any;
      const theme = meta.theme || "info";
      const iconName = meta.icon || "spark";

      const themeClasses: Record<string, string> = {
        info: "bg-blue-50/80 border border-blue-100 text-blue-900 rounded-2xl p-6 shadow-xs",
        success: "bg-emerald-50/80 border border-emerald-100 text-emerald-955 rounded-2xl p-6 shadow-xs",
        warning: "bg-amber-50/80 border border-amber-100 text-amber-955 rounded-2xl p-6 shadow-xs",
        danger: "bg-rose-50/80 border border-rose-100 text-rose-955 rounded-2xl p-6 shadow-xs",
        primary: "bg-indigo-50/80 border border-indigo-100 text-indigo-955 rounded-2xl p-6 shadow-xs",
        violet: "bg-violet-50/80 border border-violet-100 text-violet-955 rounded-2xl p-6 shadow-xs",
        amber: "bg-amber-50/80 border border-amber-100 text-amber-955 rounded-2xl p-6 shadow-xs"
      };

      const iconColorClasses: Record<string, string> = {
        info: "text-blue-700 bg-blue-100/60",
        success: "text-emerald-700 bg-emerald-100/60",
        warning: "text-amber-700 bg-amber-100/60",
        danger: "text-rose-700 bg-rose-100/60",
        primary: "text-indigo-700 bg-indigo-100/60",
        violet: "text-violet-700 bg-violet-100/60",
        amber: "text-amber-700 bg-amber-100/60"
      };

      const renderIcon = () => {
        const iconSize = 20;
        switch (iconName) {
          case "idea":
            return <Lightbulb size={iconSize} />;
          case "life":
            return <Compass size={iconSize} />;
          case "warn":
            return <XCircle size={iconSize} />;
          case "secret":
            return <Sparkles size={iconSize} />;
          case "parent":
            return <Users size={iconSize} />;
          case "detective":
            return (
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            );
          default:
            return <Sparkles size={iconSize} />;
        }
      };

      const labelMap: Record<string, {en: string, hi: string}> = {
        idea: { en: "Explain Like I'm 10 (ELI10)", hi: "सरल शब्दों में समझें (ELI10)" },
        life: { en: "Real-Life Connection", hi: "असली जिंदगी से जुड़ाव" },
        warn: { en: "Watch Out!", hi: "सावधान रहें!" },
        secret: { en: "Secret Trick / Memory Trick", hi: "सीक्रेट ट्रिक / मेमोरी ट्रिक" },
        parent: { en: "Note for Parents", hi: "माता-पिता के लिए सुझाव" },
        detective: { en: "Curiosity Hook", hi: "जिज्ञासा पहेली (Curiosity Hook)" },
        spark: { en: "Quick Tip", hi: "महत्वपूर्ण टिप" }
      };

      const label = labelMap[iconName] || { en: "Note", hi: "विशेष नोट" };

      return (
        <div key={block.id} className={`${themeClasses[theme] || themeClasses.info} relative overflow-hidden my-4`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
            <div className={`p-2.5 rounded-xl shrink-0 ${iconColorClasses[theme] || iconColorClasses.info} flex items-center justify-center`}>
              {renderIcon()}
            </div>
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider mb-2 text-slate-800">
                {label[selectedLanguage]}
              </h4>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                {block.content[selectedLanguage]}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "recipe") {
      const meta = (block.metadata || {}) as any;
      const steps = meta.steps || [];

      return (
        <div key={block.id} className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 my-6">
          <h4 className="font-black text-slate-800 text-base sm:text-lg mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {block.content[selectedLanguage]}
          </h4>
          <div className="space-y-4">
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                  {step[selectedLanguage]}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "challenge") {
      const meta = (block.metadata || {}) as any;
      const isOlympiad = meta.level === "olympiad";
      const solutionText = meta.solution?.[selectedLanguage] || "";
      const isRevealed = !!revealedChallenges[block.id];

      return (
        <div 
          key={block.id} 
          className={`border rounded-3xl p-6 sm:p-8 my-6 relative overflow-hidden transition-all duration-300 ${
            isOlympiad 
              ? "bg-amber-50/50 border-amber-200 shadow-sm" 
              : "bg-indigo-50/30 border-indigo-100 shadow-sm"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${
              isOlympiad 
                ? "bg-amber-100 text-amber-850" 
                : "bg-indigo-100 text-indigo-800"
            }`}>
              {isOlympiad ? <Trophy size={12} className="text-amber-800" /> : <HelpCircle size={12} className="text-indigo-800" />}
              {isOlympiad ? "Challenge Yourself (Olympiad-Level)" : "Challenge Corner"}
            </span>
            <span className="text-xs text-slate-400 font-bold">
              {isOlympiad ? "असाधारण चुनौती" : "चुनौती कोना"}
            </span>
          </div>

          <p className="font-extrabold text-sm sm:text-base text-slate-800 leading-relaxed mb-6">
            {block.content[selectedLanguage]}
          </p>

          {meta.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {meta.options.map((opt: any, optIdx: number) => (
                <div 
                  key={optIdx} 
                  className="p-3 bg-white border border-slate-200/85 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-xs"
                >
                  <span className="font-mono text-slate-400 mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                  {opt[selectedLanguage]}
                </div>
              ))}
            </div>
          )}

          {!isRevealed ? (
            <button
              onClick={() => setRevealedChallenges(prev => ({ ...prev, [block.id]: true }))}
              className={`w-full py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs ${
                isOlympiad 
                  ? "bg-amber-600 hover:bg-amber-700 text-white" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Reveal Solution / समाधान देखें
            </button>
          ) : (
            <div className="space-y-4 border-t border-dashed border-slate-200 pt-6 animate-fade-in">
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Target size={14} className="text-indigo-600" /> Correct Solution / सही उत्तर:
              </h5>
              <p className="text-slate-700 text-sm leading-relaxed font-semibold whitespace-pre-line">
                {solutionText}
              </p>
              <button
                onClick={() => setRevealedChallenges(prev => ({ ...prev, [block.id]: false }))}
                className="text-xs text-slate-400 hover:text-slate-600 underline font-bold mt-2 cursor-pointer transition-all"
              >
                Hide Solution / समाधान छिपाएं
              </button>
            </div>
          )}
        </div>
      );
    }

    if (block.type === "parent-note") {
      const meta = (block.metadata || {}) as any;
      const whyItMatters = meta.whyItMatters?.[selectedLanguage] || "";
      const commonStruggle = meta.commonStruggle?.[selectedLanguage] || "";
      const homeActivity = meta.homeActivity?.[selectedLanguage] || "";

      return (
        <div key={block.id} className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 my-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/40 rounded-full blur-xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0 flex items-center justify-center shadow-xs">
              <Users size={24} />
            </div>
            <div className="space-y-6 w-full">
              <div>
                <h4 className="font-black text-emerald-950 text-base sm:text-lg">
                  For Parents / अभिभावकों के लिए
                </h4>
                <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-0.5">
                  {block.content[selectedLanguage]}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h5 className="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-emerald-600" /> Why This Matters
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    {whyItMatters}
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-600" /> Common Struggle
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    {commonStruggle}
                  </p>
                </div>
              </div>

              <div className="border-t border-emerald-100/80 pt-4 mt-2">
                <h5 className="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5 mb-2">
                  <Home size={14} className="text-indigo-600" /> Try This at Home (Home Activity)
                </h5>
                <p className="text-slate-700 text-xs leading-relaxed font-bold bg-white/80 border border-emerald-100 rounded-xl p-3 shadow-xs">
                  {homeActivity}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "summary") {
      const meta = (block.metadata || {}) as any;
      const points = meta.points || [];
      const mistakesToAvoid = meta.mistakesToAvoid || [];
      const shortcuts = meta.shortcuts || [];

      return (
        <div key={block.id} className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 my-8 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h4 className="font-black text-base sm:text-xl text-white font-display">
                  {block.content[selectedLanguage]}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  1-Minute Quick Revision Card (रैपिड रिवीजन)
                </p>
              </div>
              <Zap size={22} className="text-amber-400 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-3 bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
                <h5 className="font-extrabold text-blue-400 text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                  <BookMarked size={16} /> Key Takeaways
                </h5>
                <ul className="space-y-2 text-xs text-slate-300 font-medium list-disc pl-4 leading-relaxed">
                  {points.map((pt: any, i: number) => (
                    <li key={i}>{pt[selectedLanguage]}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
                <h5 className="font-extrabold text-emerald-400 text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                  <Sparkles size={16} /> Speed Hacks
                </h5>
                <ul className="space-y-2 text-xs text-slate-300 font-medium list-disc pl-4 leading-relaxed">
                  {shortcuts.map((sc: any, i: number) => (
                    <li key={i}>{sc[selectedLanguage]}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
                <h5 className="font-extrabold text-rose-400 text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                  <XCircle size={16} /> Pitfalls to Avoid
                </h5>
                <ul className="space-y-2 text-xs text-slate-300 font-medium list-disc pl-4 leading-relaxed">
                  {mistakesToAvoid.map((ms: any, i: number) => (
                    <li key={i}>{ms[selectedLanguage]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Sidebar topics list
  const sidebarTopics = ContentCMS.getAllTopics().filter(t => t.slug === "applied-math" || t.slug === "number-puzzles" || t.slug === "lcm-intervals" || t.slug === "coordinate-geometry");

  return (
    <main className="min-h-screen bg-[#F8FAFF] flex flex-col justify-between mesh-bg relative overflow-hidden">
      <Navbar />

      {/* Confetti container */}
      {confetti.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map(p => (
            <div 
              key={p.id}
              className="absolute w-2 h-4 rounded-sm animate-bounce"
              style={{
                left: `${p.left}%`,
                top: `${p.top}px`,
                backgroundColor: p.color,
                transform: `rotate(${Math.random() * 360}deg)`,
                transition: "all 3s ease-out"
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 pt-32 lg:pt-36 pb-12 flex-grow flex flex-col lg:flex-row gap-8 animate-fade-in">
        
        {/* Mobile Slide-Over Drawer Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            {/* Backdrop Blur Overlay */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            
            {/* Sliding Drawer Panel */}
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-6 shadow-xl flex flex-col justify-between overflow-y-auto animate-slide-up">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black font-display text-slate-800 text-lg">Mathematics Index</h3>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                
                <Link 
                  href="/academy/mathematics" 
                  className="inline-flex items-center gap-2 text-xs font-black text-blue-800 mb-6 hover:underline uppercase tracking-wider"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ArrowLeft size={14} /> Back to Dashboard
                </Link>

                <div className="space-y-1.5">
                  {sidebarTopics.map(t => {
                    const isCompleted = progress.completedTopics.includes(t.slug);
                    const isActive = t.slug === slug;
                    return (
                      <Link
                        key={t.slug}
                        href={`/academy/mathematics/${t.slug}/${activeTab}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                          isActive 
                            ? "bg-blue-800 border-blue-800 text-white shadow-sm" 
                            : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>{t.title[selectedLanguage]}</span>
                        {isCompleted && (
                          <CheckCircle2 size={16} fill={isActive ? "#1E40AF" : "#ECFDF5"} className={isActive ? "text-white" : "text-emerald-600"} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar (Visible only on lg screens) */}
        <aside className="hidden lg:block w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <Link 
              href="/academy/mathematics" 
              className="inline-flex items-center gap-2 text-xs font-black text-blue-800 mb-6 hover:underline uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            
            <h3 className="font-black font-display text-slate-800 text-lg mb-4">Mathematics Index</h3>
            
            <div className="space-y-1.5">
              {sidebarTopics.map(t => {
                const isCompleted = progress.completedTopics.includes(t.slug);
                const isActive = t.slug === slug;
                return (
                  <Link
                    key={t.slug}
                    href={`/academy/mathematics/${t.slug}/${activeTab}`}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                      isActive 
                        ? "bg-blue-800 border-blue-800 text-white shadow-sm" 
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{t.title[selectedLanguage]}</span>
                    {isCompleted && (
                      <CheckCircle2 size={16} fill={isActive ? "#1E40AF" : "#ECFDF5"} className={isActive ? "text-white" : "text-emerald-600"} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Column: Dynamic Lesson Content Panel */}
        <div className="flex-grow min-w-0 space-y-6">
          
          {/* Unified Header Card (Combined Title, Mobile Navigation, and Tabs) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-5 sm:gap-6">
            
            {/* Top Navigation Row (Mobile/Tablet view only) */}
            <div className="lg:hidden flex items-center justify-between border-b border-slate-50 pb-3 mb-1">
              <Link 
                href="/academy/mathematics" 
                className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-800 uppercase tracking-widest"
              >
                <ArrowLeft size={12} /> Dashboard
              </Link>
              <button 
                onClick={() => setSidebarOpen(true)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-700 rounded-xl flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <Menu size={12} /> Index
              </button>
            </div>

            {/* Title & Metadata Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                  {topic.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-800 leading-tight">
                  {topic.title[selectedLanguage]}
                </h2>
              </div>

              {/* Revision Mode toggle & Language selectors */}
              <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {selectedLanguage === "en" ? "Revision Mode" : "रिवीजन मोड"}
                  </span>
                  <button
                    onClick={() => {
                      setRevisionMode(!revisionMode);
                      if (!revisionMode) {
                        setActiveStage("revision");
                      } else {
                        setActiveStage("start");
                      }
                    }}
                    className={`w-11 h-6 rounded-full transition-all duration-300 relative shrink-0 ${
                      revisionMode ? "bg-blue-800" : "bg-slate-205"
                    }`}
                    style={{ backgroundColor: revisionMode ? "#1E40AF" : "#E2E8F0" }}
                  >
                    <span 
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        revisionMode ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
                  <button 
                    onClick={() => setSelectedLanguage("en")}
                    className={`text-[9px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all ${
                      selectedLanguage === "en" ? "bg-white text-slate-800 shadow-xs animate-fade-in" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setSelectedLanguage("hi")}
                    className={`text-[9px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all ${
                      selectedLanguage === "hi" ? "bg-white text-slate-800 shadow-xs animate-fade-in" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Row (Tabs selector + Bookmark buttons) */}
            <div className="flex items-center gap-2 w-full mt-1 overflow-x-auto pb-1 sm:pb-0">
              {/* Bookmark Toggle */}
              <button 
                onClick={handleBookmarkToggle}
                className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-700 shrink-0 transition-colors"
                title="Bookmark Topic"
              >
                <BookMarked size={16} fill={progress.bookmarks.includes(slug) ? "currentColor" : "none"} />
              </button>
              
              {/* Tabs Scroll Selector */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto shrink-0">
                {["learn", "practice", "tricks", "worksheet"].map(tab => (
                  <Link
                    key={tab}
                    href={`/academy/mathematics/${slug}/${tab}`}
                    className={`text-[10px] px-3.5 py-2 rounded-lg font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? "bg-white text-slate-800 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Tab Body Renderers */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm min-h-[400px]">
            
            {/* LEARN TAB */}
            {activeTab === "learn" && (
              <div className="space-y-6">
                
                {/* 1. Revision Mode Active View */}
                {revisionMode ? (
                  <div className="space-y-8 animate-fade-in">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 flex items-center gap-3">
                      <Zap className="text-indigo-800 animate-pulse shrink-0" size={20} />
                      <div>
                        <h4 className="font-extrabold text-indigo-950 text-sm">
                          {selectedLanguage === "en" ? "Revision Mode Active" : "रिवीजन मोड सक्रिय"}
                        </h4>
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                          We've compiled all the key shortcuts, common mistakes, summary points, and practice challenges for you.
                        </p>
                      </div>
                    </div>

                    {/* Summary cards */}
                    {topic.blocks.filter(b => b.type === "summary").map(block => renderBlock(block))}

                    {/* Mistakes warnings */}
                    {topic.blocks.filter(b => b.type === "warning").map(block => renderBlock(block))}

                    {/* Spot the Mistake Lab */}
                    <MistakeLab topicSlug={slug} selectedLanguage={selectedLanguage} />

                    {/* Quick Challenge Corners */}
                    {topic.blocks.filter(b => b.type === "challenge").map(block => renderBlock(block))}
                    
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                      <button
                        onClick={() => { setRevisionMode(false); setActiveStage("start"); }}
                        className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        Exit Revision Mode
                      </button>
                      <Link
                        href={`/academy/mathematics/${slug}/practice`}
                        className="px-5 py-2.5 bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                      >
                        Try Practice Quiz
                      </Link>
                    </div>
                  </div>
                ) : (
                  
                  // 2. Normal Stage Learning Journey View
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Journey Progress Map */}
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 sm:p-5 mb-2 overflow-x-auto scrollbar-none flex items-center justify-between gap-3 shadow-xs">
                      {stages.map((st, i) => {
                        const isActive = st.id === activeStage;
                        const isPast = stages.findIndex(s => s.id === activeStage) > i;
                        return (
                          <button
                            key={st.id}
                            onClick={() => setActiveStage(st.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shrink-0 border ${
                              isActive
                                ? "bg-blue-800 border-blue-800 text-white shadow-xs scale-102"
                                : isPast
                                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                              isActive ? "bg-white text-blue-800 animate-pulse" : isPast ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                            }`}>
                              {i + 1}
                            </span>
                            <span>{st.name[selectedLanguage]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Learning Companion Guidance bubble */}
                    <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-3xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
                      <div className="w-12 h-12 bg-blue-800 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                        <Brain size={24} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-blue-800 uppercase tracking-wider block">Captain Courage</span>
                        <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5 leading-relaxed">
                          {companionMessages[activeStage]?.[selectedLanguage]}
                        </p>
                      </div>
                    </div>

                    {/* Render active stage blocks */}
                    <div className="space-y-6 pt-2">
                      {getStageBlocks(activeStage).map(block => renderBlock(block))}
                    </div>

                    {/* Append MistakeLab under Master stage */}
                    {activeStage === "master" && (
                      <MistakeLab topicSlug={slug} selectedLanguage={selectedLanguage} />
                    )}

                    {/* Stage Footer Navigation */}
                    <div className="border-t border-slate-100 pt-6 mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <button
                        onClick={() => setFlashcardOpen(true)}
                        className="w-full sm:w-auto px-5 py-3 border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <BookMarked size={14} /> Play Flashcards (Stage {stages.findIndex(s => s.id === activeStage) + 1})
                      </button>

                      {(() => {
                        const currentIdx = stages.findIndex(s => s.id === activeStage);
                        if (currentIdx < stages.length - 1) {
                          const nextStageObj = stages[currentIdx + 1];
                          return (
                            <button
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setTimeout(() => setActiveStage(nextStageObj.id), 250);
                              }}
                              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                              Next: {nextStageObj.name[selectedLanguage]} <ArrowRight size={14} />
                            </button>
                          );
                        } else {
                          return (
                            <Link
                              href={`/academy/mathematics/${slug}/practice`}
                              className="w-full sm:w-auto px-6 py-3.5 bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                              Start Quiz Challenge <Trophy size={14} />
                            </Link>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* AI Tutor simulated triggers widget */}
                <div className="border-t border-slate-100 pt-8 mt-12 bg-slate-50/30 rounded-3xl p-4 sm:p-8 border">
                  <h4 className="font-black text-slate-800 font-display text-lg mb-2 flex items-center gap-2">
                    <Sparkles className="text-indigo-600" size={20} />
                    CNTS AI Academy Tutor
                  </h4>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Struggling with this concept? Ask our simulator to generate simpler custom learning cases.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => triggerAiTutor("explain")}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all"
                    >
                      Explain Concept Again
                    </button>
                    <button 
                      onClick={() => triggerAiTutor("easier")}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all"
                    >
                      Give Simpler Example
                    </button>
                  </div>

                  {aiLoading && (
                    <div className="flex items-center gap-2 text-xs text-indigo-700 font-bold mt-6 animate-pulse">
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping" />
                      Tutor is preparing response...
                    </div>
                  )}

                  {aiResponse && (
                    <div className="mt-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 text-slate-700 text-sm leading-relaxed">
                      {aiResponse}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PRACTICE QUIZ TAB */}
            {activeTab === "practice" && questions.length > 0 && (
              <div className="space-y-8">
                {quizFinished ? (
                  <div className="text-center py-12 max-w-md mx-auto space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                      <Trophy size={36} />
                    </div>
                    <h3 className="text-2xl font-black font-display text-slate-800">
                      Practice Completed!
                    </h3>
                    <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                      You solved {quizScore} out of {questions.length} questions correctly. 
                      You earned general XP points and boosted your cognitive skills!
                    </p>
                    
                    <div className="flex flex-col gap-3 justify-center pt-4">
                      <button 
                        onClick={restartQuiz}
                        className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95"
                      >
                        Practice Again
                      </button>
                      <button 
                        onClick={shareChallenge}
                        className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        {copiedShareLink ? "Link Copied!" : "Challenge a Friend 🏆"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Question Header Card */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        Question {currentQIndex + 1} of {questions.length}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        questions[currentQIndex].difficulty === "easy" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : questions[currentQIndex].difficulty === "medium"
                          ? "bg-amber-50 text-amber-700 border border-amber-200" 
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {questions[currentQIndex].difficulty}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-800 mb-8 leading-relaxed">
                      {questions[currentQIndex].text[selectedLanguage]}
                    </h3>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {questions[currentQIndex].options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrectAnswer = idx === questions[currentQIndex].correctIndex;
                        const isWrongAnswer = isSelected && !isCorrectAnswer;

                        let cardClass = "border-slate-100 bg-white hover:bg-slate-50/50 hover:border-slate-200";
                        if (selectedOption !== null) {
                          if (isCorrectAnswer) {
                            cardClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                          } else if (isWrongAnswer) {
                            cardClass = "border-rose-500 bg-rose-50 text-rose-800";
                          } else {
                            cardClass = "border-slate-50 bg-slate-50/30 opacity-70 pointer-events-none";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={selectedOption !== null}
                            onClick={() => handleAnswerSubmit(idx)}
                            className={`flex justify-between items-center p-5 rounded-2xl border text-left font-bold transition-all text-sm ${cardClass}`}
                          >
                            <span>{opt[selectedLanguage]}</span>
                            {selectedOption !== null && isCorrectAnswer && (
                              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-4" />
                            )}
                            {selectedOption !== null && isWrongAnswer && (
                              <XCircle size={18} className="text-rose-600 shrink-0 ml-4" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Hint widget */}
                    {selectedOption === null && (
                      <div className="mb-8">
                        <button 
                          onClick={() => setShowHint(prev => !prev)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-700 transition-colors uppercase tracking-wider"
                        >
                          <Lightbulb size={14} /> {showHint ? "Hide Hint" : "Need a Hint?"}
                        </button>
                        {showHint && (
                          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-slate-700 text-xs mt-2 leading-relaxed">
                            {questions[currentQIndex].hints[hintIndex][selectedLanguage]}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Diagnostic evaluation explanations */}
                    {showExplanation && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mt-8 animate-slide-up">
                        <div className="flex items-center gap-2 mb-3">
                          {isCorrect ? (
                            <span className="text-emerald-700 text-xs font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 rounded-full">Correct</span>
                          ) : (
                            <span className="text-rose-700 text-xs font-black uppercase tracking-wider px-2 py-0.5 bg-rose-50 rounded-full">Incorrect</span>
                          )}
                        </div>

                        <p className="text-slate-700 text-sm leading-relaxed">
                          {questions[currentQIndex].explanation[selectedLanguage]}
                        </p>

                        {/* Adaptive Practice Assist */}
                        {!isCorrect && (
                          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 mt-6 space-y-3">
                            <span className="text-[9px] text-indigo-850 font-black uppercase tracking-wider block">Adaptive Assist</span>
                            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                              Not quite! Let's get you back on track. Try one of these learning aids:
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                              <button
                                onClick={() => {
                                  setSelectedOption(null);
                                  setShowExplanation(false);
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded-lg shadow-xs transition-colors"
                              >
                                Try Question Again
                              </button>
                              <button
                                onClick={() => {
                                  setShowHint(true);
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded-lg shadow-xs transition-colors"
                              >
                                Reveal Hint
                              </button>
                              <button
                                onClick={() => setShowSimplerExamplePopup(true)}
                                className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg shadow-xs transition-colors"
                              >
                                View Simpler Example
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Smart prerequisite recommendation box */}
                        {recMessage && (
                          <div className="bg-blue-50/50 border-l-4 border-blue-800 rounded-r-xl p-4 text-slate-700 text-xs mt-4 leading-relaxed animate-fade-in">
                            {recMessage}
                          </div>
                        )}

                        <button 
                          onClick={nextQuestion}
                          className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                        >
                          Continue <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TRICKS & SHORTCUTS TAB */}
            {activeTab === "tricks" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-display text-slate-800">Memory Lab</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Interactive cheatsheets & speed hacks</p>
                  </div>
                </div>
                
                {/* Memory Lab interactive widgets */}
                <MemoryLab topicSlug={slug} selectedLanguage={selectedLanguage} />
              </div>
            )}

            {/* WORKSHEET PRINT TAB */}
            {activeTab === "worksheet" && (
              <div className="space-y-6 max-w-3xl mx-auto animate-fade-in print:p-0">
                <style dangerouslySetInnerHTML={{ __html: `
                  @media print {
                    /* 1. Hide interactive elements, sidebars, navbar, footer, buttons, headers */
                    nav, 
                    header, 
                    footer, 
                    aside,
                    .print\\:hidden,
                    button,
                    .navbar,
                    .sidebar,
                    [role="dialog"],
                    [aria-modal="true"],
                    div[class*="animate-slide-in-ticker"],
                    div[class*="bg-slate-900"][class*="text-white"][class*="tracking-wide"],
                    div.flex-grow.min-w-0 > div:first-child {
                      display: none !important;
                      visibility: hidden !important;
                      height: 0 !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      border: none !important;
                      overflow: hidden !important;
                    }

                    /* 2. Reset html and body layout flow */
                    html, body, main {
                      background: white !important;
                      color: black !important;
                      width: 100% !important;
                      height: auto !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      overflow: visible !important;
                      display: block !important;
                    }

                    /* 3. Strip wrappers & flex grids to allow block flow without offset margins */
                    .max-w-7xl,
                    div[class*="max-w-7xl"],
                    main > div,
                    div[class*="flex-grow"] {
                      display: block !important;
                      width: 100% !important;
                      max-width: 100% !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      padding-top: 0 !important;
                      margin-top: 0 !important;
                      border: none !important;
                      box-shadow: none !important;
                    }

                    /* Strip parent Card container borders and shadow in print mode */
                    div.flex-grow.min-w-0 > div:nth-child(2) {
                      border: none !important;
                      background: transparent !important;
                      box-shadow: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }

                    /* 4. Format worksheet container */
                    #printable-worksheet {
                      display: block !important;
                      width: 100% !important;
                      max-width: 100% !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      border: none !important;
                      box-shadow: none !important;
                      background: white !important;
                      overflow: visible !important;
                    }

                    /* 5. Force standard page breaks for answers key */
                    .page-break {
                      page-break-before: always !important;
                      break-before: page !important;
                      padding-top: 2rem !important;
                    }
                  }
                `}} />

                 {/* Print button controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4 print:hidden">
                  <div>
                    <h3 className="text-xl font-black font-display text-slate-800">
                      Worksheet Generator
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Bilingual Printable Practice Book
                    </p>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm shrink-0"
                  >
                    <Printer size={14} /> Print Worksheet
                  </button>
                </div>

                {/* Actual Printable Page Sheet container */}
                <div 
                  id="printable-worksheet" 
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-12 shadow-xs space-y-8 text-slate-800 print:shadow-none print:border-none print:p-0"
                >
                  {/* 1. Header Card */}
                  <div className="border-b-4 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                      <span className="text-[10px] text-blue-800 font-black uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                        Courage National Talent Search (CNTS)
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black font-display mt-1 text-slate-900">
                        {topic.title[selectedLanguage]}
                      </h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        {selectedLanguage === "en" ? "Study Worksheet & Practice Set" : "अध्ययन कार्यपत्रक और अभ्यास सेट"}
                      </p>
                    </div>
                    <div className="text-right text-xs font-semibold text-slate-400">
                      CNTS Academy 2026
                    </div>
                  </div>

                  {/* Student Credentials fields for school worksheets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-slate-100 rounded-2xl text-xs font-bold bg-slate-50/50">
                    <div className="flex items-center gap-2 w-full">
                      <span className="shrink-0">{selectedLanguage === "en" ? "Name:" : "नाम:"}</span>
                      <div className="flex-grow border-b border-dashed border-slate-300 h-4 min-w-[60px]"></div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <span className="shrink-0">{selectedLanguage === "en" ? "Roll Number:" : "रोल नंबर:"}</span>
                      <div className="flex-grow border-b border-dashed border-slate-300 h-4 min-w-[40px]"></div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <span className="shrink-0">{selectedLanguage === "en" ? "Class:" : "कक्षा:"}</span>
                      <div className="flex-grow border-b border-dashed border-slate-300 h-4 min-w-[40px]"></div>
                    </div>
                  </div>

                  {/* 2. Concept Summary Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                      <BookOpen size={18} className="text-blue-800" />
                      {selectedLanguage === "en" ? "1. Key Concept / सिद्धांत" : "1. मुख्य सिद्धांत"}
                    </h3>
                    
                    {/* ELI10 concept block */}
                    {topic.blocks
                      .filter(b => b.type === "callout" && (b.metadata as any)?.icon === "idea")
                      .map((block, idx) => (
                        <p key={idx} className="text-sm text-slate-700 leading-relaxed font-semibold bg-blue-50/30 border-l-4 border-blue-800 rounded-r-xl p-4">
                          {block.content[selectedLanguage]}
                        </p>
                      ))}

                    {/* Real-life application */}
                    {topic.blocks
                      .filter(b => b.type === "callout" && (b.metadata as any)?.icon === "life")
                      .map((block, idx) => (
                        <p key={idx} className="text-xs text-slate-600 leading-relaxed italic mt-2">
                          <strong>{selectedLanguage === "en" ? "Real-Life Link: " : "वास्तविक जीवन से जुड़ाव: "}</strong>
                          {block.content[selectedLanguage]}
                        </p>
                      ))}
                  </div>

                  {/* 3. Speed Hacks & Cheatsheets */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                      <Zap size={18} className="text-amber-500" />
                      {selectedLanguage === "en" ? "2. Speed Hacks & Tricks / स्पीड हैक्स" : "2. स्पीड हैक्स और ट्रिक्स"}
                    </h3>
                    
                    {/* Print alphabet index helpers if Alphabet series / Coding decoding */}
                    {(slug === "alphabet-series" || slug === "coding-decoding") && (
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 font-mono text-xs text-center space-y-3">
                        <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider">A-Z Index Table</span>
                        <div className="grid grid-cols-13 gap-1 font-bold text-slate-800">
                          {Array.from({ length: 13 }, (_, i) => String.fromCharCode(65 + i)).map(l => (
                            <div key={l} className="border border-slate-200 bg-white p-1 rounded">
                              <div>{l}</div>
                              <div className="text-[10px] text-slate-400">{l.charCodeAt(0) - 64}</div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-13 gap-1 font-bold text-slate-800">
                          {Array.from({ length: 13 }, (_, i) => String.fromCharCode(78 + i)).map(l => (
                            <div key={l} className="border border-slate-200 bg-white p-1 rounded">
                              <div>{l}</div>
                              <div className="text-[10px] text-slate-400">{l.charCodeAt(0) - 64}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tip blocks */}
                    {topic.blocks
                      .filter(b => b.type === "tip")
                      .map((block, idx) => (
                        <div key={idx} className="bg-amber-50/50 border border-dashed border-amber-200 rounded-2xl p-4 text-xs font-semibold text-slate-700 leading-relaxed">
                          {block.content[selectedLanguage]}
                        </div>
                      ))}
                  </div>

                  {/* 4. Solved Step-by-Step Recipes */}
                  {topic.blocks.some(b => b.type === "recipe") && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-700" />
                        {selectedLanguage === "en" ? "3. Step-by-Step Solver Method / हल करने की विधि" : "3. हल करने की विधि"}
                      </h3>
                      {topic.blocks
                        .filter(b => b.type === "recipe")
                        .map((block, idx) => {
                          const meta = (block.metadata || {}) as any;
                          const steps = meta.steps || [];
                          return (
                            <div key={idx} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30 space-y-3">
                              <h4 className="font-extrabold text-sm text-slate-800">{block.content[selectedLanguage]}</h4>
                              <div className="space-y-2">
                                {steps.map((st: any, i: number) => (
                                  <div key={i} className="flex gap-3 text-xs font-semibold text-slate-700 items-start">
                                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">{i + 1}</span>
                                    <p className="pt-0.5 leading-relaxed">{st[selectedLanguage]}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* 5. Solved Examples */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                      <Lightbulb size={18} className="text-yellow-600" />
                      {selectedLanguage === "en" ? "4. Solved Examples / हल किए गए उदाहरण" : "4. हल किए गए उदाहरण"}
                    </h3>
                    {topic.blocks
                      .filter(b => b.type === "example")
                      .map((block, idx) => {
                        const parts = block.content[selectedLanguage].split("\n");
                        const titleLine = parts.find((l: string) => l.startsWith("Level:") || l.startsWith("स्तर:"));
                        return (
                          <div key={idx} className="border border-slate-200/80 rounded-2xl p-5 space-y-3 bg-white shadow-xs">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">
                              {titleLine ? titleLine.replace("Level:", "").replace("स्तर:", "").trim() : "Solved Example"}
                            </span>
                            <div className="space-y-2 text-xs font-semibold text-slate-700 leading-relaxed">
                              {parts.map((line: string, i: number) => {
                                const trimmed = line.trim();
                                if (!trimmed || trimmed.startsWith("Level:") || trimmed.startsWith("स्तर:")) return null;
                                if (trimmed.startsWith("Student Thinking:") || trimmed.startsWith("Incorrect Method:") || trimmed.startsWith("Correct Method:") || trimmed.startsWith("Shortcut:")) {
                                  return (
                                    <p key={i} className="pl-4 border-l-2 border-slate-300 font-bold text-slate-800 bg-slate-50 p-2 rounded-r-lg">
                                      {trimmed}
                                    </p>
                                  );
                                }
                                return <p key={i}>{trimmed}</p>;
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* 6. Offline Practice Question Set (All questions!) */}
                  <div className="space-y-8">
                    <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                      <Target size={18} className="text-indigo-600" />
                      {selectedLanguage === "en" ? "5. Offline Practice Exercises / अभ्यास प्रश्न" : "5. अभ्यास प्रश्न"}
                    </h3>
                    
                    <div className="space-y-8">
                      {questions.map((q, qIdx) => (
                        <div key={q.id} className="space-y-4 p-5 border border-slate-200/60 rounded-3xl bg-white shadow-xs">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                            <span>Question {qIdx + 1}</span>
                            <span className="uppercase tracking-widest text-[9px] bg-slate-100 px-2 py-0.5 rounded">{q.difficulty}</span>
                          </div>
                          
                          <p className="font-extrabold text-slate-800 text-sm sm:text-base leading-relaxed">
                            {q.text[selectedLanguage]}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex gap-2.5 items-center p-3 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 bg-slate-50/50">
                                <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] text-slate-400 shrink-0 font-mono">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt[selectedLanguage]}</span>
                              </div>
                            ))}
                          </div>

                          {/* Student Scratch Workspace border */}
                          <div className="border border-dashed border-slate-200 rounded-2xl h-24 flex items-center justify-center bg-slate-50/30 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                            [ {selectedLanguage === "en" ? "Student Workspace / Scratchpad" : "छात्र रफ कार्य क्षेत्र"} ]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7. Parent Checklist home activity */}
                  {topic.blocks.some(b => b.type === "parent-note") && (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-3">
                      <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Home size={14} className="text-emerald-700" />
                        {selectedLanguage === "en" ? "Parent-Child Home Activity Challenge" : "माता-पिता-बच्चे के लिए घरेलू गतिविधि चुनौती"}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {(topic.blocks.find(b => b.type === "parent-note")?.metadata as any)?.homeActivity?.[selectedLanguage]}
                      </p>
                    </div>
                  )}

                  {/* 8. Printable Answer Key Page (pushed to separate page during printing) */}
                  <div className="page-break border-t-4 border-slate-900 pt-8 mt-12 space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                        {selectedLanguage === "en" ? "Answer Key & Explanations (उत्तर कुंजी)" : "उत्तर कुंजी और विस्तृत व्याख्या"}
                      </h3>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">
                        Parents/Teachers: Detach or keep this section for evaluation.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {questions.map((q, qIdx) => (
                        <div key={q.id} className="text-xs space-y-2 border-b border-slate-100 pb-4">
                          <p className="font-extrabold text-slate-800 text-sm">
                            Question {qIdx + 1}: Correct Option {String.fromCharCode(65 + q.correctIndex)}
                          </p>
                          <p className="text-slate-500 font-bold italic leading-relaxed">
                            {selectedLanguage === "en" ? "Answer: " : "उत्तर: "} {q.options[q.correctIndex][selectedLanguage]}
                          </p>
                          <p className="text-slate-600 font-semibold leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                            <strong>{selectedLanguage === "en" ? "Explanation: " : "व्याख्या: "}</strong>
                            {q.explanation[selectedLanguage]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer message */}
                  <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400 print:pt-8">
                    © Courage National Talent Search (CNTS) 2026. Keep this worksheet for exam revision.
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      <Footer />

      {/* 3D Interactive Flashcard Engine Overlay */}
      {flashcardOpen && (
        <FlashcardEngine 
          cards={translateBlocksToFlashcards()} 
          selectedLanguage={selectedLanguage}
          onClose={() => setFlashcardOpen(false)}
        />
      )}

      {/* Simpler Example Popup Modal */}
      {showSimplerExamplePopup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-slate-200 relative animate-slide-up">
            <button
              onClick={() => setShowSimplerExamplePopup(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95 border border-slate-200/50"
            >
              <X size={16} />
            </button>
            
            <div className="flex gap-3 items-start mb-4">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl shrink-0">
                <Lightbulb size={20} />
              </div>
              <div>
                <span className="text-[9px] font-black text-blue-800 uppercase tracking-wider block">Prerequisite Helper</span>
                <h4 className="font-extrabold text-slate-800 text-base">Simpler Concept Case</h4>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
              {selectedLanguage === "en" 
                ? "Let's look at a simpler setup first to build confidence. Solve this starter puzzle, then retry the main question!"
                : "आत्मविश्वास बढ़ाने के लिए पहले एक सरल उदाहरण देखते हैं। इस शुरुआती पहेली को हल करें, फिर मुख्य प्रश्न को फिर से हल करें!"}
            </p>

            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-4 mb-6">
              <span className="text-[9px] text-amber-850 font-extrabold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md">
                Simple Level Puzzle
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                {questions[currentQIndex]?.difficulty === "easy"
                  ? (selectedLanguage === "en" 
                      ? "If A is taller than B, and B is taller than C, who is the tallest?"
                      : "यदि A, B से लंबा है, और B, C से लंबा है, तो सबसे लंबा कौन है?")
                  : (selectedLanguage === "en"
                      ? "If A = 1, B = 2, C = 3, what is the next letter and number?"
                      : "यदि A = 1, B = 2, C = 3, तो अगला अक्षर और संख्या क्या होगी?")}
              </p>
              
              <div className="bg-emerald-50 border border-dashed border-emerald-200 rounded-xl p-3">
                <span className="block text-[8px] font-bold text-emerald-805 uppercase tracking-widest mb-1">Concept Bridge / सिद्धांत</span>
                <p className="text-[11px] text-slate-700 leading-normal font-semibold">
                  {questions[currentQIndex]?.difficulty === "easy"
                    ? (selectedLanguage === "en"
                        ? "Draw a simple line from A -> B -> C to visualize ordering!"
                        : "क्रम को देखने के लिए A -> B -> C से एक सरल रेखा खींचें!")
                    : (selectedLanguage === "en"
                        ? "Letters go A, B, C, D (+1 position). Numbers go 1, 2, 3, 4 (+1 value)."
                        : "अक्षर A, B, C, D (+1 स्थान) के रूप में जाते हैं। संख्याएँ 1, 2, 3, 4 (+1 मान) के रूप में जाती हैं।")}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSimplerExamplePopup(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              I Understand! Let's Retry
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
