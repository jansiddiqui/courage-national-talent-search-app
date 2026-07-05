import { Question } from "../../../core/types";

export const numberPuzzlesQuestions: Question[] = [
  {
    id: "q_puzzle_easy",
    topicId: "number-puzzles",
    skill: "Numerical Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Find the missing number in the grid pattern:\nRow 1: 2, 4, 8\nRow 2: 3, 9, 27\nRow 3: 4, 16, ________.",
      hi: "ग्रिड पैटर्न में लुप्त संख्या ज्ञात कीजिए:\nपंक्ति 1: 2, 4, 8\nपंक्ति 2: 3, 9, 27\nपंक्ति 3: 4, 16, ________।"
    },
    options: [
      { en: "32", hi: "32" },
      { en: "48", hi: "48" },
      { en: "64", hi: "64" },
      { en: "80", hi: "80" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Look at the relation between the numbers in each row.", hi: "प्रत्येक पंक्ति में संख्याओं के बीच संबंध देखें।" },
      { en: "In Row 1: 2, 2²=4, 2³=8. In Row 2: 3, 3²=9, 3³=27. Follow the same powers for Row 3.", hi: "पंक्ति 1 में: 2, 2²=4, 2³=8। पंक्ति 2 में: 3, 3²=9, 3³=27। पंक्ति 3 के लिए भी इसी नियम का पालन करें।" }
    ],
    explanation: {
      en: "Each row displays a number, its square, and its cube: Row 1 = [2, 2², 2³], Row 2 = [3, 3², 3³]. Thus, Row 3 = [4, 4², 4³] = [4, 16, 64].",
      hi: "प्रत्येक पंक्ति में एक संख्या, उसका वर्ग और उसका घन दिखाया गया है: पंक्ति 1 = [2, 2², 2³], पंक्ति 2 = [3, 3², 3³]। इस प्रकार, पंक्ति 3 = [4, 4², 4³] = [4, 16, 64]।"
    }
  },
  {
    id: "q_puzzle_medium",
    topicId: "number-puzzles",
    skill: "Numerical Logic",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "If '+' means '*', '*' means '-', '-' means '/', and '/' means '+', then what is the value of: 8 + 4 / 12 - 3 * 5?",
      hi: "यदि '+' का अर्थ '*', '*' का अर्थ '-', '-' का अर्थ '/', और '/' का अर्थ '+' है, तो 8 + 4 / 12 - 3 * 5 का मान क्या होगा?"
    },
    options: [
      { en: "31", hi: "31" },
      { en: "35", hi: "35" },
      { en: "41", hi: "41" },
      { en: "25", hi: "25" }
    ],
    correctIndex: 0,
    hints: [
      { en: "First rewrite the equation by replacing the mathematical symbols with their new meanings.", hi: "पहले गणितीय प्रतीकों को उनके नए अर्थों से बदलकर समीकरण को फिर से लिखें।" },
      { en: "The rewritten equation is: 8 * 4 + 12 / 3 - 5. Apply BODMAS rules to calculate.", hi: "फिर से लिखा गया समीकरण है: 8 * 4 + 12 / 3 - 5। गणना करने के लिए BODMAS नियमों का पालन करें।" }
    ],
    explanation: {
      en: "Substitute symbols: 8 + 4 / 12 - 3 * 5 becomes 8 * 4 + 12 / 3 - 5.\nApply BODMAS:\n1. Division: 12 / 3 = 4\n2. Multiplication: 8 * 4 = 32\n3. New equation: 32 + 4 - 5 = 36 - 5 = 31.",
      hi: "प्रतीकों को बदलें: 8 + 4 / 12 - 3 * 5 बन जाता है 8 * 4 + 12 / 3 - 5।\nBODMAS लागू करें:\n1. भाग: 12 / 3 = 4\n2. गुणा: 8 * 4 = 32\n3. नया समीकरण: 32 + 4 - 5 = 36 - 5 = 31।"
    }
  },
  {
    id: "q_puzzle_hard",
    topicId: "number-puzzles",
    skill: "Analytical Reasoning",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "In these number triangles, the central number is calculated from the corner numbers using a specific rule:\nTriangle 1: Corners (3, 4, 5) -> Center = 17\nTriangle 2: Corners (4, 5, 6) -> Center = 26\nTriangle 3: Corners (5, 6, 7) -> Center = ?\nWhat is the missing central number?",
      hi: "इन संख्या त्रिभुजों में, कोने की संख्याओं से एक विशिष्ट नियम का उपयोग करके केंद्रीय संख्या की गणना की जाती है:\nत्रिभुज 1: कोने (3, 4, 5) -> केंद्र = 17\nत्रिभुज 2: कोने (4, 5, 6) -> केंद्र = 26\nत्रिभुज 3: कोने (5, 6, 7) -> केंद्र = ?\nलुप्त केंद्रीय संख्या क्या है?"
    },
    options: [
      { en: "33", hi: "33" },
      { en: "37", hi: "37" },
      { en: "42", hi: "42" },
      { en: "45", hi: "45" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Try multiplying the first two corner numbers and then adding or subtracting the third.", hi: "पहले दो कोने की संख्याओं को गुणा करने का प्रयास करें और फिर तीसरे को जोड़ें या घटाएं।" },
      { en: "Triangle 1: (3 * 4) + 5 = 12 + 5 = 17. Test if this same rule works for Triangle 2.", hi: "त्रिभुज 1: (3 * 4) + 5 = 12 + 5 = 17। जांचें कि क्या यही नियम त्रिभुज 2 के लिए भी काम करता है।" }
    ],
    explanation: {
      en: "The rule is: (Corner 1 * Corner 2) + Corner 3 = Center.\nTriangle 1: (3 * 4) + 5 = 12 + 5 = 17.\nTriangle 2: (4 * 5) + 6 = 20 + 6 = 26.\nTriangle 3: (5 * 6) + 7 = 30 + 7 = 37.",
      hi: "नियम यह है: (कोना 1 * कोना 2) + कोना 3 = केंद्र।\nत्रिभुज 1: (3 * 4) + 5 = 12 + 5 = 17।\nत्रिभुज 2: (4 * 5) + 6 = 20 + 6 = 26।\nत्रिभुज 3: (5 * 6) + 7 = 30 + 7 = 37।"
    }
  }
];
