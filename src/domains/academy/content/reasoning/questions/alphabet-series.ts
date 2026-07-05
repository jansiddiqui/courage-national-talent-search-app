import { Question } from "../../../core/types";

export const alphabetSeriesQuestions: Question[] = [
  {
    id: "q_alphabet_easy",
    topicId: "alphabet-series",
    skill: "Verbal Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Find the next letter in the sequence: A, C, E, G, ________.",
      hi: "इस श्रृंखला में अगला अक्षर ज्ञात कीजिए: A, C, E, G, ________।"
    },
    options: [
      { en: "H", hi: "H" },
      { en: "I", hi: "I" },
      { en: "J", hi: "J" },
      { en: "K", hi: "K" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Count standard positions in the alphabet: A=1, C=3, E=5...", hi: "वर्णमाला में मानक स्थितियों की गणना करें: A=1, C=3, E=5..." },
      { en: "The pattern skips one letter: A (skip B) C (skip D) E...", hi: "यह पैटर्न एक अक्षर छोड़ता है: A (B छोड़ें) C (D छोड़ें) E..." }
    ],
    explanation: {
      en: "The pattern adds +2 to the alphabetical position at each step: A(1)+2 = C(3), C(3)+2 = E(5), E(5)+2 = G(7), G(7)+2 = I(9).",
      hi: "यह पैटर्न प्रत्येक चरण में वर्णमाला की स्थिति में +2 जोड़ता है: A(1)+2 = C(3), C(3)+2 = E(5), E(5)+2 = G(7), G(7)+2 = I(9)।"
    }
  },
  {
    id: "q_alphabet_medium",
    topicId: "alphabet-series",
    skill: "Verbal Logic",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Find the next pair of letters in the sequence: AZ, CX, EV, GT, ________.",
      hi: "इस श्रृंखला में अगला अक्षर-युग्म ज्ञात कीजिए: AZ, CX, EV, GT, ________।"
    },
    options: [
      { en: "HS", hi: "HS" },
      { en: "IR", hi: "IR" },
      { en: "KP", hi: "KP" },
      { en: "BY", hi: "BY" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Examine the first and second letter of each pair separately.", hi: "प्रत्येक युग्म के पहले और दूसरे अक्षर का अलग-अलग परीक्षण करें।" },
      { en: "First letter: A(+2)->C(+2)->E(+2)->G(+2)->I. Second letter: Z(-2)->X(-2)->V(-2)->T(-2)->R.", hi: "पहला अक्षर: A(+2)->C(+2)->E(+2)->G(+2)->I. दूसरा अक्षर: Z(-2)->X(-2)->V(-2)->T(-2)->R." }
    ],
    explanation: {
      en: "The first letter of each pair increases by 2: A, C, E, G, I. The second letter decreases by 2: Z, X, V, T, R. Combined, they form IR.",
      hi: "प्रत्येक युग्म का पहला अक्षर 2 बढ़ता है: A, C, E, G, I. दूसरा अक्षर 2 घटता है: Z, X, V, T, R. मिलकर वे IR बनाते हैं।"
    }
  },
  {
    id: "q_alphabet_hard",
    topicId: "alphabet-series",
    skill: "Verbal Logic",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Find the next letters in the pattern: Z, W, S, N, ________.",
      hi: "पैटर्न में अगला अक्षर ज्ञात कीजिए: Z, W, S, N, ________।"
    },
    options: [
      { en: "H", hi: "H" },
      { en: "I", hi: "I" },
      { en: "J", hi: "J" },
      { en: "G", hi: "G" }
    ],
    correctIndex: 0,
    hints: [
      { en: "The series is decreasing. Look at the positions: Z=26, W=23, S=19...", hi: "यह श्रृंखला घट रही है। स्थितियों को देखें: Z=26, W=23, S=19..." },
      { en: "The gaps are decreasing progressively: 26 - 3 = 23, 23 - 4 = 19, 19 - 5 = 14. What is next?", hi: "गैप उत्तरोत्तर बढ़ रहा है (पीछे जाने में): 26 - 3 = 23, 23 - 4 = 19, 19 - 5 = 14। अगला क्या है?" }
    ],
    explanation: {
      en: "The positions of the letters are Z(26), W(23), S(19), N(14). The subtraction shifts increase by 1 at each step: -3, -4, -5. The next step is -6. N(14) - 6 = H(8).",
      hi: "अक्षरों की स्थितियाँ Z(26), W(23), S(19), N(14) हैं। घटाव का अंतर प्रत्येक चरण में 1 बढ़ता है: -3, -4, -5। अगला चरण -6 है। N(14) - 6 = H(8)।"
    }
  }
];
