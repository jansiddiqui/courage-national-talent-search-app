import { Question } from "../../../core/types";

export const argumentEvaluationQuestions: Question[] = [
  {
    id: "q_arg_easy",
    topicId: "argument-evaluation",
    skill: "Analytical",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Statement: Should games and sports be made compulsory in schools?\nArguments:\nI. Yes, because it helps in the overall physical and mental development of students.\nII. No, because it takes away time from study.",
      hi: "कथन: क्या स्कूलों में खेलकूद को अनिवार्य किया जाना चाहिए?\nतर्क:\nI. हाँ, क्योंकि यह छात्रों के समग्र शारीरिक और मानसिक विकास में मदद करता है।\nII. नहीं, क्योंकि यह पढ़ाई से समय छीन लेता है।"
    },
    options: [
      { en: "Only argument I is strong", hi: "केवल तर्क I मजबूत है" },
      { en: "Only argument II is strong", hi: "केवल तर्क II मजबूत है" },
      { en: "Both arguments I and II are strong", hi: "तर्क I और II दोनों मजबूत हैं" },
      { en: "Neither argument I nor II is strong", hi: "न तो तर्क I और न ही II मजबूत है" }
    ],
    correctIndex: 0,
    hints: [
      { en: "A strong argument must state a major benefit or concern with logical backing.", hi: "एक मजबूत तर्क में तार्किक समर्थन के साथ एक प्रमुख लाभ या चिंता का उल्लेख होना चाहिए।" },
      { en: "Physical and mental development (Argument I) is a core verified benefit. Study time can be managed, so Argument II is weak.", hi: "शारीरिक और मानसिक विकास (तर्क I) एक सत्यापित लाभ है। अध्ययन के समय को प्रबंधित किया जा सकता है, इसलिए तर्क II कमजोर है।" }
    ],
    explanation: {
      en: "Argument I is strong because overall physical and mental growth is a proven, critical aspect of school education. Argument II is weak because it assumes a false choice (students can balance sports and study with proper scheduling).",
      hi: "तर्क I मजबूत है क्योंकि समग्र शारीरिक और मानसिक विकास स्कूली शिक्षा का एक प्रमाणित, महत्वपूर्ण पहलू है। तर्क II कमजोर है क्योंकि यह एक गलत धारणा पर आधारित है।"
    }
  },
  {
    id: "q_arg_medium",
    topicId: "argument-evaluation",
    skill: "Analytical",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Statement: Should the government ban plastic bags completely?\nArguments:\nI. Yes, because plastic is non-biodegradable and causes severe environmental damage.\nII. No, because alternative paper bags are more expensive to produce.",
      hi: "कथन: क्या सरकार को प्लास्टिक बैगों पर पूरी तरह से प्रतिबंध लगा देना चाहिए?\nतर्क:\nI. हाँ, क्योंकि प्लास्टिक गैर-बायोडिग्रेडेबल है और पर्यावरण को गंभीर नुकसान पहुंचाता है।\nII. नहीं, क्योंकि वैकल्पिक पेपर बैगों का उत्पादन अधिक महंगा है।"
    },
    options: [
      { en: "Only argument I is strong", hi: "केवल तर्क I मजबूत है" },
      { en: "Only argument II is strong", hi: "केवल तर्क II मजबूत है" },
      { en: "Both arguments I and II are strong", hi: "तर्क I और II दोनों मजबूत हैं" },
      { en: "Neither argument I nor II is strong", hi: "न तो तर्क I और न ही II मजबूत है" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Environmental damage (Argument I) is a major, logical hazard that justifies banning plastic.", hi: "पर्यावरणीय क्षति (तर्क I) एक बड़ा खतरा है जो प्लास्टिक पर प्रतिबंध लगाने का औचित्य साबित करता है।" },
      { en: "Economic cost (Argument II) is also a practical, strong concern that affects citizens and businesses.", hi: "आर्थिक लागत (तर्क II) भी एक व्यावहारिक चिंता है जो नागरिकों और व्यवसायों को प्रभावित करती है।" }
    ],
    explanation: {
      en: "Both arguments are strong because they present valid, logical points from different angles: Argument I highlights a critical ecological issue (environmental safety), and Argument II highlights a real-world economic challenge (cost of paper alternatives).",
      hi: "दोनों तर्क मजबूत हैं क्योंकि वे विभिन्न कोणों से वैध, तार्किक बिंदु प्रस्तुत करते हैं: तर्क I एक महत्वपूर्ण पारिस्थितिक मुद्दे को उजागर करता है, और तर्क II एक वास्तविक आर्थिक चुनौती को उजागर करता है।"
    }
  },
  {
    id: "q_arg_hard",
    topicId: "argument-evaluation",
    skill: "Analytical",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Statement: Should school classrooms be air-conditioned?\nArguments:\nI. Yes, because it ensures a comfortable temperature for concentration, especially in hot summers.\nII. No, because it is extremely expensive and will increase the tuition fees for students.",
      hi: "कथन: क्या स्कूल की कक्षाओं को वातानुकूलित (air-conditioned) किया जाना चाहिए?\nतर्क:\nI. हाँ, क्योंकि यह ध्यान केंद्रित करने के लिए एक आरामदायक तापमान सुनिश्चित करता है, खासकर गर्म गर्मियों में।\nII. नहीं, क्योंकि यह बहुत महंगा है और इससे छात्रों की ट्यूशन फीस बढ़ जाएगी।"
    },
    options: [
      { en: "Only argument I is strong", hi: "केवल तर्क I मजबूत है" },
      { en: "Only argument II is strong", hi: "केवल तर्क II मजबूत है" },
      { en: "Both I and II are strong", hi: "I और II दोनों मजबूत हैं" },
      { en: "Neither I nor II is strong", hi: "न तो I और न ही II मजबूत है" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Both arguments touch upon major realistic factors: student performance and financial practicality.", hi: "दोनों तर्क प्रमुख यथार्थवादी कारकों को छूते हैं: छात्र का प्रदर्शन और वित्तीय व्यावहारिकता।" },
      { en: "Argument I represents a real physical need for focus. Argument II represents a real cost constraint that affects access. Both are strong.", hi: "तर्क I ध्यान केंद्रित करने की वास्तविक आवश्यकता को दर्शाता है। तर्क II एक वास्तविक लागत बाधा को दर्शाता है। दोनों मजबूत हैं।" }
    ],
    explanation: {
      en: "Both arguments are strong because they address two critical, competing dimensions: student learning conditions (comfort/concentration) vs. financial feasibility (tuition fee hikes), both of which are major logical arguments.",
      hi: "दोनों तर्क मजबूत हैं क्योंकि वे दो महत्वपूर्ण आयामों को संबोधित करते हैं: छात्रों के सीखने की स्थिति (आराम/एकाग्रता) बनाम वित्तीय व्यवहार्यता (ट्यूशन फीस में वृद्धि)।"
    }
  }
];
