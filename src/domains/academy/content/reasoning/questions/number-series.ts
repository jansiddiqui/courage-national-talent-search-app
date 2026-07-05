import { Question } from "../../../core/types";

export const numberSeriesQuestions: Question[] = [
  {
    id: "q_series_easy",
    topicId: "number-series",
    skill: "Numerical Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Find the next number in the sequence: 5, 10, 15, 20, ________.",
      hi: "श्रृंखला में अगली संख्या ज्ञात कीजिए: 5, 10, 15, 20, ________।"
    },
    options: [
      { en: "22", hi: "22" },
      { en: "25", hi: "25" },
      { en: "30", hi: "30" },
      { en: "35", hi: "35" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Look at the gap between each number.", hi: "प्रत्येक संख्या के बीच के अंतर को देखें।" },
      { en: "Each step increases by adding 5. What is 20 + 5?", hi: "प्रत्येक चरण 5 जोड़ने पर बढ़ता है। 20 + 5 क्या है?" }
    ],
    explanation: {
      en: "The pattern is a simple addition of 5 at each step: 5+5=10, 10+5=15, 15+5=20, so 20+5=25.",
      hi: "यह पैटर्न प्रत्येक चरण में 5 जोड़ने का है: 5+5=10, 10+5=15, 15+5=20, इसलिए 20+5=25।"
    }
  },
  {
    id: "q_series_medium",
    topicId: "number-series",
    skill: "Numerical Logic",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Find the next number in the pattern: 2, 6, 12, 20, 30, ________.",
      hi: "इस पैटर्न में अगली संख्या ज्ञात कीजिए: 2, 6, 12, 20, 30, ________।"
    },
    options: [
      { en: "36", hi: "36" },
      { en: "40", hi: "40" },
      { en: "42", hi: "42" },
      { en: "45", hi: "45" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Write down the differences: 6-2 = 4, 12-6 = 6...", hi: "अंतर लिखिए: 6-2 = 4, 12-6 = 6..." },
      { en: "The differences are +4, +6, +8, +10. The next gap is +12.", hi: "अंतर +4, +6, +8, +10 हैं। अगला अंतर +12 होना चाहिए।" }
    ],
    explanation: {
      en: "The difference between consecutive numbers increases by 2: +4, +6, +8, +10. The next difference is +12. Thus, 30 + 12 = 42.",
      hi: "क्रमागत संख्याओं के बीच का अंतर 2 बढ़ता है: +4, +6, +8, +10। अगला अंतर +12 है। इस प्रकार, 30 + 12 = 42।"
    }
  },
  {
    id: "q_series_hard",
    topicId: "number-series",
    skill: "Numerical Logic",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Find the missing number in the sequence: 1, 8, 27, 64, ________.",
      hi: "इस श्रृंखला में लुप्त संख्या ज्ञात कीजिए: 1, 8, 27, 64, ________।"
    },
    options: [
      { en: "81", hi: "81" },
      { en: "100", hi: "100" },
      { en: "125", hi: "125" },
      { en: "150", hi: "150" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Think about cube numbers (1x1x1, 2x2x2, etc.).", hi: "घन संख्याओं (Cube numbers) के बारे में सोचें (1x1x1, 2x2x2, आदि)।" },
      { en: "1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64. What is 5³?", hi: "1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64. 5³ क्या है?" }
    ],
    explanation: {
      en: "The sequence consists of perfect cubes of consecutive integers: 1³=1, 2³=8, 3³=27, 4³=64, so the next term is 5³ = 125.",
      hi: "इस श्रृंखला में क्रमागत पूर्णांकों के पूर्ण घन शामिल हैं: 1³=1, 2³=8, 3³=27, 4³=64, इसलिए अगला पद 5³ = 125 है।"
    }
  }
];
