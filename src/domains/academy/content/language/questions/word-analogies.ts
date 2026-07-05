import { Question } from "../../../core/types";

export const wordAnalogiesQuestions: Question[] = [
  {
    id: "q_lang_analogy_easy",
    topicId: "word-analogies",
    skill: "Verbal",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Complete the word analogy:\nBook is to Author as Statue is to ________.",
      hi: "शब्द सादृश्य को पूरा करें:\nपुस्तक का जो संबंध लेखक से है, मूर्ति का वही संबंध ________ से है।"
    },
    options: [
      { en: "Sculptor", hi: "मूर्तिकार" },
      { en: "Painter", hi: "चित्रकार" },
      { en: "Mason", hi: "राजमिस्त्री" },
      { en: "Museum", hi: "संग्रहालय" }
    ],
    correctIndex: 0,
    hints: [
      { en: "An author is the creator who writes a book.", hi: "एक लेखक वह रचनाकार होता है जो पुस्तक लिखता है।" },
      { en: "Who is the artist that creates or carves a statue?", hi: "वह कलाकार कौन है जो मूर्ति का निर्माण या नक्काशी करता है?" }
    ],
    explanation: {
      en: "The relationship is Creator-to-Creation. An Author creates a Book, and a Sculptor creates a Statue.",
      hi: "यह संबंध रचनाकार-से-रचना का है। एक लेखक पुस्तक बनाता है, और एक मूर्तिकार मूर्ति बनाता है।"
    }
  },
  {
    id: "q_lang_analogy_medium",
    topicId: "word-analogies",
    skill: "Verbal",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Find the missing word to complete the analogy:\nLight is to Darkness as Knowledge is to ________.",
      hi: "सादृश्य को पूरा करने के लिए लुप्त शब्द ज्ञात कीजिए:\nप्रकाश का जो संबंध अंधकार से है, ज्ञान का वही संबंध ________ से है।"
    },
    options: [
      { en: "Ignorance", hi: "अज्ञानता" },
      { en: "Wisdom", hi: "बुद्धिमानी" },
      { en: "Intelligence", hi: "बुद्धि" },
      { en: "Education", hi: "शिक्षा" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Look at the relationship between Light and Darkness. They are opposites.", hi: "प्रकाश और अंधकार के बीच के संबंध को देखें। वे एक दूसरे के विपरीत (विलोम) हैं।" },
      { en: "Find the opposite word for Knowledge.", hi: "ज्ञान के लिए विपरीत अर्थ वाला शब्द खोजें।" }
    ],
    explanation: {
      en: "The relationship is Antonyms (opposites). Light is the opposite of Darkness, and Knowledge is the opposite of Ignorance.",
      hi: "यह संबंध विलोम शब्द (antonyms) का है। प्रकाश अंधकार का विपरीत है, और ज्ञान अज्ञानता का विपरीत है।"
    }
  },
  {
    id: "q_lang_analogy_hard",
    topicId: "word-analogies",
    skill: "Verbal",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Complete the group classification analogy:\nLion is to Pride as Wolf is to ________.",
      hi: "समूह वर्गीकरण सादृश्य को पूरा करें:\nशेर का जो संबंध 'प्राइड' (Pride) से है, भेड़िये का वही संबंध ________ से है।"
    },
    options: [
      { en: "Herd", hi: "झुंड (Herd)" },
      { en: "Pack", hi: "पैक/झुंड (Pack)" },
      { en: "Swarm", hi: "सwarm (Swarm)" },
      { en: "Flock", hi: "रेवड़ (Flock)" }
    ],
    correctIndex: 1,
    hints: [
      { en: "A group of lions is called a 'Pride'.", hi: "शेरों के एक समूह को 'प्राइड' (Pride) कहा जाता है।" },
      { en: "What collective noun is used to refer to a group of wolves?", hi: "भेड़ियों के समूह को संदर्भित करने के लिए किस समूहवाचक संज्ञा का उपयोग किया जाता है?" }
    ],
    explanation: {
      en: "The relationship is Animal-to-Group. A group of Lions is called a Pride, and a group of Wolves is called a Pack.",
      hi: "यह संबंध जानवर-से-समूह का है। शेरों के समूह को प्राइड कहा जाता है, और भेड़ियों के समूह को पैक (Pack) कहा जाता है।"
    }
  }
];
