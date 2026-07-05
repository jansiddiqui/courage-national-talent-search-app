import { Question } from "../../../core/types";

export const syllogismsQuestions: Question[] = [
  {
    id: "q_crit_syll_easy",
    topicId: "syllogisms",
    skill: "Analytical",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Read these statements and decide which conclusion(s) logically follow:\nStatements:\n1. All mangoes are fruits.\n2. All fruits are sweet.\nConclusions:\nI. All mangoes are sweet.\nII. Some sweet things are mangoes.",
      hi: "इन कथनों को पढ़ें और तय करें कि कौन सा निष्कर्ष तार्किक रूप से सही है:\nकथन:\n1. सभी आम फल हैं।\n2. सभी फल मीठे हैं।\nनिष्कर्ष:\nI. सभी आम मीठे हैं।\nII. कुछ मीठी चीजें आम हैं।"
    },
    options: [
      { en: "Only conclusion I follows", hi: "केवल निष्कर्ष I सही है" },
      { en: "Only conclusion II follows", hi: "केवल निष्कर्ष II सही है" },
      { en: "Both conclusions I and II follow", hi: "निष्कर्ष I और II दोनों सही हैं" },
      { en: "Neither conclusion I nor II follows", hi: "निष्कर्ष I और II में से कोई भी सही नहीं है" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Draw Venn diagrams. Put the circle of 'Mangoes' completely inside 'Fruits', and 'Fruits' completely inside 'Sweet'.", hi: "वेन आरेख (Venn diagram) बनाएं। 'Mangoes' के गोले को पूरी तरह से 'Fruits' के अंदर रखें, और 'Fruits' को पूरी तरह से 'Sweet' के अंदर रखें।" },
      { en: "Since Mangoes are inside Fruits, and Fruits are inside Sweet, Mangoes must be inside Sweet too. Also, some sweets overlap with Mangoes.", hi: "चूंकि आम फलों के अंदर हैं, और फल मीठे के अंदर हैं, आम भी मीठे के अंदर होंगे। साथ ही, कुछ मीठी चीजें आम से ओवरलैप होती हैं।" }
    ],
    explanation: {
      en: "Using Venn diagrams, the circle of Mangoes lies inside Fruits, which lies inside Sweet. Therefore, all Mangoes are Sweet (Conclusion I follows). Since the Sweet circle covers Mangoes, some sweet things are Mangoes (Conclusion II also follows).",
      hi: "वेन आरेखों का उपयोग करते हुए, आम का गोला फलों के अंदर स्थित है, जो कि मीठे के अंदर स्थित है। इसलिए, सभी आम मीठे हैं (निष्कर्ष I सही है)। चूंकि मीठे का गोला आमों को ढकता है, कुछ मीठी चीजें आम हैं (निष्कर्ष II भी सही है)।"
    }
  },
  {
    id: "q_crit_syll_medium",
    topicId: "syllogisms",
    skill: "Analytical",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Statements:\n1. All pencils are pens.\n2. No pen is a ruler.\nConclusions:\nI. No pencil is a ruler.\nII. Some pens are pencils.",
      hi: "कथन:\n1. सभी पेंसिल पेन हैं।\n2. कोई पेन रूलर नहीं है।\nनिष्कर्ष:\nI. कोई पेंसिल रूलर नहीं है।\nII. कुछ पेन पेंसिल हैं।"
    },
    options: [
      { en: "Only conclusion I follows", hi: "केवल निष्कर्ष I सही है" },
      { en: "Only conclusion II follows", hi: "केवल निष्कर्ष II सही है" },
      { en: "Neither follows", hi: "कोई भी सही नहीं है" },
      { en: "Both conclusions I and II follow", hi: "निष्कर्ष I और II दोनों सही हैं" }
    ],
    correctIndex: 3,
    hints: [
      { en: "Pencils are inside Pens. There is no intersection between Pens and Rulers.", hi: "पेंसिलें पेन के अंदर हैं। पेन और रूलर के बीच कोई ओवरलैप नहीं है।" },
      { en: "Since pencils are inside pens, and rulers cannot touch pens, rulers can never touch pencils either. Also, since all pencils are pens, some pens are definitely pencils.", hi: "चूंकि पेंसिलें पेन के अंदर हैं, और रूलर पेन को नहीं छू सकते, इसलिए रूलर कभी पेंसिल को भी नहीं छू सकते। साथ ही, चूंकि सभी पेंसिलें पेन हैं, कुछ पेन निश्चित रूप से पेंसिल हैं।" }
    ],
    explanation: {
      en: "Since all Pencils are inside Pens, and Pens have no connection with Rulers, Pencils can never connect with Rulers (Conclusion I follows). Also, the Pen circle contains Pencils, which means some Pens are Pencils (Conclusion II follows).",
      hi: "चूंकि सभी पेंसिलें पेन के अंदर हैं, और पेन का रूलर से कोई संबंध नहीं है, इसलिए पेंसिलें कभी रूलर से नहीं जुड़ सकतीं (निष्कर्ष I सही है)। साथ ही, पेन के गोले में पेंसिलें शामिल हैं, जिसका अर्थ है कि कुछ पेन पेंसिल हैं (निष्कर्ष II भी सही है)।"
    }
  },
  {
    id: "q_crit_syll_hard",
    topicId: "syllogisms",
    skill: "Analytical",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Statements:\n1. Some doctors are writers.\n2. All writers are readers.\nConclusions:\nI. Some doctors are readers.\nII. Some readers are doctors.\nIII. All readers are writers.",
      hi: "कथन:\n1. कुछ डॉक्टर लेखक हैं।\n2. सभी लेखक पाठक हैं।\nनिष्कर्ष:\nI. कुछ डॉक्टर पाठक हैं।\nII. कुछ पाठक डॉक्टर हैं।\nIII. सभी पाठक लेखक हैं।"
    },
    options: [
      { en: "Only I and II follow", hi: "केवल I और II सही हैं" },
      { en: "Only II and III follow", hi: "केवल II और III सही हैं" },
      { en: "Only I and III follow", hi: "केवल I और III सही हैं" },
      { en: "All follow", hi: "सभी सही हैं" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Writers circle overlaps with Doctors. Readers circle completely covers Writers.", hi: "लेखक (Writers) का गोला डॉक्टरों से ओवरलैप होता है। पाठक (Readers) का गोला लेखक को पूरी तरह से ढकता है।" },
      { en: "Since Readers cover all Writers, and Writers overlap with Doctors, Readers must also overlap with Doctors (I and II follow). However, Readers circle is larger than Writers, so not all readers are writers.", hi: "चूंकि पाठक सभी लेखकों को ढकते हैं, और लेखक डॉक्टरों से ओवरलैप होते हैं, पाठकों को भी डॉक्टरों से ओवरलैप होना चाहिए (I और II सही हैं)।" }
    ],
    explanation: {
      en: "The Readers circle completely encloses Writers. Since Writers intersects with Doctors, the enclosing Readers circle must also intersect with Doctors. Hence, some doctors are readers (I) and some readers are doctors (II). However, since all writers are readers, it doesn't mean all readers are writers (III is invalid).",
      hi: "पाठक (Readers) का गोला लेखक (Writers) को पूरी तरह से घेरता है। चूंकि लेखक डॉक्टरों से ओवरलैप होता है, इसलिए घेरने वाला पाठक का गोला भी डॉक्टरों से ओवरलैप होगा। इसलिए I और II सही हैं। लेकिन सभी पाठक लेखक नहीं हो सकते (III गलत है)।"
    }
  }
];
