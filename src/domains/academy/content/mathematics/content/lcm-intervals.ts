import { TopicContent } from "../../../core/types";

export const lcmIntervalsContent: TopicContent = {
  id: "topic_lcm_intervals",
  slug: "lcm-intervals",
  version: 2,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "LCM & Interval Puzzles",
    hi: "लघुत्तम समापवर्त्य और अंतराल पहेलियाँ (LCM Intervals)"
  },
  category: "Mathematical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_lcm_easy", "q_lcm_medium", "q_lcm_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Bells & Traffic Lights: Solve using LCM (Least Common Multiple) when multiple events repeat at regular intervals and need to align.",
      "Add start time: After finding the LCM in seconds or minutes, convert it back and add to the starting timestamp.",
      "Track overlap counts: To find how many times they toll together in 1 hour, divide total time by LCM and add 1 (if starting time is included)."
    ],
    quickTricks: [
      "Always check units! Convert minutes to seconds or vice versa to keep the LCM numbers correct."
    ]
  },
  blocks: [
    {
      id: "b_lcm_hook",
      type: "callout",
      content: {
        en: "Three temple bells ring at intervals of 4, 6, and 8 seconds. If they all ring together right now, in how many seconds will they ring together again? \n\nIt is exactly 24 seconds! But why not 48? Or 12? This is the magic of Least Common Multiple (LCM). Let's learn how to synchronize these intervals easily!",
        hi: "मंदिर की तीन घंटियाँ क्रमशः 4, 6 और 8 सेकंड के अंतराल पर बजती हैं। यदि वे अभी एक साथ बजती हैं, तो कितने सेकंड बाद वे फिर से एक साथ बजेंगी?\n\nयह ठीक 24 सेकंड है! लेकिन 48 क्यों नहीं? या 12? यह लघुत्तम समापवर्त्य (LCM) का जादू है। आइए इन अंतरालों को सिंक्रनाइज़ करना सीखें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_lcm_eli10",
      type: "callout",
      content: {
        en: "LCM is like finding the first common stepping stone for two or more frogs jumping at different distances. Frog A jumps 3 steps at a time, Frog B jumps 4 steps at a time. They will both land on step 12 at the same time! That common step is the Least Common Multiple.",
        hi: "LCM अलग-अलग दूरियों पर कूदने वाले दो या दो से अधिक मेढकों के लिए पहला सामान्य पत्थर (stepping stone) खोजने जैसा है। मेंढक A एक बार में 3 कदम कूदता है, मेंढक B एक बार में 4 कदम कूदता है। वे दोनों एक साथ 12वें कदम पर उतरेंगे! वही सामान्य कदम LCM है।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_lcm_life",
      type: "callout",
      content: {
        en: "You see interval logic in traffic lights, alarm clocks, train schedules, and medicine timings. Learning LCM helps you schedule overlapping tasks effortlessly.",
        hi: "आप ट्रैफिक लाइट, अलार्म घड़ियों, ट्रेन शेड्यूल और दवा के समय में अंतराल तर्क (interval logic) देखते हैं। LCM सीखने से आपको ओवरलैपिंग कार्यों को आसानी से शेड्यूल करने में मदद मिलती है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_lcm_recipe_title",
      type: "heading",
      content: {
        en: "Synchronizing Bells Recipe (LCM विधि)",
        hi: "घंटियों को सिंक्रनाइज़ करने की रेसिपी (LCM Method)"
      }
    },
    {
      id: "b_lcm_recipe",
      type: "recipe",
      content: {
        en: "Calculate the exact next timestamp when repeating events overlap.",
        hi: "दोहराए जाने वाले आयोजनों के ओवरलैप होने का सटीक अगला समय ज्ञात करें।"
      },
      metadata: {
        steps: [
          {
            en: "Identify the individual intervals: e.g., 10 minutes, 15 minutes.",
            hi: "व्यक्तिगत अंतरालों की पहचान करें: जैसे, 10 मिनट, 15 मिनट।"
          },
          {
            en: "Find the prime factors of each number: 10 = 2 * 5, 15 = 3 * 5.",
            hi: "प्रत्येक संख्या के अभाज्य गुणनखंड (prime factors) ज्ञात करें: 10 = 2 * 5, 15 = 3 * 5।"
          },
          {
            en: "Calculate LCM: Multiply the highest power of all factors: 2 * 3 * 5 = 30 minutes.",
            hi: "LCM की गणना करें: सभी गुणनखंडों की उच्चतम घात को गुणा करें: 2 * 3 * 5 = 30 मिनट।"
          },
          {
            en: "Add LCM to the initial joint start time to get the next overlap moment.",
            hi: "अगला ओवरलैप क्षण प्राप्त करने के लिए प्रारंभिक संयुक्त प्रारंभ समय में LCM जोड़ें।"
          }
        ]
      }
    },
    {
      id: "b_lcm_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_lcm_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Three lights flash at intervals of 2, 3, and 5 seconds respectively. How many seconds after they flash together will they flash together again?\n\nStep 1: Write intervals: 2, 3, 5.\nStep 2: Since all three are prime numbers, their LCM is simply their product: 2 * 3 * 5 = 30.\nStep 3: They will flash together again after 30 seconds.\nAnswer: 30 seconds.",
        hi: "Level: Easy | उदाहरण 1: तीन लाइटें क्रमशः 2, 3 और 5 सेकंड के अंतराल पर चमकती हैं। वे एक साथ चमकने के कितने सेकंड बाद फिर से एक साथ चमकेंगी?\n\nचरण 1: अंतराल लिखें: 2, 3, 5।\nचरण 2: चूंकि तीनों अभाज्य संख्याएं हैं, इसलिए उनका LCM उनका गुणनफल है: 2 * 3 * 5 = 30।\nचरण 3: वे 30 सेकंड बाद फिर से एक साथ चमकेंगी।\nउत्तर: 30 सेकंड।"
      }
    },
    {
      id: "b_lcm_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Two runners A and B start at the same time on a circular track. A completes a lap in 40 seconds, B in 60 seconds. When do they meet again at the start line?\n\nStep 1: Find LCM of 40 and 60.\n  - 40 = 2³ * 5\n  - 60 = 2² * 3 * 5\nStep 2: LCM = 2³ * 3 * 5 = 8 * 3 * 5 = 120 seconds.\nStep 3: Convert 120 seconds to minutes = 120 / 60 = 2 minutes.\nAnswer: 2 minutes.",
        hi: "Level: Medium | उदाहरण 2: दो धावक A और B एक गोलाकार ट्रैक पर एक ही समय पर शुरू होते हैं। A 40 सेकंड में और B 60 सेकंड में एक चक्कर पूरा करता है। वे शुरुआती रेखा पर दोबारा कब मिलेंगे?\n\nचरण 1: 40 और 60 का LCM ज्ञात करें।\n  - 40 = 2³ * 5\n  - 60 = 2² * 3 * 5\nचरण 2: LCM = 2³ * 3 * 5 = 120 सेकंड।\nचरण 3: मिनट में बदलें = 120 / 60 = 2 मिनट।\nउत्तर: 2 मिनट।"
      }
    },
    {
      id: "b_lcm_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Three bells toll together at 9:00 AM. They toll at intervals of 12, 15, and 18 seconds. How many times will they toll together in the next 15 minutes (excluding the first toll)?\n\nStep 1: Find LCM of 12, 15, and 18.\n  - 12 = 2² * 3\n  - 15 = 3 * 5\n  - 18 = 2 * 3²\n  - LCM = 2² * 3² * 5 = 4 * 9 * 5 = 180 seconds.\nStep 2: Convert LCM to minutes = 180 / 60 = 3 minutes.\nStep 3: Calculate tolls in 15 minutes = 15 / 3 = 5 times.\nAnswer: 5 times.",
        hi: "Level: Hard | उदाहरण 3: तीन घंटियाँ सुबह 9:00 बजे एक साथ बजती हैं। वे 12, 15 और 18 सेकंड के अंतराल पर बजती हैं। अगले 15 मिनट में वे कितनी बार एक साथ बजेंगी (पहले टोल को छोड़कर)?\n\nचरण 1: 12, 15 और 18 का LCM ज्ञात करें।\n  - LCM = 180 सेकंड = 3 मिनट।\nचरण 2: 15 मिनट में कुल बार = 15 / 3 = 5 बार।\nउत्तर: 5 बार।"
      }
    },
    {
      id: "b_lcm_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Four bells toll at intervals of 6, 8, 12, and 18 seconds respectively. If they toll together now, how many times will they toll together in 30 minutes, INCLUDING the toll at the start?",
        hi: "ओलंपियाड चुनौती: चार घंटियाँ क्रमशः 6, 8, 12 और 18 सेकंड के अंतराल पर बजती हैं। यदि वे अभी एक साथ बजती हैं, तो शुरुआत में बजने वाली घंटी को शामिल करते हुए 30 मिनट में वे कितनी बार एक साथ बजेंगी?"
      },
      metadata: {
        question: {
          en: "Select the correct count:",
          hi: "सही संख्या चुनें:"
        },
        options: [
          { en: "25 times", hi: "25 बार" },
          { en: "26 times", hi: "26 बार" },
          { en: "30 times", hi: "30 बार" },
          { en: "31 times", hi: "31 बार" }
        ],
        correctIndex: 1,
        solution: {
          en: "Find LCM of 6, 8, 12, and 18. LCM is 72 seconds.\nConvert total time (30 minutes) to seconds: 30 * 60 = 1800 seconds.\nDivide total seconds by LCM: 1800 / 72 = 25 times.\nAdd 1 for the starting toll: 25 + 1 = 26 times.",
          hi: "6, 8, 12 और 18 का LCM ज्ञात करें। LCM 72 सेकंड है।\nकुल समय (30 मिनट) को सेकंड में बदलें: 30 * 60 = 1800 सेकंड।\nLCM से विभाजित करें: 1800 / 72 = 25 बार।\nशुरुआती घंटी को जोड़ें: 25 + 1 = 26 बार।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_lcm_summary",
      type: "summary",
      content: {
        en: "LCM Puzzles Summary Card",
        hi: "LCM पहेलियाँ समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "LCM synchronizes multiple events returning at different regular speeds.", hi: "LCM विभिन्न नियमित गतियों पर लौटने वाली कई घटनाओं को सिंक्रनाइज़ करता है।" },
          { en: "Common contexts: bells tolling, traffic lights flashing, circular runners passing.", hi: "सामान्य संदर्भ: घंटियों का बजना, ट्रैफिक लाइट का चमकना, गोलाकार धावक।" }
        ],
        shortcuts: [
          { en: "Convert everything to the smallest common unit (seconds) first.", hi: "सबसे पहले सब कुछ सबसे छोटी सामान्य इकाई (सेकंड) में बदलें।" },
          { en: "Use prime factorization to find the LCM quickly.", hi: "LCM जल्दी खोजने के लिए अभाज्य गुणनखंड का उपयोग करें।" }
        ],
        mistakesToAvoid: [
          { en: "Don't forget to check if the question asks to 'include' or 'exclude' the starting overlap toll.", hi: "यह जांचना न भूलें कि प्रश्न में शुरुआत वाले समय को शामिल करना है या बाहर करना है।" }
        ]
      }
    },
    {
      id: "b_lcm_parent",
      type: "parent-note",
      content: {
        en: "Relational Arithmetic & Temporal Synchronization",
        hi: "संबंधपरक अंकगणित और लौकिक सिंक्रनाइज़ेशन"
      },
      metadata: {
        whyItMatters: {
          en: "Temporal interval logic forms the basis of computer clock cycles, network packet routing, and scheduling algorithms. Finding overlapping patterns builds algebraic scalability.",
          hi: "अंतराल तर्क कंप्यूटर क्लॉक साइकिल, नेटवर्क पैकेट रूटिंग और शेड्यूलिंग एल्गोरिदम का आधार बनता है।"
        },
        commonStruggle: {
          en: "Children often forget that the first event happens at Time = 0, which leads to off-by-one errors when counting overlaps.",
          hi: "बच्चे अक्सर भूल जाते हैं कि पहली घटना समय = 0 पर होती है, जिससे गिनती में 1 की त्रुटि (off-by-one error) हो जाती है।"
        },
        homeActivity: {
          en: "Bake cookies or set alarms together: set one oven timer for 4 minutes and another for 6 minutes, and ask your child when they will beep together.",
          hi: "घर पर दो अलार्म लगाएं (एक 4 मिनट का, दूसरा 6 मिनट का) और बच्चे को दोनों के एक साथ बजने का समय बताने को कहें।"
        }
      }
    }
  ]
};
