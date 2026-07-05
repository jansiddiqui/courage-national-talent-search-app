import { TopicContent } from "../../../core/types";

export const argumentEvaluationContent: TopicContent = {
  id: "topic_argument_evaluation",
  slug: "argument-evaluation",
  version: 2,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Argument Evaluation",
    hi: "तर्क मूल्यांकन (Argument Evaluation)"
  },
  category: "Analytical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_arg_easy", "q_arg_medium", "q_arg_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Strong vs. Weak: A strong argument is directly related to the statement and supported by solid logic or facts. A weak argument is emotional, general, or irrelevant.",
      "Check Assumptions: An assumption is an unstated belief that must be true for the argument to hold weight.",
      "Spot Fallacies: Watch out for arguments that generalize based on a single instance (e.g. 'It rained today, so it rains every day')."
    ],
    quickTricks: [
      "Ask: 'Is this argument based on facts and logic, or is it just an emotional opinion?' Opinions are always weak arguments."
    ]
  },
  blocks: [
    {
      id: "b_arg_hook",
      type: "callout",
      content: {
        en: "If someone says: 'We should ban all exams because exams make students nervous.' Is this a strong argument? \n\nNo, it's weak! It focuses only on an emotional feeling instead of looking at the educational value of exams. Learning how to separate strong, logical arguments from weak, emotional opinions is a superpower! Let's learn how to evaluate arguments like a judge!",
        hi: "यदि कोई कहता है: 'हमें सभी परीक्षाओं पर प्रतिबंध लगा देना चाहिए क्योंकि परीक्षाएं छात्रों को घबरा देती हैं।' क्या यह एक मजबूत तर्क है?\n\nनहीं, यह कमजोर है! यह परीक्षाओं के शैक्षिक मूल्य को देखने के बजाय केवल एक भावनात्मक भावना पर ध्यान केंद्रित करता है। न्यायधीश की तरह तर्कों का मूल्यांकन करना सीखें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_arg_eli10",
      type: "callout",
      content: {
        en: "Evaluating arguments is like testing the strength of a bridge. A strong bridge is built with steel facts and concrete logic. A weak bridge is built with paper opinions and emotional comments. Your job is to walk on the argument and see if it can hold weight without collapsing.",
        hi: "तर्कों का मूल्यांकन करना एक पुल की ताकत का परीक्षण करने जैसा है। एक मजबूत पुल तथ्य और ठोस तर्क से बनता है। एक कमजोर पुल केवल राय और भावनात्मक टिप्पणियों से बनता है। आपका काम तर्क पर चलना और यह देखना है कि क्या यह टिक सकता है।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_arg_life",
      type: "callout",
      content: {
        en: "You use this when writing debates, reading editorials, listening to advertisements, or discussing decisions with friends. It helps you avoid being tricked by false claims.",
        hi: "आप इसका उपयोग वाद-विवाद लिखते समय, विज्ञापन सुनते समय, या दोस्तों के साथ निर्णयों पर चर्चा करते समय करते हैं। यह आपको झूठे दावों से बचने में मदद करता है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_arg_lib_table",
      type: "table",
      content: {
        en: "Strong vs. Weak Arguments Criteria",
        hi: "मजबूत बनाम कमजोर तर्क मानदंड"
      },
      metadata: {
        headers: [
          { en: "Argument Type", hi: "तर्क प्रकार" },
          { en: "Key Characteristics", hi: "मुख्य विशेषताएं" },
          { en: "Example Case", hi: "उदाहरण मामला" }
        ],
        rows: [
          [
            { en: "Strong", hi: "मजबूत" },
            { en: "Directly relates to the topic, based on practical facts, safety, or progress.", hi: "विषय से सीधे संबंधित, व्यावहारिक तथ्यों, सुरक्षा या प्रगति पर आधारित।" },
            { en: "Exams are needed to test student understanding fairly.", hi: "छात्रों की समझ का निष्पक्ष परीक्षण करने के लिए परीक्षा आवश्यक है।" }
          ],
          [
            { en: "Weak", hi: "कमजोर" },
            { en: "Based on emotions, simple comparison, or irrelevant facts.", hi: "भावनाओं, सरल तुलना, या अप्रासंगिक तथ्यों पर आधारित।" },
            { en: "Exams should be banned because my friend hates them.", hi: "परीक्षा पर प्रतिबंध लगाया जाना चाहिए क्योंकि मेरा दोस्त उनसे नफरत करता है।" }
          ]
        ]
      }
    },
    {
      id: "b_arg_recipe_title",
      type: "heading",
      content: {
        en: "Argument Testing Recipe (तर्क विश्लेषण विधि)",
        hi: "तर्क विश्लेषण विधि रेसिपी (Argument Testing)"
      }
    },
    {
      id: "b_arg_recipe",
      type: "recipe",
      content: {
        en: "Use these questions to test if any argument is logically strong.",
        hi: "यह जांचने के लिए इन प्रश्नों का उपयोग करें कि क्या कोई तर्क तार्किक रूप से मजबूत है।"
      },
      metadata: {
        steps: [
          {
            en: "Check Relevance: Does the argument directly answer the core topic? (If no, it is weak).",
            hi: "प्रासंगिकता की जांच करें: क्या तर्क सीधे मुख्य विषय का उत्तर देता है? (यदि नहीं, तो यह कमजोर है)।"
          },
          {
            en: "Check Support: Is the argument based on a scientific fact, safety, law, or logical benefit? (If yes, it is strong).",
            hi: "समर्थन की जांच करें: क्या तर्क वैज्ञानिक तथ्य, सुरक्षा, कानून या तार्किक लाभ पर आधारित है? (यदि हाँ, तो यह मजबूत है)।"
          },
          {
            en: "Check for Emotions: Is the argument using exaggeration (like 'always', 'everyone') or emotional appeal? (If yes, it is usually weak).",
            hi: "भावनाओं की जांच करें: क्या तर्क में अतिशयोक्ति (जैसे 'हमेशा', 'हर कोई') या भावनात्मक अपील का उपयोग किया जा रहा है? (यदि हाँ, तो यह कमजोर है)।"
          }
        ]
      }
    },
    {
      id: "b_arg_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_arg_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Statement: Should mobile phones be banned in schools?\nArgument 1: Yes, because they distract students during classes. (Strong - directly relates to learning focus).\nArgument 2: No, because other countries do not ban them. (Weak - simple comparison with no logical justification for local benefit).\nAnswer: Argument 1 is strong, 2 is weak.",
        hi: "Level: Easy | उदाहरण 1: कथन: क्या स्कूलों में मोबाइल फोन पर प्रतिबंध लगाया जाना चाहिए?\nतर्क 1: हाँ, क्योंकि वे कक्षाओं के दौरान छात्रों का ध्यान भटकाते हैं। (मजबूत - सीखने के ध्यान से सीधे संबंधित)।\nतर्क 2: नहीं, क्योंकि अन्य देश उन पर प्रतिबंध नहीं लगाते हैं। (कमजोर - स्थानीय लाभ का कोई तार्किक औचित्य नहीं है)।\nउत्तर: तर्क 1 मजबूत है, 2 कमजोर है।"
      }
    },
    {
      id: "b_arg_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Statement: Should games and sports be made compulsory in schools?\nArgument 1: Yes, because it helps in the overall physical and mental development of students. (Strong - verified developmental benefit).\nArgument 2: No, because it takes away time from study. (Weak - study time can be managed with scheduling; not a absolute negative point).\nAnswer: Argument 1 is strong, 2 is weak.",
        hi: "Level: Medium | उदाहरण 2: कथन: क्या स्कूलों में खेलकूद को अनिवार्य किया जाना चाहिए?\nतर्क 1: हाँ, क्योंकि यह छात्रों के समग्र शारीरिक और मानसिक विकास में मदद करता है। (मजबूत)।\nतर्क 2: नहीं, क्योंकि यह पढ़ाई से समय छीन लेता है। (कमजोर)।\nउत्तर: तर्क 1 मजबूत है, 2 कमजोर है।"
      }
    },
    {
      id: "b_arg_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Statement: Should the government ban plastic bags completely?\nArgument 1: Yes, because plastic is non-biodegradable and causes environmental damage. (Strong - ecological health logic).\nArgument 2: No, because alternative paper bags are more expensive to produce. (Strong - valid economic constraint that impacts commerce).\nAnswer: Both arguments 1 and 2 are strong.",
        hi: "Level: Hard | उदाहरण 3: कथन: क्या सरकार को प्लास्टिक बैगों पर पूरी तरह से प्रतिबंध लगा देना चाहिए?\nतर्क 1: हाँ, क्योंकि प्लास्टिक पर्यावरण को गंभीर नुकसान पहुंचाता है। (मजबूत - पर्यावरण सुरक्षा)।\nतर्क 2: नहीं, क्योंकि वैकल्पिक पेपर बैगों का उत्पादन अधिक महंगा है। (मजबूत - आर्थिक पहलू)।\nउत्तर: तर्क 1 और 2 दोनों मजबूत हैं।"
      }
    },
    {
      id: "b_arg_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Statement: Should primary education be made completely free in India?\nArguments:\nI. Yes, because it is the only way to improve literacy levels and lift families out of poverty.\nII. No, because it will put a heavy burden on the national exchequer.",
        hi: "ओलंपियाड चुनौती: कथन: क्या भारत में प्राथमिक शिक्षा पूरी तरह से मुफ्त की जानी चाहिए?\nतर्क:\nI. हाँ, क्योंकि साक्षरता के स्तर में सुधार और परिवारों को गरीबी से बाहर निकालने का यही एकमात्र तरीका है।\nII. नहीं, क्योंकि इससे राष्ट्रीय खजाने पर भारी बोझ पड़ेगा।"
      },
      metadata: {
        question: {
          en: "Evaluate the arguments:",
          hi: "तर्कों का मूल्यांकन करें:"
        },
        options: [
          { en: "Only argument I is strong", hi: "केवल तर्क I मजबूत है" },
          { en: "Only argument II is strong", hi: "केवल तर्क II मजबूत है" },
          { en: "Both arguments I and II are strong", hi: "तर्क I और II दोनों मजबूत हैं" },
          { en: "Neither argument I nor II is strong", hi: "न तो तर्क I और न ही II मजबूत है" }
        ],
        correctIndex: 2,
        solution: {
          en: "Argument I is strong because it addresses a fundamental human right and verified path to development. Argument II is also strong because the financial feasibility (tax burden) is a real-world governmental constraint.",
          hi: "तर्क I मजबूत है क्योंकि यह एक मौलिक मानव अधिकार और विकास का मार्ग है। तर्क II भी मजबूत है क्योंकि वित्तीय व्यवहार्यता (खजाने पर बोझ) एक वास्तविक सरकारी बाधा है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_arg_summary",
      type: "summary",
      content: {
        en: "Argument Evaluation Summary Card",
        hi: "तर्क मूल्यांकन समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Evaluating arguments helps determine whether claims stand on facts or opinions.", hi: "तर्कों का मूल्यांकन यह निर्धारित करने में मदद करता है कि दावे तथ्यों पर आधारित हैं या केवल राय पर।" },
          { en: "Strong arguments are realistic, beneficial, and directly address the topic.", hi: "मजबूत तर्क यथार्थवादी, लाभकारी और सीधे विषय को संबोधित करने वाले होते हैं।" }
        ],
        shortcuts: [
          { en: "Eliminate emotional language or simple comparisons without justification.", hi: "बिना औचित्य के भावनात्मक भाषा या सरल तुलनाओं को हटा दें।" },
          { en: "Test if the argument concerns safety, public health, national interest, or verified facts.", hi: "जांचें कि क्या तर्क सुरक्षा, सार्वजनिक स्वास्थ्य, राष्ट्रीय हित या प्रमाणित तथ्यों से संबंधित है।" }
        ],
        mistakesToAvoid: [
          { en: "Do not mark an argument as strong just because you personally support that viewpoint.", hi: "किसी तर्क को केवल इसलिए मजबूत न मानें क्योंकि आप व्यक्तिगत रूप से उस दृष्टिकोण का समर्थन करते हैं।" }
        ]
      }
    },
    {
      id: "b_arg_parent",
      type: "parent-note",
      content: {
        en: "Logical Debate & Critical Reasoning Skills",
        hi: "तार्किक वाद-विवाद और आलोचनात्मक तर्क कौशल"
      },
      metadata: {
        whyItMatters: {
          en: "Evaluating arguments builds immunity against media manipulation, advertising claims, and peer pressure, helping kids form independent viewpoints.",
          hi: "तर्कों का मूल्यांकन करना बच्चों को झूठे विज्ञापनों और बहकावे से बचने में मदद करता है।"
        },
        commonStruggle: {
          en: "Children often confuse the length or vocabulary of an argument with its logical strength.",
          hi: "बच्चे अक्सर किसी तर्क की लंबाई या कठिन शब्दों को उसकी तार्किक मजबूती मान बैठते हैं।"
        },
        homeActivity: {
          en: "Create a friendly debate about a movie or meal choice, and ask your child to explain why their preferred choice is better using facts.",
          hi: "घर पर किसी फिल्म या भोजन की पसंद के बारे में चर्चा करें, और बच्चे से पूछें कि तथ्यों का उपयोग करके उनकी पसंद बेहतर क्यों है।"
        }
      }
    }
  ]
};
