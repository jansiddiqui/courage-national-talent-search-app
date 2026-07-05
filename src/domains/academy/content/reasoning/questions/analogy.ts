import { Question } from "../../../core/types";

export const analogyQuestions: Question[] = [
  {
    id: "q_analogy_easy",
    topicId: "analogy",
    skill: "Verbal Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Book is to Reading as Fork is to ________.",
      hi: "किताब का संबंध पढ़ने से है, तो कांटे (Fork) का संबंध ________ से है।"
    },
    options: [
      { en: "Writing", hi: "लिखना" },
      { en: "Eating", hi: "खाना" },
      { en: "Sleeping", hi: "सोना" },
      { en: "Cooking", hi: "पकाना" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Think about the primary purpose of a fork.", hi: "कांटे के प्राथमिक उद्देश्य के बारे में सोचें।" },
      { en: "A book is read; what do we do with a fork?", hi: "किताब पढ़ी जाती है; हम कांटे का क्या करते हैं?" }
    ],
    explanation: {
      en: "A book is a tool used for reading, and a fork is a tool used for eating.",
      hi: "किताब पढ़ने के लिए इस्तेमाल होने वाला उपकरण है, और कांटा खाने के लिए इस्तेमाल होने वाला उपकरण है।"
    }
  },
  {
    id: "q_analogy_medium",
    topicId: "analogy",
    skill: "Verbal Logic",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Clock is to Time as Thermometer is to ________.",
      hi: "घड़ी का संबंध समय से है, तो थर्मामीटर का संबंध ________ से है।"
    },
    options: [
      { en: "Heat", hi: "गर्मी" },
      { en: "Radiation", hi: "विकिरण" },
      { en: "Temperature", hi: "तापमान" },
      { en: "Weather", hi: "मौसम" }
    ],
    correctIndex: 2,
    hints: [
      { en: "What metric does a clock show?", hi: "घड़ी कौन सा माप दर्शाती है?" },
      { en: "What metric does a thermometer measure?", hi: "थर्मामीटर क्या मापता है?" }
    ],
    explanation: {
      en: "A clock measures and displays time, whereas a thermometer measures and displays temperature.",
      hi: "घड़ी समय को मापती और प्रदर्शित करती है, जबकि थर्मामीटर तापमान को मापता और प्रदर्शित करता है।"
    }
  },
  {
    id: "q_analogy_hard",
    topicId: "analogy",
    skill: "Verbal Logic",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Light is to Darkness as Knowledge is to ________.",
      hi: "प्रकाश का संबंध अंधकार से है, तो ज्ञान का संबंध ________ से है।"
    },
    options: [
      { en: "Ignorance", hi: "अज्ञानता" },
      { en: "Intelligence", hi: "बुद्धिमानी" },
      { en: "Wisdom", hi: "ज्ञान/ज्ञानता" },
      { en: "Education", hi: "शिक्षा" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Light dispels darkness. What does knowledge dispel?", hi: "प्रकाश अंधकार को दूर करता है। ज्ञान किसे दूर करता है?" },
      { en: "Look for the direct opposite of knowledge.", hi: "ज्ञान का प्रत्यक्ष विलोम शब्द खोजें।" }
    ],
    explanation: {
      en: "Light is the opposite of darkness (it removes darkness), and knowledge is the opposite of ignorance (it removes ignorance).",
      hi: "प्रकाश अंधकार का विपरीत है (यह अंधकार को दूर करता है), और ज्ञान अज्ञानता का विपरीत है (यह अज्ञानता को दूर करता है)।"
    }
  }
];
