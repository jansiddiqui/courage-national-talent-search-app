import { TopicContent } from "../../../core/types";

export const analogyContent: TopicContent = {
  id: "topic_analogy",
  slug: "analogy",
  version: 2,
  publishedAt: "2026-07-05",
  status: "published",
  title: {
    en: "Analogy",
    hi: "सादृश्यता (Analogy)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_analogy_easy", "q_analogy_medium", "q_analogy_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Find the exact relationship in the first pair before checking the second.",
      "Check the order of the relationship (A is to B, not B is to A).",
      "Use the Bridge Sentence Method to avoid silly mistakes."
    ],
    quickTricks: [
      "Create a sentence for the first pair: 'A is used for B'. Apply this exact sentence to the second pair."
    ]
  },
  blocks: [
    {
      id: "b_analogy_hook",
      type: "callout",
      content: {
        en: "If a bird is to the sky (Bird : Sky), then a fish is to... what? \n\nWater! Of course. This is an analogy—a game of matching relationships. Just like a bird flies in the sky, a fish swims in the water. Your brain is a supercomputer at finding relationships. Let's see how to map these logical bridges!",
        hi: "यदि एक पक्षी का संबंध आसमान से है (पक्षी : आसमान), तो एक मछली का संबंध... किससे होगा? \n\nपानी से! बिल्कुल सही। इसे ही सादृश्यता (Analogy) कहते हैं—संबंधों को मिलाने का खेल। जैसे पक्षी आसमान में उड़ता है, वैसे ही मछली पानी में तैरती है। आपका दिमाग रिश्तों को खोजने में सुपर कंप्यूटर है। आइए देखें कि इन तार्किक पुलों को कैसे बनाया जाता है!"
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
        en: "An Analogy is like a 'logical bridge' connecting two islands. The first pair of words shows you how the bridge is built. Your job is to walk across that bridge and build a twin bridge that looks exactly the same for the second pair! If the first bridge is 'Object is made of Material', the second bridge MUST also be 'Object is made of Material'. No changes allowed!",
        hi: "सादृश्यता दो द्वीपों को जोड़ने वाले एक 'तार्किक पुल' (Logical Bridge) की तरह है। पहला जोड़ा आपको दिखाता है कि पुल कैसे बनाया गया है। आपका काम उस पुल पर चलना है और दूसरे जोड़े के लिए बिल्कुल वैसा ही एक जुड़वां पुल बनाना है! यदि पहला पुल 'वस्तु : जिस सामग्री से बनी है' का है, तो दूसरा पुल भी अनिवार्य रूप से 'वस्तु : जिस सामग्री से बनी है' का ही होना चाहिए। कोई बदलाव नहीं!"
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
        en: "We use analogies to explain complex ideas all the time! Have you ever said 'This bedroom is as messy as a pigsty'? Or 'He is as brave as a lion'? Analogies help us explain the unknown by linking it to things we already know and love.",
        hi: "हम हर समय जटिल विचारों को समझाने के लिए सादृश्यताओं का उपयोग करते हैं! क्या आपने कभी कहा है 'यह कमरा चिड़ियाघर जैसा बिखरा है'? या 'वह शेर की तरह बहादुर है'? सादृश्यता हमें उन चीजों से जोड़कर अज्ञात को समझाने में मदद करती है जिन्हें हम पहले से जानते हैं।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_analogy_diag_h",
      type: "heading",
      content: {
        en: "The Analogy Formula (सादृश्यता सूत्र)",
        hi: "सादृश्यता सूत्र (The Analogy Formula)"
      }
    },
    {
      id: "b_analogy_diag",
      type: "diagram",
      content: {
        en: "The colon (:) means 'is related to'. The double colon (::) means 'in the same way'.",
        hi: "कोलन (:) का अर्थ है 'का संबंध है'। डबल कोलन (::) का अर्थ है 'ठीक उसी तरह से'।"
      },
      metadata: {
        type: "flowchart",
        nodes: [
          { id: "1", label: { en: "A : B", hi: "A : B" } },
          { id: "2", label: { en: "Same Relationship (::)", hi: "समान संबंध (::)" }, parentId: "1" },
          { id: "3", label: { en: "C : D", hi: "C : D" }, parentId: "2" }
        ],
        config: {}
      }
    },
    {
      id: "b_analogy_library_h",
      type: "heading",
      content: {
        en: "The Pattern Library (पैटर्न लाइब्रेरी)",
        hi: "पैटर्न लाइब्रेरी (The Pattern Library)"
      }
    },
    {
      id: "b_analogy_lib_intro",
      type: "paragraph",
      content: {
        en: "In cognitive reasoning, analogies fall into 3 main categories. Let's study how they work:",
        hi: "रीजनिंग में, सादृश्यताएं मुख्य रूप से 3 श्रेणियों में आती हैं। आइए जानें कि वे कैसे काम करती हैं:"
      }
    },
    {
      id: "b_analogy_lib_table",
      type: "table",
      content: {
        en: "Analogy Categories",
        hi: "सादृश्यता श्रेणियां"
      },
      metadata: {
        headers: [
          { en: "Category", hi: "श्रेणी" },
          { en: "Logical Relationship", hi: "तार्किक संबंध" },
          { en: "Example", hi: "उदाहरण" }
        ],
        rows: [
          [
            { en: "Word Analogy", hi: "शब्द सादृश्यता" },
            { en: "Tool/Action, Synonym/Antonym, Animal/Home, Part/Whole.", hi: "औजार/कार्य, पर्यायवाची/विलोम, पशु/आवास, भाग/पूर्ण।" },
            { en: "Chef : Knife :: Carpenter : Saw", hi: "रसोइया : चाकू :: बढ़ई : आरी" }
          ],
          [
            { en: "Number Analogy", hi: "संख्या सादृश्यता" },
            { en: "Squares, Cubes, Multiplying factors, or Digit sums.", hi: "वर्ग, घन, गुणात्मक कारक, या अंकों का योग।" },
            { en: "4 : 16 :: 5 : 25 (Square rule)", hi: "4 : 16 :: 5 : 25 (वर्ग का नियम)" }
          ],
          [
            { en: "Alphabet Analogy", hi: "वर्णमाला सादृश्यता" },
            { en: "Letter shifting, reverse letter positions.", hi: "अक्षरों का विस्थापन, विपरीत अक्षरों की स्थिति।" },
            { en: "CAT : DDY :: DOG : ? (Shift pattern)", hi: "CAT : DDY :: DOG : ? (विस्थापन पैटर्न)" }
          ]
        ]
      }
    },
    {
      id: "b_analogy_recipe_h",
      type: "heading",
      content: {
        en: "The Recipe: The Bridge Sentence Method",
        hi: "रेसिपी: ब्रिज सेंटेंस मेथड (ब्रिज वाक्य विधि)"
      }
    },
    {
      id: "b_analogy_recipe",
      type: "recipe",
      content: {
        en: "Never guess! Always build a sentence first:",
        hi: "कभी भी तुक्का न लगाएं! हमेशा पहले एक वाक्य बनाएं:"
      },
      metadata: {
        steps: [
          {
            en: "Build a Sentence: Write a simple sentence using the first pair. E.g., for 'Pen : Write', say: 'A Pen is used to Write.'",
            hi: "एक वाक्य बनाएं: पहले जोड़े का उपयोग करके एक सरल वाक्य लिखें। जैसे, 'Pen : Write' के लिए कहें: 'एक पेन का उपयोग लिखने के लिए किया जाता है।'"
          },
          {
            en: "Check the Direction: Make sure you go from left to right. Don't swap the order!",
            hi: "दिशा की जांच करें: सुनिश्चित करें कि आप बाएं से दाएं जा रहे हैं। क्रम को न बदलें!"
          },
          {
            en: "Apply the Sentence: Test the exact same sentence on the third word. 'A Fork is used to [Eat].'",
            hi: "वाक्य लागू करें: तीसरे शब्द पर बिल्कुल उसी वाक्य का परीक्षण करें। 'एक कांटे (Fork) का उपयोग [खाने] के लिए किया जाता है।'"
          },
          {
            en: "Select and Verify: Pick the option that fits the sentence perfectly and check for any double meaning.",
            hi: "चुनें और पुष्टि करें: वह विकल्प चुनें जो वाक्य में बिल्कुल फिट बैठता है और किसी दोहरे अर्थ की जांच करें।"
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
        en: "Level: Easy | Example 1: Doctor : Hospital :: Teacher : ?\n\nStudent Thinking: 'A doctor works in a hospital. Where does a teacher work?'\nIncorrect Method: 'Teacher teaches.' (This is an action, not a place!).\nCorrect Method: Build the Bridge Sentence:\n  - 'A Doctor works at a Hospital.'\n  - Apply to teacher: 'A Teacher works at a [School].'\nShortcut: Match the category (Profession : Location). Answer is School.",
        hi: "Level: Easy | उदाहरण 1: Doctor : Hospital :: Teacher : ?\n\nछात्र की सोच: 'एक डॉक्टर अस्पताल में काम करता है। एक शिक्षक कहाँ काम करता है?'\nगलत तरीका: 'शिक्षक पढ़ाता है।' (यह एक क्रिया है, कार्यस्थल नहीं!)।\nसही तरीका: ब्रिज वाक्य बनाएं:\n  - 'एक डॉक्टर अस्पताल (Hospital) में काम करता है।'\n  - शिक्षक पर लागू करें: 'एक शिक्षक स्कूल (School) में काम करता है।'\nशॉर्टकट: श्रेणी का मिलान करें (पेशा : स्थान)। उत्तर School (स्कूल) है।"
      }
    },
    {
      id: "b_analogy_ex2",
      type: "example",
      content: {
        en: "Level: Easy | Example 2: Lion : Den :: Cow : ?\n\nStudent Thinking: 'This is about animals and their homes!'\nCorrect Method: Bridge Sentence:\n  - 'A Lion lives in a Den.'\n  - Apply to Cow: 'A Cow lives in a [Shed].'\nShortcut: Animal : Shelter. Answer is Shed.",
        hi: "Level: Easy | उदाहरण 2: Lion : Den :: Cow : ?\n\nछात्र की सोच: 'यह जानवरों और उनके घरों के बारे में है!'\nसही तरीका: ब्रिज वाक्य:\n  - 'एक शेर गुफा (Den) में रहता है।'\n  - गाय पर लागू करें: 'एक गाय शेड (Shed) में रहती है।'\nशॉर्टकट: पशु : आवास। उत्तर Shed (शेड) है।"
      }
    },
    {
      id: "b_analogy_ex3",
      type: "example",
      content: {
        en: "Level: Easy | Example 3: Scissors : Cut :: Pen : ?\n\nStudent Thinking: 'What is the action of the tool?'\nCorrect Method: Bridge Sentence:\n  - 'Scissors are used to Cut.'\n  - Apply to Pen: 'A Pen is used to [Write].'\nShortcut: Tool : Action. Answer is Write.",
        hi: "Level: Easy | उदाहरण 3: Scissors : Cut :: Pen : ?\n\nछात्र की सोच: 'औजार का काम क्या है?'\nसही तरीका: ब्रिज वाक्य:\n  - 'कैंची का उपयोग काटने (Cut) के लिए किया जाता है।'\n  - पेन पर लागू करें: 'एक पेन का उपयोग लिखने (Write) के लिए किया जाता है।'\nशॉर्टकट: औजार : कार्य। उत्तर Write (लिखना) है।"
      }
    },
    {
      id: "b_analogy_ex4",
      type: "example",
      content: {
        en: "Level: Medium | Example 4: 9 : 81 :: 7 : ?\n\nStudent Thinking: 'How does 9 relate to 81? Ah, 9 × 9 = 81 (Square rule).'\nIncorrect Method: '9 + 72 = 81, so 7 + 72 = 79.' (Usually, test makers prefer squares/multiples over simple large additions in analogies).\nCorrect Method:\n  - 9² = 81\n  - 7² = 49\nShortcut: Apply the square logic directly. Answer is 49.",
        hi: "Level: Medium | उदाहरण 4: 9 : 81 :: 7 : ?\n\nछात्र की सोच: '9 का संबंध 81 से कैसे है? अह, 9 × 9 = 81 (वर्ग नियम)।'\nगलत तरीका: '9 + 72 = 81, इसलिए 7 + 72 = 79।' (आमतौर पर, परीक्षक सरल बड़े जोड़ के बजाय वर्ग या गुणा को प्राथमिकता देते हैं)।\nसही तरीका:\n  - 9² = 81\n  - 7² = 49\nशॉर्टकट: सीधे वर्ग नियम लागू करें। उत्तर 49 है।"
      }
    },
    {
      id: "b_analogy_ex5",
      type: "example",
      content: {
        en: "Level: Medium | Example 5: CAT : DDY :: DOG : ?\n\nStudent Thinking: 'Letters are shifting! Let's check positions: C(+1)=D, A(+3)=D, T(+5)=Y. Shifts are +1, +3, +5.'\nCorrect Method: Apply the same shifting logic to DOG:\n  - D (+1) = E\n  - O (+3) = R\n  - G (+5) = L\nShortcut: Translate to numbers, add shift ranks (+1, +3, +5), translate back. Answer is ERL.",
        hi: "Level: Medium | उदाहरण 5: CAT : DDY :: DOG : ?\n\nछात्र की सोच: 'अक्षर विस्थापित हो रहे हैं! आइए विस्थापन देखें: C(+1)=D, A(+3)=D, T(+5)=Y। यानी +1, +3, +5 का पैटर्न है।'\nसही तरीका: यही नियम DOG पर लागू करें:\n  - D (+1) = E\n  - O (+3) = R\n  - G (+5) = L\nशॉर्टकट: अक्षरों की स्थिति में क्रमशः +1, +3, +5 जोड़ें। उत्तर ERL है।"
      }
    },
    {
      id: "b_analogy_ex6",
      type: "example",
      content: {
        en: "Level: Medium | Example 6: 6 : 18 :: 4 : ?\n\nStudent Thinking: '6 × 3 = 18. Let's try 4 × 3 = 12. But what if 12 is not in the options?'\nCorrect Method (Alternate Rule): Try (Number² / 2):\n  - 6² / 2 = 36 / 2 = 18\n  - Apply to 4: 4² / 2 = 16 / 2 = 8\nShortcut: Always look for options to confirm whether the rule is ×3 or n²/2. Answer is 8 (or 12 depending on choices).",
        hi: "Level: Medium | उदाहरण 6: 6 : 18 :: 4 : ?\n\nछात्र की सोच: '6 × 3 = 18. आइए 4 × 3 = 12 का प्रयास करें। लेकिन क्या होगा अगर 12 विकल्प में न हो?'\nसही तरीका (वैकल्पिक नियम): (संख्या² / 2) का प्रयास करें:\n  - 6² / 2 = 36 / 2 = 18\n  - 4 पर लागू करें: 4² / 2 = 16 / 2 = 8\nशॉर्टकट: विकल्प हमेशा स्पष्ट करते हैं कि नियम ×3 है या n²/2। उत्तर 8 है।"
      }
    },
    {
      id: "b_analogy_ex7",
      type: "example",
      content: {
        en: "Level: Hard | Example 7: Clock : Time :: Thermometer : ?\n\nStudent Thinking: 'A clock shows time. What does a thermometer show?'\nIncorrect Method: 'Fever' or 'Doctor'. (Fever is a state, not the standard dimension. Clock measures time, Thermometer measures temperature!).\nCorrect Method: Bridge Sentence:\n  - 'A Clock measures Time.'\n  - Apply: 'A Thermometer measures [Temperature].'\nShortcut: Instrument : Dimension Measured. Answer is Temperature.",
        hi: "Level: Hard | उदाहरण 7: Clock : Time :: Thermometer : ?\n\nछात्र की सोच: 'एक घड़ी समय दिखाती है। थर्मामीटर क्या दिखाता है?'\nगलत तरीका: 'बुखार' या 'डॉक्टर'। (बुखार एक स्थिति है, मूल माप नहीं। घड़ी समय मापती है, थर्मामीटर तापमान मापता है!)।\nसही तरीका: ब्रिज वाक्य:\n  - 'एक घड़ी (Clock) समय (Time) को मापती है।'\n  - थर्मामीटर पर लागू करें: 'एक थर्मामीटर तापमान (Temperature) को मापता है।'\nशॉर्टकट: यंत्र : मापी जाने वाली इकाई। उत्तर Temperature (तापमान) है।"
      }
    },
    {
      id: "b_analogy_ex8",
      type: "example",
      content: {
        en: "Level: Hard | Example 8: 123 : 36 :: 234 : ?\n\nStudent Thinking: '123 is a huge number! How do we get 36? Let's check digit operations.'\nCorrect Method: Sum of digits, then square:\n  - (1 + 2 + 3)² = 6² = 36\n  - Apply to 234: (2 + 3 + 4)² = 9² = 81\nShortcut: (Sum of Digits)². Answer is 81.",
        hi: "Level: Hard | उदाहरण 8: 123 : 36 :: 234 : ?\n\nछात्र की सोच: '123 बहुत बड़ी संख्या है! हमें 36 कैसे मिल सकता है? आइए अंकों के योग पर विचार करें।'\nसही तरीका: अंकों को जोड़ें, फिर वर्ग करें:\n  - (1 + 2 + 3)² = 6² = 36\n  - 234 पर लागू करें: (2 + 3 + 4)² = 9² = 81\nशॉर्टकट: (अंकों का योग)²। उत्तर 81 है।"
      }
    },
    {
      id: "b_analogy_mistakes",
      type: "warning",
      content: {
        en: "Common Mistake: Reversing the order of the relationship. If the first pair is Profession : Tool (Chef : Knife), the answer must be Profession : Tool (Carpenter : Saw), NOT Tool : Profession (Saw : Carpenter). Always check the direction of your bridge sentence!",
        hi: "सामान्य गलती: संबंध के क्रम को उलट देना। यदि पहला जोड़ा 'पेशा : औजार' (रसोइया : चाकू) है, तो उत्तर भी 'पेशा : औजार' (बढ़ई : आरी) होना चाहिए, न कि 'औजार : पेशा' (आरी : बढ़ई)। हमेशा अपने ब्रिज वाक्य की दिशा की जांच करें!"
      }
    },
    {
      id: "b_analogy_tricks",
      type: "callout",
      content: {
        en: "The Golden Rule of Analogies:\n  Always build a specific bridge sentence. A loose sentence like 'A doctor works with patients' might lead to mistakes. A tight sentence like 'A stethoscope is a diagnostic tool used by a Doctor' will always guide you to the single correct option.",
        hi: "सादृश्यता का स्वर्ण नियम:\n  हमेशा एक स्पष्ट और सटीक ब्रिज वाक्य बनाएं। एक ढीला-ढाला वाक्य जैसे 'डॉक्टर मरीज के साथ काम करता है' गलतियां करा सकता है। एक सटीक वाक्य जैसे 'स्टेथोस्कोप डॉक्टर द्वारा इस्तेमाल किया जाने वाला एक जांच उपकरण है' आपको हमेशा सही विकल्प तक ले जाएगा।"
      },
      metadata: {
        icon: "secret",
        theme: "violet"
      }
    },
    {
      id: "b_analogy_challenge",
      type: "challenge",
      content: {
        en: "Complete this analogy: Calendar : Date :: Dictionary : ________",
        hi: "इस सादृश्यता को पूरा कीजिए: कैलेंडर : तारीख :: शब्दकोश (Dictionary) : ________"
      },
      metadata: {
        options: [
          { en: "Vocabulary", hi: "शब्दावली" },
          { en: "Book", hi: "किताब" },
          { en: "Words", hi: "शब्द (Words)" },
          { en: "Language", hi: "भाषा" }
        ],
        correctIndex: 2,
        solution: {
          en: "The correct answer is Words.\nLet's build the bridge sentence:\n  - 'A Calendar is used to find a Date.'\n  - Apply to dictionary: 'A Dictionary is used to find [Words].'\n  While vocabulary is related, we search for specific individual 'Words' in a dictionary, just like we look for specific 'Dates' in a calendar.",
          hi: "सही उत्तर Words (शब्द) है।\nआइए ब्रिज वाक्य बनाएं:\n  - 'एक कैलेंडर (Calendar) का उपयोग तारीख (Date) खोजने के लिए किया जाता है।'\n  - शब्दकोश पर लागू करें: 'एक शब्दकोश (Dictionary) का उपयोग शब्द (Words) खोजने के लिए किया जाता है।'\n  हालांकि शब्दावली भी संबंधित है, लेकिन हम शब्दकोश में विशिष्ट 'शब्दों' को खोजते हैं, ठीक वैसे ही जैसे कैलेंडर में 'तारीख' देखते हैं।"
        },
        level: "standard"
      }
    },
    {
      id: "b_analogy_super_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Complete the analogy: 8 : 28 :: 15 : ________",
        hi: "ओलंपियाड चुनौती: सादृश्यता को पूरा कीजिए: 8 : 28 :: 15 : ________"
      },
      metadata: {
        options: [
          { en: "65", hi: "65" },
          { en: "48", hi: "48" },
          { en: "35", hi: "35" },
          { en: "50", hi: "50" }
        ],
        correctIndex: 0,
        solution: {
          en: "The correct answer is 65.\nLet's analyze the relationship between 8 and 28:\n  - 8 can be written as 3² - 1.\n  - 28 can be written as 3³ + 1.\n  Let's test this square-cube relationship on the next number, 15:\n  - 15 can be written as 4² - 1.\n  - Therefore, the missing term must be 4³ + 1.\n  - 4³ + 1 = 64 + 1 = 65.",
          hi: "सही उत्तर 65 है।\nआइए 8 और 28 के बीच के संबंध का विश्लेषण करें:\n  - 8 को 3² - 1 लिखा जा सकता है।\n  - 28 को 3³ + 1 लिखा जा सकता है।\n  आइए इस वर्ग-घन (square-cube) संबंध का परीक्षण 15 पर करें:\n  - 15 को 4² - 1 लिखा जा सकता है।\n  - इसलिए, लुप्त पद 4³ + 1 होना चाहिए।\n  - 4³ + 1 = 64 + 1 = 65।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_analogy_summary",
      type: "summary",
      content: {
        en: "Analogy Summary Card",
        hi: "सादृश्यता समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Analogies test comparative relationships between pairs.", hi: "सादृश्यता जोड़ों के बीच तुलनात्मक संबंधों का परीक्षण करती है।" },
          { en: "Check category types: Words, Numbers, and Alphabets.", hi: "श्रेणी प्रकारों की जांच करें: शब्द, संख्याएं और वर्णमाला।" },
          { en: "Keep the exact order of elements matching in both pairs.", hi: "दोनों जोड़ों में तत्वों के सटीक क्रम का मिलान बनाए रखें।" }
        ],
        shortcuts: [
          { en: "Bridge Sentence Method: Build a sentence for pair 1, apply it to pair 2.", hi: "ब्रिज वाक्य विधि: पहले जोड़े के लिए एक वाक्य बनाएं, उसे दूसरे पर लागू करें।" },
          { en: "Sum of digits or square/cube roots are highly common in number analogies.", hi: "संख्या सादृश्यता में अंकों का योग या वर्ग/घनमूल बहुत आम हैं।" }
        ],
        mistakesToAvoid: [
          { en: "Never assume a relationship without verifying it works perfectly in both directions.", hi: "दोनों दिशाओं में पूरी तरह से जांच किए बिना किसी संबंध की कल्पना न करें।" },
          { en: "Don't select options that match the theme but break the logical function class.", hi: "उन विकल्पों को न चुनें जो विषय से मेल खाते हों लेकिन तार्किक संबंध को तोड़ते हों।" }
        ]
      }
    },
    {
      id: "b_analogy_parent",
      type: "parent-note",
      content: {
        en: "Relational Logic & Association Skills",
        hi: "संबंधपरक तर्क और साहचर्य कौशल (Association)"
      },
      metadata: {
        whyItMatters: {
          en: "Analogies form the core of relational reasoning, which helps children transfer knowledge from a familiar domain to a new context. This skill is critical for problem-solving in science, logic, and computer architectures.",
          hi: "सादृश्यता संबंधपरक तर्क का मूल है, जो बच्चों को एक परिचित क्षेत्र से नए संदर्भ में ज्ञान स्थानांतरित करने में मदद करती है। यह कौशल विज्ञान, तर्कशास्त्र और कंप्यूटर प्रोग्रामिंग में समस्याओं को हल करने के लिए महत्वपूर्ण है।"
        },
        commonStruggle: {
          en: "Children often pick options that are topically related (e.g., picking 'hospital' just because the prompt mentioned 'doctor') without checking if the logical bridge function actually matches.",
          hi: "बच्चे अक्सर उन विकल्पों को चुन लेते हैं जो केवल विषय से जुड़े होते हैं (जैसे सिर्फ इसलिए 'अस्पताल' चुनना क्योंकि प्रश्न में 'डॉक्टर' का उल्लेख था) बिना यह जांचे कि क्या तार्किक संबंध वास्तव में मेल खाता है।"
        },
        homeActivity: {
          en: "Play 'Relationship Tag' during meals. Say: 'Water is to Cup as Soup is to...' and let your child guess ('Bowl!'). Take turns creating fun relationships using household items to build agile association pathways.",
          hi: "भोजन के समय 'रिलेशनशिप टैग' खेलें। कहें: 'पानी का संबंध कप से है तो सूप का संबंध किससे होगा...' और अपने बच्चे को अनुमान लगाने दें ('कटोरा!')। घर की चीजों का उपयोग करके नए संबंध बनाने की बारी-बारी से कोशिश करें।"
        }
      }
    }
  ]
};
