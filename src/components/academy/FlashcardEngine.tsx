"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  BookMarked, 
  AlertCircle, 
  RefreshCw, 
  Bookmark, 
  Volume2, 
  HelpCircle,
  Trophy
} from "lucide-react";

export interface Flashcard {
  id: string;
  type: "concept" | "trick" | "example" | "challenge" | "memory";
  title: string;
  frontContent: string;
  backContent: string;
  backDetails?: React.ReactNode;
}

interface FlashcardEngineProps {
  cards: Flashcard[];
  selectedLanguage: "en" | "hi";
  onClose: () => void;
}

export default function FlashcardEngine({ cards: initialCards, selectedLanguage, onClose }: FlashcardEngineProps) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [difficultIds, setDifficultIds] = useState<string[]>([]);
  
  // Touch swipe states
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load bookmarks and review lists
  useEffect(() => {
    try {
      const savedBookmarked = localStorage.getItem("cnts_flashcards_bookmarked");
      if (savedBookmarked) setBookmarkedIds(JSON.parse(savedBookmarked));

      const savedDifficult = localStorage.getItem("cnts_flashcards_difficult");
      if (savedDifficult) setDifficultIds(JSON.parse(savedDifficult));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, cards.length]);

  const toggleBookmark = (id: string) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((x) => x !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem("cnts_flashcards_bookmarked", JSON.stringify(updated));
  };

  const toggleDifficult = (id: string) => {
    const updated = difficultIds.includes(id)
      ? difficultIds.filter((x) => x !== id)
      : [...difficultIds, id];
    setDifficultIds(updated);
    localStorage.setItem("cnts_flashcards_difficult", JSON.stringify(updated));
  };

  const [isSpeaking, setIsSpeaking] = useState(false);

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleNext = () => {
    stopSpeaking();
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    }
  };

  const handlePrev = () => {
    stopSpeaking();
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 150);
    }
  };

  const handleShuffle = () => {
    stopSpeaking();
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  const handleReset = () => {
    stopSpeaking();
    setIsFlipped(false);
    setTimeout(() => {
      setCards(initialCards);
      setCurrentIndex(0);
    }, 150);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      const swipeThreshold = 50; // min distance in px
      if (diff > swipeThreshold) {
        handleNext();
      } else if (diff < -swipeThreshold) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const toggleSpeak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US";
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const currentCard = cards[currentIndex];

  if (!currentCard) return null;

  const isBookmarked = bookmarkedIds.includes(currentCard.id);
  const isDifficult = difficultIds.includes(currentCard.id);

  // Define colors based on card types
  const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    concept: { bg: "bg-blue-50 text-blue-800", text: "text-blue-900", border: "border-blue-200" },
    trick: { bg: "bg-violet-50 text-violet-800", text: "text-violet-900", border: "border-violet-200" },
    example: { bg: "bg-emerald-50 text-emerald-800", text: "text-emerald-900", border: "border-emerald-200" },
    challenge: { bg: "bg-amber-50 text-amber-800", text: "text-amber-900", border: "border-amber-200" },
    memory: { bg: "bg-slate-900 text-white", text: "text-slate-100", border: "border-slate-800" }
  };

  const activeColors = typeColors[currentCard.type] || typeColors.concept;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* 3D Flip Card CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .flashcard-perspective {
          perspective: 1500px;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flashcard-flipped {
          transform: rotateY(180deg);
        }
        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 24px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .flashcard-back {
          transform: rotateY(180deg);
        }
      `}} />

      {/* Header controls bar */}
      <div className="flex justify-between items-center max-w-2xl mx-auto w-full pb-4 border-b border-white/10 shrink-0">
        <div>
          <h3 className="text-white font-black text-base sm:text-lg">CNTS Flashcard Engine</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShuffle} 
            className="p-2 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl transition-all"
            title="Shuffle Cards"
          >
            <Shuffle size={16} />
          </button>
          <button 
            onClick={handleReset} 
            className="p-2 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl transition-all"
            title="Reset Shuffling"
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={() => { stopSpeaking(); onClose(); }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 ml-2"
          >
            Close
          </button>
        </div>
      </div>

      {/* Interactive flashcard area */}
      <div className="flex-grow flex items-center justify-center py-6 w-full max-w-md mx-auto relative">
        <div 
          className="flashcard-perspective w-full h-[360px] sm:h-[420px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`flashcard-inner ${isFlipped ? "flashcard-flipped" : ""}`}>
            
            {/* CARD FRONT FACE */}
            <div className={`flashcard-front bg-white border-2 ${activeColors.border} p-6 sm:p-8 flex flex-col justify-between`}>
              <div className="flex justify-between items-center w-full">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${activeColors.bg}`}>
                  {currentCard.type}
                </span>
                
                {/* Icons */}
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(currentCard.id); }}
                    className={`p-1.5 rounded-lg transition-all ${isBookmarked ? "text-blue-800" : "text-slate-300"}`}
                  >
                    <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleDifficult(currentCard.id); }}
                    className={`p-1.5 rounded-lg transition-all ${isDifficult ? "text-amber-600" : "text-slate-300"}`}
                  >
                    <AlertCircle size={16} fill={isDifficult ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              <div className="text-center py-6">
                <h4 className="text-xl sm:text-2xl font-black font-display text-slate-800 leading-snug">
                  {currentCard.title}
                </h4>
                <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-wider animate-pulse">
                  Click / Tap to Flip Card
                </p>
              </div>

              <div className="flex justify-between w-full text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Space to Flip</span>
                <span>Keyboard Nav Support</span>
              </div>
            </div>

            {/* CARD BACK FACE */}
            <div className={`flashcard-back bg-slate-900 border-2 border-slate-800 text-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto`}>
              <div className="flex justify-between items-center w-full shrink-0">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-slate-800 text-slate-300 font-black uppercase tracking-wider">
                  Answer / विवरण
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSpeak(currentCard.backContent); }}
                    className={`p-1.5 rounded-lg transition-all ${
                      isSpeaking 
                        ? "bg-blue-600 text-white animate-pulse" 
                        : "bg-slate-850 hover:bg-slate-700 text-slate-300"
                    }`}
                    title="Speak Answer"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              </div>

              <div className="my-auto py-4 overflow-y-auto max-h-[220px] sm:max-h-[280px] text-left">
                {currentCard.backDetails ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    {currentCard.backDetails}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-200 whitespace-pre-line">
                    {currentCard.backContent}
                  </p>
                )}
              </div>

              <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mt-4">
                Click Card to flip back
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer navigation controls */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 shrink-0">
        
        {/* Helper indicators */}
        <div className="flex gap-1.5 justify-center">
          {cards.map((_, idx) => (
            <span 
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/20"
              }`}
              onClick={() => { setIsFlipped(false); setCurrentIndex(idx); }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center w-full gap-4">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft size={14} /> Prev
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
