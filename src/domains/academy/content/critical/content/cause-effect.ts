import { TopicContent } from "../../../core/types";

export const causeEffectContent: TopicContent = {
  id: "topic_cause_effect",
  slug: "cause-effect",
  version: 3,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Cause & Effect",
    hi: "कार्य-कारण संबंध (Cause & Effect)"
  },
  category: "Analytical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_crit_cause_easy", "q_crit_cause_medium", "q_crit_cause_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Timeline check: The Cause is the trigger event that happens first. The Effect is the result that happens because of the cause.",
      "Check connection: If two statements are related, one must directly lead to the other (e.g. rain -> waterlogging).",
      "Common Cause: Sometimes both statements are effects of a single hidden event (e.g. storm -> closed shops AND fallen trees)."
    ],
    quickTricks: [
      "Use 'BECAUSE' test! Read: 'Statement A happened BECAUSE of Statement B'. If this sounds logical, B is cause and A is effect."
    ]
  },
  blocks: [
    {
      id: "b_cause_hook",
      type: "callout",
      content: {
        en: "If you drop a glass and it breaks, dropping the glass is the cause, and the broken glass is the effect! \n\nIn talent exams, statements are not always that simple. You might read about government policies, price rises, or weather shifts. Let's learn how to apply the 'Because Test' to trace these event chains easily!",
        hi: "यदि आप एक कांच का गिलास गिराते हैं और वह टूट जाता है, तो गिलास का गिरना 'कारण' है, और टूटना 'प्रभाव' है!\n\nप्रतिभा परीक्षाओं में कथन हमेशा इतने सरल नहीं होते। आप सरकारी नीतियों, मूल्य वृद्धि, या मौसम में बदलाव के बारे में पढ़ सकते हैं। आइए इन घटना चक्रों को आसानी से समझने के लिए 'बिकॉज टेस्ट' (Because Test) लागू करना सीखें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_cause_eli10",
      type: "callout",
      content: {
        en: "Cause and effect is about finding the 'Why' behind events. A Cause is a trigger (like pulling a domino block), and an Effect is the chain reaction (the falling blocks). Our job is to look at two statements and decide which one is the trigger, and which one is the reaction.",
        hi: "कार्य-कारण संबंध घटनाओं के पीछे के 'क्यों' को खोजने के बारे में है। एक कारण (Cause) एक ट्रिगर है, और एक प्रभाव (Effect) उसकी श्रृंखला प्रतिक्रिया (chain reaction) है।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_cause_life",
      type: "callout",
      content: {
        en: "Understanding cause-effect linkages helps you analyze news articles, evaluate business trends, and solve science problems. It teaches you to trace why things happen in the world.",
        hi: "कार्य-कारण संबंधों को समझने से आपको समाचारों का विश्लेषण करने, व्यावसायिक रुझानों का मूल्यांकन करने और विज्ञान की समस्याओं को हल करने में मदद मिलती है। यह आपको यह पता लगाना सिखाता है कि दुनिया में चीजें क्यों होती हैं।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_cause_lib_table",
      type: "table",
      content: {
        en: "Relationship Modes in Cause & Effect",
        hi: "कार्य-कारण संबंधों में संबंध मोड"
      },
      metadata: {
        headers: [
          { en: "Relation Mode", hi: "संबंध मोड" },
          { en: "Logical Formula / Connection", hi: "तार्किक कनेक्शन" },
          { en: "Example Case", hi: "उदाहरण मामला" }
        ],
        rows: [
          [
            { en: "Direct Linkage", hi: "सीधा संबंध" },
            { en: "Statement A directly triggers Statement B", hi: "कथन A सीधे कथन B को ट्रिगर करता है" },
            { en: "Heavy rain (cause) -> School closed (effect)", hi: "भारी बारिश (कारण) -> स्कूल बंद (प्रभाव)" }
          ],
          [
            { en: "Common Cause", hi: "सामान्य कारण" },
            { en: "Both statements occur because of a single hidden event", hi: "दोनों कथन एक ही छिपी हुई घटना के कारण होते हैं" },
            { en: "Cyclone -> Flights delayed AND power cut", hi: "चक्रवात -> उड़ानें निलंबित और बिजली गुल" }
          ],
          [
            { en: "Independent Causes", hi: "स्वतंत्र कारण" },
            { en: "Statements have zero logical connection", hi: "कथनों के बीच शून्य तार्किक संबंध है" },
            { en: "Inflation in India AND wheat crop failure in Canada", hi: "भारत में मुद्रास्फीति और कनाडा में गेहूं की फसल खराब होना" }
          ]
        ]
      }
    },
    {
      id: "b_cause_recipe_title",
      type: "heading",
      content: {
        en: "The Because Test Recipe (बिकॉज टेस्ट विधि)",
        hi: "बिकॉज टेस्ट विधि रेसिपी (The Because Test)"
      }
    },
    {
      id: "b_cause_recipe",
      type: "recipe",
      content: {
        en: "Use this connection check to identify cause-effect linkages in statements.",
        hi: "कथनों में कार्य-कारण संबंधों की पहचान करने के लिए इस कनेक्शन जाँच विधि का उपयोग करें।"
      },
      metadata: {
        steps: [
          {
            en: "Read Statement I and Statement II separately.",
            hi: "कथन I और कथन II को अलग-अलग पढ़ें।"
          },
          {
            en: "Test Link 1: Read: '[Statement I] happened BECAUSE [Statement II]'. See if this makes logical sense.",
            hi: "लिंक 1 का परीक्षण करें: पढ़ें: '[कथन I] हुआ क्योंकि [कथन II]'। देखें कि क्या यह तार्किक रूप से समझ में आता है।"
          },
          {
            en: "Test Link 2: Read: '[Statement II] happened BECAUSE [Statement I]'. Compare which link sounds more natural.",
            hi: "लिंक 2 का परीक्षण करें: पढ़ें: '[कथन II] हुआ क्योंकि [कथन I]'। तुलना करें कि कौन सा लिंक अधिक स्वाभाविक लगता है।"
          },
          {
            en: "If Link 1 is true, II is cause. If Link 2 is true, I is cause. If neither is true, check for a common external cause.",
            hi: "यदि लिंक 1 सही है, तो II कारण है। यदि लिंक 2 सही है, तो I कारण है। यदि कोई भी सही नहीं है, तो एक सामान्य बाहरी कारण की जाँच करें।"
          }
        ]
      }
    },
    {
      id: "b_cause_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_cause_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Statement I: School cancelled classes today. Statement II: Severe waterlogging occurred across the city.\n\nStep 1: Test Link 1: 'School cancelled classes BECAUSE severe waterlogging occurred.' (Highly logical!).\nStep 2: Test Link 2: 'Severe waterlogging occurred BECAUSE school cancelled classes.' (Gibberish!).\nAnswer: Statement II is cause, I is effect.",
        hi: "Level: Easy | उदाहरण 1: कथन I: स्कूल ने आज कक्षाएं रद्द कर दीं। कथन II: पूरे शहर में गंभीर जलभराव हुआ।\n\nचरण 1: लिंक 1 परीक्षण: 'स्कूल ने कक्षाएं रद्द कीं क्योंकि गंभीर जलभराव हुआ था।' (अत्यंत तार्किक!)।\nचरण 2: लिंक 2 परीक्षण: 'गंभीर जलभराव हुआ क्योंकि स्कूल ने कक्षाएं रद्द की थीं।' (अतार्किक!)।\nउत्तर: कथन II कारण है, कथन I इसका प्रभाव है।"
      }
    },
    {
      id: "b_cause_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Statement I: The cost of raw steel has increased by 30%. Statement II: The prices of new cars have gone up by 5% this month.\n\nStep 1: Test Link 1: 'Steel cost increased BECAUSE car prices went up.' (Not logical - raw material costs drive product pricing, not vice versa).\nStep 2: Test Link 2: 'Car prices went up BECAUSE raw steel cost increased.' (Highly logical).\nAnswer: Statement I is cause, II is effect.",
        hi: "Level: Medium | उदाहरण 2: कथन I: कच्चे स्टील की लागत में 30% की वृद्धि हुई है। कथन II: इस महीने नई कारों की कीमतों में 5% की वृद्धि हुई है।\n\nचरण 1: लिंक 2 परीक्षण: 'कारों की कीमतें बढ़ीं क्योंकि कच्चे स्टील की लागत बढ़ गई थी।' (तार्किक)।\nउत्तर: कथन I कारण है, कथन II इसका प्रभाव है।"
      }
    },
    {
      id: "b_cause_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Statement I: Major train routes were diverted this afternoon. Statement II: Severe signal failures occurred at the central railway junction.\n\nStep 1: Test: 'Train routes were diverted BECAUSE signal failures occurred.' (Highly logical - signal failure makes routes unsafe, forcing diversions).\nAnswer: Statement II is cause, I is effect.",
        hi: "Level: Hard | उदाहरण 3: कथन I: आज दोपहर मुख्य ट्रेन मार्गों को बदल दिया गया। कथन II: केंद्रीय रेलवे जंक्शन पर गंभीर सिग्नल खराबी हुई।\n\nचरण 1: परीक्षण: 'ट्रेन मार्गों को बदला गया क्योंकि सिग्नल में खराबी हुई थी।' (तार्किक)।\nउत्तर: कथन II कारण है, कथन I प्रभाव है।"
      }
    },
    {
      id: "b_cause_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Statement I: The government increased subsidies on agricultural fertilizers. Statement II: Farmers recorded a bumper wheat crop harvest this season.",
        hi: "ओलंपियाड चुनौती: कथन I: सरकार ने कृषि उर्वरकों पर सब्सिडी बढ़ा दी। कथन II: किसानों ने इस सीजन में गेहूं की बंपर फसल दर्ज की।"
      },
      metadata: {
        question: {
          en: "Identify the relationship:",
          hi: "संबंध की पहचान करें:"
        },
        options: [
          { en: "Statement I is the cause, II is the effect", hi: "कथन I कारण है, II प्रभाव है" },
          { en: "Statement II is the cause, I is the effect", hi: "कथन II कारण है, I प्रभाव है" },
          { en: "Both statements are independent causes", hi: "दोनों कथन स्वतंत्र कारण हैं" },
          { en: "Both statements are effects of a common cause", hi: "दोनों कथन एक सामान्य कारण के प्रभाव हैं" }
        ],
        correctIndex: 0,
        solution: {
          en: "Increasing subsidies (I) makes fertilizers affordable, which directly helps farmers grow healthier crops and record a bumper harvest (II). Thus, I is the cause and II is the effect.",
          hi: "सब्सिडी बढ़ाने (I) से उर्वरक सस्ते हो जाते हैं, जो सीधे तौर पर किसानों को बेहतर फसल उगाने और बंपर उपज (II) दर्ज करने में मदद करता है। अतः I कारण और II प्रभाव है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_cause_summary",
      type: "summary",
      content: {
        en: "Cause & Effect Summary Card",
        hi: "कार्य-कारण संबंध समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Cause is the immediate trigger; effect is the logical consequence.", hi: "कारण तत्काल ट्रिगर है; प्रभाव तार्किक परिणाम है।" },
          { en: "Check if both statements represent a timeline connection or separate events.", hi: "जांचें कि क्या दोनों कथन समय-सीमा संबंध दिखाते हैं या अलग घटनाएं हैं।" }
        ],
        shortcuts: [
          { en: "Use the 'Because Test': '[A] occurred BECAUSE [B] occurred'.", hi: "बिकॉज टेस्ट का उपयोग करें: '[A] हुआ क्योंकि [B] हुआ'।" },
          { en: "Look for keywords like 'consequently', 'resulted in', 'due to'.", hi: "'परिणामस्वरूप', 'के कारण' जैसे शब्दों को खोजें।" }
        ],
        mistakesToAvoid: [
          { en: "Avoid reversing the order: the cause must always happen before the effect in chronological logic.", hi: "क्रम को उलटने की भूल न करें: तार्किक रूप से कारण हमेशा प्रभाव से पहले घटित होना चाहिए।" }
        ]
      }
    },
    {
      id: "b_cause_parent",
      type: "parent-note",
      content: {
        en: "Parent Guide for Cause and Effect Logic",
        hi: "कार्य-कारण तर्क के लिए पैरेंट गाइड"
      },
      metadata: {
        whyItMatters: {
          en: "Cause-effect analysis builds analytical critical logic. It forms the base for scientific reasoning, debugging programs, and tracing history trends.",
          hi: "कार्य-कारण विश्लेषण विश्लेषणात्मक आलोचनात्मक तर्क का निर्माण करता है। यह वैज्ञानिक तर्क, प्रोग्रामों को डीबग करने और इतिहास के रुझानों को समझने का आधार बनता है।"
        },
        commonStruggle: {
          en: "Children often confuse correlation with causation (believing that because two things happened together, one must have caused the other).",
          hi: "बच्चे अक्सर सहसंबंध (correlation) को कार्य-कारण (causation) समझ लेते हैं (यह मान लेते हैं कि दो चीजें एक साथ हुईं तो एक ने दूसरे को जन्म दिया होगा)।"
        },
        homeActivity: {
          en: "Ask 'What will happen if...' questions during daily chores (e.g. 'What is the effect if we forget to water this plant?').",
          hi: "दैनिक कार्यों के दौरान 'क्या होगा यदि...' प्रश्न पूछें (जैसे, 'यदि हम इस पौधे को पानी देना भूल जाएं तो इसका क्या प्रभाव होगा?')।"
        }
      }
    }
  ]
};
