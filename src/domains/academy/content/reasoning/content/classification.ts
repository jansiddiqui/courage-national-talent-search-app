import { TopicContent } from "../../../core/types";

export const classificationContent: TopicContent = {
  id: "topic_classification",
  slug: "classification",
  version: 2,
  publishedAt: "2026-07-05",
  status: "published",
  title: {
    en: "Classification",
    hi: "वर्गीकरण (Classification)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_classification_easy", "q_classification_medium", "q_classification_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Find the shared property that connects 3 out of the 4 items.",
      "The odd one out is the item that does NOT fit that shared property.",
      "Check categories like mathematical traits, vocabulary classes, and letter positioning."
    ],
    quickTricks: [
      "Always state the rule aloud: 'Three of these are [Rule], and one is not.'"
    ]
  },
  blocks: [
    {
      id: "b_class_hook",
      type: "callout",
      content: {
        en: "Four friends are waiting in a line: Dog, Cat, Horse, and Eagle. One of them is a secret spy who doesn't belong to the team! Can you spot the imposter? \n\nYes, it's the Eagle! While the dog, cat, and horse are mammals who walk on the ground, the eagle is a bird who can fly. In reasoning, this game is called 'Classification' or 'Odd One Out'!",
        hi: "चार दोस्त एक कतार में खड़े हैं: कुत्ता, बिल्ली, घोड़ा और चील। उनमें से एक सीक्रेट जासूस है जो टीम का हिस्सा नहीं है! क्या आप उस बहरूपिये को पहचान सकते हैं?\n\nहाँ, वह चील है! जहाँ कुत्ता, बिल्ली और घोड़ा जमीन पर चलने वाले स्तनधारी जीव हैं, वहीं चील एक उड़ने वाला पक्षी है। रीजनिंग में इस खेल को 'वर्गीकरण' (Classification) या 'बेमेल शब्द खोजना' (Odd One Out) कहा जाता है!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_class_eli10",
      type: "callout",
      content: {
        en: "Classification means grouping items that share a secret club rule. Imagine three items are inside the club because they follow the rule, and one is left standing outside because it doesn't fit. To solve these puzzles, your target is NOT just to find something different about one item. Instead, you must first find the common rule that binds the other three together!",
        hi: "वर्गीकरण का अर्थ है उन चीजों को एक समूह में रखना जो एक गुप्त नियम का पालन करती हैं। कल्पना कीजिए कि तीन चीजें क्लब के अंदर हैं क्योंकि वे नियम का पालन करती हैं, और एक बाहर खड़ी है क्योंकि वह फिट नहीं बैठती। इन पहेलियों को हल करने के लिए, आपका लक्ष्य केवल किसी एक वस्तु में कुछ अलग ढूंढना नहीं है। इसके बजाय, आपको पहले उस सामान्य नियम को खोजना होगा जो अन्य तीन को एक साथ जोड़ता है!"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_class_life",
      type: "callout",
      content: {
        en: "You classify things every single day! Think about how you sort clean laundry (socks go in one drawer, shirts in another). Or how garbage is separated into wet waste (biodegradable) and dry waste (recyclable). Sorting helps our brains keep order in a busy world.",
        hi: "आप हर दिन चीजों का वर्गीकरण करते हैं! सोचिए कि आप साफ कपड़ों को कैसे छांटते हैं (मोजे एक दराज में, शर्ट दूसरी में)। या कचरे को गीले कचरे (सड़ने योग्य) और सूखे कचरे (पुनर्चक्रण योग्य) में कैसे अलग किया जाता है। चीजों को छांटने से हमारे दिमाग को व्यस्त दुनिया में व्यवस्था बनाए रखने में मदद मिलती है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_class_library_h",
      type: "heading",
      content: {
        en: "The Pattern Library (पैटर्न लाइब्रेरी)",
        hi: "पैटर्न लाइब्रेरी (The Pattern Library)"
      }
    },
    {
      id: "b_class_lib_intro",
      type: "paragraph",
      content: {
        en: "Test makers build classification questions using 3 main categories. Let's explore how to break them down:",
        hi: "वर्गीकरण के प्रश्न मुख्य रूप से 3 श्रेणियों में बांटे जा सकते हैं। आइए समझें कि इन्हें कैसे हल किया जाता है:"
      }
    },
    {
      id: "b_class_lib_table",
      type: "table",
      content: {
        en: "Classification Categories",
        hi: "वर्गीकरण श्रेणियां"
      },
      metadata: {
        headers: [
          { en: "Category", hi: "श्रेणी" },
          { en: "Common Club Rules", hi: "साझा नियम" },
          { en: "Example", hi: "उदाहरण" }
        ],
        rows: [
          [
            { en: "Word Classification", hi: "शब्द वर्गीकरण" },
            { en: "Common species, geography (states vs capitals), functions, materials.", hi: "समान प्रजाति, भूगोल (राज्य बनाम राजधानियाँ), कार्य, सामग्री।" },
            { en: "Gold, Silver, Platinum, Wood (Wood is non-metal)", hi: "सोना, चांदी, प्लैटिनम, लकड़ी (लकड़ी अधातु है)" }
          ],
          [
            { en: "Number Classification", hi: "संख्या वर्गीकरण" },
            { en: "Primes vs composites, even vs odd, perfect squares, divisibility rules.", hi: "अभाज्य बनाम भाज्य, सम बनाम विषम, पूर्ण वर्ग, विभाज्यता के नियम।" },
            { en: "9, 25, 49, 50 (50 is not a square number)", hi: "9, 25, 49, 50 (50 एक वर्ग संख्या नहीं है)" }
          ],
          [
            { en: "Alphabet Classification", hi: "वर्णमाला वर्गीकरण" },
            { en: "Vowel counts, letter spacing intervals, mirror opposite pairs.", hi: "स्वर (vowels) की संख्या, अक्षर विस्थापन अंतराल, विपरीत जोड़े।" },
            { en: "LNP, DFH, RTV, KMQ (KMQ has uneven spacing)", hi: "LNP, DFH, RTV, KMQ (KMQ में अंतराल असमान है)" }
          ]
        ]
      }
    },
    {
      id: "b_class_recipe_h",
      type: "heading",
      content: {
        en: "The Recipe: Find the Club Rule First",
        hi: "रेसिपी: पहले क्लब के नियम को खोजें"
      }
    },
    {
      id: "b_class_recipe",
      type: "recipe",
      content: {
        en: "Follow this exact checklist to avoid trap options:",
        hi: "गलत विकल्पों के जाल से बचने के लिए इस चेकलिस्ट का पालन करें:"
      },
      metadata: {
        steps: [
          {
            en: "Ignore the Odd One: Do not look at why one option is weird yet. Focus on the other three.",
            hi: "अकेले अंतर को छोड़ें: अभी यह न देखें कि कौन सा विकल्प अजीब है। बाकी तीन पर ध्यान केंद्रित करें।"
          },
          {
            en: "Build a Shared Rule: Find a rule that binds exactly 3 options. E.g., 'These three are prime numbers.'",
            hi: "एक साझा नियम बनाएं: एक ऐसा नियम खोजें जो ठीक 3 विकल्पों को जोड़ता हो। जैसे, 'ये तीनों अभाज्य संख्याएं हैं।'"
          },
          {
            en: "Verify the Imposter: Check if the 4th option breaks this exact rule. E.g., '25 is NOT a prime number.'",
            hi: "बहरूपिये की पुष्टि करें: जांचें कि क्या चौथा विकल्प इस नियम को तोड़ता है। जैसे, '25 अभाज्य संख्या नहीं है।'"
          },
          {
            en: "Double Check: Ensure no other rule divides the options in a different 3-to-1 split.",
            hi: "पुनः जांच करें: सुनिश्चित करें कि कोई अन्य नियम विकल्पों को अलग 3-बनाम-1 अनुपात में न बांट रहा हो।"
          }
        ]
      }
    },
    {
      id: "b_class_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_class_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Apple, Mango, Potato, Orange\n\nStudent Thinking: 'Potato grows underground, so it's different. But let's build the rule first!'\nCorrect Method:\n  - Apple, Mango, and Orange belong to the 'Fruits' club.\n  - Potato is a vegetable and does not belong to the Fruit club.\nShortcut: Rule is: Three are Fruits. Potato is the odd one out.",
        hi: "Level: Easy | उदाहरण 1: Apple, Mango, Potato, Orange\n\nछात्र की सोच: 'आलू जमीन के नीचे उगता है, इसलिए यह अलग है। लेकिन पहले नियम बनाते हैं!'\nसही तरीका:\n  - सेब (Apple), आम (Mango) और संतरा (Orange) 'फल' (Fruits) क्लब के सदस्य हैं।\n  - आलू (Potato) एक सब्जी है और फल क्लब का हिस्सा नहीं है।\nशॉर्टकट: नियम है: तीन फल हैं। आलू बेमेल (odd one out) है।"
      }
    },
    {
      id: "b_class_ex2",
      type: "example",
      content: {
        en: "Level: Easy | Example 2: Eye, Ear, Nose, Hand\n\nStudent Thinking: 'All are body parts. What is the sub-category?'\nCorrect Method:\n  - Eye, Ear, and Nose are 'Sense Organs' (help us see, hear, smell).\n  - Hand is an external organ used for physical action, not a sensory receptor.\nShortcut: Three are Sense Organs. Hand is the odd one out.",
        hi: "Level: Easy | उदाहरण 2: Eye, Ear, Nose, Hand\n\nछात्र की सोच: 'सभी शरीर के अंग हैं। उप-श्रेणी क्या है?'\nसही तरीका:\n  - आँख (Eye), कान (Ear) और नाक (Nose) 'ज्ञानेंद्रियाँ' (Sense Organs) हैं।\n  - हाथ (Hand) एक बाह्य कार्य करने वाला अंग है, ज्ञानेंद्रिय नहीं।\nशॉर्टकट: तीन ज्ञानेंद्रियाँ हैं। हाथ बेमेल है।"
      }
    },
    {
      id: "b_class_ex3",
      type: "example",
      content: {
        en: "Level: Easy | Example 3: 3, 5, 7, 9\n\nStudent Thinking: 'All are odd numbers! Let's check prime numbers.'\nIncorrect Method: Choosing 3 because it is the smallest. (Too subjective!).\nCorrect Method:\n  - 3, 5, and 7 are prime numbers (only divisible by 1 and themselves).\n  - 9 is a composite number (divisible by 1, 3, and 9).\nShortcut: Three are Prime numbers. 9 is the odd one out.",
        hi: "Level: Easy | उदाहरण 3: 3, 5, 7, 9\n\nछात्र की सोच: 'सभी विषम संख्याएँ हैं! आइए अभाज्य (prime) संख्याओं की जाँच करें।'\nगलत तरीका: 3 को चुनना क्योंकि वह सबसे छोटी संख्या है। (यह बहुत ही बुनियादी है!)।\nसही तरीका:\n  - 3, 5 और 7 अभाज्य संख्याएँ हैं (केवल 1 और स्वयं से विभाज्य)।\n  - 9 एक भाज्य संख्या है (1, 3 और 9 से विभाज्य)।\nशॉर्टकट: तीन अभाज्य संख्याएँ हैं। 9 बेमेल है।"
      }
    },
    {
      id: "b_class_ex4",
      type: "example",
      content: {
        en: "Level: Medium | Example 4: 27, 64, 125, 144\n\nStudent Thinking: 'These are large numbers. Let's check squares and cubes!'\nCorrect Method:\n  - 27 = 3³ (Cube of 3)\n  - 64 = 4³ (Cube of 4)\n  - 125 = 5³ (Cube of 5)\n  - 144 = 12² (Square of 12, not a perfect cube!)\nShortcut: Three are perfect cubes. 144 is the odd one out.",
        hi: "Level: Medium | उदाहरण 4: 27, 64, 125, 144\n\nछात्र की सोच: 'ये बड़ी संख्याएँ हैं। आइए वर्ग और घन की जाँच करें!'\nसही तरीका:\n  - 27 = 3³ (3 का घन)\n  - 64 = 4³ (4 का घन)\n  - 125 = 5³ (5 का घन)\n  - 144 = 12² (12 का वर्ग है, घन नहीं!)\nशॉर्टकट: तीन संख्याएँ पूर्ण घन (perfect cubes) हैं। 144 बेमेल है।"
      }
    },
    {
      id: "b_class_ex5",
      type: "example",
      content: {
        en: "Level: Medium | Example 5: Asia, Africa, Europe, India\n\nStudent Thinking: 'India is a country in Asia. Let's check the others.'\nCorrect Method:\n  - Asia, Africa, and Europe are 'Continents'.\n  - India is a 'Country'.\nShortcut: Three are Continents. India is the odd one out.",
        hi: "Level: Medium | उदाहरण 5: Asia, Africa, Europe, India\n\nछात्र की सोच: 'भारत एशिया का एक देश है। दूसरों को देखते हैं।'\nसही तरीका:\n  - एशिया (Asia), अफ्रीका (Africa) और यूरोप (Europe) 'महाद्वीप' (Continents) हैं।\n  - भारत (India) एक 'देश' (Country) है।\nशॉर्टकट: तीन महाद्वीप हैं। भारत बेमेल है।"
      }
    },
    {
      id: "b_class_ex6",
      type: "example",
      content: {
        en: "Level: Medium | Example 6: AE, IO, OU, UY\n\nStudent Thinking: 'Letters! Let's check vowels.'\nCorrect Method:\n  - AE contains only vowels (A and E).\n  - IO contains only vowels (I and O).\n  - OU contains only vowels (O and U).\n  - UY contains a vowel (U) and a consonant (Y).\nShortcut: Three pairs contain only vowels. UY is the odd one out.",
        hi: "Level: Medium | उदाहरण 6: AE, IO, OU, UY\n\nछात्र की सोच: 'अक्षर! आइए वोवेल्स (vowels) की जांच करें।'\nसही तरीका:\n  - AE में केवल स्वर (vowels) हैं (A और E)।\n  - IO में केवल स्वर हैं (I और O)।\n  - OU में केवल स्वर हैं (O और U)।\n  - UY में एक स्वर (U) और एक व्यंजन (Y) है।\nशॉर्टकट: तीन जोड़ों में केवल स्वर (vowels) हैं। UY बेमेल है।"
      }
    },
    {
      id: "b_class_ex7",
      type: "example",
      content: {
        en: "Level: Hard | Example 7: LNP, DFH, RTV, KMQ\n\nStudent Thinking: 'Positions! Let's convert letters to numbers.'\nCorrect Method:\n  - L(12) ➔ N(14) ➔ P(16) [Rule: +2, +2]\n  - D(4) ➔ F(6) ➔ H(8) [Rule: +2, +2]\n  - R(18) ➔ T(20) ➔ V(22) [Rule: +2, +2]\n  - K(11) ➔ M(13) ➔ Q(17) [Rule: +2, +4! This breaks the pattern]\nShortcut: Check letter gap intervals. KMQ is the odd one out.",
        hi: "Level: Hard | उदाहरण 7: LNP, DFH, RTV, KMQ\n\nछात्र की सोच: 'अक्षरों की स्थिति! आइए इन्हें अंकों में बदलें।'\nसही तरीका:\n  - L(12) ➔ N(14) ➔ P(16) [नियम: +2, +2]\n  - D(4) ➔ F(6) ➔ H(8) [नियम: +2, +2]\n  - R(18) ➔ T(20) ➔ V(22) [नियम: +2, +2]\n  - K(11) ➔ M(13) ➔ Q(17) [नियम: +2, +4! यह पैटर्न तोड़ता है]\nशॉर्टकट: अक्षरों के बीच के अंतर की जांच करें। KMQ बेमेल है।"
      }
    },
    {
      id: "b_class_ex8",
      type: "example",
      content: {
        en: "Level: Hard | Example 8: 12, 24, 30, 48\n\nStudent Thinking: 'All are even numbers. All are divisible by 2 and 3. Let's check higher divisibility.'\nIncorrect Method: Choosing 30 because it ends in 0. (Too basic, check factor rules first!).\nCorrect Method:\n  - 12, 24, and 48 are divisible by 12 (12×1=12, 12×2=24, 12×4=48).\n  - 30 is NOT divisible by 12.\nShortcut: Divisibility by 12. Answer is 30.",
        hi: "Level: Hard | उदाहरण 8: 12, 24, 30, 48\n\nछात्र की सोच: 'सभी सम संख्याएँ हैं। सभी 2 और 3 से विभाज्य हैं। आइए उच्च विभाज्यता की जांच करें।'\nगलत तरीका: 30 को चुनना क्योंकि यह 0 पर समाप्त होता है। (यह बहुत ही बुनियादी है, पहले गुणांक नियमों को देखें!)।\nसही तरीका:\n  - 12, 24 और 48 संख्या 12 से पूरी तरह विभाज्य हैं (12×1=12, 12×2=24, 12×4=48)।\n  - 30 संख्या 12 से विभाज्य नहीं है।\nशॉर्टकट: 12 से विभाज्यता का नियम। उत्तर 30 है।"
      }
    },
    {
      id: "b_class_mistakes",
      type: "warning",
      content: {
        en: "Common Mistake: Choosing an option because it is 'unique' in some way. E.g., choosing '9' in the set (3, 5, 7, 9) because it's a square number. While true, 3, 5, and 7 do not have a rule that leaves 9 out (unless you establish a group rule like 'Three are primes'). Always define the group's rule first, rather than focusing on the odd item's traits directly!",
        hi: "सामान्य गलती: किसी विकल्प को इसलिए चुनना क्योंकि वह किसी तरह से 'अनोखा' है। जैसे, (3, 5, 7, 9) के समूह में '9' चुनना क्योंकि वह एक वर्ग संख्या है। हालांकि यह सच है, लेकिन 3, 5 और 7 के पास ऐसा कोई नियम नहीं है जो 9 को बाहर करता हो (जब तक कि आप 'तीन अभाज्य हैं' जैसा समूह नियम स्थापित न करें)। हमेशा पहले समूह का नियम परिभाषित करें, न कि सीधे बेमेल वस्तु के लक्षणों पर ध्यान केंद्रित करें!"
      }
    },
    {
      id: "b_class_tricks",
      type: "callout",
      content: {
        en: "The Rule of Three:\n  An item is the odd one out ONLY if you can state a rule that unites the other three. If you cannot describe the club rule of the other three in a single sentence, your answer is probably incorrect!",
        hi: "तीन का नियम (Rule of Three):\n  कोई वस्तु बेमेल केवल तभी है जब आप एक ऐसा नियम बता सकें जो अन्य तीन को एक सूत्र में जोड़ता हो। यदि आप एक वाक्य में अन्य तीन के क्लब नियम का वर्णन नहीं कर सकते हैं, तो आपका उत्तर शायद गलत है!"
      },
      metadata: {
        icon: "secret",
        theme: "violet"
      }
    },
    {
      id: "b_class_challenge",
      type: "challenge",
      content: {
        en: "Find the odd one out: Mercury, Venus, Moon, Mars",
        hi: "बेमेल शब्द ज्ञात कीजिए: Mercury, Venus, Moon, Mars"
      },
      metadata: {
        options: [
          { en: "Mercury", hi: "बुध (Mercury)" },
          { en: "Venus", hi: "शुक्र (Venus)" },
          { en: "Moon", hi: "चंद्रमा (Moon)" },
          { en: "Mars", hi: "मंगल (Mars)" }
        ],
        correctIndex: 2,
        solution: {
          en: "The correct answer is Moon.\nLet's define the club rule for the other three:\n  - Mercury, Venus, and Mars are 'Planets' orbiting the Sun.\n  - The Moon is a 'Natural Satellite' (orbiting the Earth, not a planet).\n  Therefore, the Moon is the odd one out.",
          hi: "सही उत्तर Moon (चंद्रमा) है।\nआइए बाकी तीन के लिए क्लब नियम परिभाषित करें:\n  - बुध (Mercury), शुक्र (Venus) और मंगल (Mars) सूर्य की परिक्रमा करने वाले 'ग्रह' (Planets) हैं।\n  - चंद्रमा (Moon) एक 'प्राकृतिक उपग्रह' (satellite) है जो पृथ्वी की परिक्रमा करता है, ग्रह नहीं।\n  इसलिए, चंद्रमा बेमेल है।"
        },
        level: "standard"
      }
    },
    {
      id: "b_class_super_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Find the odd one out: 126, 215, 342, 511",
        hi: "ओलंपियाड चुनौती: बेमेल संख्या ज्ञात कीजिए: 126, 215, 342, 511"
      },
      metadata: {
        options: [
          { en: "126", hi: "126" },
          { en: "215", hi: "215" },
          { en: "342", hi: "342" },
          { en: "511", hi: "511" }
        ],
        correctIndex: 0,
        solution: {
          en: "The correct answer is 126.\nLet's check how these numbers relate to perfect cubes:\n  - 215 = 6³ - 1 (216 - 1)\n  - 342 = 7³ - 1 (343 - 1)\n  - 511 = 8³ - 1 (512 - 1)\n  The club rule for these three is: 'Cube of an integer minus 1' (n³ - 1).\n  - But 126 = 5³ + 1 (125 + 1).\n  Since it adds 1 instead of subtracting, 126 is the odd one out.",
          hi: "सही उत्तर 126 है।\nआइए देखें कि ये संख्याएँ पूर्ण घनों (perfect cubes) से कैसे संबंधित हैं:\n  - 215 = 6³ - 1 (216 - 1)\n  - 342 = 7³ - 1 (343 - 1)\n  - 511 = 8³ - 1 (512 - 1)\n  इन तीनों के लिए क्लब नियम है: 'संख्या का घन घटाव 1' (n³ - 1)।\n  - लेकिन 126 = 5³ + 1 (125 + 1) है।\n  क्योंकि यह 1 घटाने के बजाय 1 जोड़ता है, इसलिए 126 बेमेल है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_class_summary",
      type: "summary",
      content: {
        en: "Classification Summary Card",
        hi: "वर्गीकरण समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Classification involves finding the shared rule of the majority.", hi: "वर्गीकरण में अधिकांश वस्तुओं के साझा नियम को खोजना शामिल है।" },
          { en: "Always search for a rule that binds exactly three options together.", hi: "हमेशा एक ऐसा नियम खोजें जो ठीक तीन विकल्पों को आपस में जोड़ता हो।" },
          { en: "Odd item is the one that breaks the shared group rule.", hi: "बेमेल वस्तु वह होती है जो समूह के साझा नियम को तोड़ती है।" }
        ],
        shortcuts: [
          { en: "Rule of Three: Three must be inside the club, one must be outside.", hi: "तीन का नियम: तीन वस्तुएं क्लब के अंदर होनी चाहिए, एक बाहर।" },
          { en: "For numbers, check prime status and cube/square offsets (+1, -1) first.", hi: "संख्याओं के लिए, सबसे पहले अभाज्य स्थिति और वर्ग/घन के अंतर (+1, -1) की जांच करें।" }
        ],
        mistakesToAvoid: [
          { en: "Don't pick an option just because it looks different in a subjective way.", hi: "केवल इसलिए किसी विकल्प को न चुनें क्योंकि वह किसी सतही रूप में अलग दिखता है।" },
          { en: "Ensure your group rule is mathematically or logically sound, not a coincidence.", hi: "सुनिश्चित करें कि आपका समूह नियम तार्किक रूप से पुख्ता हो, कोई संयोग न हो।" }
        ]
      }
    },
    {
      id: "b_class_parent",
      type: "parent-note",
      content: {
        en: "Taxonomic Grouping & Logical Categorization",
        hi: "वर्गीकरण तर्क और संज्ञानात्मक विकास कौशल"
      },
      metadata: {
        whyItMatters: {
          en: "Classification tests a child's taxonomy sorting, subset logic, and feature isolation. This logic directly maps to science (categorizing animals, elements) and computer science (sorting algorithms, database queries).",
          hi: "वर्गीकरण बच्चों की चीजों को छांटने, उप-समूह बनाने और गुणों को अलग करने की क्षमता का परीक्षण करता है। यह तर्क सीधे विज्ञान (जीवों, तत्वों का वर्गीकरण) और कंप्यूटर साइंस (डेटाबेस वर्गीकरण) में काम आता है।"
        },
        commonStruggle: {
          en: "Students often look for what is 'strange' about one item without validating the other three. This makes them fall for trap options designed to look superficially different.",
          hi: "बच्चे अक्सर यह देखना शुरू कर देते हैं कि किसी एक वस्तु में क्या 'अजीब' है, बिना बाकी तीनों की जांच किए। इससे वे जाल वाले विकल्पों (traps) में फंस जाते हैं जो दिखने में अलग लगते हैं।"
        },
        homeActivity: {
          en: "In the kitchen or bookshelf, put 3 similar objects and 1 slightly different object together (e.g. 3 steel spoons and 1 plastic fork). Ask your child: 'Find the spy! Tell me the rule that binds the other three.'",
          hi: "रसोई में या किताबों की अलमारी पर, 3 समान वस्तुएं और 1 थोड़ी अलग वस्तु एक साथ रखें (जैसे 3 स्टील के चम्मच और 1 प्लास्टिक का कांटा)। अपने बच्चे से कहें: 'जासूस को पहचानो! और वह नियम बताओ जो बाकी तीन को जोड़ता है।'"
        }
      }
    }
  ]
};
