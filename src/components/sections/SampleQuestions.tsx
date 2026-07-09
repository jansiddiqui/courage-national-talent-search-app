"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";

interface Question {
  id: string;
  category: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: "q1",
    category: "Pattern Recognition",
    text: "2, 4, 8, 16, ?",
    options: ["24", "30", "32", "36"],
    correctAnswer: 2, // "32"
    explanation: "This question measures Pattern Recognition — identifying the underlying rule (multiply by 2) to predict the next step.",
  },
  {
    id: "q2",
    category: "Logical Reasoning",
    text: "All roses are flowers. Some flowers fade quickly. Can we conclude that all roses fade quickly?",
    options: ["Yes", "No"],
    correctAnswer: 1, // "No"
    explanation: "This question measures Logical Reasoning — separating factual rules from assumptions.",
  },
  {
    id: "q3",
    category: "Spatial Thinking",
    text: "Imagine folding a flat piece of paper into a cube. Which of these properties remains completely unchanged?",
    options: ["Its total surface area", "Its 3D volume", "The distance between opposite corners", "Its overall shape"],
    correctAnswer: 0, // "Its total surface area"
    explanation: "This question measures Spatial Thinking — the ability to mentally manipulate shapes in 3D space.",
  }
];

export default function SampleQuestions() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);
  };

  const handleNext = () => {
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setActiveQuestion(0);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  const currentQ = questions[activeQuestion];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Text */}
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-widest mb-4 bg-rose-50 px-3 py-1 rounded-full">
              Try It Yourself
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
              Experience the difference.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              CNTS questions aren't about remembering formulas. They are designed to feel like puzzles that test raw intellectual potential.
            </p>
            
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-400">1</div>
                <span>No syllabus required</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-400">2</div>
                <span>Tests logic, not memory</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-400">3</div>
                <span>Fun and engaging for students</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Quiz */}
          <div className="bg-[#F8FAFF] rounded-3xl border border-blue-100 p-6 md:p-10 shadow-lg shadow-blue-900/5 relative">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-lg">
                Question {activeQuestion + 1} of {questions.length}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sample Test
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-medium text-slate-800 mb-8 leading-snug">
              {currentQ.text}
            </h3>

            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50";
                
                if (hasAnswered) {
                  if (idx === currentQ.correctAnswer) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-rose-50 border-rose-300 text-rose-700";
                  } else {
                    btnStyle = "bg-white border-slate-200 text-slate-400 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${btnStyle} ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {hasAnswered && idx === currentQ.correctAnswer && <CheckCircle2 className="text-emerald-500" size={20} />}
                      {hasAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="text-rose-400" size={20} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className={`p-5 rounded-2xl mb-6 ${isCorrect ? 'bg-emerald-100/50 border border-emerald-200' : 'bg-slate-100 border border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="text-emerald-600" size={20} />
                    ) : (
                      <XCircle className="text-slate-400" size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-slate-700'}`}>
                      {isCorrect ? "✓ Correct!" : "Not quite."}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                      {currentQ.explanation}
                    </p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      One of the cognitive abilities assessed in CNTS.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${hasAnswered ? 'bg-blue-800 text-white shadow-md hover:bg-blue-700 hover:shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {activeQuestion < questions.length - 1 ? "Next Question" : "Try Again"}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}