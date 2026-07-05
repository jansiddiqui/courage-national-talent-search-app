import { TopicContent } from "../../../core/types";

export const wordAnalogiesContent: TopicContent = {
  id: "topic_word_analogies",
  slug: "word-analogies",
  version: 3,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Word Analogies",
    hi: "शब्द सादृश्य (Word Analogies)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_lang_analogy_easy", "q_lang_analogy_medium", "q_lang_analogy_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Synonyms/Antonyms: Spot if the first pair of words have the same meaning or opposite meanings.",
      "Worker/Tool: Look for relationship like Carpenter:Saw, Painter:Brush.",
      "Part/Whole: Check if one word is a part of the other, e.g., Wheel:Car, Page:Book."
    ],
    quickTricks: [
      "Always construct a simple bridge sentence relating the first pair (e.g. 'A book is written by an author') and apply the exact sentence structure to the second pair!"
    ]
  },
  blocks: [
    {
      id: "b_analogy_hook",
      type: "callout",
      content: {
        en: "If a glove goes on a hand, where does a sock go? Easy, the foot! \n\nBut what if we ask: Glove is to Hand as Sock is to ________? This is a word analogy! It is like finding the golden bridge that connects two pairs of words. Let's learn how to cross this bridge easily!",
        hi: "यदि एक दस्ताना हाथ पर जाता है, तो मोजा कहाँ जाता है? आसान है, पैर पर!\n\nलेकिन क्या होगा यदि हम पूछें: दस्ताने का जो संबंध हाथ से है, मोज़े का वही संबंध ________ से है? यह एक शब्द सादृश्य (Word Analogy) है! यह दो जोड़ी शब्दों को जोड़ने वाले पुल को खोजने जैसा है। आइए इस पुल को आसानी से पार करना सीखें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_analogy_eli10",
      type: "callout",
      content: {
        en: "A word analogy is a word-logic puzzle. It shows you two words that have a secret relationship (like opposites, or builder and tool). Then, it gives you a third word and asks you to find a fourth word that has the exact same secret relationship. It is vocabulary logic!",
        hi: "शब्द सादृश्य एक शब्द-तर्क पहेली है। यह आपको दो शब्द दिखाता है जिनका एक गुप्त संबंध होता है (जैसे विलोम, या निर्माता और उपकरण)। फिर, यह आपको तीसरा शब्द देता है और आपसे चौथा शब्द खोजने के लिए कहता है जिसका वही गुप्त संबंध हो। यह शब्दावली का तर्क है!"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_analogy_life",
      type: "callout",
      content: {
        en: "Analogies build strong language precision and vocabulary skills. It teaches you to analyze exact relationships between words, which is useful in reading comprehension and writing essays.",
        hi: "सादृश्यताएं मजबूत भाषा सटीकता और शब्दावली कौशल का निर्माण करती हैं। यह आपको शब्दों के बीच सटीक संबंधों का विश्लेषण करना सिखाता है, जो पढ़ने और लिखने में बहुत उपयोगी है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_analogy_lib_table",
      type: "table",
      content: {
        en: "Types of Word Relationships",
        hi: "शब्द संबंधों के प्रकार"
      },
      metadata: {
        headers: [
          { en: "Relation Type", hi: "संबंध प्रकार" },
          { en: "Bridge Structure", hi: "ब्रिज संरचना" },
          { en: "Example Pair", hi: "उदाहरण जोड़ी" }
        ],
        rows: [
          [
            { en: "Worker & Tool", hi: "कार्यकर्ता और उपकरण" },
            { en: "Worker uses Tool to perform task", hi: "कार्यकर्ता कार्य करने के लिए उपकरण का उपयोग करता है" },
            { en: "Sculptor : Chisel", hi: "मूर्तिकार : छेनी" }
          ],
          [
            { en: "Synonyms / Antonyms", hi: "समानार्थी / विपरीतार्थी" },
            { en: "Opposite or same meanings", hi: "विपरीत या समान अर्थ" },
            { en: "Kind : Cruel (Antonyms)", hi: "दयालु : क्रूर (विलोम)" }
          ],
          [
            { en: "Animal Group", hi: "पशु समूह" },
            { en: "Group of Animal is called GroupName", hi: "जानवर के समूह को समूह-नाम कहा जाता है" },
            { en: "Wolf : Pack", hi: "भेड़िया : पैक" }
          ]
        ]
      }
    },
    {
      id: "b_analogy_recipe_title",
      type: "heading",
      content: {
        en: "The Bridge Sentence Recipe (ब्रिज सेंटेंस रेसिपी)",
        hi: "ब्रिज सेंटेंस रेसिपी (The Bridge Sentence)"
      }
    },
    {
      id: "b_analogy_recipe",
      type: "recipe",
      content: {
        en: "Use this foolproof sentence method to solve any word analogy puzzle.",
        hi: "किसी भी शब्द सादृश्य पहेली को हल करने के लिए इस अचूक वाक्य विधि का उपयोग करें।"
      },
      metadata: {
        steps: [
          {
            en: "Look at the first pair: A : B (e.g., Writer : Pen).",
            hi: "पहली जोड़ी को देखें: A : B (जैसे, लेखक : पेन)।"
          },
          {
            en: "Make a simple sentence connecting A and B: 'A writer uses a pen to do work.'",
            hi: "A और B को जोड़ने वाला एक सरल वाक्य बनाएं: 'एक लेखक काम करने के लिए पेन का उपयोग करता है।'"
          },
          {
            en: "Insert the third word C (e.g. Doctor) into the exact same sentence skeleton: 'A doctor uses a ________ to do work.'",
            hi: "तीसरे शब्द C (जैसे डॉक्टर) को उसी वाक्य के ढांचे में डालें: 'एक डॉक्टर काम करने के लिए ________ का उपयोग करता है।'"
          },
          {
            en: "Find the word that fits perfectly (Stethoscope). That is your correct answer!",
            hi: "वह शब्द खोजें जो पूरी तरह फिट बैठता हो (स्टेथोस्कोप)। वही आपका सही उत्तर है!"
          }
        ]
      }
    },
    {
      id: "b_analogy_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_analogy_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Book is to Author as Statue is to ?\n\nStep 1: Check relation: Creator-to-Creation. An Author creates a Book.\nStep 2: Apply to second pair: A Sculptor creates a Statue.\nAnswer: Sculptor.",
        hi: "Level: Easy | उदाहरण 1: पुस्तक का जो संबंध लेखक से है, मूर्ति का वही संबंध किससे है?\n\nचरण 1: संबंध जांचें: रचनाकार-से-रचना का संबंध। एक लेखक पुस्तक बनाता है।\nचरण 2: दूसरे जोड़े पर लागू करें: एक मूर्तिकार मूर्ति बनाता है।\nउत्तर: Sculptor (मूर्तिकार)।"
      }
    },
    {
      id: "b_analogy_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Find the missing word: 'Wheel : Car :: Wing : ?'\n\nStep 1: Build bridge sentence: 'A Wheel is a part of a Car.' (Part-to-Whole relationship).\nStep 2: Apply to Wing: 'A Wing is a part of an [Airplane].'\nAnswer: Airplane.",
        hi: "Level: Medium | उदाहरण 2: लुप्त शब्द खोजें: 'Wheel : Car :: Wing : ?'\n\nचरण 1: ब्रिज वाक्य: 'पहिया (Wheel) कार का एक हिस्सा है।' (भाग-से-पूर्ण संबंध)।\nचरण 2: विंग (Wing) पर लागू करें: 'विंग हवाई जहाज (Airplane) का एक हिस्सा है।'\nउत्तर: Airplane।"
      }
    },
    {
      id: "b_analogy_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Find the correct matching pair: 'Lighthouse : Ships :: ? : ?'\n\nStep 1: Build bridge sentence: 'A Lighthouse guides Ships through dangerous waters.' (Guider-to-Guided relation).\nStep 2: Test options. If options show 'Traffic Light : Cars', verify: 'A Traffic Light guides Cars through roads'. This fits perfectly.\nAnswer: Traffic Light : Cars.",
        hi: "Level: Hard | उदाहरण 3: सही मिलान वाला जोड़ा खोजें: 'Lighthouse : Ships :: ? : ?'\n\nचरण 1: ब्रिज वाक्य: 'लाइटहाउस जहाजों (Ships) को रास्ता दिखाता है।'\nचरण 2: विकल्प जांचें: 'Traffic Light : Cars' बिल्कुल सही बैठता है क्योंकि ट्रैफिक लाइट कारों को रास्ता दिखाती है।\nउत्तर: Traffic Light : Cars।"
      }
    },
    {
      id: "b_analogy_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Complete the analogy: 'Scale : Weight :: Thermometer : ?'",
        hi: "ओलंपियाड चुनौती: सादृश्यता पूर्ण करें: 'Scale : Weight :: Thermometer : ?'"
      },
      metadata: {
        question: {
          en: "Select the correct option:",
          hi: "सही विकल्प चुनें:"
        },
        options: [
          { en: "Fever", hi: "बुखार" },
          { en: "Temperature", hi: "तापमान" },
          { en: "Mercury", hi: "पारा" },
          { en: "Heat", hi: "ऊष्मा" }
        ],
        correctIndex: 1,
        solution: {
          en: "A Scale is an instrument used to measure Weight. Similarly, a Thermometer is an instrument used to measure Temperature. Although it detects fever, temperature is the physical property measured, just as weight is the property measured by a scale.",
          hi: "तराजू (Scale) वजन मापने का एक उपकरण है। इसी तरह, थर्मामीटर तापमान (Temperature) मापने का उपकरण है। बुखार केवल एक अवस्था है, मापी जाने वाली भौतिक संपत्ति तापमान है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_analogy_summary",
      type: "summary",
      content: {
        en: "Word Analogies Summary Card",
        hi: "शब्द सादृश्य समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Analogies test comparative relationships between word pairs.", hi: "सादृश्यता शब्द युग्मों के बीच तुलनात्मक संबंधों का परीक्षण करती है।" },
          { en: "Common types include antonyms, synonyms, tool-action, and part-whole.", hi: "सामान्य प्रकारों में विलोम, पर्यायवाची, उपकरण-क्रिया और भाग-पूर्ण शामिल हैं।" }
        ],
        shortcuts: [
          { en: "Always build the Bridge Sentence first to keep order consistent.", hi: "क्रम को सुसंगत बनाए रखने के लिए हमेशा पहले ब्रिज वाक्य बनाएं।" },
          { en: "Ensure the parts of speech match: if pair 1 is Noun:Verb, pair 2 must be Noun:Verb.", hi: "सुनिश्चित करें कि व्याकरणिक प्रकार मेल खाते हों (संज्ञा:क्रिया तो संज्ञा:क्रिया ही हो)।" }
        ],
        mistakesToAvoid: [
          { en: "Do not swap the order. If the trigger is on the left, the result must be on the left.", hi: "क्रम को न बदलें। यदि कारण बाईं ओर है, तो परिणाम बाईं ओर होना चाहिए।" }
        ]
      }
    },
    {
      id: "b_analogy_parent",
      type: "parent-note",
      content: {
        en: "Word Analogies & Verbal Classification",
        hi: "शब्द सादृश्य और मौखिक वर्गीकरण"
      },
      metadata: {
        whyItMatters: {
          en: "Vocabulary relationships help children organize knowledge systems. It exercises categorization skills which are vital for verbal aptitude tests.",
          hi: "शब्दावली संबंध बच्चों को ज्ञान प्रणालियों को व्यवस्थित करने में मदद करते हैं। यह वर्गीकरण कौशल का अभ्यास कराता है जो मौखिक योग्यता परीक्षाओं के लिए महत्वपूर्ण है।"
        },
        commonStruggle: {
          en: "Children often ignore the grammatical categories of words (e.g. mapping a verb to a noun relationship).",
          hi: "बच्चे अक्सर शब्दों की व्याकरणिक श्रेणियों (जैसे संज्ञा से क्रिया का मिलान) को नजरअंदाज कर देते हैं।"
        },
        homeActivity: {
          en: "Play word bridge games during meals: 'A is part of B, like pedal is to bicycle. Now give me one for wheel.'",
          hi: "भोजन के समय वर्ड ब्रिज गेम खेलें: 'A, B का हिस्सा है, जैसे पेडल साइकिल का है। अब मुझे पहिये के लिए एक बताओ।'"
        }
      }
    }
  ]
};
