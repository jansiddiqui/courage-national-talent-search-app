import { TopicContent } from "../../../core/types";

export const prepositionsConjunctionsContent: TopicContent = {
  id: "topic_prepositions_conjunctions",
  slug: "prepositions-conjunctions",
  version: 2,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Prepositions & Conjunctions",
    hi: "पूर्वसर्ग और संयोजक (Prepositions & Conjunctions)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_prep_easy", "q_prep_medium", "q_prep_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Prepositions of Place: Use 'at' for specific points (at the door), 'in' for enclosed spaces (in the room), and 'on' for surfaces (on the table).",
      "Correlative Conjunctions: Always keep standard pairings together, e.g., 'neither... nor', 'either... or', 'not only... but also'.",
      "Conjunction Switch: Use 'although' to connect contrasting ideas. Do not use 'but' in the same sentence as 'although'."
    ],
    quickTricks: [
      "Check pairings! If you see 'neither' in a sentence, the connector MUST be 'nor', never 'or'."
    ]
  },
  blocks: [
    {
      id: "b_prep_hook",
      type: "callout",
      content: {
        en: "What is the difference between 'The key is on the table' and 'The key is under the table'? Just one small word, but the location changes completely! \n\nPrepositions and conjunctions are the glue of sentences. They tell us WHERE things are and HOW thoughts connect. Let's learn how to glue our words together perfectly!",
        hi: "क्या अंतर है 'The key is on the table' और 'The key is under the table' में? केवल एक छोटा सा शब्द, लेकिन स्थान पूरी तरह से बदल जाता है!\n\nपूर्वसर्ग (Prepositions) और संयोजक (Conjunctions) वाक्यों के गोंद की तरह हैं। वे हमें बताते हैं कि चीजें कहाँ हैं और विचार कैसे जुड़ते हैं। आइए अपने शब्दों को पूरी तरह से जोड़ना सीखें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_prep_eli10",
      type: "callout",
      content: {
        en: "Prepositions are like spatial pointers—they tell you if an object is above, below, inside, or next to something. Conjunctions are like bridges—they connect two independent thoughts (e.g. 'I was hungry' AND 'I ate pizza'). Using the correct connectors makes sentences smooth and logical.",
        hi: "पूर्वसर्ग (Prepositions) स्थानिक संकेतकों की तरह हैं—वे आपको बताते हैं कि कोई वस्तु किसी चीज़ के ऊपर, नीचे, अंदर या उसके बगल में है। संयोजक (Conjunctions) पुलों की तरह हैं—वे दो स्वतंत्र विचारों को जोड़ते हैं।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_prep_life",
      type: "callout",
      content: {
        en: "You use this when giving directions, describing locations, or explaining reasons. Using correct prepositions makes you sound professional and prevents misunderstandings.",
        hi: "आप इसका उपयोग निर्देश देने, स्थानों का वर्णन करने या कारणों को समझाने में करते हैं। सही पूर्वसर्गों का उपयोग करने से आप पेशेवर लगते हैं और गलतफहमियों से बचाव होता है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_prep_recipe_title",
      type: "heading",
      content: {
        en: "Preposition of Time & Place Recipe (समय और स्थान नियम)",
        hi: "समय और स्थान के पूर्वसर्गों की रेसिपी (Time & Place Rules)"
      }
    },
    {
      id: "b_prep_recipe",
      type: "recipe",
      content: {
        en: "Apply these guidelines to choose between 'at', 'in', and 'on'.",
        hi: "इन नियमों का पालन करके 'at', 'in', और 'on' के बीच सही चयन करें।"
      },
      metadata: {
        steps: [
          {
            en: "For SPECIFIC points of time or place, use 'at' (e.g., at 5:00 PM, at the bus stop).",
            hi: "समय या स्थान के विशिष्ट बिंदुओं के लिए 'at' का उपयोग करें (जैसे, सुबह 5:00 बजे, बस स्टॉप पर)।"
          },
          {
            en: "For DAYS and DATES or flat surfaces, use 'on' (e.g., on Monday, on July 15, on the floor).",
            hi: "दिनों और तारीखों या समतल सतहों के लिए 'on' का उपयोग करें (जैसे, सोमवार को, फर्श पर)।"
          },
          {
            en: "For MONTHS, YEARS, or enclosed boundaries, use 'in' (e.g., in 2026, in summer, in the box).",
            hi: "महीनों, वर्षों या घिरे हुए स्थानों के लिए 'in' का उपयोग करें (जैसे, 2026 में, बॉक्स में)।"
          }
        ]
      }
    },
    {
      id: "b_prep_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_prep_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: He is sitting ________ the chair. (in/on)\n\nStep 1: Check the surface connection. A chair usually has flat surfaces and sometimes boundaries.\nStep 2: Since it is a flat chair surface without high side boundaries, we say 'on'.\nAnswer: on.",
        hi: "Level: Easy | उदाहरण 1: He is sitting ________ the chair. (in/on)\n\nउत्तर: on (समतल सतह के लिए)।"
      }
    },
    {
      id: "b_prep_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Complete: '________ Raman ________ Amit completed the assignment, so both received low grades.'\n\nStep 1: The clue 'both received low grades' means neither completed it.\nStep 2: Use correlative pair: 'Neither... nor'.\nAnswer: Neither... nor.",
        hi: "Level: Medium | उदाहरण 2: '________ Raman ________ Amit completed the assignment, so both received low grades.' को पूरा करें।\n\nचरण 1: सुराग 'दोनों को कम ग्रेड मिले' से पता चलता है कि किसी ने भी काम पूरा नहीं किया।\nचरण 2: 'Neither... nor' जोड़ी का उपयोग करें।\nउत्तर: Neither... nor।"
      }
    },
    {
      id: "b_prep_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Identify the mistake: 'Although she was tired, but she finished her project.'\n\nStep 1: 'Although' and 'but' represent the same contrast.\nStep 2: Using both in a single sentence is redundant. We should remove 'but'.\nAnswer: Remove 'but'. Correct: 'Although she was tired, she finished her project.'",
        hi: "Level: Hard | उदाहरण 3: गलती पहचानें: 'Although she was tired, but she finished her project.'\n\nचरण 1: 'Although' और 'but' दोनों एक ही विरोधाभास को दिखाते हैं। एक साथ उपयोग करना व्याकरणिक रूप से गलत है।\nचरण 2: 'but' को हटा दें। सही: 'Although she was tired, she finished her project.'\nउत्तर: 'but' को हटाएं।"
      }
    },
    {
      id: "b_prep_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Fill in the blanks: 'The principal sat ________ the desk while the student stood ________ the door, waiting for an explanation.'",
        hi: "ओलंपियाड चुनौती: रिक्त स्थान भरें: 'The principal sat ________ the desk while the student stood ________ the door, waiting for an explanation.'"
      },
      metadata: {
        question: {
          en: "Select the correct pair:",
          hi: "सही जोड़ी चुनें:"
        },
        options: [
          { en: "on, in", hi: "on, in" },
          { en: "at, at", hi: "at, at" },
          { en: "in, on", hi: "in, on" },
          { en: "under, at", hi: "under, at" }
        ],
        correctIndex: 1,
        solution: {
          en: "We sat 'at a desk' to do work (point of activity). A student stands 'at the door' (specific location point). Thus, 'at, at' is the correct pair.",
          hi: "हम काम करने के लिए 'at a desk' बैठते हैं। छात्र 'at the door' (विशिष्ट स्थान बिंदु) पर खड़ा है। अतः 'at, at' सही जोड़ी है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_prep_summary",
      type: "summary",
      content: {
        en: "Prepositions and Conjunctions Summary Card",
        hi: "पूर्वसर्ग और संयोजक समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Prepositions express physical or temporal positions of nouns.", hi: "पूर्वसर्ग संज्ञाओं की भौतिक या लौकिक स्थितियों को व्यक्त करते हैं।" },
          { en: "Conjunctions bridge phrases and clauses together logically.", hi: "संयोजक वाक्यांशों और उपवाक्यों को तार्किक रूप से जोड़ते हैं।" }
        ],
        shortcuts: [
          { en: "At (specific clock time), On (day/date), In (month/year/season).", hi: "At (विशिष्ट समय), On (दिन/तारीख), In (महीना/वर्ष)।" },
          { en: "Neither-Nor, Either-Or, Not Only-But Also are inseparable pairs.", hi: "Neither-Nor, Either-Or, Not Only-But Also अविभाज्य जोड़े हैं।" }
        ],
        mistakesToAvoid: [
          { en: "Never use 'but' in the same clause after using 'Although'.", hi: "'Although' का उपयोग करने के बाद उसी क्लॉज में 'but' का उपयोग कभी न करें।" }
        ]
      }
    },
    {
      id: "b_prep_parent",
      type: "parent-note",
      content: {
        en: "Connectors and Preposition Precision",
        hi: "संयोजक और पूर्वसर्ग सटीकता कौशल"
      },
      metadata: {
        whyItMatters: {
          en: "Grammatical connectors form the baseline of argument flow. Logical sentence linking is essential for structured verbal analysis tests.",
          hi: "व्याकरणिक संयोजक तर्क प्रवाह की आधारशिला हैं। संरचित मौखिक विश्लेषण के लिए वाक्यों का सही संबंध आवश्यक है।"
        },
        commonStruggle: {
          en: "Children often map preposition rules directly from their native language, leading to literal translation errors.",
          hi: "बच्चे अक्सर पूर्वसर्ग नियमों को अपनी मातृभाषा से सीधे अनुवाद करते हैं, जिससे गलतियाँ होती हैं।"
        },
        homeActivity: {
          en: "Play 'Connector Switch': start sentences with 'Because...', 'Although...', 'Unless...' and let your child finish them correctly.",
          hi: "घर पर 'संयोजक स्विच' का खेल खेलें: 'Because...', 'Although...' जैसे शब्दों से वाक्य शुरू करें और अपने बच्चे से उसे पूरा करवाएं।"
        }
      }
    }
  ]
};
