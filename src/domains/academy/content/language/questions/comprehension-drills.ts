import { Question } from "../../../core/types";

export const comprehensionDrillsQuestions: Question[] = [
  {
    id: "q_comp_easy",
    topicId: "comprehension-drills",
    skill: "Verbal",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Read the passage and answer the question:\n'The Honeybee is the only insect that produces food eaten by humans. A single honeybee visits between 50 and 100 flowers in a single collection trip.'\nQuestion: How many flowers does a honeybee typically visit in a single collection trip?",
      hi: "गद्यांश को पढ़ें और प्रश्न का उत्तर दें:\n'मधुमक्खी एकमात्र ऐसा कीट है जो मनुष्यों द्वारा खाया जाने वाला भोजन बनाती है। एक अकेली मधुमक्खी एक संग्रह यात्रा में 50 से 100 फूलों के बीच जाती है।'\nप्रश्न: एक मधुमक्खी आम तौर पर एक संग्रह यात्रा में कितने फूलों का दौरा करती है?"
    },
    options: [
      { en: "Under 50", hi: "50 से कम" },
      { en: "Between 50 and 100", hi: "50 से 100 के बीच" },
      { en: "Exactly 100", hi: "ठीक 100" },
      { en: "More than 150", hi: "150 से अधिक" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Look for numbers in the second sentence of the passage.", hi: "गद्यांश के दूसरे वाक्य में संख्याओं को देखें।" },
      { en: "The text says 'between 50 and 100 flowers'. Match this with the options.", hi: "पाठ में लिखा है '50 से 100 फूलों के बीच'। इसका विकल्पों से मिलान करें।" }
    ],
    explanation: {
      en: "According to the passage, a single honeybee visits between 50 and 100 flowers in one trip. Thus, the option 'Between 50 and 100' is correct.",
      hi: "गद्यांश के अनुसार, एक अकेली मधुमक्खी एक यात्रा में 50 से 100 फूलों के बीच जाती है। इस प्रकार, '50 से 100 के बीच' वाला विकल्प सही है।"
    }
  },
  {
    id: "q_comp_medium",
    topicId: "comprehension-drills",
    skill: "Verbal",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Read the passage and answer the question:\n'In polar regions, global warming is causing glaciers to melt at an unprecedented rate. This is not only raising global sea levels but also threatening the survival of polar bears, who rely on sea ice as platform for hunting seals.'\nQuestion: What is the main reason polar bears are threatened by melting glaciers?",
      hi: "गद्यांश को पढ़ें और प्रश्न का उत्तर दें:\n'ध्रुवीय क्षेत्रों में, ग्लोबल वार्मिंग के कारण ग्लेशियर अभूतपूर्व दर से पिघल रहे हैं। इससे न केवल वैश्विक समुद्र का स्तर बढ़ रहा है बल्कि ध्रुवीय भालूओं के जीवित रहने पर भी खतरा मंडरा रहा है, जो सील का शिकार करने के लिए समुद्री बर्फ का उपयोग करते हैं।'\nप्रश्न: पिघलते ग्लेशियरों से ध्रुवीय भालूओं को खतरा होने का मुख्य कारण क्या है?"
    },
    options: [
      { en: "They are losing their hunting platforms", hi: "वे अपने शिकार के प्लेटफार्मों को खो रहे हैं" },
      { en: "The water is becoming too cold for them", hi: "उनके लिए पानी बहुत ठंडा होता जा रहा है" },
      { en: "Seal populations are migrating away", hi: "सील की आबादी वहां से पलायन कर रही है" },
      { en: "They cannot swim in open water", hi: "वे खुले पानी में तैर नहीं सकते" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Look for the clause beginning with 'who rely on...'.", hi: "'who rely on...' से शुरू होने वाले खंड को देखें।" },
      { en: "The passage states that polar bears rely on sea ice as a platform for hunting. Melting ice means losing these platforms.", hi: "गद्यांश में कहा गया है कि ध्रुवीय भालू शिकार करने के लिए समुद्री बर्फ पर निर्भर करते हैं। बर्फ पिघलने का मतलब इन प्लेटफार्मों को खोना है।" }
    ],
    explanation: {
      en: "The passage explains that polar bears 'rely on sea ice as platform for hunting'. Since global warming melts this ice, they are losing their hunting platforms, threatening their survival.",
      hi: "गद्यांश स्पष्ट करता है कि ध्रुवीय भालू 'शिकार के लिए समुद्री बर्फ पर निर्भर' करते हैं। चूंकि ग्लोबल वार्मिंग इस बर्फ को पिघला रही है, वे अपने शिकार प्लेटफार्मों को खो रहे हैं।"
    }
  },
  {
    id: "q_comp_hard",
    topicId: "comprehension-drills",
    skill: "Analytical",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Read the passage and answer the question:\n'While standard education focuses on memorization, critical thinking requires evaluating arguments. A student trained in rote learning can recall facts but struggles when asked to synthesize contradicting viewpoints. Therefore, building logic pathways is essential for true diagnostic intelligence.'\nQuestion: Based on the passage, what is the primary difference between rote learning and critical thinking?",
      hi: "गद्यांश को पढ़ें और प्रश्न का उत्तर दें:\n'जबकि मानक शिक्षा याद रखने (रटने) पर केंद्रित है, आलोचनात्मक सोच के लिए तर्कों के मूल्यांकन की आवश्यकता होती है। रटकर सीखने में प्रशिक्षित छात्र तथ्यों को याद रख सकता है लेकिन विपरीत दृष्टिकोणों को संश्लेषित करने के लिए कहे जाने पर संघर्ष करता है।'\nप्रश्न: गद्यांश के आधार पर, रटने और आलोचनात्मक सोच में मुख्य अंतर क्या है?"
    },
    options: [
      { en: "Rote learning helps recall facts, but critical thinking evaluates and synthesizes arguments", hi: "रटना तथ्यों को याद रखने में मदद करता है, लेकिन आलोचनात्मक सोच तर्कों का मूल्यांकन और संश्लेषण करती है" },
      { en: "Rote learning is harder than critical thinking", hi: "रटना आलोचनात्मक सोच से अधिक कठिन है" },
      { en: "Critical thinking is only for science students", hi: "आलोचनात्मक सोच केवल विज्ञान के छात्रों के लिए है" },
      { en: "Rote learning builds logical pathways", hi: "रटना तार्किक मार्गों का निर्माण करता है" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Compare the descriptions of both learning types in the first and second sentences.", hi: "पहले और दूसरे वाक्यों में दोनों प्रकार के सीखने के विवरण की तुलना करें।" },
      { en: "Rote learning allows fact recall, but students struggle to synthesize contradicting viewpoints. Critical thinking evaluates arguments.", hi: "रटना तथ्यों को याद रखने की अनुमति देता है, लेकिन छात्र विपरीत विचारों को संश्लेषित करने में संघर्ष करते हैं। आलोचनात्मक सोच तर्कों का मूल्यांकन करती है।" }
    ],
    explanation: {
      en: "The passage outlines that standard rote learning allows fact recall, whereas critical thinking requires evaluating arguments and synthesizing contradicting viewpoints. Therefore, the first option is the correct comparison.",
      hi: "गद्यांश रेखांकित करता है कि मानक रटना तथ्यों को याद रखने की अनुमति देता है, जबकि आलोचनात्मक सोच के लिए तर्कों के मूल्यांकन और विपरीत दृष्टिकोणों के संश्लेषण की आवश्यकता होती है।"
    }
  }
];
