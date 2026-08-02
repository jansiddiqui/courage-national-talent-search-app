export type LanguageMode = "en" | "hi" | "hinglish";

export type CategoryType =
  | "opening"
  | "gatekeeper"
  | "principal"
  | "academic"
  | "trust"
  | "competition"
  | "operations"
  | "followup_cadence"
  | "closing"
  | "emergency";

export type PriorityLevel = "critical" | "high" | "medium" | "low";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type BuyingSignalType = "positive" | "neutral" | "negative";
export type ExpectedRoleType = "Principal" | "Vice Principal" | "Coordinator" | "Receptionist" | "Trustee" | "Management";
export type EmotionType = "Interested" | "Busy" | "Suspicious" | "Confused" | "Excited" | "Angry" | "Rejecting";

export type SalesStage =
  | "STAGE_1_FIRST_TOUCH"
  | "STAGE_2_GATEKEEPER"
  | "STAGE_3_PERMISSION_OPENING"
  | "STAGE_4_ACADEMIC_DEEPDIVE"
  | "STAGE_5_TRUST_VERIFICATION"
  | "STAGE_6_COMPETITION_OBJECTION"
  | "STAGE_7_OPERATIONS_SUPPORT"
  | "STAGE_8_MULTITOUCH_FOLLOWUP"
  | "STAGE_9_CLOSING_VARIATION"
  | "STAGE_10_EMERGENCY_RECOVERY";

export interface CallingScenario {
  id: string;
  category: CategoryType;
  salesStage: SalesStage;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  buyingSignal: BuyingSignalType;
  expectedRole: ExpectedRoleType;
  emotion: EmotionType;
  
  title: Record<LanguageMode, string>;
  subtitle?: Record<LanguageMode, string>;
  script: Record<LanguageMode, string>;
  
  psychologyReason?: Record<LanguageMode, string>;
  suggestedTone?: Record<LanguageMode, string>;
  mistakesToAvoid?: Record<LanguageMode, string[]>;
  followUpQuestion?: Record<LanguageMode, string>;
  keyTakeaways?: Record<LanguageMode, string[]>;
  
  conversionProbability?: number; // 0 - 100%
  nextAction?: string;
  recommendedNextScenarioId?: string;
}

export interface ScriptItem {
  id: string;
  category: "opening" | "objection" | "faq" | "gatekeeper";
  title: Record<LanguageMode, string>;
  subtitle?: Record<LanguageMode, string>;
  script: Record<LanguageMode, string>;
  keyTakeaways?: Record<LanguageMode, string[]>;
}

export const CALLING_SCENARIOS: CallingScenario[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // ─── STAGE 1 & 3: COLD OPENINGS & PERMISSION HOOKS ───────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "opening_principal_formal",
    category: "opening",
    salesStage: "STAGE_3_PERMISSION_OPENING",
    priority: "critical",
    difficulty: "easy",
    buyingSignal: "neutral",
    expectedRole: "Principal",
    emotion: "Busy",
    title: {
      en: "Principal Cold Opening (Permission-Based 20s)",
      hi: "प्राचार्य से पहला 20 सेकंड का संवाद (अनुमति आधारित)",
      hinglish: "Principal Cold Opening (Permission-Based 20s)",
    },
    subtitle: {
      en: "Short 20-second opening. Asks permission before delivering pitch details.",
      hi: "संक्षिप्त 20 सेकंड की शुरुआत। विवरण देने से पहले समय की अनुमति माँगे।",
      hinglish: "20-sec high conversion opening. Respects Principal's time.",
    },
    script: {
      en: `good morning/afternoon, [Principal Name]. Am I speaking with the Principal of [School Name]?

My name is [Caller Name], and I'm calling from Courage National Talent Search (CNTS), powered by Courage Library.

We're inviting selected schools across [State Name] to participate in the Founding Edition of CNTS for students of Classes 5 to 8. The school onboarding is completely free, and I'd like to take just two minutes to explain how your school can participate. Would this be a convenient time?`,
      hi: `[Greeting] [Principal Name] जी। क्या मेरी बात [School Name] के प्राचार्य जी से हो रही है?

मेरा नाम [Caller Name] है, और मैं करेज लाइब्रेरी द्वारा संचालित करेज नेशनल टैलेंट सर्च (CNTS) की ओर से बात कर रहा/रही हूँ।

हम कक्षा 5वीं से 8वीं के विद्यार्थियों के लिए CNTS के संस्थापक संस्करण (Founding Edition) में [State Name] के चुनिंदा विद्यालयों को आमंत्रित कर रहे हैं। विद्यालय प्रबंधन के लिए ऑनबोर्डिंग बिल्कुल मुफ़्त (₹0) है, और मैं केवल 2 मिनट में समझाना चाहता/चाहती हूँ कि आपका विद्यालय कैसे भाग ले सकता है। क्या अभी 2 मिनट बात करने का सही समय है?`,
      hinglish: `Good Morning/Afternoon [Principal Name] ji. Kya main [School Name] ke Principal Sir/Ma'am se baat kar raha/rahi hu?

Mera naam [Caller Name] hai, aur main Courage National Talent Search (CNTS) se baat kar raha/rahi hu, powered by Courage Library.

Hum [State Name] ke selected schools ko Classes 5th se 8th ke students ke liye CNTS Founding Edition me invite kar rahe hain. School onboarding 100% free (₹0) hai, aur main bas 2 minutes me explain karna chahta/chahti hu ki aapka school kaise participate kar sakta hai. Kya abhi 2 minutes baat karne ka convenient time hai?`,
    },
    psychologyReason: {
      en: "Principals decide in the first 15 seconds. Asking permission before presenting details builds immediate trust.",
      hi: "प्राचार्य शुरुआती 15 सेकंड में निर्णय लेते हैं। विवरण देने से पहले अनुमति माँगने से तुरंत विश्वास बनता है।",
      hinglish: "Principal 15 seconds me judge karte hain. Permission ask karke proceed karo.",
    },
    suggestedTone: {
      en: "Conversational, Polite & Crisp",
      hi: "व्यावहारिक, विनम्र एवं संक्षिप्त",
      hinglish: "Natural & Polite B2B tone",
    },
    mistakesToAvoid: {
      en: ["Don't pitch for more than 20 seconds without asking permission", "Don't state fake compliments"],
      hi: ["अनुमति बिना 20 सेकंड से अधिक न बोलें", "झूठी तारीफ न करें"],
      hinglish: ["Don't pitch > 20 sec without permission", "No fake praise"],
    },
    followUpQuestion: {
      en: "If Yes: Proceed to opening_principal_value_step2. If Busy: Offer callback times.",
      hi: "यदि हाँ: चरण 2 पर जाएँ। यदि व्यस्त: कॉल बैक समय तय करें।",
      hinglish: "If Yes -> Step 2 pitch. If Busy -> Fixed callback time.",
    },
    conversionProbability: 85,
    recommendedNextScenarioId: "opening_principal_value_step2",
  },

  {
    id: "opening_principal_value_step2",
    category: "opening",
    salesStage: "STAGE_3_PERMISSION_OPENING",
    priority: "critical",
    difficulty: "easy",
    buyingSignal: "positive",
    expectedRole: "Principal",
    emotion: "Interested",
    title: {
      en: "Value Proposition Pitch (Step 2 - After Permission)",
      hi: "मूल्य प्रस्ताव (चरण 2 - अनुमति मिलने के बाद)",
      hinglish: "Value Proposition Pitch (Step 2 - After Permission)",
    },
    subtitle: {
      en: "Deliver this 30-second summary ONLY after the Principal says 'Yes, tell me more'.",
      hi: "यह 30 सेकंड का विवरण केवल तब दें जब प्राचार्य कहें 'हाँ, बताइए'।",
      hinglish: "Use after Principal gives permission to present details.",
    },
    script: {
      en: `Thank you, Sir/Ma'am.

CNTS is a national online cognitive talent search designed to evaluate students beyond traditional marks by assessing Reasoning, Mathematics, Language, and Critical Thinking.

There is zero registration cost for the school management. Students participate voluntarily with a token fee of ₹99, and each candidate receives an individual performance diagnostic report and a QR-verified digital certificate.`,
      hi: `धन्यवाद सर/मैम।

CNTS एक राष्ट्रीय ऑनलाइन कॉग्निटिव टैलेंट खोज है, जो छात्रों को केवल किताबी अंकों से परे उनके रीजनिंग, गणित, भाषा और क्रिटिकल थिंकिंग का सटीक मूल्यांकन करती है।

विद्यालय प्रबंधन के लिए शून्य लागत है। छात्र मात्र ₹99 के टोकन शुल्क के साथ स्वेच्छा से भाग लेते हैं, और प्रत्येक प्रतिभागी को व्यक्तिगत कॉग्निटिव रिपोर्ट और सत्यापित क्यूआर डिजिटल प्रमाणपत्र मिलता है।`,
      hinglish: `Thank you Sir/Ma'am.

CNTS ek national online cognitive talent search hai jo students ko regular marks se aage Reasoning, Math, Language aur Critical Thinking me evaluate karta hai.

School management ke liye ZERO registration cost hai. Students voluntarily ₹99 token fee se participate karte hain, aur har candidate ko individual cognitive report aur QR-verified Digital Certificate milta hai.`,
    },
    psychologyReason: {
      en: "Delivered when Principal is listening actively. Clearly breaks down ₹0 management cost + 4 domains + ₹99 voluntary fee.",
      hi: "अनुमति मिलने के बाद प्राचार्य ध्यान से सुनते हैं। ₹0 स्कूल शुल्क और ₹99 टोकन शुल्क स्पष्ट करें।",
      hinglish: "Clear breakdown of ₹0 school fee + 4 cognitive domains + ₹99 student fee.",
    },
    conversionProbability: 90,
    recommendedNextScenarioId: "obj_cost_fees",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ─── STAGE 2: RECEPTIONIST & PA GATEKEEPING INTELLIGENCE ────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "gk_principal_in_assembly",
    category: "gatekeeper",
    salesStage: "STAGE_2_GATEKEEPER",
    priority: "high",
    difficulty: "medium",
    buyingSignal: "neutral",
    expectedRole: "Receptionist",
    emotion: "Busy",
    title: {
      en: "Principal is currently in Morning Assembly / Class",
      hi: "प्राचार्य अभी प्रात:कालीन सभा / कक्षा में हैं",
      hinglish: "Principal is in Assembly / taking class right now",
    },
    subtitle: {
      en: "Handling Morning Assembly or Teaching Schedule",
      hi: "प्रात:कालीन सभा या क्लास शेड्यूल संभालना",
      hinglish: "Assembly / Class timing handling",
    },
    script: {
      en: `Thank you for informing me, Ma'am/Sir. I know morning assembly hours are very busy.

We are calling from Courage National Talent Search (CNTS) Secretariat regarding the official Founding Edition Invitation for Classes 5 to 8. Should I call back at 11:30 AM after assembly, or is 2:30 PM after classes better?`,
      hi: `जानकारी के लिए धन्यवाद, मैम/सर। मैं समझता/समझती हूँ कि सुबह सभा और कक्षाओं का समय व्यस्त रहता है।

हम कक्षा 5 से 8 के लिए आधिकारिक संस्थापक संस्करण निमंत्रण के संबंध में करेज नेशनल टैलेंट सर्च (CNTS) सचिवालय से बात कर रहे हैं। क्या मैं सभा के बाद सुबह 11:30 बजे कॉल करूँ, या दोपहर 2:30 बजे कक्षाओं के बाद सही रहेगा?`,
      hinglish: `Thanks for informing Ma'am/Sir. Main samajhta hu morning assembly time busy rehta hai.

Hum Class 5th se 8th ke official CNTS Founding Edition Invitation ke regarding call kar rahe hain. Kya main assembly ke baad 11:30 AM call karu ya afternoon 2:30 PM better hoga?`,
    },
    psychologyReason: {
      en: "Offering 2 precise post-assembly time slots (11:30 AM or 2:30 PM) prevents a dead-end rejection.",
      hi: "सभा के बाद के 2 निश्चित समय विकल्प देने से कॉल रद्द होने से बचती है।",
      hinglish: "Offer 2 specific post-assembly time slots to fix callback.",
    },
    conversionProbability: 70,
    recommendedNextScenarioId: "gatekeeper_send_whatsapp",
  },

  {
    id: "gk_principal_on_leave_retired",
    category: "gatekeeper",
    salesStage: "STAGE_2_GATEKEEPER",
    priority: "high",
    difficulty: "hard",
    buyingSignal: "neutral",
    expectedRole: "Receptionist",
    emotion: "Confused",
    title: {
      en: "Principal has retired / On leave / New Principal joined",
      hi: "प्राचार्य सेवानिवृत्त हो चुके हैं / छुट्टी पर हैं / नए प्राचार्य आए हैं",
      hinglish: "Principal retired / On leave / New Principal joined",
    },
    subtitle: {
      en: "Handling Principal Leadership Change or Leave",
      hi: "प्राचार्य परिवर्तन या अवकाश की स्थिति संभालना",
      hinglish: "Leadership transition or leave handling",
    },
    script: {
      en: `Thank you for sharing that update, Ma'am/Sir. Could you kindly guide me with the name of the In-charge Principal or Vice Principal currently managing academic affairs?

We are issuing official Founding Edition invitations for Classes 5 to 8 and want to ensure [School Name] receives the official invitation kit on time.`,
      hi: `इस जानकारी के लिए धन्यवाद, मैम/सर। क्या आप कृपया मुझे अभी अकादमिक कार्य देख रहे प्रभारी प्राचार्य या उप-प्राचार्य का नाम बता सकते हैं?

हम कक्षा 5 से 8 के लिए आधिकारिक संस्थापक संस्करण निमंत्रण जारी कर रहे हैं और चाहते हैं कि [School Name] को यह निमंत्रण समय पर मिले।`,
      hinglish: `Update ke liye thanks Ma'am/Sir. Kya aap kindly abhi academics handle kar rahe In-charge Principal ya Vice Principal ka name share kar sakte hain?

Hum Class 5th se 8th ke official Founding Edition Invitations issue kar rahe hain aur chahte hain [School Name] ko invitation kit time par mile.`,
    },
    psychologyReason: {
      en: "Leadership changes create an opening to build rapport with the new Principal or Vice Principal immediately.",
      hi: "नेतृत्व परिवर्तन नए प्राचार्य या उप-प्राचार्य से नया संबंध बनाने का अवसर देता है।",
      hinglish: "New leadership is receptive to fresh academic initiatives.",
    },
    conversionProbability: 65,
    recommendedNextScenarioId: "opening_coordinator_casual",
  },

  {
    id: "gk_vp_or_olympiad_coordinator_handles",
    category: "gatekeeper",
    salesStage: "STAGE_2_GATEKEEPER",
    priority: "critical",
    difficulty: "easy",
    buyingSignal: "positive",
    expectedRole: "Receptionist",
    emotion: "Interested",
    title: {
      en: "Vice Principal or Olympiad Coordinator handles talent exams",
      hi: "उप-प्राचार्य या ओलंपियाड समन्वयक टैलेंट परीक्षाएं संभालते हैं",
      hinglish: "VP or Olympiad Coordinator handles these exams",
    },
    subtitle: {
      en: "Directing to the Actual Decision Maker",
      hi: "वास्तविक निर्णयकर्ता के पास पहुँचना",
      hinglish: "Pivoting to the exact decision maker",
    },
    script: {
      en: `That is perfect! Could you please share their direct extension or mobile number, or transfer my call to their desk?

We are dispatching the official CNTS 2026 Academic Blueprint for Classes 5 to 8 and would love to connect directly with them.`,
      hi: `यह तो बहुत अच्छी बात है! क्या आप कृपया उनका एक्सटेंशन या मोबाइल नंबर दे सकते हैं, या मेरी कॉल उनके डेस्क पर ट्रांसफर कर सकते हैं?

हम कक्षा 5 से 8 के लिए आधिकारिक CNTS 2026 एकेडमिक खाका भेज रहे हैं और उनसे सीधे संपर्क करना चाहते हैं।`,
      hinglish: `Perfect! Kya aap kindly unka mobile number ya extension share kar sakte hain, ya call unke desk par transfer kar sakte hain?

Hum Class 5th se 8th ke official CNTS 2026 Academic Blueprint ke regarding unse discuss karna chahte hain.`,
    },
    psychologyReason: {
      en: "Olympiad Coordinators are evaluated on student talent participation. They welcome high-quality assessment tools.",
      hi: "समन्वयक छात्र प्रदर्शन के आधार पर आंके जाते हैं। वे अच्छे शैक्षणिक टूल का स्वागत करते हैं।",
      hinglish: "Olympiad coordinators actively look for structured talent search programs.",
    },
    conversionProbability: 90,
    recommendedNextScenarioId: "opening_coordinator_casual",
  },

  {
    id: "gk_call_after_lunch_or_4pm",
    category: "gatekeeper",
    salesStage: "STAGE_2_GATEKEEPER",
    priority: "medium",
    difficulty: "easy",
    buyingSignal: "neutral",
    expectedRole: "Receptionist",
    emotion: "Busy",
    title: {
      en: "Call back after lunch / Call after 4 PM",
      hi: "लंच के बाद कॉल करें / दोपहर 4 बजे के बाद कॉल करें",
      hinglish: "Call back after lunch / Call after 4 PM",
    },
    subtitle: {
      en: "Timing Guidance by Front Desk",
      hi: "रिसेप्शन द्वारा सटीक समय का सुझाव",
      hinglish: "Precise window guidance",
    },
    script: {
      en: `Thank you for the guidance, Ma'am/Sir. I will note down exactly 4:15 PM today to call Principal [Principal Name].

Should I send a quick reminder message on your official WhatsApp so you have our secretariat details handy?`,
      hi: `सलाह के लिए धन्यवाद, मैम/सर। मैं आज ठीक शाम 4:15 बजे प्राचार्य [Principal Name] जी से बात करने के लिए समय नोट कर लेता/लेती हूँ।

क्या मैं आपके आधिकारिक व्हाट्सएप पर एक संक्षिप्त रिमाइंडर मैसेज भेज दूँ ताकि हमारे सचिवालय का विवरण आपके पास रहे?`,
      hinglish: `Guidance ke liye thanks Ma'am/Sir. Main aaj sharp 4:15 PM ka time note kar leta/leti hu Principal [Principal Name] ji se baat karne ke liye.

Kya main official WhatsApp par ek quick reminder send kar du taaki details aapke paas rahein?`,
    },
    psychologyReason: {
      en: "Confirming an exact minute (4:15 PM instead of generic 4 PM) makes you look like a scheduled appointment caller.",
      hi: "सटीक मिनट (4:15 बजे) तय करने से आप एक पूर्व-निर्धारित कॉल करने वाले की तरह लगते हैं।",
      hinglish: "Specific time commitment increases receptionist cooperation.",
    },
    conversionProbability: 80,
    recommendedNextScenarioId: "gatekeeper_send_whatsapp",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ─── STAGE 4: ACADEMIC & SYLLABUS INTELLIGENCE ───────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "academic_ncert_cbse_alignment",
    category: "academic",
    salesStage: "STAGE_4_ACADEMIC_DEEPDIVE",
    priority: "high",
    difficulty: "medium",
    buyingSignal: "positive",
    expectedRole: "Principal",
    emotion: "Interested",
    title: {
      en: "Is the syllabus aligned with NCERT / CBSE / State Boards?",
      hi: "क्या पाठ्यक्रम NCERT / CBSE / राज्य बोर्ड के अनुसार है?",
      hinglish: "Is syllabus aligned with NCERT / CBSE / ICSE / State Board?",
    },
    subtitle: {
      en: "Curriculum & Board Alignment Query",
      hi: "पाठ्यक्रम एवं बोर्ड मैपिंग प्रश्न",
      hinglish: "Board Mapping Query",
    },
    script: {
      en: `Yes, 100%! CNTS questions for Classes 5 to 8 are strictly mapped to age-appropriate learning competencies defined by NCERT and national curriculum standards.

Rather than testing rote memory, it evaluates application-level Reasoning, Mathematics, Language, and Critical Thinking, making it 100% compatible with CBSE, ICSE, and State Board syllabi.`,
      hi: `जी, 100%! कक्षा 5 से 8 के लिए CNTS के प्रश्न NCERT और राष्ट्रीय पाठ्यचर्या के अनुसार आयु-उपयुक्त दक्षताओं पर आधारित हैं।

यह रटने की बजाय एप्लिकेशन-स्तरीय रीजनिंग, गणित, भाषा और क्रिटिकल थिंकिंग का परीक्षण करता है, जो CBSE, ICSE और स्टेट बोर्ड के पाठ्यक्रम से पूरी तरह मेल खाता है।`,
      hinglish: `Ji 100%! Class 5th se 8th ke questions strictly NCERT aur National Curriculum standards ke according mapped hain.

Ratta maarne ki jagah ye application-based Reasoning, Math, Language aur Critical Thinking test karta hai, jo CBSE, ICSE aur State Boards ke saath 100% compatible hai.`,
    },
    psychologyReason: {
      en: "Principals fear extra out-of-syllabus burden. Confirming NCERT competency mapping reassures them.",
      hi: "प्राचार्य पाठ्यक्रम से बाहर के बोझ से डरते हैं। NCERT संरेखण की पुष्टि से वे आश्वस्त होते हैं।",
      hinglish: "Confirming NCERT mapping removes syllabus anxiety.",
    },
    conversionProbability: 85,
    recommendedNextScenarioId: "obj_who_prepares_questions",
  },

  {
    id: "academic_weak_vs_topper_students",
    category: "academic",
    salesStage: "STAGE_4_ACADEMIC_DEEPDIVE",
    priority: "medium",
    difficulty: "medium",
    buyingSignal: "neutral",
    expectedRole: "Principal",
    emotion: "Confused",
    title: {
      en: "Can average or weak students participate, or is it only for toppers?",
      hi: "क्या सामान्य या कमजोर छात्र भाग ले सकते हैं, या केवल टॉपरों के लिए है?",
      hinglish: "Can average students participate, or only toppers?",
    },
    subtitle: {
      en: "Student Inclusivity & Aptitude Level",
      hi: "छात्र समावेशिता एवं योग्यता स्तर",
      hinglish: "Inclusivity & Aptitude query",
    },
    script: {
      en: `CNTS is specifically designed for ALL students in Classes 5 to 8!

While traditional exams penalize average students, CNTS provides a diagnostic cognitive skill roadmap showing exact strengths in logic, math, language, and critical thinking. It boosts confidence for average candidates while challenging toppers!`,
      hi: `CNTS विशेष रूप से कक्षा 5 से 8 के सभी विद्यार्थियों के लिए डिज़ाइन किया गया है!

पारंपरिक परीक्षाएं कमजोर छात्रों को हतोत्साहित करती हैं, जबकि CNTS एक कॉग्निटिव रिपोर्ट देता है जो लॉजिक, गणित, भाषा और थिंकिंग में उनकी खूबियों को उजागर करती है। यह सामान्य छात्रों का आत्मविश्वास बढ़ाता है!`,
      hinglish: `CNTS specifically Class 5th se 8th ke SABHI students ke liye hai!

Regular exams me average students disheartened hote hain, lekin CNTS unhe cognitive report deta hai jo logic, math, language me unke hidden strengths dikhati hai. Ye toppers ke saath average students ka bhi confidence boost karta hai!`,
    },
    psychologyReason: {
      en: "Schools want inclusive programs where average students don't feel left out or demoralized.",
      hi: "स्कूल समावेशी कार्यक्रम चाहते हैं जहाँ सामान्य छात्र निराश न हों।",
      hinglish: "Highlights diagnostic growth value for all student tiers.",
    },
    conversionProbability: 88,
    recommendedNextScenarioId: "obj_cost_fees",
  },

  {
    id: "academic_can_class_4_or_9_participate",
    category: "academic",
    salesStage: "STAGE_4_ACADEMIC_DEEPDIVE",
    priority: "low",
    difficulty: "easy",
    buyingSignal: "neutral",
    expectedRole: "Principal",
    emotion: "Confused",
    title: {
      en: "Can Class 4th or Class 9th students also participate?",
      hi: "क्या कक्षा 4 या 9 के छात्र भी भाग ले सकते हैं?",
      hinglish: "Can Class 4 or Class 9 students participate?",
    },
    subtitle: {
      en: "Class Eligibility Boundary Inquiry",
      hi: "कक्षा पात्रता सीमा प्रश्न",
      hinglish: "Class eligibility query",
    },
    script: {
      en: `For the Founding Edition of CNTS 2026, the assessment is strictly standardized for Classes 5th, 6th, 7th, and 8th.

Our cognitive logic benchmarks are specifically calibrated for Sub-Junior (Classes 5-6) and Junior (Classes 7-8). We will expand to other classes in upcoming editions!`,
      hi: `CNTS 2026 के इस संस्थापक संस्करण के लिए परीक्षा केवल कक्षा 5वीं, 6ठी, 7वीं और 8वीं के लिए ही मानकीकृत की गई है।

हमारे कॉग्निटिव बेंचमार्क सब-जूनियर (कक्षा 5-6) और जूनियर (कक्षा 7-8) के लिए तैयार किए गए हैं। आगामी संस्करणों में अन्य कक्षाओं को भी जोड़ा जाएगा!`,
      hinglish: `CNTS 2026 Founding Edition me exam strictly Class 5th, 6th, 7th aur 8th ke liye hi standardized hai.

Hamaare cognitive logic benchmarks Sub-Junior (5-6) aur Junior (7-8) ke liye calibrated hain. Next editions me upcoming classes ko add kiya jayega!`,
    },
    psychologyReason: {
      en: "Shows strict scientific standardization rather than taking money for inappropriate age groups.",
      hi: "वैज्ञानिक मानकीकरण दिखाता है कि हर उम्र के लिए अंधाधुंध शुल्क नहीं लिया जा रहा।",
      hinglish: "Demonstrates scientific rigor and clear age calibration.",
    },
    conversionProbability: 82,
    recommendedNextScenarioId: "opening_principal_value_step2",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ─── STAGE 5: TRUST & LEGITIMACY VERIFICATION ────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "trust_who_is_founder_and_office_location",
    category: "trust",
    salesStage: "STAGE_5_TRUST_VERIFICATION",
    priority: "high",
    difficulty: "medium",
    buyingSignal: "negative",
    expectedRole: "Principal",
    emotion: "Suspicious",
    title: {
      en: "Who is behind Courage Library? Where is your official office located?",
      hi: "करेज लाइब्रेरी के संस्थापक कौन हैं? आपका आधिकारिक कार्यालय कहाँ है?",
      hinglish: "Who is the founder? Where is Courage Library office located?",
    },
    subtitle: {
      en: "Founder & Organizational Credentials Query",
      hi: "संस्थापक एवं संस्थागत साख प्रश्न",
      hinglish: "Founder & HQ credentials query",
    },
    script: {
      en: `Courage Library is an official registered educational initiative dedicated to student talent discovery and cognitive empowerment.

Our headquarters details, trust registration, and official portal are publicly accessible at thecouragelibrary.com. Every school onboarding includes an official signed digital invitation letter for your records.`,
      hi: `करेज लाइब्रेरी एक पंजीकृत शैक्षणिक पहल है, जो छात्रों की प्रतिभा खोज और कॉग्निटिव विकास के लिए समर्पित है।

हमारे मुख्यालय का विवरण, ट्रस्ट पंजीकरण और आधिकारिक पोर्टल thecouragelibrary.com पर सार्वजनिक रूप से उपलब्ध हैं। प्रत्येक स्कूल ऑनबोर्डिंग में आपके रिकॉर्ड के लिए आधिकारिक डिजिटल निमंत्रण पत्र शामिल रहता है।`,
      hinglish: `Courage Library ek registered educational trust initiative hai jo student talent discovery aur cognitive analytics par kaam karta hai.

Hamaara head office details aur official portal thecouragelibrary.com par publicly accessible hai. Onboarding ke waqt aapko official signed digital invitation letter milta hai.`,
    },
    psychologyReason: {
      en: "Principals want transparent credentials. Providing portal link and registered trust credentials removes trust friction.",
      hi: "प्राचार्य पारदर्शी क्रेडेंशियल चाहते हैं। पोर्टल लिंक और ट्रस्ट पंजीकरण से संशय मिटता है।",
      hinglish: "Public domain verification details build solid corporate credibility.",
    },
    conversionProbability: 78,
    recommendedNextScenarioId: "obj_trust_legitimacy",
  },

  {
    id: "trust_schools_from_my_city_joined",
    category: "trust",
    salesStage: "STAGE_5_TRUST_VERIFICATION",
    priority: "high",
    difficulty: "medium",
    buyingSignal: "positive",
    expectedRole: "Principal",
    emotion: "Interested",
    title: {
      en: "Have other schools from my city or CBSE/ICSE board joined?",
      hi: "क्या मेरे शहर या CBSE/ICSE बोर्ड के अन्य स्कूल जुड़े हैं?",
      hinglish: "Have other schools from my city / board joined?",
    },
    subtitle: {
      en: "Social Proof & Regional Peer School Inquiry",
      hi: "सामाजिक प्रमाण और क्षेत्रीय समकक्ष स्कूल प्रश्न",
      hinglish: "Social proof & peer validation query",
    },
    script: {
      en: `Yes! We are onboarding top CBSE, ICSE, and recognized institutions across [State Name]. 

Schools participate to provide their students with national benchmark rankings across Reasoning, Math, Language, and Critical Thinking. I can share our official State Onboarding List with your office!`,
      hi: `जी हाँ! हम [State Name] भर के प्रमुख CBSE, ICSE और मान्यता प्राप्त विद्यालयों को नामांकित कर रहे हैं।

विद्यालय अपने छात्रों को राष्ट्रीय स्तर पर 4 कॉग्निटिव डोमेन की रैंकिंग प्रदान करने के लिए जुड़ रहे हैं। मैं आपके कार्यालय के साथ राज्य स्तरीय ऑनबोर्डिंग सूची साझा कर सकता/सकती हूँ!`,
      hinglish: `Ji bilkul! Hum [State Name] ke top CBSE, ICSE aur recognized schools ko onboard kar rahe hain.

Schools apne students ko national benchmark rankings dene ke liye participate kar rahe hain. Main aapke office ko official State Onboarding Roster share kar sakta/sakti hu!`,
    },
    psychologyReason: {
      en: "Principals rely heavily on peer social proof. Knowing other CBSE/ICSE schools are participating creates fear of missing out (FOMO).",
      hi: "प्राचार्य समकक्ष स्कूलों के फैसलों पर भरोसा करते हैं। अन्य प्रमुख स्कूलों की भागीदारी से FOMO बनता है।",
      hinglish: "Leveraging peer adoption creates strong institutional FOMO.",
    },
    conversionProbability: 88,
    recommendedNextScenarioId: "closing_confirm_onboarding",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ─── STAGE 6: COMPETITOR OBJECTION HANDLING (SOF / SILVERZONE / ASSET) ──────
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "comp_already_conduct_sof_silverzone",
    category: "competition",
    salesStage: "STAGE_6_COMPETITION_OBJECTION",
    priority: "critical",
    difficulty: "hard",
    buyingSignal: "negative",
    expectedRole: "Principal",
    emotion: "Suspicious",
    title: {
      en: "We already conduct SOF / SilverZone / Unified Olympiads",
      hi: "हम पहले से ही SOF / सिल्वरज़ोन / यूनिफाइड ओलंपियाड आयोजित करते हैं",
      hinglish: "We already conduct SOF / SilverZone Olympiads",
    },
    subtitle: {
      en: "Handling Established Olympiad Competition",
      hi: "स्थापित ओलंपियाड प्रतिस्पर्धा को संभालना",
      hinglish: "Established competition objection handling",
    },
    script: {
      en: `SOF and SilverZone are wonderful subject-specific exams! CNTS does not replace them; it complements them.

While subject Olympiads test textbook syllabus memory, CNTS evaluates core 21st-century cognitive skills: Logical Reasoning, Quantitative Logic, Language Context, and Critical Thinking. It provides teachers with a 48-hour diagnostic skill roadmap!`,
      hi: `SOF और सिल्वरज़ोन बेहतरीन विषय-विशिष्ट परीक्षाएं हैं! CNTS उन्हें बदलता नहीं है, बल्कि उनका पूरक है।

विषय ओलंपियाड पाठ्यपुस्तक के सिलेबस का परीक्षण करते हैं, जबकि CNTS 21वीं सदी की 4 मुख्य कॉग्निटिव क्षमताओं (रीजनिंग, गणितीय तर्क, भाषा और थिंकिंग) का मूल्यांकन करता है। यह शिक्षकों को 48 घंटे में डायग्नोस्टिक रिपोर्ट देता है!`,
      hinglish: `SOF aur SilverZone bohot ache subject exams hain Sir/Ma'am! CNTS unhe replace nahi karta, balki complement karta hai.

Subject Olympiads textbook marks test karte hain, jabki CNTS 21st-century cognitive skills evaluate karta hai (Reasoning, Math, Language & Critical Thinking). Ye teachers ko individual skill roadmap deta hai!`,
    },
    psychologyReason: {
      en: "Never attack established competitors like SOF. Position CNTS as a complementary 21st-century cognitive diagnostic tool.",
      hi: "SOF जैसे स्थापित प्रतियोगियों की बुराई न करें। CNTS को एक पूरक कॉग्निटिव टूल के रूप में पेश करें।",
      hinglish: "Position as a complementary skill diagnostic, not a replacement.",
    },
    conversionProbability: 82,
    recommendedNextScenarioId: "academic_ncert_cbse_alignment",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ─── STAGE 8: MULTI-TOUCH FOLLOW-UP CADENCE ─────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "followup_day2_whatsapp_cadence",
    category: "followup_cadence",
    salesStage: "STAGE_8_MULTITOUCH_FOLLOWUP",
    priority: "high",
    difficulty: "easy",
    buyingSignal: "positive",
    expectedRole: "Principal",
    emotion: "Interested",
    title: {
      en: "Day 2 WhatsApp Follow-up Message",
      hi: "दूसरे दिन का व्हाट्सएप फॉलो-अप संदेश",
      hinglish: "Day 2 WhatsApp Follow-up Cadence",
    },
    subtitle: {
      en: "Short professional WhatsApp touchpoint after initial call.",
      hi: "कॉल के बाद दूसरे दिन का पेशेवर व्हाट्सएप संदेश।",
      hinglish: "Day 2 digital reminder touchpoint.",
    },
    script: {
      en: `Respected Principal Dr. [Principal Name],

Following our brief call yesterday regarding the Founding Edition of Courage National Talent Search (CNTS 2026) for Classes 5 to 8:

• School Onboarding: 100% FREE (₹0 Management Cost)
• Voluntary Student Token Fee: ₹99
• Deliverables: QR-Verified Digital Certificates & Individual Cognitive Reports

Official Information Link: thecouragelibrary.com/cnts
Should we reserve [School Name]'s invitation slot?`,
      hi: `आदरणीय प्राचार्य डॉ. [Principal Name] जी,

कक्षा 5 से 8 के लिए करेज नेशनल टैलेंट सर्च (CNTS 2026) के संस्थापक संस्करण के संबंध में कल हुई बातचीत के संदर्भ में:

• स्कूल ऑनबोर्डिंग: 100% मुफ़्त (₹0 लागत)
• स्वेच्छिक छात्र टोकन शुल्क: ₹99
• लाभ: डिजिटल क्यूआर प्रमाण पत्र एवं कॉग्निटिव रिपोर्ट

आधिकारिक विवरण: thecouragelibrary.com/cnts
क्या हम [School Name] का निमंत्रण स्लॉट सुरक्षित करें?`,
      hinglish: `Respected Principal Dr. [Principal Name] ji,

Following our call yesterday regarding CNTS 2026 Founding Edition for Classes 5 to 8:

• School Onboarding: 100% FREE (₹0)
• Voluntary Student Token Fee: ₹99
• Student Deliverables: QR Digital Certificates & Cognitive Reports

Portal Link: thecouragelibrary.com/cnts
Should we reserve [School Name]'s invitation slot?`,
    },
    psychologyReason: {
      en: "Multi-touch follow-up keeps your proposal active in the Principal's mind without phone spam.",
      hi: "व्हाट्सएप फॉलो-अप बिना फोन स्पैम किए प्राचार्य के ध्यान में प्रस्ताव बनाए रखता है।",
      hinglish: "Non-intrusive digital reminder maintains deal momentum.",
    },
    conversionProbability: 85,
    recommendedNextScenarioId: "closing_confirm_onboarding",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ─── STAGE 10: EMERGENCY SCENARIOS & LANGUAGE BARRIERS ──────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "emergency_angry_or_busy_principal",
    category: "emergency",
    salesStage: "STAGE_10_EMERGENCY_RECOVERY",
    priority: "critical",
    difficulty: "hard",
    buyingSignal: "negative",
    expectedRole: "Principal",
    emotion: "Angry",
    title: {
      en: "Principal is angry / Interrupted / Rude Receptionist",
      hi: "प्राचार्य नाराज हैं / बीच में रोका / असभ्य व्यवहार",
      hinglish: "Principal is angry / Interrupted / Rude response",
    },
    subtitle: {
      en: "Graceful De-escalation & Professional Exit",
      hi: "शालीनता से स्थिति संभालना और विदा लेना",
      hinglish: "De-escalation & graceful exit protocol",
    },
    script: {
      en: `I sincerely apologize for disturbing your busy schedule, Dr. [Principal Name]. I completely respect your time.

I will send our official 1-page program summary to your school email for reference when convenient. Have a great day ahead!`,
      hi: `आपके व्यस्त समय में व्यवधान के लिए मैं क्षमा चाहता/चाहती हूँ, डॉ. [Principal Name] जी। मैं आपके समय का पूरा सम्मान करता/करती हूँ।

सुविधा अनुसार देखने के लिए मैं आपके स्कूल ईमेल पर आधिकारिक 1-पेज का विवरण भेज दूँगा/दूंगी। आपका दिन शुभ हो!`,
      hinglish: `I sincerely apologize for disturbing your busy schedule Dr. [Principal Name] ji. Main aapke time ki poori respect karta/karti hu.

Main official 1-page summary email kar deta/deti hu Jab bhi time mile check kar lijiyega. Have a great day ahead!`,
    },
    psychologyReason: {
      en: "Never argue back. Immediate polite apology & de-escalation protects institutional reputation.",
      hi: "कभी बहस न करें। तुरंत विनम्र क्षमा और शांति संस्था की साख बचाती है।",
      hinglish: "Immediate apology & de-escalation preserves brand reputation.",
    },
    conversionProbability: 30,
    recommendedNextScenarioId: "followup_day2_whatsapp_cadence",
  },
];

// ─── Backward Compatibility Layer for Legacy Components ───
export const CALLING_SCRIPTS: ScriptItem[] = CALLING_SCENARIOS.map(s => ({
  id: s.id,
  category: (s.category === "opening" || s.category === "gatekeeper") ? s.category : (s.category === "academic" || s.category === "trust" || s.category === "competition") ? "objection" : "faq",
  title: s.title,
  subtitle: s.subtitle,
  script: s.script,
  keyTakeaways: s.keyTakeaways,
}));
