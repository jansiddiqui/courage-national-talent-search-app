import { Question } from "../../../core/types";

export const lcmIntervalsQuestions: Question[] = [
  {
    id: "q_lcm_easy",
    topicId: "lcm-intervals",
    skill: "Numerical Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Three alarms ring at intervals of 4, 6, and 12 minutes respectively. If they all ring together at 8:00 AM, when will they ring together next?",
      hi: "तीन अलार्म क्रमशः 4, 6 और 12 मिनट के अंतराल पर बजते हैं। यदि वे सभी सुबह 8:00 बजे एक साथ बजते हैं, तो वे अगली बार एक साथ कब बजेंगे?"
    },
    options: [
      { en: "8:12 AM", hi: "8:12 AM" },
      { en: "8:24 AM", hi: "8:24 AM" },
      { en: "8:36 AM", hi: "8:36 AM" },
      { en: "9:00 AM", hi: "9:00 AM" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Find the Least Common Multiple (LCM) of 4, 6, and 12.", hi: "4, 6 और 12 का लघुत्तम समापवर्त्य (LCM) ज्ञात करें।" },
      { en: "Since 12 is divisible by both 4 and 6, the LCM is 12. Now add 12 minutes to 8:00 AM.", hi: "चूंकि 12, 4 और 6 दोनों से विभाज्य है, इसलिए LCM 12 है। अब सुबह 8:00 बजे में 12 मिनट जोड़ें।" }
    ],
    explanation: {
      en: "The LCM of 4, 6, and 12 is 12 minutes. So they will ring together again 12 minutes after 8:00 AM, which is 8:12 AM.",
      hi: "4, 6 और 12 का LCM 12 मिनट है। इसलिए वे सुबह 8:00 बजे के 12 मिनट बाद यानी 8:12 बजे फिर से एक साथ बजेंगे।"
    }
  },
  {
    id: "q_lcm_medium",
    topicId: "lcm-intervals",
    skill: "Numerical Logic",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Two runners start running around a circular track from the same point at the same time. Runner A takes 40 seconds to complete one lap, and Runner B takes 60 seconds. After how many minutes will they meet at the starting point again?",
      hi: "दो धावक एक ही समय पर एक ही बिंदु से एक गोलाकार ट्रैक के चारों ओर दौड़ना शुरू करते हैं। धावक A को एक चक्कर पूरा करने में 40 सेकंड लगते हैं, और धावक B को 60 सेकंड लगते हैं। कितने मिनट बाद वे शुरुआती बिंदु पर फिर से मिलेंगे?"
    },
    options: [
      { en: "2 minutes", hi: "2 मिनट" },
      { en: "3 minutes", hi: "3 मिनट" },
      { en: "4 minutes", hi: "4 मिनट" },
      { en: "120 minutes", hi: "120 मिनट" }
    ],
    correctIndex: 0,
    hints: [
      { en: "First, find the LCM of 40 and 60 in seconds.", hi: "सबसे पहले, सेकंड में 40 और 60 का LCM ज्ञात करें।" },
      { en: "LCM of 40 and 60 is 120 seconds. Convert 120 seconds into minutes.", hi: "40 और 60 का LCM 120 सेकंड है। 120 सेकंड को मिनट में बदलें।" }
    ],
    explanation: {
      en: "LCM of 40 and 60 is 120 seconds. Since 60 seconds = 1 minute, 120 seconds = 120 / 60 = 2 minutes.",
      hi: "40 और 60 का LCM 120 सेकंड है। चूंकि 60 सेकंड = 1 मिनट, इसलिए 120 सेकंड = 120 / 60 = 2 मिनट।"
    }
  },
  {
    id: "q_lcm_hard",
    topicId: "lcm-intervals",
    skill: "Analytical Reasoning",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Three traffic signals change color every 15, 20, and 30 seconds respectively. In a period of 1 hour, how many times will they change color at the exact same second, assuming they start together at the beginning?",
      hi: "तीन ट्रैफिक सिग्नल क्रमशः हर 15, 20 और 30 सेकंड में रंग बदलते हैं। 1 घंटे की अवधि में, वे कितनी बार बिल्कुल एक ही सेकंड पर रंग बदलेंगे, यह मानते हुए कि वे शुरुआत में एक साथ शुरू होते हैं?"
    },
    options: [
      { en: "60 times", hi: "60 बार" },
      { en: "61 times", hi: "61 बार" },
      { en: "120 times", hi: "120 बार" },
      { en: "121 times", hi: "121 बार" }
    ],
    correctIndex: 1,
    hints: [
      { en: "First calculate the LCM of 15, 20, and 30 to find how often they synchronize.", hi: "सबसे पहले 15, 20 और 30 का LCM ज्ञात करें ताकि यह पता चल सके कि वे कितनी बार सिंक्रनाइज़ होते हैं।" },
      { en: "LCM is 60 seconds (1 minute). In 1 hour (60 minutes), they synchronize 60 times. Add 1 for the initial alignment at the start.", hi: "LCM 60 सेकंड (1 मिनट) है। 1 घंटे (60 मिनट) में, वे 60 बार सिंक्रनाइज़ होते हैं। शुरुआत में होने वाले पहले संरेखण के लिए 1 जोड़ें।" }
    ],
    explanation: {
      en: "The LCM of 15, 20, and 30 is 60 seconds = 1 minute. They synchronize once every minute. In 60 minutes, they overlap 60 times. Adding the starting point (0th minute), the total count is 60 + 1 = 61 times.",
      hi: "15, 20 और 30 का LCM 60 सेकंड = 1 मिनट है। वे हर एक मिनट में एक बार सिंक्रनाइज़ होते हैं। 60 मिनट में, वे 60 बार ओवरलैप करते हैं। शुरुआती बिंदु (0वें मिनट) को जोड़ने पर, कुल संख्या 60 + 1 = 61 बार है।"
    }
  }
];
