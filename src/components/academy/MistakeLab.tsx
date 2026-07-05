"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Search, HelpCircle } from "lucide-react";

interface MistakeChallenge {
  problem: { en: string; hi: string };
  attempt: { en: string; hi: string };
  question: { en: string; hi: string };
  options: Array<{ en: string; hi: string }>;
  correctIndex: number;
  explanation: { en: string; hi: string };
}

interface MistakeLabProps {
  topicSlug: string;
  selectedLanguage: "en" | "hi";
}

export default function MistakeLab({ topicSlug, selectedLanguage }: MistakeLabProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mistake data repository by topic slug
  const mistakeDatabase: Record<string, MistakeChallenge> = {
    "number-series": {
      problem: {
        en: "Find the next term in: 2, 4, 8, 16, ?",
        hi: "अगला पद ज्ञात कीजिए: 2, 4, 8, 16, ?"
      },
      attempt: {
        en: "A student wrote: 'The differences are +2 (from 2 to 4), +4 (4 to 8), +8 (8 to 16). They grew by adding 2 each time (+2, +4, +8, so next is +10). The next number is 16 + 10 = 26.'",
        hi: "एक छात्र ने लिखा: 'संख्याओं के बीच का अंतर +2, +4, +8 है। यह अंतर हर बार 2 जुड़कर बढ़ रहा है (+2, +4, +8, तो अगला +10 होगा)। इसलिए अगला नंबर 16 + 10 = 26 है।'"
      },
      question: {
        en: "Why is the student's solution incorrect?",
        hi: "छात्र का हल गलत क्यों है?"
      },
      options: [
        { 
          en: "The next gap should be +12, not +10.", 
          hi: "अगला गैप +12 होना चाहिए, न कि +10।" 
        },
        { 
          en: "The gaps are doubling (2, 4, 8, so next is 16), not adding 2. Next term is 16 + 16 = 32.", 
          hi: "गैप दोगुने हो रहे हैं (2, 4, 8, तो अगला 16 होगा), न कि +2 जुड़ रहे हैं। अगला पद 16 + 16 = 32 है।" 
        },
        { 
          en: "There is no mistake; 26 is actually correct.", 
          hi: "कोई गलती नहीं है; 26 वास्तव में सही है।" 
        }
      ],
      correctIndex: 1,
      explanation: {
        en: "Spot on! The gaps are not an arithmetic sequence (+2, +4, +6, +8...). They are doubling (2 × 2 = 4, 4 × 2 = 8, 8 × 2 = 16). The next gap must be 16 × 2 = 32, so the next term is 16 + 16 = 32 (or simply double the previous term: 16 × 2 = 32).",
        hi: "बिल्कुल सही! अंतर समांतर श्रेणी (+2, +4, +6...) में नहीं हैं। वे दोगुने हो रहे हैं (2 × 2 = 4, 4 × 2 = 8, 8 × 2 = 16)। अगला अंतर 16 × 2 = 32 होना चाहिए, जिससे अगला पद 16 + 16 = 32 होगा।"
      }
    },
    "alphabet-series": {
      problem: {
        en: "Find the next term in: A, C, F, J, ?",
        hi: "अगला पद ज्ञात कीजिए: A, C, F, J, ?"
      },
      attempt: {
        en: "A student converted letters to positions: A=1, C=3, F=6, J=10. The gaps are +2, +3, +4. They wrote: 'Since J is the 10th letter and the last gap was +4, the next gap remains +4. 10 + 4 = 14. 14th letter is N.'",
        hi: "एक छात्र ने अक्षरों को उनकी स्थिति में बदला: A=1, C=3, F=6, J=10. अंतर +2, +3, +4 हैं। उसने लिखा: 'चूंकि J 10वां अक्षर है और आखिरी अंतर +4 था, इसलिए अगला अंतर भी +4 रहेगा। 10 + 4 = 14. 14वां अक्षर N है।'"
      },
      question: {
        en: "Where did the student make a logical error?",
        hi: "छात्र ने तार्किक गलती कहाँ की?"
      },
      options: [
        { 
          en: "J is actually rank 11, not 10.", 
          hi: "J वास्तव में 11वीं स्थिति पर है, 10वीं पर नहीं।" 
        },
        { 
          en: "The gaps are growing integers (+2, +3, +4), so the next gap must grow by +1 to become +5. J(10) + 5 = 15 (O).", 
          hi: "अंतर बढ़ रहे हैं (+2, +3, +4), इसलिए अगला अंतर +1 बढ़कर +5 होना चाहिए। J(10) + 5 = 15 (O)।" 
        },
        { 
          en: "The 14th letter of the alphabet is M, not N.", 
          hi: "वर्णमाला का 14वां अक्षर M होता है, N नहीं।" 
        }
      ],
      correctIndex: 1,
      explanation: {
        en: "Correct! The gaps are consecutive numbers (+2, +3, +4). This is a growing gap pattern, not a constant one. The next gap must increase to +5, which gives the 15th position (O), not the 14th (N).",
        hi: "सही! अंतर लगातार बढ़ते जा रहे हैं (+2, +3, +4)। यह एक बढ़ता हुआ गैप पैटर्न है, न कि स्थिर। अगला अंतर +5 होना चाहिए, जिससे 15वां अक्षर (O) मिलेगा।"
      }
    },
    "analogy": {
      problem: {
        en: "Complete the analogy: Chef : Knife :: Sculptor : ?",
        hi: "सादृश्यता को पूरा कीजिए: Chef : Knife :: Sculptor : ?"
      },
      attempt: {
        en: "A student selected 'Statue' as the answer, arguing: 'A Chef works with a knife, and a Sculptor works on a statue. It fits the creative theme perfectly.'",
        hi: "एक छात्र ने उत्तर के रूप में 'Statue' (मूर्ति) को चुना और तर्क दिया: 'एक शेफ चाकू के साथ काम करता है, और मूर्तिकार मूर्ति पर काम करता है। यह विषय से मेल खाता है।'"
      },
      question: {
        en: "What is wrong with the student's relationship analysis?",
        hi: "छात्र के संबंध विश्लेषण में क्या खराबी है?"
      },
      options: [
        { 
          en: "Chef : Knife is a Person : Tool relationship. A Sculptor's tool is a Chisel, not a Statue (which is the product).", 
          hi: "Chef : Knife का संबंध 'व्यक्ति : औजार' का है। मूर्तिकार (Sculptor) का औजार छेनी (Chisel) है, मूर्ति (Statue) नहीं (मूर्ति तो उत्पाद है)।" 
        },
        { 
          en: "Sculptors use brushes, not chisels.", 
          hi: "मूर्तिकार ब्रश का उपयोग करते हैं, छेनी का नहीं।" 
        },
        { 
          en: "The order is reversed; it should be Tool : Person.", 
          hi: "क्रम उलट गया है; यह औजार : व्यक्ति होना चाहिए।" 
        }
      ],
      correctIndex: 0,
      explanation: {
        en: "Brilliant! In analogies, the logical class must match exactly. A Knife is the tool a Chef uses to perform their job. A Statue is the final product created by a Sculptor, not the tool. The tool used by a Sculptor is a Chisel (छेनी).",
        hi: "शानदार! सादृश्यता में तार्किक वर्ग का सटीक मिलान होना चाहिए। चाकू वह उपकरण है जिसका उपयोग शेफ काम करने के लिए करता है। मूर्ति मूर्तिकार द्वारा बनाया गया उत्पाद है, उपकरण नहीं। मूर्तिकार का उपकरण छेनी (Chisel) है।"
      }
    },
    "classification": {
      problem: {
        en: "Find the odd one out: 9, 25, 49, 50",
        hi: "बेमेल चुनिए: 9, 25, 49, 50"
      },
      attempt: {
        en: "A student chose '9' because: '9 is the only single-digit number in the set. The other numbers (25, 49, 50) are all double-digit numbers.'",
        hi: "एक छात्र ने '9' को चुना क्योंकि: '9 समूह में एकमात्र एक-अंक की संख्या है। बाकी संख्याएँ (25, 49, 50) सभी दो-अंकों की संख्याएँ हैं।'"
      },
      question: {
        en: "Why is the single-digit rule a weaker classification rule here?",
        hi: "यहाँ एक-अंक का नियम कमजोर वर्गीकरण नियम क्यों है?"
      },
      options: [
        { 
          en: "9 is actually a prime number, which makes it odd.", 
          hi: "9 वास्तव में एक अभाज्य संख्या है, जो इसे अलग बनाती है।" 
        },
        { 
          en: "Classification requires defining a shared club rule for the OTHER three. 25, 49, and 50 do not share a common mathematical rule. The correct rule is perfect squares (3², 5², 7²), leaving 50 out.", 
          hi: "वर्गीकरण के लिए अन्य तीन के लिए एक साझा क्लब नियम की आवश्यकता होती है। 25, 49 और 50 कोई साझा नियम नहीं बनाते। सही नियम पूर्ण वर्ग (3², 5², 7²) का है, जिससे 50 बाहर हो जाता है क्योंकि यह वर्ग नहीं है।" 
        },
        { 
          en: "All numbers in the group are odd except 9.", 
          hi: "9 को छोड़कर समूह की सभी संख्याएँ विषम हैं।" 
        }
      ],
      correctIndex: 1,
      explanation: {
        en: "Exactly! Classification is about grouping, not isolating. You can only declare an item 'odd' if the other three share a strict mathematical property. 25, 49, and 50 do not form a logical group. However, 9 (3²), 25 (5²), and 49 (7²) share the property of being perfect squares, leaving 50 out.",
        hi: "बिल्कुल सही! वर्गीकरण समूह बनाने के बारे में है। आप किसी वस्तु को बेमेल तभी कह सकते हैं जब अन्य तीन एक सख्त नियम साझा करते हों। 9, 25 और 49 सभी पूर्ण वर्ग हैं, जबकि 50 नहीं है।"
      }
    },
    "coding-decoding": {
      problem: {
        en: "In a code language, CAT is written as XZG. How is DOG written?",
        hi: "एक कोड भाषा में, CAT को XZG लिखा जाता है। DOG को कैसे लिखा जाएगा?"
      },
      attempt: {
        en: "A student checked the first letter gap: C is 3rd, X is 24th (a shift of +21). They shifted DOG by +21: D(4)+21 = 25 (Y), O(15)+21 = 10 (J), G(7)+21 = 2 (B). Coded word is YJB.",
        hi: "एक छात्र ने पहले अक्षर का अंतर देखा: C 3वां है, X 24वां है (+21 का विस्थापन)। उन्होंने DOG को +21 से विस्थापित किया: D(4)+21=25(Y)... उत्तर YJB निकाला।"
      },
      question: {
        en: "What simpler coding logic did the student fail to see?",
        hi: "छात्र कौन सा सरल कोडिंग नियम नहीं पहचान पाया?"
      },
      options: [
        { 
          en: "The rule is opposite pairs (A-Z, B-Y, C-X). Sum of ranks is 27. DOG's opposite pairs are D-W, O-L, G-T (WLT).", 
          hi: "नियम विपरीत अक्षरों (A-Z, B-Y, C-X) का है। स्थितियों का योग 27 है। DOG का विपरीत WLT है।" 
        },
        { 
          en: "The code should just be written backward: GOD.", 
          hi: "कोड को बस उल्टा लिखा जाना चाहिए: GOD।" 
        },
        { 
          en: "The letters are shifted by +3, not +21.", 
          hi: "अक्षरों को +3 विस्थापित किया गया है, +21 नहीं।" 
        }
      ],
      correctIndex: 0,
      explanation: {
        en: "Great deduction! In coding, large jumps like +21 are almost always opposite letter pairs. C(3) + X(24) = 27. A(1) + Z(26) = 27. T(20) + G(7) = 27. Since the sum of ranks is always 27, the rule is Opposite Pairs. Applying this to DOG gives WLT.",
        hi: "बहुत बढ़िया! कोडिंग में, +21 जैसे बड़े उछाल लगभग हमेशा विपरीत अक्षर जोड़े होते हैं। C(3) + X(24) = 27. A(1) + Z(26) = 27. इसलिए विपरीत अक्षरों का नियम लागू करने पर DOG का उत्तर WLT होगा।"
      }
    }
  };

  const challenge = mistakeDatabase[topicSlug];

  if (!challenge) return null;

  const handleChoice = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === challenge.correctIndex;
    setIsCorrect(correct);
    setShowExplanation(true);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-8 my-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shrink-0">
          <Search size={20} />
        </div>
        <div>
          <h4 className="font-black text-slate-800 text-base sm:text-lg">Can You Spot the Mistake?</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Cognitive Diagnostics Lab
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Problem Description */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">The Problem</span>
          <p className="font-extrabold text-sm sm:text-base text-slate-800">{challenge.problem[selectedLanguage]}</p>
        </div>

        {/* Incorrect Student Solution */}
        <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 sm:p-5">
          <span className="block text-[8px] font-bold text-rose-500 uppercase tracking-widest mb-1.5">Incorrect Attempt / गलत हल</span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">{challenge.attempt[selectedLanguage]}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
            {challenge.question[selectedLanguage]}
          </span>
          
          <div className="grid grid-cols-1 gap-3">
            {challenge.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectChoice = idx === challenge.correctIndex;

              let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
              if (selectedOption !== null) {
                if (isCorrectChoice) {
                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                } else if (isSelected) {
                  btnClass = "border-rose-500 bg-rose-50 text-rose-800";
                } else {
                  btnClass = "border-slate-100 bg-slate-50/50 opacity-60 pointer-events-none";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleChoice(idx)}
                  className={`p-4 rounded-xl border text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnClass}`}
                >
                  <span>{opt[selectedLanguage]}</span>
                  {selectedOption !== null && isCorrectChoice && (
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrectChoice && (
                    <XCircle size={16} className="text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 animate-slide-up">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
              {isCorrect ? "🎉 Great Spotting!" : "🔍 Why that attempt fails:"}
            </h5>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
              {challenge.explanation[selectedLanguage]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
