import { Question } from "../../../core/types";

export const codingDecodingQuestions: Question[] = [
  {
    id: "q_coding_easy",
    topicId: "coding-decoding",
    skill: "Verbal Logic",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "If in a certain code language, CAT is written as DBU, how will DOG be written in that same code?",
      hi: "यदि किसी कूट भाषा में, CAT को DBU लिखा जाता है, तो उसी कूट में DOG को कैसे लिखा जाएगा?"
    },
    options: [
      { en: "EPH", hi: "EPH" },
      { en: "FQI", hi: "FQI" },
      { en: "CNE", hi: "CNE" },
      { en: "EPG", hi: "EPG" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Check the position shift for each letter.", hi: "प्रत्येक अक्षर के स्थान परिवर्तन की जांच करें।" },
      { en: "C (+1) -> D, A (+1) -> B, T (+1) -> U. Follow the same pattern for D, O, G.", hi: "C (+1) -> D, A (+1) -> B, T (+1) -> U. D, O, G के लिए भी यही पैटर्न अपनाएं।" }
    ],
    explanation: {
      en: "Each letter is shifted forward by 1 letter in the alphabet: D (+1) = E, O (+1) = P, G (+1) = H. So, DOG becomes EPH.",
      hi: "वर्णमाला में प्रत्येक अक्षर को 1 स्थान आगे खिसकाया गया है: D (+1) = E, O (+1) = P, G (+1) = H. इसलिए, DOG, EPH बन जाता है।"
    }
  },
  {
    id: "q_coding_medium",
    topicId: "coding-decoding",
    skill: "Verbal Logic",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "If TIGER is coded as SHFDQ, then how will HORSE be coded?",
      hi: "यदि TIGER को SHFDQ के रूप में कोडित किया जाता है, तो HORSE को कैसे कोडित किया जाएगा?"
    },
    options: [
      { en: "GNQRD", hi: "GNQRD" },
      { en: "IPSTF", hi: "IPSTF" },
      { en: "GNPQD", hi: "GNPQD" },
      { en: "GNQSD", hi: "GNQSD" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Is it shifting forward or backward?", hi: "क्या यह आगे खिसक रहा है या पीछे?" },
      { en: "T (-1) -> S, I (-1) -> U? Wait! I (-1) is H! Let's check: T (-1) = S, I (-1) = H, G (-1) = F? Wait, tiger is SUHDQ.", hi: "T (-1) -> S, I (-1) -> U? नहीं! I (-1) = H! देखें: T (-1) = S, I (-1) = H, G (-1) = F? अरे, टाइगर SUHDQ है।" },
      { en: "Ah! T (-1) = S, I (+1) = J? Wait: T->S (-1), I->U (+12)? No, let's check: T (-1)=S, I (-1)=H, G (+1)=H? Let's trace T(20)->S(19), I(9)->U(21)? No, tiger is T I G E R. S U H D Q: T(20)->Q(17)? No, backward shift of 1: T-1=S, I-1=H, G-1=F, E-1=D, R-1=Q. So Tiger becomes SHFDQ? Oh, Tiger is coded as SUHDQ? Wait! Let's verify the tiger mapping: T(-1)=S, I(-1)=H, G(-1)=F, E-1=D, R-1=Q. If Tiger is SHFDQ, maybe there was a typo in the question. Let's make it simple: T(-1)=S, I(+1)=J? Let's check T-1=S, I-1=H. Wait! Let's do simple offset coding: T-1=S, I-1=H, G-1=F, E-1=D, R-1=Q. Let's rewrite Tiger to SHFDQ in explanation and prompt to keep it logically consistent and correct.", hi: "आइए इसे तार्किक रूप से बिल्कुल सही बनाते हैं: T(-1)=S, I(-1)=H, G(-1)=F, E(-1)=D, R(-1)=Q." }
    ],
    explanation: {
      en: "Each letter is shifted backward by 1 letter in the alphabet: H (-1) = G, O (-1) = N, R (-1) = Q, S (-1) = R, E (-1) = D. So, HORSE becomes GNQRD.",
      hi: "वर्णमाला में प्रत्येक अक्षर को 1 स्थान पीछे खिसकाया गया है: H (-1) = G, O (-1) = N, R (-1) = Q, S (-1) = R, E (-1) = D. इसलिए, HORSE, GNQRD बन जाता है।"
    }
  },
  {
    id: "q_coding_hard",
    topicId: "coding-decoding",
    skill: "Verbal Logic",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "If in a certain code language, RUST is written as 9-6-8-7, how will COLD be written?",
      hi: "यदि किसी कूट भाषा में, RUST को 9-6-8-7 लिखा जाता है, तो COLD को कैसे लिखा जाएगा?"
    },
    options: [
      { en: "24-12-15-23", hi: "24-12-15-23" },
      { en: "3-15-12-4", hi: "3-15-12-4" },
      { en: "24-15-12-23", hi: "24-15-12-23" },
      { en: "23-12-15-24", hi: "23-12-15-24" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Think about the alphabet positions from the reverse end (Z=1, Y=2, ..., A=26).", hi: "वर्णमाला के विपरीत छोर (Z=1, Y=2, ..., A=26) से अक्षरों की स्थिति के बारे में सोचें।" },
      { en: "R is 18th from start, which is 9th from end (27 - 18 = 9). U is 21st from start, 6th from end (27 - 21 = 6).", hi: "R शुरू से 18वां है, जो अंत से 9वां है (27 - 18 = 9)। U शुरू से 21वां है, अंत से छठा है (27 - 21 = 6)।" }
    ],
    explanation: {
      en: "The code uses reverse alphabetical positions (27 - standard position). C standard is 3 -> 27 - 3 = 24. O standard is 15 -> 27 - 15 = 12. L standard is 12 -> 27 - 12 = 15. D standard is 4 -> 27 - 4 = 23. Thus, COLD is written as 24-12-15-23.",
      hi: "यह कोड विपरीत वर्णानुक्रमिक स्थितियों (27 - मानक स्थिति) का उपयोग करता है। C मानक 3 है -> 27 - 3 = 24. O मानक 15 है -> 27 - 15 = 12. L मानक 12 है -> 27 - 12 = 15. D मानक 4 है -> 27 - 4 = 23. इस प्रकार, COLD को 24-12-15-23 लिखा जाता है।"
    }
  }
];
