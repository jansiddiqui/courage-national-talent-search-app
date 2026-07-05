import { Question } from "../../../core/types";

export const classificationQuestions: Question[] = [
  {
    id: "q_classification_easy",
    topicId: "classification",
    skill: "Verbal Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Choose the odd one out from the following list.",
      hi: "निम्नलिखित सूची में से बेमेल (Odd one out) शब्द चुनें।"
    },
    options: [
      { en: "Apple", hi: "सेब" },
      { en: "Banana", hi: "केला" },
      { en: "Potato", hi: "आलू" },
      { en: "Mango", hi: "आम" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Three of these are fruits. One is a vegetable.", hi: "इनमें से तीन फल हैं। एक सब्जी है।" },
      { en: "Which one grows underground?", hi: "कौन सा जमीन के अंदर उगता है?" }
    ],
    explanation: {
      en: "Apple, Banana, and Mango are fruits, while Potato is a root vegetable.",
      hi: "सेब, केला और आम फल हैं, जबकि आलू एक कंद सब्जी है।"
    }
  },
  {
    id: "q_classification_medium",
    topicId: "classification",
    skill: "Verbal Logic",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Find the odd one out from the following group of numbers.",
      hi: "संख्याओं के निम्नलिखित समूह में से बेमेल संख्या ज्ञात कीजिए।"
    },
    options: [
      { en: "25", hi: "25" },
      { en: "36", hi: "36" },
      { en: "47", hi: "47" },
      { en: "64", hi: "64" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Think about square numbers.", hi: "वर्ग संख्याओं (Square numbers) के बारे में सोचें।" },
      { en: "5x5 = 25, 6x6 = 36. Which number is not a perfect square?", hi: "5x5 = 25, 6x6 = 36। कौन सी संख्या पूर्ण वर्ग नहीं है?" }
    ],
    explanation: {
      en: "25 (5²), 36 (6²), and 64 (8²) are perfect squares, whereas 47 is a prime number and not a perfect square.",
      hi: "25 (5²), 36 (6²) और 64 (8²) पूर्ण वर्ग संख्याएं हैं, जबकि 47 एक अभाज्य संख्या है और पूर्ण वर्ग नहीं है।"
    }
  },
  {
    id: "q_classification_hard",
    topicId: "classification",
    skill: "Verbal Logic",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Identify the word that does NOT fit in the group.",
      hi: "उस शब्द को पहचानें जो समूह में फिट नहीं बैठता है।"
    },
    options: [
      { en: "Mercury", hi: "बुध (Mercury)" },
      { en: "Moon", hi: "चंद्रमा (Moon)" },
      { en: "Earth", hi: "पृथ्वी (Earth)" },
      { en: "Venus", hi: "शुक्र (Venus)" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Consider celestial bodies and their orbits.", hi: "खगोलीय पिंडों और उनकी कक्षाओं पर विचार करें।" },
      { en: "Three are planets that orbit the Sun. One is a satellite.", hi: "तीन ग्रह हैं जो सूर्य की परिक्रमा करते हैं। एक उपग्रह है।" }
    ],
    explanation: {
      en: "Mercury, Earth, and Venus are planets that orbit the Sun, while the Moon is a natural satellite orbiting the Earth.",
      hi: "बुध, पृथ्वी और शुक्र ग्रह हैं जो सूर्य की परिक्रमा करते हैं, जबकि चंद्रमा एक प्राकृतिक उपग्रह है जो पृथ्वी की परिक्रमा करता है।"
    }
  }
];
