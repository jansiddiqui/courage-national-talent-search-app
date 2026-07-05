import { TopicContent } from "../../../core/types";

export const syntaxLogicContent: TopicContent = {
  id: "topic_syntax_logic",
  slug: "syntax-logic",
  version: 3,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Syntax & Sentence Logic",
    hi: "वाक्य-रचना और वाक्य तर्क (Syntax Logic)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_lang_syntax_easy", "q_lang_syntax_medium", "q_lang_syntax_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Subject-Verb Agreement: A singular subject always takes a singular verb, and plural subject takes a plural verb.",
      "Sentence Order: Standard English structure follows Subject + Verb + Object (SVO).",
      "Relative Clauses: Pronouns like 'who', 'which', and 'that' should sit immediately next to the noun they describe."
    ],
    quickTricks: [
      "For sentence rearrangement (PQRS), always look for pairs! Find which two letters MUST go together, then filter the options."
    ]
  },
  blocks: [
    {
      id: "b_syntax_hook",
      type: "callout",
      content: {
        en: "Why is 'The cat chased the mouse' correct, but 'The mouse chased the cat' has a completely different meaning? And why is 'Chased cat mouse the the' absolute gibberish? \n\nBecause of syntax! Syntax is the set of traffic rules that words follow to make sense together. Let's learn how to direct this word traffic like a pro!",
        hi: "क्यों 'The cat chased the mouse' सही है, लेकिन 'The mouse chased the cat' का बिल्कुल अलग अर्थ है? और क्यों 'Chased cat mouse the the' बिल्कुल बकवास है?\n\nवाक्य-रचना (Syntax) के कारण! वाक्य-रचना उन ट्रैफ़िक नियमों का समूह है जिनका पालन शब्द एक साथ मिलकर अर्थपूर्ण होने के लिए करते हैं। आइए इस शब्द ट्रैफ़िक को एक प्रो की तरह निर्देशित करना सीखें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_syntax_eli10",
      type: "callout",
      content: {
        en: "Syntax is like building with Lego blocks. You can't just connect any two blocks anywhere. There is a top and a bottom, a connector and a receiver. Similarly, in a sentence, subject nouns connect to action verbs, and prepositions bridge them to objects. If you connect them wrong, the building collapses!",
        hi: "वाक्य-रचना (Syntax) लेगो ब्लॉक के साथ निर्माण करने जैसा है। आप किसी भी दो ब्लॉक को कहीं भी नहीं जोड़ सकते। एक शीर्ष और एक निचला भाग, एक कनेक्टर और एक रिसीवर होता है। इसी तरह, एक वाक्य में, कर्ता संज्ञाएं क्रियाओं से जुड़ती हैं, और पूर्वसर्ग उन्हें कर्म (object) से जोड़ते हैं।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_syntax_life",
      type: "callout",
      content: {
        en: "Good syntax logic helps you communicate clearly and write paragraphs that are easy to understand. Correct sentence structure ensures your reader understands your exact points.",
        hi: "अच्छी वाक्य-रचना (syntax logic) आपको स्पष्ट रूप से संवाद करने और समझने में आसान पैराग्राफ लिखने में मदद करती है। सही वाक्य संरचना यह सुनिश्चित करती है कि आपका पाठक आपकी बात को सही तरीके से समझे।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_syntax_lib_table",
      type: "table",
      content: {
        en: "Syntax Alignment Rules",
        hi: "वाक्य-रचना संरेखण नियम"
      },
      metadata: {
        headers: [
          { en: "Grammar Area", hi: "व्याकरण क्षेत्र" },
          { en: "Syntax Rule", hi: "वाक्य-रचना नियम" },
          { en: "Example Correct Case", hi: "सही उदाहरण" }
        ],
        rows: [
          [
            { en: "Subject-Verb", hi: "कर्ता-क्रिया" },
            { en: "Singular subject = singular verb, collective nouns take singular verbs in unity.", hi: "एकवचन कर्ता = एकवचन क्रिया, समूहवाचक संज्ञा एकवचन क्रिया लेती है।" },
            { en: "The herd of cows is grazing.", hi: "गायों का झुंड चर रहा है।" }
          ],
          [
            { en: "Relative Clause", hi: "संबंधवाचक उपवाक्य" },
            { en: "Place clauses immediately next to the noun modified.", hi: "उपवाक्यों को उस संज्ञा के ठीक बगल में रखें जिसे वे परिभाषित करते हैं।" },
            { en: "The girl who won the prize is my sister.", hi: "जिस लड़की ने पुरस्कार जीता वह मेरी बहन है।" }
          ],
          [
            { en: "Sentence Flow", hi: "वाक्य प्रवाह" },
            { en: "Subject (S) + Verb (V) + Object (O)", hi: "कर्ता (S) + क्रिया (V) + कर्म (O)" },
            { en: "Rahul kicked the football.", hi: "राहुल ने फुटबॉल को लात मारी।" }
          ]
        ]
      }
    },
    {
      id: "b_syntax_recipe_title",
      type: "heading",
      content: {
        en: "Rearranging Jumbled Words Recipe (PQRS वाक्य विधि)",
        hi: "PQRS वाक्य पुनर्व्यवस्था रेसिपी (Rearranging Words)"
      }
    },
    {
      id: "b_syntax_recipe",
      type: "recipe",
      content: {
        en: "Follow these steps to reconstruct any jumbled word puzzle quickly.",
        hi: "किसी भी उलझे हुए शब्द पहेली को जल्दी से हल करने के लिए इन चरणों का पालन करें।"
      },
      metadata: {
        steps: [
          {
            en: "Find the main subject (Who/What is the sentence about?). This is usually the opening block.",
            hi: "मुख्य कर्ता (Subject) खोजें (वाक्य किसके बारे में है?)। यह आमतौर पर शुरुआती ब्लॉक होता है।"
          },
          {
            en: "Look for the verb or action. What is the subject doing?",
            hi: "क्रिया (verb) या कार्य की तलाश करें। कर्ता क्या कर रहा है?"
          },
          {
            en: "Identify connecting words. Pronouns like 'who' or 'which' must be placed right after the noun they describe.",
            hi: "जोड़ने वाले शब्दों को पहचानें। 'who' या 'which' जैसे सर्वनामों को संज्ञा के ठीक बाद रखा जाना चाहिए।"
          },
          {
            en: "Assemble and read aloud. Ensure the final flow follows Subject + Verb + Object.",
            hi: "इकट्ठा करें और जोर से पढ़ें। सुनिश्चित करें कि प्रवाह कर्ता + क्रिया + कर्म का पालन करता है।"
          }
        ]
      }
    },
    {
      id: "b_syntax_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_syntax_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Choose the correct verb form: 'The herd of deer ________ running towards the river.' (is/are)\n\nStep 1: Identify the true subject. It is the collective noun 'herd', not 'deer'.\nStep 2: A collective noun represents a single unit, so it is singular.\nStep 3: Select the singular verb: 'is'.\nAnswer: is.",
        hi: "Level: Easy | उदाहरण 1: सही क्रिया रूप चुनें: 'The herd of deer ________ running towards the river.' (is/are)\n\nचरण 1: वास्तविक कर्ता की पहचान करें। यह समूहवाचक संज्ञा 'herd' है, न कि 'deer'।\nचरण 2: समूहवाचक संज्ञा एक एकल इकाई का प्रतिनिधित्व करती है, इसलिए यह एकवचन है।\nउत्तर: is।"
      }
    },
    {
      id: "b_syntax_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Find the grammatically incorrect section: 'Either the teacher (A) or the students (B) is presenting (C) the project today (D).'\n\nStep 1: In 'Either... or' constructions, the verb agrees with the closer subject.\nStep 2: The closer subject is 'students' (plural).\nStep 3: Therefore, 'is presenting' must be replaced with 'are presenting'.\nAnswer: C.",
        hi: "Level: Medium | उदाहरण 2: व्याकरणिक रूप से गलत हिस्सा खोजें: 'Either the teacher (A) or the students (B) is presenting (C) the project today (D).'\n\nचरण 1: 'Either... or' वाक्य संरचना में, क्रिया सबसे पास वाले कर्ता के अनुसार बदलती है।\nचरण 2: पास वाला कर्ता 'students' (बहुवचन) है।\nचरण 3: इसलिए 'is presenting' के स्थान पर 'are presenting' होना चाहिए।\nउत्तर: C।"
      }
    },
    {
      id: "b_syntax_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Rearrange to form a coherent sentence:\nP: in the school playground\nQ: the children played\nR: despite the light rain\nS: until sunset\n\nStep 1: Find the subject-verb core: Q ('the children played'). This is the start.\nStep 2: Connect location details: P ('in the school playground'). So, Q -> P.\nStep 3: Connect temporal and external conditions: Q -> P -> S -> R ('the children played in the school playground until sunset despite the light rain').\nAnswer: QPSR.",
        hi: "Level: Hard | उदाहरण 3: एक सार्थक वाक्य बनाने के लिए पुनर्व्यवस्थित करें:\nP: in the school playground\nQ: the children played\nR: despite the light rain\nS: until sunset\n\nचरण 1: कर्ता-क्रिया खोजें: Q ('the children played')। यह शुरुआत है।\nचरण 2: स्थान जोड़ें: P ('in the school playground')। यानी, Q -> P।\nचरण 3: समय और बाहरी परिस्थितियाँ जोड़ें: Q -> P -> S -> R।\nउत्तर: QPSR।"
      }
    },
    {
      id: "b_syntax_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Rearrange the sections to form a grammatically correct sentence:\nP: who had studied diligently\nQ: easily cleared the entrance exam\nR: the scholarship students\nS: with outstanding scores",
        hi: "ओलंपियाड चुनौती: व्याकरणिक रूप से सही वाक्य बनाने के लिए वर्गों को पुनर्व्यवस्थित करें:\nP: who had studied diligently\nQ: easily cleared the entrance exam\nR: the scholarship students\nS: with outstanding scores"
      },
      metadata: {
        question: {
          en: "Select the correct order:",
          hi: "सही क्रम चुनें:"
        },
        options: [
          { en: "RPQS", hi: "RPQS" },
          { en: "RPQ", hi: "RPQ" },
          { en: "RPSQ", hi: "RPSQ" },
          { en: "RQPS", hi: "RQPS" }
        ],
        correctIndex: 0,
        solution: {
          en: "The subject is 'the scholarship students' (R). The relative clause 'who had studied diligently' (P) must sit immediately next to the subject noun. Then, the main verb phrase 'easily cleared...' (Q) and finally the adverbial clause 'with outstanding scores' (S). Thus, RPQS is correct.",
          hi: "कर्ता 'the scholarship students' (R) है। संबंधवाचक क्लॉज 'who had studied...' (P) इसके ठीक बाद आना चाहिए। फिर मुख्य क्रिया 'easily cleared...' (Q) और अंत में 'with outstanding scores' (S)। अतः RPQS सही है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_syntax_summary",
      type: "summary",
      content: {
        en: "Syntax & Sentence Logic Summary Card",
        hi: "वाक्य-रचना और वाक्य तर्क समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Syntax is the logic system governing English word placement structures.", hi: "वाक्य-रचना अंग्रेजी शब्द प्लेसमेंट संरचनाओं को नियंत्रित करने वाली तर्क प्रणाली है।" },
          { en: "Verbs must agree in number (singular/plural) with their true grammatical subjects.", hi: "क्रियाओं को संख्या (एकवचन/बहुवचन) में अपने वास्तविक कर्ता के साथ सहमत होना चाहिए।" }
        ],
        shortcuts: [
          { en: "SVO rule: Subject + Verb + Object is the baseline skeleton.", hi: "SVO नियम: कर्ता + क्रिया + कर्म आधारभूत ढांचा है।" },
          { en: "Relative modifiers (who/which/that) always sit next to the noun they refer to.", hi: "संबंधवाचक शब्द हमेशा उस संज्ञा के बगल में बैठते हैं जिसे वे परिभाषित करते हैं।" }
        ],
        mistakesToAvoid: [
          { en: "Do not let intervening prepositional phrases (e.g. 'one of the boys') trick you into choosing the wrong verb number.", hi: "बीच में आने वाले पूर्वसर्ग वाक्यांशों (जैसे 'one of the boys') के कारण गलत क्रिया चुनने की गलती न करें।" }
        ]
      }
    },
    {
      id: "b_syntax_parent",
      type: "parent-note",
      content: {
        en: "Parent Guide for Syntax Logic Puzzles",
        hi: "वाक्य-रचना तर्क पहेलियों के लिए पैरेंट गाइड"
      },
      metadata: {
        whyItMatters: {
          en: "Syntax logic builds verbal analytics and sentence coherence, preparing children for international writing and editing tests.",
          hi: "वाक्य-रचना तर्क मौखिक विश्लेषण और वाक्य सुसंगति का निर्माण करता है, जिससे बच्चे लेखन और संपादन परीक्षाओं के लिए तैयार होते हैं।"
        },
        commonStruggle: {
          en: "Children often structure sentences based on how it sounds, which can be misleading due to common spoken slang.",
          hi: "बच्चे अक्सर वाक्यों की संरचना इस आधार पर करते हैं कि वह सुनने में कैसा लगता है, जो आम बोलचाल की भाषा के कारण भवानी हो सकता है।"
        },
        homeActivity: {
          en: "Write words of a proverb on separate paper cards, mix them up, and have your child rearrange them in under 20 seconds.",
          hi: "एक कहावत के शब्दों को अलग-अलग कागज़ के कार्डों पर लिखें, उन्हें मिला दें, और अपने बच्चे को 20 सेकंड से कम समय में उन्हें फिर से व्यवस्थित करने के लिए कहें।"
        }
      }
    }
  ]
};
