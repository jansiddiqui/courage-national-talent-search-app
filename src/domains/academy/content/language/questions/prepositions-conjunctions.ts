import { Question } from "../../../core/types";

export const prepositionsConjunctionsQuestions: Question[] = [
  {
    id: "q_prep_easy",
    topicId: "prepositions-conjunctions",
    skill: "Verbal",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Fill in the blank with the correct preposition:\n'The exam will start ________ exactly 9:00 AM.'",
      hi: "सही पूर्वसर्ग (preposition) से रिक्त स्थान भरें:\n'The exam will start ________ exactly 9:00 AM.'"
    },
    options: [
      { en: "on", hi: "on" },
      { en: "in", hi: "in" },
      { en: "at", hi: "at" },
      { en: "for", hi: "for" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Identify if 9:00 AM is a specific point of time or a day.", hi: "पहचानें कि क्या सुबह 9:00 बजे समय का एक विशिष्ट बिंदु है या एक दिन है।" },
      { en: "For specific clock times, we always use the preposition 'at'.", hi: "विशिष्ट घड़ी के समय के लिए, हम हमेशा 'at' पूर्वसर्ग का उपयोग करते हैं।" }
    ],
    explanation: {
      en: "We use 'at' for precise times: at 9:00 AM, at midnight, at lunchtime. Therefore, 'at' is correct.",
      hi: "हम सटीक समय के लिए 'at' का उपयोग करते हैं: सुबह 9:00 बजे, आधी रात को। इसलिए, 'at' सही है।"
    }
  },
  {
    id: "q_prep_medium",
    topicId: "prepositions-conjunctions",
    skill: "Verbal",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Choose the correct conjunction pair to complete the sentence:\n'________ Raman ________ Amit completed the assignment, so both received low grades.'",
      hi: "वाक्य को पूरा करने के लिए सही संयोजक जोड़ी (conjunction pair) चुनें:\n'________ Raman ________ Amit completed the assignment, so both received low grades.'"
    },
    options: [
      { en: "Neither ... nor", hi: "Neither ... nor" },
      { en: "Either ... or", hi: "Either ... or" },
      { en: "Not only ... but also", hi: "Not only ... but also" },
      { en: "Whether ... or", hi: "Whether ... or" }
    ],
    correctIndex: 0,
    hints: [
      { en: "The clue is 'both received low grades', which means neither of them completed the work (negative sense).", hi: "सुराग 'both received low grades' है, जिसका अर्थ है कि उनमें से किसी ने भी काम पूरा नहीं किया (नकारात्मक भाव)।" },
      { en: "The standard negative correlative conjunction pairing is 'neither... nor'.", hi: "मानक नकारात्मक संबंधवाचक संयोजक जोड़ी 'neither... nor' है।" }
    ],
    explanation: {
      en: "Since both received low grades, it means zero people completed the work. The negative pair 'Neither... nor' fits this meaning. 'Neither Raman nor Amit completed the assignment.'",
      hi: "चूंकि दोनों को कम ग्रेड मिले, इसका मतलब है कि किसी ने भी काम पूरा नहीं किया। नकारात्मक जोड़ी 'Neither... nor' इस अर्थ में फिट बैठती है।"
    }
  },
  {
    id: "q_prep_hard",
    topicId: "prepositions-conjunctions",
    skill: "Verbal",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Identify the grammatically correct sentence from the choices below:",
      hi: "नीचे दिए गए विकल्पों में से व्याकरणिक रूप से सही वाक्य की पहचान करें:"
    },
    options: [
      { en: "Although she was tired, but she finished her project.", hi: "Although she was tired, but she finished her project." },
      { en: "Although she was tired, she finished her project.", hi: "Although she was tired, she finished her project." },
      { en: "Although she was tired, yet but she finished her project.", hi: "Although she was tired, yet but she finished her project." },
      { en: "She was tired although she finished her project.", hi: "She was tired although she finished her project." }
    ],
    correctIndex: 1,
    hints: [
      { en: "In English grammar, double conjunctions connecting the same relationship are redundant.", hi: "अंग्रेजी व्याकरण में, एक ही संबंध को जोड़ने वाले दोहरे संयोजक अनावश्यक होते हैं।" },
      { en: "Using 'Although' and 'but' together in a single sentence is incorrect. A comma alone is sufficient.", hi: "एक ही वाक्य में 'Although' और 'but' का एक साथ उपयोग करना गलत है। केवल एक अल्पविराम (comma) ही काफी है।" }
    ],
    explanation: {
      en: "Using 'Although' and 'but' together is a common redundancy error. The correct structure is: 'Although she was tired, she finished her project.'",
      hi: "एक साथ 'Although' और 'but' का उपयोग करना एक आम व्याकरण त्रुटि है। सही संरचना है: 'Although she was tired, she finished her project.'"
    }
  }
];
