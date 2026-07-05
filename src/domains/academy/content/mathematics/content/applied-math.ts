import { TopicContent } from "../../../core/types";

export const appliedMathContent: TopicContent = {
  id: "topic_applied_math",
  slug: "applied-math",
  version: 3,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Applied Mathematics",
    hi: "व्यावहारिक गणित (Applied Math)"
  },
  category: "Mathematical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_applied_easy", "q_applied_medium", "q_applied_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Handshake Rule: For N people, total handshakes = N * (N - 1) / 2.",
      "Age Rule: Gaps between ages never change over time. If A is 5 years older than B today, A will still be 5 years older in 20 years.",
      "Heads/Legs Rule: Double total heads, then subtract from total legs to find the number of 4-legged animal count divided by 2."
    ],
    quickTricks: [
      "For heads and legs: Goats = (Total Legs - 2 * Total Heads) / 2."
    ]
  },
  blocks: [
    {
      id: "b_applied_hook",
      type: "callout",
      content: {
        en: "Imagine you go to a birthday party with 10 friends. If every single person shakes hands with everyone else exactly once, how many handshakes happen? 100? 90? \n\nNo, it's exactly 45! Want to know how we got that number so fast without counting them one-by-one? Let's crack the code of real-world math logic!",
        hi: "कल्पना कीजिए कि आप 10 दोस्तों के साथ एक बर्थडे पार्टी में जाते हैं। यदि प्रत्येक व्यक्ति बाकी सभी से ठीक एक बार हाथ मिलाता है, तो कुल कितने हैंडशेक होंगे? 100? 90?\n\nनहीं, यह ठीक 45 है! जानना चाहते हैं कि हमने बिना एक-एक करके गिने इतनी जल्दी यह संख्या कैसे प्राप्त की? आइए व्यावहारिक गणित के नियमों को समझें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_applied_eli10",
      type: "callout",
      content: {
        en: "Applied math isn't about memorizing scary equations. It is like using a secret key to solve everyday puzzles—like sharing pizza slices, counting legs on a farm, or calculating ages. We just translate word stories into simple mathematical relationships!",
        hi: "व्यावहारिक गणित का मतलब डरावने समीकरणों को रटना नहीं है। यह रोजमर्रा की पहेलियों को हल करने के लिए एक जादुई कुंजी का उपयोग करने जैसा है—जैसे पिज्जा के टुकड़े साझा करना, खेत में जानवरों के पैरों को गिनना, या उम्र की गणना करना। हम केवल शब्दों की कहानियों को सरल गणितीय संबंधों में बदलते हैं!"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_applied_life",
      type: "callout",
      content: {
        en: "You use this when sharing things, counting scores, or predicting timelines. Knowing how numbers behave in real situations helps you make faster, smarter decisions every day.",
        hi: "आप इसका उपयोग चीजें साझा करने, स्कोर गिनने या समय-सीमा का अनुमान लगाने में करते हैं। वास्तविक स्थितियों में संख्याएं कैसे व्यवहार करती हैं, यह जानने से आपको हर दिन तेजी से और बेहतर निर्णय लेने में मदद मिलती है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_applied_lib_table",
      type: "table",
      content: {
        en: "Core Applied Math Patterns",
        hi: "मुख्य व्यावहारिक गणित पैटर्न"
      },
      metadata: {
        headers: [
          { en: "Pattern Type", hi: "पैटर्न का प्रकार" },
          { en: "Mathematical Formula / Logic", hi: "गणितीय सूत्र / तर्क" },
          { en: "Example Case", hi: "उदाहरण मामला" }
        ],
        rows: [
          [
            { en: "Handshake Puzzle", hi: "हैंडशेक पहेली" },
            { en: "N * (N - 1) / 2", hi: "N * (N - 1) / 2" },
            { en: "8 people = 28 handshakes", hi: "8 लोग = 28 हैंडशेक" }
          ],
          [
            { en: "Heads & Legs", hi: "सिर और पैर" },
            { en: "Goats = (Legs - 2*Heads) / 2", hi: "बकरियां = (पैर - 2*सिर) / 2" },
            { en: "20 heads, 56 legs = 8 goats", hi: "20 सिर, 56 पैर = 8 बकरियां" }
          ],
          [
            { en: "Age Gaps", hi: "आयु का अंतर" },
            { en: "Age difference remains constant", hi: "आयु का अंतर हमेशा स्थिर रहता है" },
            { en: "Father is 30y older always", hi: "पिता हमेशा 30 वर्ष बड़े रहेंगे" }
          ]
        ]
      }
    },
    {
      id: "b_applied_recipe_title",
      type: "heading",
      content: {
        en: "The Handshake Formula Recipe (हैंडशेक फॉर्मूला)",
        hi: "हैंडशेक फॉर्मूला रेसिपी (The Handshake Formula)"
      }
    },
    {
      id: "b_applied_recipe",
      type: "recipe",
      content: {
        en: "Calculate total combinations when everyone connects with everyone else.",
        hi: "जब हर कोई आपस में जुड़ता है तो कुल संयोजनों (combinations) की गणना करें।"
      },
      metadata: {
        steps: [
          {
            en: "Count the total number of people (N). Let's say N = 6.",
            hi: "लोगों की कुल संख्या (N) गिनें। मान लें N = 6।"
          },
          {
            en: "Multiply N by (N - 1). Here, 6 * 5 = 30.",
            hi: "N को (N - 1) से गुणा करें। यहाँ, 6 * 5 = 30।"
          },
          {
            en: "Divide the result by 2 (since a handshake takes 2 people). 30 / 2 = 15 total handshakes.",
            hi: "परिणाम को 2 से विभाजित करें (क्योंकि एक हैंडशेक में 2 लोग लगते हैं)। 30 / 2 = 15 कुल हैंडशेक।"
          }
        ]
      }
    },
    {
      id: "b_applied_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_applied_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Raman is twice as old as Amit. If Amit is 8 years old today, how old will Raman be in 5 years?\n\nStep 1: Calculate Raman's current age. Raman = 2 * Amit = 16 years.\nStep 2: Add 5 years to Raman's current age. Raman in 5 years = 16 + 5 = 21 years.\nShortcut: Age gaps are constant. Amit grows by 5, Raman grows by 5. Answer is 21.",
        hi: "Level: Easy | उदाहरण 1: रमन की आयु अमित की आयु से दोगुनी है। यदि अमित आज 8 वर्ष का है, तो 5 वर्ष बाद रमन कितने वर्ष का होगा?\n\nचरण 1: रमन की वर्तमान आयु ज्ञात करें। रमन = 2 * अमित = 16 वर्ष।\nचरण 2: रमन की वर्तमान आयु में 5 वर्ष जोड़ें। 5 वर्ष में रमन = 16 + 5 = 21 वर्ष।\nउत्तर: 21 वर्ष।"
      }
    },
    {
      id: "b_applied_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Solve heads & legs puzzle: 10 animals (chickens & goats) have 28 legs. How many goats?\n\nStep 1: Assume all 10 animals are chickens. They would have 10 * 2 = 20 legs.\nStep 2: Find extra legs. 28 - 20 = 8 extra legs. These belong to goats.\nStep 3: Goats have 4 legs (2 more than chickens). Goats = 8 / 2 = 4 goats.",
        hi: "Level: Medium | उदाहरण 2: सिर और पैर की पहेली हल करें: 10 जानवरों (मुर्गियों और बकरियों) के 28 पैर हैं। बकरियां कितनी हैं?\n\nचरण 1: मान लें कि सभी 10 जानवर मुर्गियां हैं। उनके 10 * 2 = 20 पैर होते।\nचरण 2: अतिरिक्त पैर खोजें। 28 - 20 = 8 अतिरिक्त पैर। ये बकरियों के हैं।\nचरण 3: बकरियों की संख्या = 8 / 2 = 4 बकरियां।"
      }
    },
    {
      id: "b_applied_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: At a business conference, 12 participants shake hands with each other. How many handshakes will take place in total?\n\nStep 1: Identify N = 12.\nStep 2: Apply formula: Total = N * (N - 1) / 2 = 12 * 11 / 2.\nStep 3: 132 / 2 = 66 handshakes.\nAnswer: 66.",
        hi: "Level: Hard | उदाहरण 3: एक व्यावसायिक सम्मेलन में, 12 प्रतिभागी एक-दूसरे से हाथ मिलाते हैं। कुल कितने हैंडशेक होंगे?\n\nचरण 1: N = 12.\nचरण 2: सूत्र लागू करें: कुल = N * (N - 1) / 2 = 12 * 11 / 2.\nचरण 3: 132 / 2 = 66.\nउत्तर: 66."
      }
    },
    {
      id: "b_applied_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: In a class, some students shake hands with each other. If the total number of handshakes is 105, how many students are there in the class?",
        hi: "ओलंपियाड चुनौती: एक कक्षा में, कुछ छात्र एक-दूसरे से हाथ मिलाते हैं। यदि हैंडशेक की कुल संख्या 105 है, तो कक्षा में कितने छात्र हैं?"
      },
      metadata: {
        question: {
          en: "Calculate the value of N:",
          hi: "N का मान ज्ञात करें:"
        },
        options: [
          { en: "14 students", hi: "14 छात्र" },
          { en: "15 students", hi: "15 छात्र" },
          { en: "16 students", hi: "16 छात्र" },
          { en: "20 students", hi: "20 छात्र" }
        ],
        correctIndex: 1,
        solution: {
          en: "Apply formula: N * (N - 1) / 2 = 105 => N * (N - 1) = 210. Since 15 * 14 = 210, N must be 15.",
          hi: "सूत्र लागू करें: N * (N - 1) / 2 = 105 => N * (N - 1) = 210. चूंकि 15 * 14 = 210, इसलिए N का मान 15 होना चाहिए।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_applied_summary",
      type: "summary",
      content: {
        en: "Applied Mathematics Summary Card",
        hi: "व्यावहारिक गणित समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Applied math translates word puzzles into arithmetic equations.", hi: "व्यावहारिक गणित शब्द पहेली को अंकगणितीय समीकरणों में बदलता है।" },
          { en: "Key areas: age gaps, handshake combinations, and animal leg counts.", hi: "मुख्य क्षेत्र: आयु अंतर, हैंडशेक संयोजन और पशु पैरों की संख्या।" }
        ],
        shortcuts: [
          { en: "Handshakes total is always N * (N - 1) / 2.", hi: "हैंडशेक की कुल संख्या हमेशा N * (N - 1) / 2 होती है।" },
          { en: "Remember that age gaps are constant across any number of years.", hi: "याद रखें कि कितने भी वर्षों में आयु का अंतर हमेशा स्थिर रहता है।" }
        ],
        mistakesToAvoid: [
          { en: "Don't count double for handshakes. A shaking hands with B is the same as B shaking hands with A.", hi: "हैंडशेक के लिए दोबारा गिनती न करें। A का B से हाथ मिलाना वही है जो B का A से हाथ मिलाना है।" }
        ]
      }
    },
    {
      id: "b_applied_parent",
      type: "parent-note",
      content: {
        en: "Parent Audit Guide for Applied Math Puzzles",
        hi: "व्यावहारिक गणित पहेलियों के लिए पैरेंट गाइड"
      },
      metadata: {
        whyItMatters: {
          en: "Applied math builds logical modeling skills. It teaches children how to turn real situations into solvable math equations.",
          hi: "व्यावहारिक गणित तार्किक मॉडल बनाने के कौशल का निर्माण करता है। यह बच्चों को वास्तविक स्थितियों को हल करने योग्य गणितीय समीकरणों में बदलना सिखाता है।"
        },
        commonStruggle: {
          en: "Children often try to guess answers by trial and error instead of writing down relationships.",
          hi: "बच्चे अक्सर संबंध लिखने के बजाय प्रयास और त्रुटि (trial and error) द्वारा उत्तरों का अनुमान लगाने का प्रयास करते हैं।"
        },
        homeActivity: {
          en: "Count heads and legs of family members and pets at home, or ask handshake questions when guests visit.",
          hi: "घर पर परिवार के सदस्यों और पालतू जानवरों के सिर और पैर गिनें, या मेहमानों के आने पर हैंडशेक के प्रश्न पूछें।"
        }
      }
    }
  ]
};
