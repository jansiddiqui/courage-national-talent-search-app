import Fuse from "fuse.js";

export interface FAQEntry {
  id: string;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
}

export const cntsKnowledgeBase: FAQEntry[] = [
  // REGISTRATION & FEE
  {
    id: "reg_1",
    category: "Registration",
    keywords: ["what is cnts", "meaning", "about", "courage national talent search"],
    question: "What is CNTS?",
    answer: "The Courage National Talent Search (CNTS) is a national-level cognitive aptitude and talent discovery assessment platform. It helps parents understand how their child thinks, focusing on potential rather than just memorization."
  },
  {
    id: "reg_2",
    category: "Fee",
    keywords: ["fee", "cost", "price", "how much", "registration fee", "payment"],
    question: "What is the registration fee?",
    answer: "The registration fee for the CNTS 2026 Founding Edition is exactly ₹99."
  },
  {
    id: "reg_3",
    category: "Eligibility",
    keywords: ["who can participate", "eligibility", "classes", "grades", "age limit"],
    question: "Who can participate in CNTS?",
    answer: "CNTS is currently open to students studying in Classes 5, 6, 7, and 8."
  },
  {
    id: "reg_4",
    category: "Registration",
    keywords: ["how to register", "apply", "enroll", "signup"],
    question: "How do I register my child?",
    answer: "You can register directly on our website by clicking the 'Register Now' button. You'll need to provide basic student details and complete the ₹99 payment."
  },
  {
    id: "reg_5",
    category: "Registration",
    keywords: ["edit application", "change details", "wrong name", "update profile"],
    question: "Can I edit my application after submission?",
    answer: "Basic profile details can be updated before the admit card is generated. For major changes (like changing the registered class), please contact our support team."
  },
  {
    id: "reg_6",
    category: "Fee",
    keywords: ["refund", "cancel", "money back"],
    question: "Is the registration fee refundable?",
    answer: "Yes, we offer a 100% refund if requested within 24 hours of registration, no questions asked. After 24 hours, the fee is non-refundable."
  },

  // ASSESSMENT DETAILS
  {
    id: "exam_1",
    category: "Assessment",
    keywords: ["exam date", "when is the exam", "assessment date", "schedule"],
    question: "When will the exam be conducted?",
    answer: "The CNTS 2026 Founding Edition assessment dates will be announced shortly. Registered candidates will receive updates via email and WhatsApp."
  },
  {
    id: "exam_2",
    category: "Assessment",
    keywords: ["duration", "time limit", "how long"],
    question: "What is the duration of the exam?",
    answer: "The CNTS assessment is 90 minutes long."
  },
  {
    id: "exam_3",
    category: "Assessment",
    keywords: ["mode", "online or offline", "how to take exam", "home or center"],
    question: "Is the exam online or offline?",
    answer: "CNTS is a completely online assessment. Candidates can take the exam from the comfort of their home."
  },
  {
    id: "exam_4",
    category: "Syllabus",
    keywords: ["syllabus", "what to study", "topics", "subjects", "preparation"],
    question: "What is the syllabus for the exam?",
    answer: "CNTS focuses on cognitive aptitude, logical reasoning, creativity, and problem-solving rather than strict school subjects. Preparation guides and sample questions will be available in your dashboard."
  },
  {
    id: "exam_5",
    category: "Assessment",
    keywords: ["negative marking", "penalty", "wrong answer", "deduction"],
    question: "Is there negative marking?",
    answer: "There is no negative marking in the CNTS assessment. Students are encouraged to attempt all questions."
  },
  {
    id: "exam_6",
    category: "Assessment",
    keywords: ["pattern", "question format", "mcq"],
    question: "What is the question pattern?",
    answer: "The assessment consists of multiple-choice questions (MCQs) designed to test reasoning, decision-making, and critical thinking."
  },

  // TECHNICAL REQUIREMENTS
  {
    id: "tech_1",
    category: "Technical",
    keywords: ["mobile", "phone", "tablet", "ipad", "can i use phone"],
    question: "Can I take the exam on a mobile phone?",
    answer: "Yes, the assessment platform is fully responsive and can be accessed from any smartphone, tablet, laptop, or desktop."
  },
  {
    id: "tech_2",
    category: "Technical",
    keywords: ["webcam", "camera", "video", "proctoring"],
    question: "Do I need a webcam for the exam?",
    answer: "No, a webcam is not required for the Founding Edition. Candidates are encouraged to attempt the assessment independently to get an honest cognitive profile."
  },
  {
    id: "tech_3",
    category: "Technical",
    keywords: ["browser", "chrome", "safari", "requirements"],
    question: "Which browser should I use?",
    answer: "We recommend using the latest version of Google Chrome, Safari, or Microsoft Edge for the best experience."
  },
  {
    id: "tech_4",
    category: "Technical",
    keywords: ["internet", "wifi", "disconnect", "data"],
    question: "What happens if my internet disconnects during the exam?",
    answer: "Your progress is auto-saved. If you lose connection, simply log back in within your time window to resume from where you left off."
  },

  // RESULTS & TALENT PROFILE
  {
    id: "res_1",
    category: "Talent Profile",
    keywords: ["talent profile", "report", "what is it", "scorecard", "marksheet"],
    question: "What is a Talent Profile?",
    answer: "Unlike a traditional report card with just marks, the Talent Profile is a comprehensive multi-dimensional analysis of your child's hidden strengths, problem-solving approach, and cognitive abilities."
  },
  {
    id: "res_2",
    category: "Results",
    keywords: ["result date", "when are results", "declaration"],
    question: "When will the results be declared?",
    answer: "Results and Talent Profiles will be available in the candidate dashboard roughly 2-3 weeks after the assessment concludes."
  },
  {
    id: "res_3",
    category: "Results",
    keywords: ["certificate", "participation", "merit"],
    question: "Will my child get a certificate?",
    answer: "Yes, every participating student will receive a digital Certificate of Participation, and top performers will receive a Certificate of Merit."
  },

  // SUPPORT & ACCOUNT
  {
    id: "sup_1",
    category: "Support",
    keywords: ["forgot id", "lost id", "candidate id", "recover", "application number"],
    question: "I forgot my Candidate ID. How can I recover it?",
    answer: "You can use the 'Recover ID' option on the login page. Provide your registered email or phone number, and we will send your Candidate ID to you."
  },
  {
    id: "sup_2",
    category: "Support",
    keywords: ["payment failed", "money deducted", "error", "double payment"],
    question: "My payment failed but money was deducted. What should I do?",
    answer: "If your money was deducted but registration failed, the amount will be automatically refunded by your bank within 5-7 business days. Please try registering again."
  },
  {
    id: "sup_3",
    category: "Support",
    keywords: ["contact", "help", "support", "email", "phone number", "customer care"],
    question: "How can I contact CNTS support?",
    answer: "You can reach us through the 'Contact Us' page on our website, or join our official WhatsApp channel for direct updates."
  }
];

// Initialize Fuse.js instance
const fuseOptions = {
  includeScore: true,
  // Threshold determines how strict the match must be. 0.0 is perfect, 1.0 is anything.
  // 0.4 is a good balance for fuzzy keyword matching.
  threshold: 0.4,
  keys: [
    { name: "keywords", weight: 0.7 },
    { name: "question", weight: 0.3 }
  ]
};

const fuse = new Fuse(cntsKnowledgeBase, fuseOptions);

/**
 * Attempts to match a user query to a known FAQ.
 * @param query The user's question
 * @returns The matching FAQ answer, or null if no confident match is found.
 */
export function matchFAQ(query: string): string | null {
  if (!query || query.trim().length < 3) return null;
  
  const results = fuse.search(query);
  
  // If we found a match and the score is below the strict threshold (lower is better)
  if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.45) {
    return results[0].item.answer;
  }
  
  return null;
}
