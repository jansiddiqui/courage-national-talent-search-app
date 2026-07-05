import { Question } from "../../../core/types";

export const appliedMathQuestions: Question[] = [
  {
    id: "q_applied_easy",
    topicId: "applied-math",
    skill: "Numerical Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Raman is twice as old as Amit. If Amit is 8 years old today, how old will Raman be in 5 years?",
      hi: "रमन की आयु अमित की आयु से दोगुनी है। यदि अमित आज 8 वर्ष का है, तो 5 वर्ष बाद रमन कितने वर्ष का होगा?"
    },
    options: [
      { en: "16 years", hi: "16 वर्ष" },
      { en: "21 years", hi: "21 वर्ष" },
      { en: "24 years", hi: "24 वर्ष" },
      { en: "13 years", hi: "13 वर्ष" }
    ],
    correctIndex: 1,
    hints: [
      { en: "First calculate Raman's current age. He is twice as old as Amit.", hi: "पहले रमन की वर्तमान आयु ज्ञात करें। वह अमित से दोगुनी आयु का है।" },
      { en: "Raman's current age is 8 * 2 = 16 years. Now add 5 years to it.", hi: "रमन की वर्तमान आयु 8 * 2 = 16 वर्ष है। अब इसमें 5 वर्ष जोड़ें।" }
    ],
    explanation: {
      en: "Raman's today age = 2 * Amit's age = 2 * 8 = 16 years. In 5 years, Raman will be 16 + 5 = 21 years old.",
      hi: "रमन की आज की आयु = 2 * अमित की आयु = 2 * 8 = 16 वर्ष। 5 वर्ष बाद, रमन 16 + 5 = 21 वर्ष का हो जाएगा।"
    }
  },
  {
    id: "q_applied_medium",
    topicId: "applied-math",
    skill: "Analytical Reasoning",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "There are 6 students in a room. If each student shakes hands with every other student exactly once, how many handshakes will take place in total?",
      hi: "एक कमरे में 6 छात्र हैं। यदि प्रत्येक छात्र अन्य सभी छात्रों से ठीक एक बार हाथ मिलाता है, तो कुल कितने हैंडशेक होंगे?"
    },
    options: [
      { en: "12", hi: "12" },
      { en: "15", hi: "15" },
      { en: "18", hi: "18" },
      { en: "30", hi: "30" }
    ],
    correctIndex: 1,
    hints: [
      { en: "This is a combination problem. The formula for n people shaking hands is n * (n - 1) / 2.", hi: "यह एक संचय (combination) की समस्या है। n लोगों के हाथ मिलाने का सूत्र n * (n - 1) / 2 है।" },
      { en: "Substitute n = 6 into the formula: 6 * 5 / 2. Calculate the value.", hi: "सूत्र में n = 6 रखें: 6 * 5 / 2। मान की गणना करें।" }
    ],
    explanation: {
      en: "The number of handshakes is calculated by finding combinations of 2 people out of 6, which is n * (n - 1) / 2 = 6 * 5 / 2 = 15.",
      hi: "हैंडशेक की संख्या की गणना 6 में से 2 लोगों के संयोजनों को खोजकर की जाती है, जो कि n * (n - 1) / 2 = 6 * 5 / 2 = 15 है।"
    }
  },
  {
    id: "q_applied_hard",
    topicId: "applied-math",
    skill: "Analytical Reasoning",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "A farmer has some chickens (2 legs) and goats (4 legs) on his farm. If there are 20 heads and 56 legs in total, how many goats does the farmer have?",
      hi: "एक किसान के पास कुछ मुर्गियां (2 पैर) और बकरियां (4 पैर) हैं। यदि कुल 20 सिर और 56 पैर हैं, तो किसान के पास कितनी बकरियां हैं?"
    },
    options: [
      { en: "8", hi: "8" },
      { en: "10", hi: "10" },
      { en: "12", hi: "12" },
      { en: "14", hi: "14" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Let chickens be C and goats be G. We know C + G = 20 (since each animal has 1 head).", hi: "मान लें मुर्गियां C हैं और बकरियां G हैं। हम जानते हैं C + G = 20 (क्योंकि प्रत्येक जानवर का 1 सिर होता है)।" },
      { en: "Legs formula: 2*C + 4*G = 56. If all 20 animals were chickens, they would have 20 * 2 = 40 legs. The extra 16 legs belong to goats.", hi: "पैर का सूत्र: 2*C + 4*G = 56। यदि सभी 20 जानवर मुर्गियां होते, तो उनके 20 * 2 = 40 पैर होते। अतिरिक्त 16 पैर बकरियों के हैं।" }
    ],
    explanation: {
      en: "If all 20 animals were chickens, there would be 20 * 2 = 40 legs. But there are 56 legs. The extra legs (56 - 40 = 16) are due to goats having 2 extra legs each. Goats = 16 / 2 = 8 goats.",
      hi: "यदि सभी 20 जानवर मुर्गियां होते, तो 20 * 2 = 40 पैर होते। लेकिन 56 पैर हैं। अतिरिक्त पैर (56 - 40 = 16) बकरियों के 2 अतिरिक्त पैर होने के कारण हैं। बकरियां = 16 / 2 = 8 बकरियां।"
    }
  }
];
