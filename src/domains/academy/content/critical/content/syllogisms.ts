import { TopicContent } from "../../../core/types";

export const syllogismsContent: TopicContent = {
  id: "topic_syllogisms",
  slug: "syllogisms",
  version: 3,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Syllogisms",
    hi: "न्यायशास्त्र (Syllogisms)"
  },
  category: "Analytical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_crit_syll_easy", "q_crit_syll_medium", "q_crit_syll_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Venn Diagrams: Draw circles to represent each group. Overlapping circles show 'Some', nested circles show 'All', separate circles show 'No'.",
      "Avoid Real-world assumptions: If statement says 'All dogs are birds', accept it as 100% true for the puzzle logic.",
      "Check all possibilities: A conclusion is only valid if it is true in EVERY possible Venn diagram combination."
    ],
    quickTricks: [
      "If a conclusion says 'Some A are B', check if the circles of A and B MUST overlap in all scenarios. If they can be separated, the conclusion is invalid!"
    ]
  },
  blocks: [
    {
      id: "b_syll_hook",
      type: "callout",
      content: {
        en: "If all birds have wings, and all eagles are birds, does it mean all eagles have wings? Yes! \n\nBut what if we say: All carrots are orange, and some oranges are fruits. Can we conclude that some carrots are fruits? No! \n\nSyllogisms are logical equations made of words. Let's learn how to draw secret circles to solve them without any confusion!",
        hi: "यदि सभी पक्षियों के पंख होते हैं, और सभी बाज पक्षी हैं, तो क्या इसका मतलब यह है कि सभी बाजों के पंख होते हैं? हाँ!\n\nलेकिन क्या होगा यदि हम कहें: सभी गाजर नारंगी हैं, और कुछ संतरे फल हैं। क्या हम यह निष्कर्ष निकाल सकते हैं कि कुछ गाजर फल हैं? नहीं!\n\nन्यायशास्त्र (Syllogisms) शब्दों से बने तार्किक समीकरण हैं। आइए बिना किसी भ्रम के उन्हें हल करने के लिए जादुई गोले बनाना सीखें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_syll_eli10",
      type: "callout",
      content: {
        en: "Syllogisms are statement puzzles. They give you 2 or 3 facts (premises) and ask you to test if a conclusion must be true. The facts might sound silly (like 'All tables are cats'), but you must treat them as absolute truth. We use circular boundaries (Venn diagrams) to see where groups overlap!",
        hi: "न्यायशास्त्र कथन वाली पहेलियाँ हैं। वे आपको 2 या 3 तथ्य देते हैं और आपसे परीक्षण करने के लिए कहते हैं कि क्या कोई निष्कर्ष सही होना चाहिए। तथ्य अजीब लग सकते हैं (जैसे 'सभी टेबल बिल्लियाँ हैं'), लेकिन आपको उन्हें पूर्ण सत्य मानना होगा।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_syll_life",
      type: "callout",
      content: {
        en: "Syllogism tests your ability to form valid logical conclusions. It is the basis of sorting data, programming conditional checks (if/else), and avoiding incorrect assumptions in real life.",
        hi: "न्यायशास्त्र वैध तार्किक निष्कर्ष बनाने की आपकी क्षमता का परीक्षण करता है। यह डेटा को सॉर्ट करने, प्रोग्रामिंग में कंडीशनल चेक (if/else) लगाने और असल जिंदगी में गलत धारणाओं से बचने का आधार है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_syll_lib_table",
      type: "table",
      content: {
        en: "Syllogism Statement Maps",
        hi: "न्यायशास्त्र कथन मानचित्र"
      },
      metadata: {
        headers: [
          { en: "Statement", hi: "कथन" },
          { en: "Venn Layout", hi: "वेन लेआउट" },
          { en: "Logical Meaning", hi: "तार्किक अर्थ" }
        ],
        rows: [
          [
            { en: "All A are B", hi: "सभी A, B हैं" },
            { en: "Circle A is completely inside circle B", hi: "गोला A पूरी तरह से गोले B के अंदर है" },
            { en: "Every single A belongs to B", hi: "प्रत्येक A, B का हिस्सा है" }
          ],
          [
            { en: "Some A are B", hi: "कुछ A, B हैं" },
            { en: "Circle A intersects/overlaps with circle B", hi: "गोला A, गोले B के साथ ओवरलैप करता है" },
            { en: "At least one A is also B", hi: "कम से कम एक A, B भी है" }
          ],
          [
            { en: "No A is B", hi: "कोई A, B नहीं है" },
            { en: "Circle A and circle B are fully separate", hi: "गोला A और गोला B पूरी तरह अलग हैं" },
            { en: "Zero overlap between A and B", hi: "A और B के बीच शून्य ओवरलैप" }
          ]
        ]
      }
    },
    {
      id: "b_syll_recipe_title",
      type: "heading",
      content: {
        en: "Venn Diagram Logic Recipe (वेन आरेख विधि)",
        hi: "वेन आरेख विधि रेसिपी (Venn Diagram Logic)"
      }
    },
    {
      id: "b_syll_recipe",
      type: "recipe",
      content: {
        en: "Follow these steps to draw Venn diagrams for any syllogism statements.",
        hi: "किसी भी न्यायशास्त्र कथनों के लिए वेन आरेख बनाने के लिए इन चरणों का पालन करें।"
      },
      metadata: {
        steps: [
          {
            en: "For 'All A are B', draw a small circle A completely inside a larger circle B.",
            hi: "'सभी A, B हैं' के लिए, एक छोटा गोला A पूरी तरह से एक बड़े गोले B के अंदर बनाएं।"
          },
          {
            en: "For 'Some A are B', draw circles A and B overlapping like a link chain.",
            hi: "'कुछ A, B हैं' के लिए, गोले A and B को एक जंजीर की तरह आपस में काटते हुए बनाएं।"
          },
          {
            en: "For 'No A is B', draw circles A and B completely separated with space in between.",
            hi: "'कोई A, B नहीं है' के लिए, गोले A और B को बीच में जगह रखकर पूरी तरह से अलग बनाएं।"
          },
          {
            en: "Test the conclusions: If a conclusion is false in even one valid drawing, it is logically invalid.",
            hi: "निष्कर्षों का परीक्षण करें: यदि कोई निष्कर्ष किसी एक भी वैध चित्र में गलत साबित होता है, तो वह तार्किक रूप से अमान्य है।"
          }
        ]
      }
    },
    {
      id: "b_syll_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_syll_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Statements: 1. All mangoes are fruits. 2. All fruits are sweet. Conclusion: All mangoes are sweet.\n\nStep 1: Draw circle 'Mangoes' completely inside 'Fruits'.\nStep 2: Draw circle 'Fruits' completely inside 'Sweet'.\nStep 3: Since 'Mangoes' is inside 'Fruits' and 'Fruits' is inside 'Sweet', 'Mangoes' is definitely inside 'Sweet'.\nAnswer: Valid.",
        hi: "Level: Easy | उदाहरण 1: कथन: 1. सभी आम फल हैं। 2. सभी फल मीठे हैं। निष्कर्ष: सभी आम मीठे हैं।\n\nचरण 1: 'Mangoes' का गोला पूरी तरह से 'Fruits' के अंदर बनाएं।\nचरण 2: 'Fruits' का गोला पूरी तरह से 'Sweet' के अंदर बनाएं।\nचरण 3: चूंकि आम फलों के अंदर हैं और फल मीठे के अंदर हैं, आम निश्चित रूप से मीठे के अंदर हैं।\nउत्तर: मान्य।"
      }
    },
    {
      id: "b_syll_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Statements: 1. All pencils are pens. 2. No pen is a ruler. Conclusion: No pencil is a ruler.\n\nStep 1: Draw circle 'Pencils' inside 'Pens'.\nStep 2: Draw circle 'Rulers' fully separate from 'Pens'.\nStep 3: Since 'Pencils' is fully inside 'Pens', and no 'Pen' can touch 'Ruler', 'Pencil' can never touch 'Ruler' either.\nAnswer: Valid.",
        hi: "Level: Medium | उदाहरण 2: कथन: 1. सभी पेंसिल पेन हैं। 2. कोई पेन रूलर नहीं है। निष्कर्ष: कोई पेंसिल रूलर नहीं है।\n\nचरण 1: 'Pencils' का गोला 'Pens' के अंदर बनाएं।\nचरण 2: 'Rulers' का गोला 'Pens' से पूरी तरह अलग बनाएं।\nचरण 3: चूंकि पेंसिलें पेन के अंदर हैं, और कोई भी पेन रूलर से नहीं मिल सकता, इसलिए पेंसिलें भी कभी रूलर से नहीं मिल सकतीं।\nउत्तर: मान्य।"
      }
    },
    {
      id: "b_syll_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Statements: 1. Some keys are locks. 2. Some locks are doors. Conclusion: Some keys are doors.\n\nStep 1: Draw 'Keys' overlapping with 'Locks'.\nStep 2: Draw 'Doors' overlapping with 'Locks'. We can draw 'Doors' such that it does not touch 'Keys' at all.\nStep 3: Since there is a possible Venn diagram where 'Keys' and 'Doors' do not touch, the conclusion is invalid.\nAnswer: Invalid.",
        hi: "Level: Hard | उदाहरण 3: कथन: 1. कुछ चाबियां ताले हैं। 2. कुछ ताले दरवाजे हैं। निष्कर्ष: कुछ चाबियां दरवाजे हैं।\n\nचरण 1: 'Keys' और 'Locks' को काटते हुए बनाएं।\nचरण 2: 'Doors' और 'Locks' को काटते हुए बनाएं, लेकिन इस तरह कि 'Doors' 'Keys' को बिल्कुल न छुए।\nचरण 3: चूंकि एक ऐसा चित्र संभव है जहां चाबी और दरवाजे आपस में नहीं मिलते, इसलिए निष्कर्ष अमान्य है।\nउत्तर: अमान्य।"
      }
    },
    {
      id: "b_syll_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Statements:\n1. All squares are rectangles.\n2. All rectangles are polygons.\n3. Some polygons are circles.\nConclusions:\nI. All squares are polygons.\nII. Some squares are circles.",
        hi: "ओलंपियाड चुनौती: कथन:\n1. सभी वर्ग आयत हैं।\n2. सभी आयत बहुभुज (polygons) हैं।\n3. कुछ बहुभुज वृत्त हैं।\nनिष्कर्ष:\nI. सभी वर्ग बहुभुज हैं।\nII. कुछ वर्ग वृत्त हैं।"
      },
      metadata: {
        question: {
          en: "Evaluate the conclusions:",
          hi: "निष्कर्षों का मूल्यांकन करें:"
        },
        options: [
          { en: "Only conclusion I follows", hi: "केवल निष्कर्ष I सही है" },
          { en: "Only conclusion II follows", hi: "केवल निष्कर्ष II सही है" },
          { en: "Both conclusions I and II follow", hi: "निष्कर्ष I और II दोनों सही हैं" },
          { en: "Neither conclusion follows", hi: "कोई भी निष्कर्ष सही नहीं है" }
        ],
        correctIndex: 0,
        solution: {
          en: "Since squares are inside rectangles and rectangles are inside polygons, all squares must be inside polygons (I is valid). Circles overlap with polygons but don't necessarily have to touch squares (II is invalid). Only I follows.",
          hi: "चूंकि वर्ग आयत के अंदर हैं और आयत बहुभुज के अंदर हैं, इसलिए सभी वर्ग बहुभुज के अंदर होने चाहिए (निष्कर्ष I सही है)। वृत्त बहुभुज से ओवरलैप करते हैं लेकिन आवश्यक नहीं कि वे वर्ग को स्पर्श करें (निष्कर्ष II गलत है)।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_syll_summary",
      type: "summary",
      content: {
        en: "Syllogisms Summary Card",
        hi: "न्यायशास्त्र समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Syllogisms use formal logic rules to test if a conclusion follows from given premises.", hi: "न्यायशास्त्र कथनों से किसी निष्कर्ष के निकलने की वैधता का परीक्षण करता है।" },
          { en: "Always trust the statements as absolute truth, even if they run against real-world facts.", hi: "कथनों को हमेशा पूर्ण सत्य मानें, भले ही वे वास्तविक दुनिया के तथ्यों के विपरीत हों।" }
        ],
        shortcuts: [
          { en: "Venn circles: All = Nesting, Some = Overlapping, No = Separate.", hi: "वेन आरेख: सभी = घोंसला (नेस्टिंग), कुछ = ओवरलैपिंग, कोई नहीं = अलग।" },
          { en: "Draw the minimum overlap scenario to test if a conclusion can be disproven.", hi: "निष्कर्ष को गलत सिद्ध करने के लिए न्यूनतम ओवरलैप परिदृश्य का चित्र बनाएं।" }
        ],
        mistakesToAvoid: [
          { en: "Do not accept a 'Some' relation as true if the circles can possibly be drawn fully separated.", hi: "यदि आरेखों को पूरी तरह से अलग बनाया जा सकता है, तो 'कुछ' वाले निष्कर्ष को सही न मानें।" }
        ]
      }
    },
    {
      id: "b_syll_parent",
      type: "parent-note",
      content: {
        en: "Parent Guide for Syllogism Puzzles",
        hi: "न्यायशास्त्र पहेलियों के लिए पैरेंट गाइड"
      },
      metadata: {
        whyItMatters: {
          en: "Syllogisms build deductive analytics. It prevents children from making false generalizations and logic loops.",
          hi: "न्यायशास्त्र कटौतीत्मक विश्लेषण का निर्माण करता है। यह बच्चों को गलत सामान्यीकरण और तार्किक लूप बनाने से रोकता है।"
        },
        commonStruggle: {
          en: "Children often answer based on real-world facts (e.g. arguing that cats cannot be tables) instead of adhering to the rules of the puzzle.",
          hi: "बच्चे अक्सर वास्तविक दुनिया के तथ्यों के आधार पर उत्तर देते हैं (जैसे कि बिल्लियाँ मेज नहीं हो सकतीं) बजाय इसके कि पहेली के नियमों का पालन करें।"
        },
        homeActivity: {
          en: "Draw overlapping rings with colored plates on the table, label them (e.g., Round things, Red things), and place fruits inside to visualize intersection logic.",
          hi: "मेज पर रंगीन प्लेटों के साथ ओवरलैपिंग रिंग बनाएं, उन्हें लेबल करें (जैसे, गोल चीजें, लाल चीजें), और प्रतिच्छेदन (intersection) को समझने के लिए फल अंदर रखें।"
        }
      }
    }
  ]
};
