import { Question } from "../../../core/types";

export const syntaxLogicQuestions: Question[] = [
  {
    id: "q_lang_syntax_easy",
    topicId: "syntax-logic",
    skill: "Verbal",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Choose the correct verb form to complete the sentence:\n'The herd of deer ________ running towards the river.'",
      hi: "वाक्य को पूरा करने के लिए सही क्रिया रूप चुनें:\n'The herd of deer ________ running towards the river.'"
    },
    options: [
      { en: "is", hi: "is" },
      { en: "are", hi: "are" },
      { en: "were", hi: "were" },
      { en: "have", hi: "have" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Identify the real subject. Is it 'deer' or the collective noun 'herd'?", hi: "वास्तविक कर्ता (subject) को पहचानें। क्या यह 'deer' है या समूहवाचक संज्ञा 'herd' है?" },
      { en: "A collective noun like 'herd' is singular when acting as a single unit. Therefore, it takes a singular verb.", hi: "समूहवाचक संज्ञा जैसे 'herd' एकवचन होती है जब वह एक इकाई के रूप में कार्य करती है। इसलिए, यह एकवचन क्रिया लेती है।" }
    ],
    explanation: {
      en: "The subject of the sentence is the collective noun 'herd', which is singular. Thus, it takes the singular verb 'is', not the plural 'are' or 'were'.",
      hi: "वाक्य का कर्ता समूहवाचक संज्ञा 'herd' है, जो एकवचन है। इस प्रकार, यह एकवचन क्रिया 'is' लेता है, न कि बहुवचन 'are' या 'were'।"
    }
  },
  {
    id: "q_lang_syntax_medium",
    topicId: "syntax-logic",
    skill: "Analytical",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Rearrange these parts to form a grammatically correct and logical sentence:\nP: the boy\nQ: saw a snake\nR: playing in the garden\nS: who was",
      hi: "एक व्याकरणिक रूप से सही और तार्किक वाक्य बनाने के लिए इन भागों को पुनर्व्यवस्थित करें:\nP: the boy\nQ: saw a snake\nR: playing in the garden\nS: who was"
    },
    options: [
      { en: "P - S - R - Q", hi: "P - S - R - Q" },
      { en: "P - Q - S - R", hi: "P - Q - S - R" },
      { en: "R - P - S - Q", hi: "R - P - S - Q" },
      { en: "S - R - P - Q", hi: "S - R - P - Q" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Start with the main subject 'the boy' (P).", hi: "मुख्य कर्ता 'the boy' (P) से शुरुआत करें।" },
      { en: "Use the relative pronoun clause 'who was playing...' (S - R) to describe the boy, followed by the action 'saw a snake' (Q).", hi: "लड़के का वर्णन करने के लिए संबंधवाचक सर्वनाम खंड 'who was playing...' (S - R) का उपयोग करें, जिसके बाद क्रिया 'saw a snake' (Q) आए।" }
    ],
    explanation: {
      en: "The logical arrangement starts with the subject 'the boy' (P), described by the clause 'who was' (S) 'playing in the garden' (R), and ends with the main action 'saw a snake' (Q). The correct order is P-S-R-Q: 'The boy who was playing in the garden saw a snake.'",
      hi: "तार्किक व्यवस्था कर्ता 'the boy' (P) से शुरू होती है, जिसका वर्णन 'who was' (S) 'playing in the garden' (R) द्वारा किया गया है, और मुख्य क्रिया 'saw a snake' (Q) के साथ समाप्त होती है। सही क्रम P-S-R-Q है।"
    }
  },
  {
    id: "q_lang_syntax_hard",
    topicId: "syntax-logic",
    skill: "Verbal",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Choose the correct preposition to complete the sentence:\n'The school principal congratulated the students ________ their excellent performance.'",
      hi: "वाक्य को पूरा करने के लिए सही पूर्वसर्ग (preposition) चुनें:\n'The school principal congratulated the students ________ their excellent performance.'"
    },
    options: [
      { en: "for", hi: "for" },
      { en: "on", hi: "on" },
      { en: "at", hi: "at" },
      { en: "about", hi: "about" }
    ],
    correctIndex: 1,
    hints: [
      { en: "The verb 'congratulate' takes a specific preposition when referring to the reason of celebration.", hi: "उत्सव के कारण का उल्लेख करते समय क्रिया 'congratulate' एक विशिष्ट पूर्वसर्ग लेती है।" },
      { en: "We congratulate someone ON an achievement, not FOR it.", hi: "हम किसी को उसकी उपलब्धि पर (ON) बधाई देते हैं, उसके लिए (FOR) नहीं।" }
    ],
    explanation: {
      en: "In standard English syntax, the verb 'congratulate' is paired with the preposition 'on': 'congratulate someone ON something'. Therefore, 'on' is the correct preposition.",
      hi: "मानक अंग्रेजी वाक्य-रचना में, क्रिया 'congratulate' को पूर्वसर्ग 'on' के साथ जोड़ा जाता है: 'congratulate someone ON something'। इसलिए, 'on' सही पूर्वसर्ग है।"
    }
  }
];
