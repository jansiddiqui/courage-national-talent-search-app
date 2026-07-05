"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Target, 
  RotateCw, 
  Lightbulb, 
  Sparkles, 
  Trophy, 
  ChevronRight, 
  ArrowRight,
  BookOpen
} from "lucide-react";

interface MemoryLabProps {
  topicSlug: string;
  selectedLanguage: "en" | "hi";
}

export default function MemoryLab({ topicSlug, selectedLanguage }: MemoryLabProps) {
  const [activeTool, setActiveTool] = useState<"special" | "squares" | "relations" | "oddGame">("special");

  // State for Alphabet Wheel / Lookup
  const [selectedLetter, setSelectedLetter] = useState<string>("E");
  
  // State for Number Memory Grid (flipped states map)
  const [flippedNumbers, setFlippedNumbers] = useState<Record<string, boolean>>({});
  const [numberType, setNumberType] = useState<"squares" | "cubes">("squares");

  // State for Classification Game
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [showGameExplanation, setShowGameExplanation] = useState(false);

  // States for Analogy Explorer
  const [selectedRelation, setSelectedRelation] = useState<number>(0);

  // 1. Alphabet data helper
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const getLetterDetails = (letter: string) => {
    const rank = letter.charCodeAt(0) - 64;
    const reverseRank = 27 - rank;
    const oppositeLetter = String.fromCharCode(91 - rank); // 65 + (26 - rank)
    
    // EJOTY matching
    const ejoty: Record<string, number> = { E: 5, J: 10, O: 15, T: 20, Y: 25 };
    let ejotyInfo = "";
    if (ejoty[letter]) {
      ejotyInfo = selectedLanguage === "en" 
        ? `${letter} is a direct landmark letter in EJOTY (${ejoty[letter]})!`
        : `${letter} सीधे EJOTY (${ejoty[letter]}) का मुख्य मील का पत्थर अक्षर है!`;
    } else {
      const closest = Object.entries(ejoty)
        .map(([char, val]) => ({ char, val, diff: rank - val }))
        .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0];
      const diffVal = Math.abs(closest.diff);
      const direction = closest.diff > 0 ? (selectedLanguage === "en" ? "after" : "बाद") : (selectedLanguage === "en" ? "before" : "पहले");
      
      ejotyInfo = selectedLanguage === "en"
        ? `${letter} is ${diffVal} rank(s) ${direction} landmark letter ${closest.char} (${closest.val}).`
        : `${letter} मुख्य अक्षर ${closest.char} (${closest.val}) से ${diffVal} स्थान ${direction} आता है।`;
    }

    return { rank, reverseRank, oppositeLetter, ejotyInfo };
  };

  // 2. Numbers grid data
  const squaresList = Array.from({ length: 20 }, (_, i) => i + 1);
  const cubesList = Array.from({ length: 12 }, (_, i) => i + 1);

  const flipAll = (type: "squares" | "cubes") => {
    const list = type === "squares" ? squaresList : cubesList;
    const flipped: Record<string, boolean> = {};
    list.forEach(n => {
      flipped[`${type}_${n}`] = true;
    });
    setFlippedNumbers(prev => ({ ...prev, ...flipped }));
  };

  const hideAll = (type: "squares" | "cubes") => {
    const list = type === "squares" ? squaresList : cubesList;
    const flipped: Record<string, boolean> = {};
    list.forEach(n => {
      flipped[`${type}_${n}`] = false;
    });
    setFlippedNumbers(prev => ({ ...prev, ...flipped }));
  };

  // 3. Analogy explorer data
  const analogyRelations = [
    {
      title: { en: "Tool : Worker", hi: "औजार : कारीगर" },
      desc: { en: "Compares an instrument to the professional who uses it.", hi: "उपकरण और उसका उपयोग करने वाले पेशेवर की तुलना करता है।" },
      examples: [
        { first: "Knife : Chef", second: "Saw : Carpenter" },
        { first: "Pen : Writer", second: "Scalpel : Surgeon" },
        { first: "Brush : Artist", second: "Plough : Farmer" }
      ]
    },
    {
      title: { en: "Country : Capital", hi: "देश : राजधानी" },
      desc: { en: "Compares a country to its capital city.", hi: "एक देश और उसकी राजधानी शहर की तुलना करता है।" },
      examples: [
        { first: "India : New Delhi", second: "Japan : Tokyo" },
        { first: "France : Paris", second: "USA : Washington D.C." },
        { first: "Australia : Canberra", second: "UK : London" }
      ]
    },
    {
      title: { en: "Product : Raw Material", hi: "उत्पाद : कच्चा माल" },
      desc: { en: "Compares a finished item to what it's made from.", hi: "तैयार वस्तु और उसके कच्चे माल की तुलना करता है।" },
      examples: [
        { first: "Paper : Wood", second: "Bread : Flour" },
        { first: "Jewelry : Gold", second: "Furniture : Wood" },
        { first: "Cloth : Cotton", second: "Shoes : Leather" }
      ]
    },
    {
      title: { en: "Animal : Young One", hi: "पशु : शावक/बच्चा" },
      desc: { en: "Compares a parent animal to its baby.", hi: "एक वयस्क जानवर और उसके बच्चे की तुलना करता है।" },
      examples: [
        { first: "Dog : Puppy", second: "Cat : Kitten" },
        { first: "Cow : Calf", second: "Lion : Cub" },
        { first: "Sheep : Lamb", second: "Horse : Foal" }
      ]
    }
  ];

  // 4. Classification Practice Game data
  const classificationGameLevels = [
    {
      words: ["Rose", "Lotus", "Marigold", "Potato"],
      correctIndex: 3,
      explanation: {
        en: "Rose, Lotus, and Marigold belong to the 'Flowers' club. Potato is a root vegetable and doesn't belong!",
        hi: "गुलाब (Rose), कमल (Lotus) और गेंदा (Marigold) 'फूलों' (Flowers) के क्लब का हिस्सा हैं। आलू (Potato) एक सब्जी है, फूल नहीं!"
      }
    },
    {
      words: ["13", "17", "19", "21"],
      correctIndex: 3,
      explanation: {
        en: "13, 17, and 19 are Prime numbers. 21 is a Composite number (divisible by 1, 3, 7, and 21).",
        hi: "13, 17 और 19 अभाज्य (Prime) संख्याएँ हैं। 21 भाज्य संख्या है (यह 3 और 7 की टेबल में आता है)।"
      }
    },
    {
      words: ["DFH", "LNP", "RTV", "KMQ"],
      correctIndex: 3,
      explanation: {
        en: "DFH (D+2=F, F+2=H), LNP (L+2=N, N+2=P), and RTV (R+2=T, T+2=V) follow the +2 gap rule. KMQ has a +2, +4 gap (K+2=M, M+4=Q) which breaks the club rule!",
        hi: "DFH, LNP और RTV सभी में अक्षरों के बीच +2 का अंतर है। KMQ में +2, +4 का अंतर है, जो समूह के नियम को तोड़ता है!"
      }
    }
  ];

  const handleGameChoice = (idx: number) => {
    if (selectedChoice !== null) return; // Answered already
    setSelectedChoice(idx);
    const correct = idx === classificationGameLevels[currentLevel].correctIndex;
    if (correct) setGameScore(prev => prev + 1);
    setShowGameExplanation(true);
  };

  const nextLevel = () => {
    setSelectedChoice(null);
    setShowGameExplanation(false);
    if (currentLevel < classificationGameLevels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      // Reset
      setCurrentLevel(0);
      setGameScore(0);
    }
  };

  const selectedLetterDetails = getLetterDetails(selectedLetter);

  // Helper check to show correct/incorrect classes in game
  const getChoiceClass = (idx: number) => {
    if (selectedChoice === null) return "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
    const isCorrect = idx === classificationGameLevels[currentLevel].correctIndex;
    const isSelected = selectedChoice === idx;

    if (isCorrect) return "border-emerald-500 bg-emerald-50 text-emerald-800";
    if (isSelected) return "border-rose-500 bg-rose-50 text-rose-800";
    return "border-slate-50 bg-slate-50/50 opacity-60 pointer-events-none";
  };

  return (
    <div className="space-y-6">
      {/* Tab selectors for interactive tools */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 overflow-x-auto gap-1">
        {/* Topic Contextual specific tool toggle */}
        {(topicSlug === "alphabet-series" || topicSlug === "coding-decoding") && (
          <button 
            onClick={() => setActiveTool("special")}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTool === "special" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Alphabet Wheel
          </button>
        )}

        {topicSlug === "number-series" && (
          <button 
            onClick={() => setActiveTool("squares")}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTool === "squares" || activeTool === "special" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Squares & Cubes Grid
          </button>
        )}

        {topicSlug === "analogy" && (
          <button 
            onClick={() => setActiveTool("relations")}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTool === "relations" || activeTool === "special" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Analogy Relations
          </button>
        )}

        {topicSlug === "classification" && (
          <button 
            onClick={() => setActiveTool("oddGame")}
            className={`text-xs px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTool === "oddGame" || activeTool === "special" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Odd One Out Trainer
          </button>
        )}
      </div>

      {/* RENDER TOOL: ALPHABET WHEEL */}
      {(activeTool === "special" && (topicSlug === "alphabet-series" || topicSlug === "coding-decoding")) && (
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-sm mx-auto">
            <h4 className="font-black text-slate-800 text-lg">Alphabet Memory Decoder</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Select any letter to view its indices
            </p>
          </div>

          {/* Letter grid */}
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
            {alphabet.map(letter => {
              const isSelected = letter === selectedLetter;
              // Check if letter belongs to EJOTY
              const isEjoty = ["E", "J", "O", "T", "Y"].includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`h-11 sm:h-12 rounded-xl text-sm sm:text-base font-mono font-black transition-all border shadow-xs ${
                    isSelected 
                      ? "bg-blue-800 border-blue-800 text-white" 
                      : isEjoty 
                      ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Letter Details Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 animate-fade-in">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-20 h-20 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center font-mono font-black text-4xl text-blue-900 shadow-inner">
                {selectedLetter}
              </div>
              <div>
                <h5 className="font-black text-slate-800 text-base sm:text-lg">
                  {selectedLanguage === "en" ? `Letter Rank details` : `अक्षर विवरण`}
                </h5>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Symbol mapping
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-grow max-w-lg">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Rank (बाएं से)</span>
                <span className="block text-2xl font-black text-slate-800 mt-1">{selectedLetterDetails.rank}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Rev Rank (दाएं से)</span>
                <span className="block text-2xl font-black text-slate-800 mt-1">{selectedLetterDetails.reverseRank}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Opposite (विपरीत)</span>
                <span className="block text-2xl font-black text-blue-800 mt-1">{selectedLetterDetails.oppositeLetter}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-center text-xs text-amber-800 font-semibold">
            <Sparkles className="shrink-0" size={16} />
            <p>{selectedLetterDetails.ejotyInfo}</p>
          </div>
        </div>
      )}

      {/* RENDER TOOL: SQUARES & CUBES GRID */}
      {(activeTool === "squares" || (activeTool === "special" && topicSlug === "number-series")) && (
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex bg-white p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => { setNumberType("squares"); setFlippedNumbers({}); }}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all ${
                  numberType === "squares" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Squares (1-20)
              </button>
              <button 
                onClick={() => { setNumberType("cubes"); setFlippedNumbers({}); }}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-black uppercase tracking-wider transition-all ${
                  numberType === "cubes" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Cubes (1-12)
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => flipAll(numberType)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all"
              >
                Reveal All
              </button>
              <button 
                onClick={() => hideAll(numberType)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all"
              >
                Hide All
              </button>
            </div>
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {(numberType === "squares" ? squaresList : cubesList).map(n => {
              const cardId = `${numberType}_${n}`;
              const isFlipped = !!flippedNumbers[cardId];
              const result = numberType === "squares" ? n * n : n * n * n;
              
              return (
                <div 
                  key={n}
                  onClick={() => setFlippedNumbers(prev => ({ ...prev, [cardId]: !isFlipped }))}
                  className={`h-20 border rounded-2xl cursor-pointer select-none flex flex-col items-center justify-center transition-all duration-300 transform ${
                    isFlipped 
                      ? "bg-slate-900 border-slate-850 text-white rotate-y-180 scale-95" 
                      : "bg-white border-slate-200 text-slate-800 hover:-translate-y-0.5 hover:shadow-xs"
                  }`}
                >
                  {!isFlipped ? (
                    <div className="text-center">
                      <span className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-0.5">Value</span>
                      <span className="block text-base font-black font-mono">{n}{numberType === "squares" ? "²" : "³"}</span>
                    </div>
                  ) : (
                    <div className="text-center animate-fade-in rotate-y-180">
                      <span className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-0.5">Answer</span>
                      <span className="block text-lg font-black font-mono text-amber-450">{result}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER TOOL: ANALOGY EXPLORER */}
      {(activeTool === "relations" || (activeTool === "special" && topicSlug === "analogy")) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            <h4 className="font-black text-slate-800 text-base mb-4 pl-1">Relationship Types</h4>
            {analogyRelations.map((rel, idx) => {
              const isActive = idx === selectedRelation;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedRelation(idx)}
                  className={`w-full text-left px-5 py-4 border rounded-2xl transition-all font-bold text-sm flex items-center justify-between group ${
                    isActive 
                      ? "bg-blue-800 border-blue-800 text-white shadow-sm" 
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{rel.title[selectedLanguage]}</span>
                  <ChevronRight size={16} className={`transition-transform ${isActive ? "translate-x-1" : "text-slate-400 group-hover:translate-x-1"}`} />
                </button>
              );
            })}
          </div>

          <div className="md:col-span-2 bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-blue-700 font-extrabold uppercase tracking-wider">Relationship Explanation</span>
                <h5 className="font-black text-slate-800 text-lg mt-1">{analogyRelations[selectedRelation].title[selectedLanguage]}</h5>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">{analogyRelations[selectedRelation].desc[selectedLanguage]}</p>
              </div>

              <div className="space-y-3 pt-4">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Solved Pairs (उदाहरण)</span>
                {analogyRelations[selectedRelation].examples.map((ex, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl gap-2">
                    <span className="font-mono font-black text-slate-700 text-sm sm:text-base">{ex.first}</span>
                    <span className="text-xs font-mono font-bold text-slate-400 shrink-0 uppercase tracking-widest hidden sm:inline">same as (::)</span>
                    <span className="font-mono font-black text-blue-800 text-sm sm:text-base">{ex.second}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER TOOL: CLASSIFICATION GAME */}
      {(activeTool === "oddGame" || (activeTool === "special" && topicSlug === "classification")) && (
        <div className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
            <div>
              <h4 className="font-black text-slate-800 text-base sm:text-lg">Spot the Imposter Challenge</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Practice Set {currentLevel + 1} of {classificationGameLevels.length}
              </p>
            </div>
            <div className="bg-amber-100 border border-amber-200 rounded-xl px-3 py-1.5 text-center shrink-0">
              <span className="block text-[8px] font-bold text-amber-800 uppercase tracking-wider">Score</span>
              <span className="block text-xs font-black text-amber-900 mt-0.5">{gameScore} / {classificationGameLevels.length}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
              Which item does NOT belong to the secret club?
            </h5>

            <div className="grid grid-cols-2 gap-4">
              {classificationGameLevels[currentLevel].words.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGameChoice(idx)}
                  className={`p-5 rounded-2xl border text-center font-black transition-all text-sm sm:text-base tracking-wide ${getChoiceClass(idx)}`}
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Explanation box */}
            {showGameExplanation && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 animate-slide-up">
                <div className="flex items-center gap-2">
                  {selectedChoice === classificationGameLevels[currentLevel].correctIndex ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy size={12} /> Correct Answer!
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <XCircle size={12} /> Incorrect choice
                    </span>
                  )}
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-semibold">
                  {classificationGameLevels[currentLevel].explanation[selectedLanguage]}
                </p>

                <button 
                  onClick={nextLevel}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center gap-1.5 ml-auto"
                >
                  {currentLevel === classificationGameLevels.length - 1 ? "Play Again" : "Continue"} <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
