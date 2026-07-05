import { TopicContent } from "../../../core/types";

export const dataSufficiencyContent: TopicContent = {
  id: "topic_data_sufficiency",
  slug: "data-sufficiency",
  version: 2,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Data Sufficiency",
    hi: "डेटा पर्याप्तता (Data Sufficiency)"
  },
  category: "Analytical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_suff_easy", "q_suff_medium", "q_suff_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Don't calculate fully: Stop as soon as you know whether the information given is enough to find a unique answer.",
      "Test individually: Always check Statement 1 by itself, then Statement 2 by itself, before trying to combine them.",
      "Unique Answer: Sufficiency means finding exactly ONE unique value or answer. If a statement gives multiple possibilities, it is insufficient."
    ],
    quickTricks: [
      "Ask: 'Can I find a single answer using only Statement 1?' If yes, mark it. If not, test Statement 2."
    ]
  },
  blocks: [
    {
      id: "b_suff_hook",
      type: "callout",
      content: {
        en: "If someone asks: 'How old is Amit?' and gives you two clues:\n1. Amit is 5 years older than Raman.\n2. Raman is 10 years old.\n\nDo you need both clues to find Amit's age? Yes! Statement 1 alone isn't enough, and Statement 2 alone isn't enough. Together, they are sufficient! This is Data Sufficiency. Let's learn how to evaluate clues like a detective!",
        hi: "यदि कोई पूछता है: 'अमित की आयु कितनी है?' और आपको दो सुराग देता है:\n1. अमित रमन से 5 वर्ष बड़ा है।\n2. रमन 10 वर्ष का है।\n\nक्या अमित की उम्र जानने के लिए आपको दोनों सुरागों की आवश्यकता है? हाँ! केवल कथन 1 काफी नहीं है, और केवल कथन 2 काफी नहीं है। साथ मिलकर, वे पर्याप्त हैं!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_suff_eli10",
      type: "callout",
      content: {
        en: "Data Sufficiency is a math-logic game. Instead of asking you to calculate an answer, it asks: 'Do you have enough information to calculate it?'. It saves you from wasting time doing complete calculations. It tests your judgment of what information is essential.",
        hi: "डेटा पर्याप्तता एक गणितीय-तर्क खेल है। आपसे उत्तर की गणना करने के लिए कहने के बजाय, यह पूछता है: 'क्या आपके पास इसकी गणना करने के लिए पर्याप्त जानकारी है?'। यह आपको पूरी गणना करने में समय बर्बाद करने से बचाता है।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_suff_life",
      type: "callout",
      content: {
        en: "You use this when solving complex programming logic, estimating project budgets, or making real-life decisions where you need to check if you have all the facts before deciding.",
        hi: "आप इसका उपयोग जटिल प्रोग्रामिंग तर्क को हल करने, परियोजना बजट का अनुमान लगाने, या वास्तविक जीवन में निर्णय लेने में करते हैं जहाँ आपको यह जांचना होता है कि निर्णय लेने से पहले आपके पास सभी तथ्य हैं या नहीं।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_suff_recipe_title",
      type: "heading",
      content: {
        en: "Clue Evaluation Recipe (डेटा विश्लेषण विधि)",
        hi: "डेटा विश्लेषण विधि रेसिपी (Clue Evaluation)"
      }
    },
    {
      id: "b_suff_recipe",
      type: "recipe",
      content: {
        en: "Follow this systematic path to check data sufficiency without making calculation errors.",
        hi: "बिना गणना त्रुटियों के डेटा पर्याप्तता की जांच करने के लिए इस व्यवस्थित मार्ग का पालन करें।"
      },
      metadata: {
        steps: [
          {
            en: "Read the question carefully to understand what needs to be found (e.g., a specific number, or a Yes/No answer).",
            hi: "प्रश्न को ध्यान से पढ़ें ताकि समझ सकें कि क्या खोजने की आवश्यकता है (जैसे, एक विशिष्ट संख्या, या हाँ/नहीं में उत्तर)।"
          },
          {
            en: "Test Statement 1 alone: Forget Statement 2 completely. Can you solve the question? (Yes/No).",
            hi: "केवल कथन 1 का परीक्षण करें: कथन 2 को पूरी तरह भूल जाएं। क्या आप प्रश्न हल कर सकते हैं? (हाँ/नहीं)।"
          },
          {
            en: "Test Statement 2 alone: Forget Statement 1 completely. Can you solve the question? (Yes/No).",
            hi: "केवल कथन 2 का परीक्षण करें: कथन 1 को पूरी तरह भूल जाएं। क्या आप प्रश्न हल कर सकते हैं? (हाँ/नहीं)।"
          },
          {
            en: "If both fail individually, combine them. Can you solve the question now? (Yes/No).",
            hi: "यदि दोनों व्यक्तिगत रूप से विफल हो जाते हैं, तो उन्हें मिलाएं। क्या आप अब प्रश्न हल कर सकते हैं? (हाँ/नहीं)।"
          }
        ]
      }
    },
    {
      id: "b_suff_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_suff_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Question: What is the value of X? \nClues: 1. X + 5 = 12. \n2. X is a prime number.\n\nStep 1: Test Clue 1 alone. X + 5 = 12 => X = 7. We got a single unique answer! So Clue 1 alone is sufficient.\nStep 2: Test Clue 2 alone. X is a prime number => X could be 2, 3, 5, 7... not unique. So Clue 2 alone is insufficient.\nAnswer: Statement 1 alone is sufficient.",
        hi: "Level: Easy | उदाहरण 1: प्रश्न: X का मान क्या है?\nसुराग: 1. X + 5 = 12. \n2. X एक अभाज्य संख्या है।\n\nचरण 1: अकेले सुराग 1 का परीक्षण करें। X + 5 = 12 => X = 7। हमें एक अनूठा उत्तर मिला! तो सुराग 1 पर्याप्त है।\nचरण 2: अकेले सुराग 2 का परीक्षण करें। X अभाज्य है => X कुछ भी हो सकता है 2, 3, 5... अनूठा नहीं है। तो यह अपर्याप्त है।\nउत्तर: केवल कथन 1 पर्याप्त है।"
      }
    },
    {
      id: "b_suff_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Question: Is X an even number?\nClues: 1. X is divisible by 4.\n2. X is divisible by 3.\n\nStep 1: Test Clue 1 alone. Divisible by 4 means X is 4, 8, 12... all of these are even. So Clue 1 alone gives a unique 'Yes' answer. Sufficient.\nStep 2: Test Clue 2 alone. Divisible by 3 means X could be 3 (odd) or 6 (even). No unique answer. Insufficient.\nAnswer: Statement 1 alone is sufficient.",
        hi: "Level: Medium | उदाहरण 2: प्रश्न: क्या X एक सम संख्या है?\nसुराग: 1. X, 4 से विभाज्य है।\n2. X, 3 से विभाज्य है।\n\nचरण 1: सुराग 1 का परीक्षण: 4 से विभाज्य संख्याएँ (4, 8, 12...) हमेशा सम होती हैं। निश्चित 'हाँ'। पर्याप्त है।\nचरण 2: सुराग 2 का परीक्षण: 3 से विभाज्य (3-विषम, 6-सम) हो सकता है। अनूठा उत्तर नहीं। अपर्याप्त है।\nउत्तर: केवल कथन 1 पर्याप्त है।"
      }
    },
    {
      id: "b_suff_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Question: Who is the tallest among A, B, and C?\nClues: 1. A is taller than B.\n2. B is shorter than C.\n\nStep 1: Test Clue 1: A > B. We don't know about C. Insufficient.\nStep 2: Test Clue 2: C > B. We don't know about A. Insufficient.\nStep 3: Combine: We know A > B and C > B. B is shortest. But we don't know if A > C or C > A. Still insufficient.\nAnswer: Statements 1 and 2 together are not sufficient.",
        hi: "Level: Hard | उदाहरण 3: प्रश्न: A, B और C में से सबसे लंबा कौन है?\nसुराग: 1. A, B से लंबा है।\n2. B, C से छोटा है।\n\nचरण 1: सुराग 1: A > B। C के बारे में जानकारी नहीं। अपर्याप्त।\nचरण 2: सुराग 2: C > B। A के बारे में जानकारी नहीं। अपर्याप्त।\nचरण 3: दोनों को मिलाएं: A > B, C > B। B सबसे छोटा है, लेकिन A और C में कौन लंबा है यह अज्ञात है।\nउत्तर: दोनों कथन मिलकर भी पर्याप्त नहीं हैं।"
      }
    },
    {
      id: "b_suff_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Question: What is the value of integers X and Y?\nClues:\nI. X + Y = 10\nII. X * Y = 25",
        hi: "ओलंपियाड चुनौती: प्रश्न: पूर्णांक X और Y का मान क्या है?\nकथन:\nI. X + Y = 10\nII. X * Y = 25"
      },
      metadata: {
        question: {
          en: "Determine the sufficiency:",
          hi: "पर्याप्तता निर्धारित करें:"
        },
        options: [
          { en: "Statement I alone is sufficient", hi: "केवल कथन I पर्याप्त है" },
          { en: "Statement II alone is sufficient", hi: "केवल कथन II पर्याप्त है" },
          { en: "Both statements together are sufficient", hi: "दोनों कथन मिलकर पर्याप्त हैं" },
          { en: "Statements I and II together are not sufficient", hi: "दोनों कथन मिलकर भी पर्याप्त नहीं हैं" }
        ],
        correctIndex: 2,
        solution: {
          en: "From I: infinitely many pairs (1,9), (2,8). Insufficient.\nFrom II: pairs like (5,5), (-5,-5). Insufficient.\nCombine: X+Y=10 and X*Y=25. The only unique solution is X=5, Y=5. Thus, both together are sufficient.",
          hi: "कथन I से: अनंत जोड़े हो सकते हैं। अपर्याप्त।\nकथन II से: (5,5) या (-5,-5) हो सकते हैं। अपर्याप्त।\nदोनों को मिलाने पर: X+Y=10 और X*Y=25। एकमात्र हल X=5, Y=5 है। अतः दोनों मिलकर पर्याप्त हैं।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_suff_summary",
      type: "summary",
      content: {
        en: "Data Sufficiency Summary Card",
        hi: "डेटा पर्याप्तता समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Data Sufficiency asks if clues are enough to find a unique answer.", hi: "डेटा पर्याप्तता यह जांचती है कि क्या सुराग एक अनूठा उत्तर खोजने के लिए पर्याप्त हैं।" },
          { en: "A statement is sufficient only if it leads to exactly one specific answer or conclusion.", hi: "एक कथन केवल तभी पर्याप्त होता है जब वह ठीक एक विशिष्ट उत्तर या निष्कर्ष पर ले जाता है।" }
        ],
        shortcuts: [
          { en: "Always test Statement 1 alone, then Statement 2 alone. Do not combine them first.", hi: "हमेशा पहले कथन 1 और फिर कथन 2 का व्यक्तिगत रूप से परीक्षण करें। पहले उन्हें न मिलाएं।" },
          { en: "Stop calculating the moment you realize a unique value exists.", hi: "जैसे ही आपको पता चले कि एक अनूठा मान मौजूद है, गणना बंद कर दें।" }
        ],
        mistakesToAvoid: [
          { en: "Do not assume a statement is sufficient if it yields two possible answers (e.g. X = 3 or X = -3).", hi: "यदि किसी कथन से दो संभावित उत्तर मिलते हैं, तो उसे पर्याप्त न मानें।" }
        ]
      }
    },
    {
      id: "b_suff_parent",
      type: "parent-note",
      content: {
        en: "Analytical Evaluation & Information Structuring",
        hi: "विश्लेषणात्मक मूल्यांकन और सूचना संरचना"
      },
      metadata: {
        whyItMatters: {
          en: "Data sufficiency models executive decision-making. It trains kids to check if they have enough research evidence before jumping to conclusions.",
          hi: "डेटा पर्याप्तता कार्यकारी निर्णय लेने के कौशल को विकसित करती है। यह बच्चों को निष्कर्ष पर पहुंचने से पहले पर्याप्त सबूतों की जांच करना सिखाती है।"
        },
        commonStruggle: {
          en: "Children often spend too much time calculating the exact numbers instead of focusing on whether the calculation is possible.",
          hi: "बच्चे अक्सर यह देखने के बजाय कि गणना संभव है या नहीं, सटीक संख्याओं की गणना करने में बहुत समय लगा देते हैं।"
        },
        homeActivity: {
          en: "Give your child a riddle where some key parts are missing, and ask them what extra clue they need to solve it.",
          hi: "अपने बच्चे को एक पहेली दें जिसमें कुछ हिस्से गायब हों, और पूछें कि इसे हल करने के लिए उन्हें किस अतिरिक्त सुराग की आवश्यकता है।"
        }
      }
    }
  ]
};
