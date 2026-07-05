import { Question } from "../../../core/types";

export const dataSufficiencyQuestions: Question[] = [
  {
    id: "q_suff_easy",
    topicId: "data-sufficiency",
    skill: "Analytical",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Question: What is Amit's age today?\nStatements:\nI. Amit is 5 years older than Raman.\nII. Raman is 10 years old today.",
      hi: "प्रश्न: आज अमित की आयु क्या है?\nकथन:\nI. अमित रमन से 5 वर्ष बड़ा है।\nII. रमन आज 10 वर्ष का है।"
    },
    options: [
      { en: "Statement I alone is sufficient", hi: "केवल कथन I पर्याप्त है" },
      { en: "Statement II alone is sufficient", hi: "केवल कथन II पर्याप्त है" },
      { en: "Both statements together are sufficient, but neither alone is sufficient", hi: "दोनों कथन मिलकर पर्याप्त हैं, लेकिन कोई भी अकेला पर्याप्त नहीं है" },
      { en: "Statements I and II together are not sufficient", hi: "कथन I और II दोनों मिलकर भी पर्याप्त नहीं हैं" }
    ],
    correctIndex: 2,
    hints: [
      { en: "Can you find Amit's age using only Statement I? No (we don't know Raman's age).", hi: "क्या आप केवल कथन I का उपयोग करके अमित की आयु पा सकते हैं? नहीं (हमें रमन की आयु नहीं पता)।" },
      { en: "Combine them: Raman is 10 (from II), Amit is 10 + 5 = 15 (from I).", hi: "उन्हें मिलाएं: रमन 10 का है (II से), अमित 10 + 5 = 15 का है (I से)।" }
    ],
    explanation: {
      en: "Statement I alone only gives a relation (Amit = Raman + 5) which is not sufficient. Statement II alone gives Raman's age (10) but no connection to Amit. Together, we find Amit = 10 + 5 = 15. So, both together are sufficient.",
      hi: "केवल कथन I केवल एक संबंध देता है जो पर्याप्त नहीं है। केवल कथन II रमन की आयु (10) देता है लेकिन अमित से कोई संबंध नहीं देता। साथ मिलकर, हम अमित = 10 + 5 = 15 पाते हैं। इसलिए, दोनों मिलकर पर्याप्त हैं।"
    }
  },
  {
    id: "q_suff_medium",
    topicId: "data-sufficiency",
    skill: "Analytical",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Question: Is X an even number?\nStatements:\nI. X is divisible by 4.\nII. X is divisible by 3.",
      hi: "प्रश्न: क्या X एक सम (even) संख्या है?\nकथन:\nI. X, 4 से विभाज्य है।\nII. X, 3 से विभाज्य है।"
    },
    options: [
      { en: "Statement I alone is sufficient", hi: "केवल कथन I पर्याप्त है" },
      { en: "Statement II alone is sufficient", hi: "केवल कथन II पर्याप्त है" },
      { en: "Both together are sufficient", hi: "दोनों मिलकर पर्याप्त हैं" },
      { en: "Neither together nor alone is sufficient", hi: "न तो मिलकर और न ही अकेले पर्याप्त हैं" }
    ],
    correctIndex: 0,
    hints: [
      { en: "divisible by 4 means X must be a multiple of 4 (e.g. 4, 8, 12, 16). Are all multiples of 4 even?", hi: "4 से विभाज्य होने का अर्थ है कि X, 4 का गुणज होना चाहिए (जैसे 4, 8, 12)। क्या 4 के सभी गुणज सम होते हैं?" },
      { en: "Multiples of 4 are always even. So, Statement I alone gives a definitive 'Yes'.", hi: "4 के गुणज हमेशा सम होते हैं। इसलिए, केवल कथन I एक निश्चित 'हाँ' देता है।" }
    ],
    explanation: {
      en: "Statement I tells us X is divisible by 4. Since any number divisible by 4 is a multiple of 4 (4, 8, 12...) and all multiples of 4 are even numbers, Statement I alone is sufficient to answer 'Yes'. Statement II tells us X is divisible by 3 (could be 3 - odd, or 6 - even), which is not sufficient.",
      hi: "कथन I हमें बताता है कि X, 4 से विभाज्य है। चूंकि 4 से विभाज्य कोई भी संख्या 4 का गुणज (4, 8, 12...) होती है और 4 के सभी गुणज सम संख्याएं हैं, इसलिए केवल कथन I 'हाँ' उत्तर देने के लिए पर्याप्त है।"
    }
  },
  {
    id: "q_suff_hard",
    topicId: "data-sufficiency",
    skill: "Analytical",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Question: Who is tallest among A, B, and C?\nStatements:\nI. A is taller than B.\nII. B is shorter than C.",
      hi: "प्रश्न: A, B और C में से सबसे लंबा कौन है?\nकथन:\nI. A, B से लंबा है।\nII. B, C से छोटा है।"
    },
    options: [
      { en: "Statement I alone is sufficient", hi: "केवल कथन I पर्याप्त है" },
      { en: "Statement II alone is sufficient", hi: "केवल कथन II पर्याप्त है" },
      { en: "Both statements together are sufficient", hi: "दोनों कथन मिलकर पर्याप्त हैं" },
      { en: "Statements I and II together are not sufficient", hi: "कथन I और II दोनों मिलकर भी पर्याप्त नहीं हैं" }
    ],
    correctIndex: 3,
    hints: [
      { en: "From I, A > B. From II, C > B.", hi: "I से, A > B। II से, C > B।" },
      { en: "We know B is the shortest. But who is taller between A and C? There is no direct clue.", hi: "हम जानते हैं कि B सबसे छोटा है। लेकिन A और C में से कौन अधिक लंबा है? कोई सीधा सुराग नहीं है।" }
    ],
    explanation: {
      en: "From Statement I, we get A > B. From Statement II, we get C > B. Combining both, we know B is shorter than both A and C, but we do not know whether A > C or C > A. Therefore, even together the statements are not sufficient.",
      hi: "कथन I से, हमें A > B मिलता है। कथन II से, हमें C > B मिलता है। दोनों को मिलाने पर, हम जानते हैं कि B, A और C दोनों से छोटा है, लेकिन हम यह नहीं जानते कि A > C है या C > A। इसलिए, दोनों मिलकर भी पर्याप्त नहीं हैं।"
    }
  }
];
