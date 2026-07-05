import { TopicContent } from "../../../core/types";

export const numberSeriesContent: TopicContent = {
  id: "topic_number_series",
  slug: "number-series",
  version: 2,
  publishedAt: "2026-07-05",
  status: "published",
  title: {
    en: "Number Series",
    hi: "संख्या श्रृंखला (Number Series)"
  },
  category: "Mathematical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_series_easy", "q_series_medium", "q_series_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Check growth speed first: slow growth = addition, fast growth = multiplication.",
      "Check the differences between consecutive terms to find hidden patterns.",
      "Alternate series are two independent sequences running in odd/even positions."
    ],
    quickTricks: [
      "Always check differences first! If differences grow, look for squares or cubes."
    ]
  },
  blocks: [
    {
      id: "b_series_hook",
      type: "callout",
      content: {
        en: "Imagine you are a detective investigating a secret bank vault. The code lock shows these numbers: 2, 4, 8, 16... and the vault door is opening in 30 seconds! Can you guess the final number to crack the code? \n\nYes, it's 32! But how? Let's unlock the secret rules that numbers use to play follow-the-leader!",
        hi: "कल्पना कीजिए कि आप एक सीक्रेट बैंक तिजोरी की जांच करने वाले जासूस हैं। कोड लॉक पर ये संख्याएं दिख रही हैं: 2, 4, 8, 16... और तिजोरी का दरवाजा 30 सेकंड में बंद होने वाला है! कोड को क्रैक करने के लिए क्या आप अंतिम संख्या का अनुमान लगा सकते हैं?\n\nहाँ, यह 32 है! लेकिन कैसे? आइए उन जादुई नियमों को अनलॉक करें जिनका उपयोग संख्याएं लुका-छिपी खेलने के लिए करती हैं!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_series_eli10",
      type: "callout",
      content: {
        en: "Numbers are like dancers! They don't just stand there; they move to a specific rhythm or rule. A 'Number Series' is simply a row of numbers dancing in a line. If you can hear their rhythm (the rule), you can predict who will dance next. You don't need heavy math formulas—just your logical eyes!",
        hi: "संख्याएँ डांसर्स की तरह होती हैं! वे सिर्फ खड़ी नहीं रहतीं, बल्कि एक निश्चित ताल या नियम पर आगे बढ़ती हैं। एक 'संख्या श्रृंखला' (Number Series) बस एक कतार में नृत्य करती हुई संख्याएं हैं। यदि आप उनके ताल (नियम) को समझ लेते हैं, तो आप बता सकते हैं कि अगला डांस कौन करेगा। इसके लिए किसी बड़े गणित के सूत्र की जरूरत नहीं है—बस आपकी तेज नजर चाहिए!"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_series_life",
      type: "callout",
      content: {
        en: "You already use this skill in real life! Have you noticed how house numbers on one side of the street go 1, 3, 5, 7 (odd numbers)? Or how your calendar days repeat in columns (7, 14, 21, 28)? Your brain is naturally wired to spot these patterns to make sense of the world.",
        hi: "आप असल जिंदगी में भी इस हुनर का इस्तेमाल करते हैं! क्या आपने ध्यान दिया है कि सड़क के एक तरफ घरों के नंबर 1, 3, 5, 7 (विषम संख्याएं) होते हैं? या कैलेंडर में तारीखें कैसे आगे बढ़ती हैं (7, 14, 21, 28)? आपका दिमाग दुनिया को समझने के लिए प्राकृतिक रूप से इन पैटर्न्स को ढूंढता रहता है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_series_diag_intro",
      type: "heading",
      content: {
        en: "Visualizing the Gaps (गैप्स को समझना)",
        hi: "गैप्स को समझना (Visualizing the Gaps)"
      }
    },
    {
      id: "b_series_diag",
      type: "diagram",
      content: {
        en: "Look at this simple pattern. The gap (+2) stays the same between every neighbor!",
        hi: "इस सरल पैटर्न को देखें। हर संख्या के बीच का अंतर (+2) बिल्कुल एक जैसा रहता है!"
      },
      metadata: {
        type: "grid",
        nodes: [
          { id: "term_1", label: { en: "2", hi: "2" } },
          { id: "gap_1", label: { en: "+2 ➔", hi: "+2 ➔" } },
          { id: "term_2", label: { en: "4", hi: "4" } },
          { id: "gap_2", label: { en: "+2 ➔", hi: "+2 ➔" } },
          { id: "term_3", label: { en: "6", hi: "6" } },
          { id: "gap_3", label: { en: "+2 ➔", hi: "+2 ➔" } },
          { id: "term_4", label: { en: "8", hi: "8" } }
        ],
        config: {
          direction: "row",
          animate: "slide-in"
        }
      }
    },
    {
      id: "b_series_library_h",
      type: "heading",
      content: {
        en: "The Pattern Library (पैटर्न लाइब्रेरी)",
        hi: "पैटर्न लाइब्रेरी (The Pattern Library)"
      }
    },
    {
      id: "b_series_lib_intro",
      type: "paragraph",
      content: {
        en: "Question setters build number series using 5 main types of logic. Learn to recognize them instantly:",
        hi: "पेपर बनाने वाले मुख्य रूप से 5 तरीकों का इस्तेमाल करके संख्या श्रृंखला तैयार करते हैं। इन्हें तुरंत पहचानना सीखें:"
      }
    },
    {
      id: "b_series_lib_table",
      type: "table",
      content: {
        en: "Core Pattern Types",
        hi: "मुख्य पैटर्न प्रकार"
      },
      metadata: {
        headers: [
          { en: "Pattern Type", hi: "पैटर्न का प्रकार" },
          { en: "How to Spot It", hi: "कैसे पहचानें" },
          { en: "Example", hi: "उदाहरण" }
        ],
        rows: [
          [
            { en: "Constant Addition (+)", hi: "स्थिर जोड़ (+)" },
            { en: "Numbers increase slowly by the same amount.", hi: "संख्याएँ धीरे-धीरे समान मात्रा से बढ़ती हैं।" },
            { en: "5, 10, 15, 20 (+5 each time)", hi: "5, 10, 15, 20 (हर बार +5)" }
          ],
          [
            { en: "Growing Addition (+2, +4, +6)", hi: "बढ़ता हुआ जोड़ (+2, +4, +6)" },
            { en: "Numbers increase, and the gap grows bigger step-by-step.", hi: "संख्याएँ बढ़ती हैं, और गैप हर कदम पर बड़ा हो जाता है।" },
            { en: "2, 4, 8, 14 (+2, +4, +6...)", hi: "2, 4, 8, 14 (पहले +2, फिर +4, फिर +6)" }
          ],
          [
            { en: "Multiplication (×)", hi: "गुणा (×)" },
            { en: "Numbers explode! They grow super fast.", hi: "संख्याएँ बहुत तेजी से बढ़ती हैं (विस्फोटक रूप से)।" },
            { en: "3, 9, 27, 81 (×3 each time)", hi: "3, 9, 27, 81 (हर बार ×3)" }
          ],
          [
            { en: "Squares & Cubes (n² / n³)", hi: "वर्ग और घन (n² / n³)" },
            { en: "Numbers match perfect squares (1, 4, 9, 16...) or have square gaps.", hi: "संख्याएँ सीधे वर्ग संख्याएँ होती हैं या उनके बीच का गैप वर्ग होता है।" },
            { en: "1, 4, 9, 16, 25 (1², 2², 3², 4²...)", hi: "1, 4, 9, 16, 25 (1², 2², 3², 4²...)" }
          ],
          [
            { en: "Alternate (Double Track)", hi: "एकान्तर (Double Track)" },
            { en: "Numbers go up and down. Two chains mixed together!", hi: "संख्याएँ ऊपर-नीचे होती हैं। एक साथ दो श्रृंखलाएँ मिक्स होती हैं!" },
            { en: "2, 10, 4, 20, 6, 30 (odd steps: 2,4,6; even steps: 10,20,30)", hi: "2, 10, 4, 20, 6, 30 (विषम स्थान: 2,4,6; सम स्थान: 10,20,30)" }
          ]
        ]
      }
    },
    {
      id: "b_series_recipe_h",
      type: "heading",
      content: {
        en: "The Recipe: How to Solve Any Question",
        hi: "रेसिपी: किसी भी प्रश्न को हल करने का अचूक तरीका"
      }
    },
    {
      id: "b_series_recipe",
      type: "recipe",
      content: {
        en: "Follow these 4 steps in order. Don't skip steps!",
        hi: "क्रमवार इन 4 चरणों का पालन करें। किसी भी चरण को न छोड़ें!"
      },
      metadata: {
        steps: [
          {
            en: "Scan the Speed: Are the numbers growing slowly (addition) or exploding quickly (multiplication)?",
            hi: "गति जांचें: क्या संख्याएं धीरे-धीरे बढ़ रही हैं (जोड़) या बहुत तेजी से भाग रही हैं (गुणा)?"
          },
          {
            en: "Find the Gaps: Subtract neighbor numbers to write the differences on top of the series.",
            hi: "अंतर निकालें: पड़ोसी संख्याओं को आपस में घटाकर उनके बीच के गैप को ऊपर लिख लें।"
          },
          {
            en: "Study the Gaps: Do the gaps follow a multiplication table (3, 6, 9...)? Are they doubling (2, 4, 8...)? Or are they square numbers?",
            hi: "गैप का अध्ययन करें: क्या गैप कोई पहाड़ा (3, 6, 9...) है? क्या वे दोगुने हो रहे हैं (2, 4, 8...)? या वे वर्ग संख्याएं हैं?"
          },
          {
            en: "Try the Double Track: If numbers zig-zag (up and down like 5, 2, 7, 4, 9), split them into two separate alternate paths.",
            hi: "डबल ट्रैक देखें: यदि संख्याएं टेढ़ी-मेढ़ी (ऊपर-नीचे) चल रही हैं (जैसे 5, 2, 7, 4, 9), तो उन्हें दो अलग-अलग श्रृंखलाओं में बांट लें।"
          }
        ]
      }
    },
    {
      id: "b_series_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_series_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: 14, 18, 22, 26, ?\n\nStudent Thinking: 'Numbers are growing slowly. Let's find the difference!'\nIncorrect Method: Trying to multiply (14 × 1.5 = ? too complex!).\nCorrect Method: Subtract neighbors:\n  - 18 - 14 = +4\n  - 22 - 18 = +4\n  - 26 - 22 = +4\n  Rule is: Add 4 each time.\nShortcut: 26 + 4 = 30. Answer is 30.",
        hi: "Level: Easy | उदाहरण 1: 14, 18, 22, 26, ?\n\nछात्र की सोच: 'संख्याएं धीरे-धीरे बढ़ रही हैं। आइए अंतर खोजें!'\nगलत तरीका: गुणा करने की कोशिश करना (14 × 1.5 = ? बहुत कठिन)।\nसही तरीका: पड़ोसियों को घटाएं:\n  - 18 - 14 = +4\n  - 22 - 18 = +4\n  - 26 - 22 = +4\n  नियम है: हर बार 4 जोड़ें।\nशॉर्टकट: 26 + 4 = 30. उत्तर 30 है।"
      }
    },
    {
      id: "b_series_ex2",
      type: "example",
      content: {
        en: "Level: Easy | Example 2: 40, 35, 30, 25, ?\n\nStudent Thinking: 'Numbers are shrinking slowly. Let's find the subtraction rule.'\nCorrect Method:\n  - 40 - 5 = 35\n  - 35 - 5 = 30\n  - 30 - 5 = 25\n  Rule is: Subtract 5 each time.\nShortcut: 25 - 5 = 20. Answer is 20.",
        hi: "Level: Easy | उदाहरण 2: 40, 35, 30, 25, ?\n\nछात्र की सोच: 'संख्याएं धीरे-धीरे घट रही हैं। घटाव का नियम खोजते हैं।'\nसही तरीका:\n  - 40 - 5 = 35\n  - 35 - 5 = 30\n  - 30 - 5 = 25\n  नियम है: हर बार 5 घटाएं।\nशॉर्टकट: 25 - 5 = 20. उत्तर 20 है।"
      }
    },
    {
      id: "b_series_ex3",
      type: "example",
      content: {
        en: "Level: Easy | Example 3: 1, 3, 6, 10, ?\n\nStudent Thinking: 'Let's check gaps: 3-1 = 2, 6-3 = 3... Oh, the gap itself is growing!'\nCorrect Method:\n  - 1 + 2 = 3\n  - 3 + 3 = 6\n  - 6 + 4 = 10\n  Rule is: Add consecutive integers (+2, +3, +4, and next must be +5).\nShortcut: 10 + 5 = 15. Answer is 15.",
        hi: "Level: Easy | उदाहरण 3: 1, 3, 6, 10, ?\n\nछात्र की सोच: 'आइए अंतर देखें: 3-1 = 2, 6-3 = 3... अरे, अंतर खुद बढ़ रहा है!'\nसही तरीका:\n  - 1 + 2 = 3\n  - 3 + 3 = 6\n  - 6 + 4 = 10\n  नियम है: लगातार बढ़ती संख्या जोड़ें (+2, +3, +4, और अगला +5 होना चाहिए)।\nशॉर्टकट: 10 + 5 = 15. उत्तर 15 है।"
      }
    },
    {
      id: "b_series_ex4",
      type: "example",
      content: {
        en: "Level: Medium | Example 4: 2, 6, 18, 54, ?\n\nStudent Thinking: 'Numbers grow very fast! 2 to 6, then 18, then 54. This must be multiplication.'\nIncorrect Method: Add differences (+4, +12, +36). While valid, multiplication is faster.\nCorrect Method:\n  - 2 × 3 = 6\n  - 6 × 3 = 18\n  - 18 × 3 = 54\n  Rule is: Multiply by 3.\nShortcut: 54 × 3 = 162. Answer is 162.",
        hi: "Level: Medium | उदाहरण 4: 2, 6, 18, 54, ?\n\nछात्र की सोच: 'संख्याएँ बहुत तेज़ी से बढ़ रही हैं! 2 से 6, फिर 18, फिर 54। यह निश्चित रूप से गुणा है।'\nगलत तरीका: अंतर जोड़ने बैठना (+4, +12, +36)। हालांकि यह भी सही है, लेकिन गुणा सोचना बहुत तेज है।\nसही तरीका:\n  - 2 × 3 = 6\n  - 6 × 3 = 18\n  - 18 × 3 = 54\n  नियम है: 3 से गुणा करें।\nशॉर्टकट: 54 × 3 = 162. उत्तर 162 है।"
      }
    },
    {
      id: "b_series_ex5",
      type: "example",
      content: {
        en: "Level: Medium | Example 5: 2, 5, 10, 17, ?\n\nStudent Thinking: 'Gaps are: +3, +5, +7. Those are consecutive odd numbers! But wait, is there another trick?'\nCorrect Method: Add next odd number (+9) ➔ 17 + 9 = 26.\nCorrect Method: These are square numbers plus 1!\n  - 1² + 1 = 2\n  - 2² + 1 = 5\n  - 3² + 1 = 10\n  - 4² + 1 = 17\n  - Next: 5² + 1 = 26.\nShortcut: Spotting squares directly saves time on larger numbers. Answer is 26.",
        hi: "Level: Medium | उदाहरण 5: 2, 5, 10, 17, ?\n\nछात्र की सोच: 'अंतर हैं: +3, +5, +7। ये लगातार विषम संख्याएँ हैं! लेकिन क्या कोई दूसरा तरीका भी है?'\nसही तरीका:\n  - अगला विषम संख्या (+9) जोड़ें ➔ 17 + 9 = 26।\n  - ये वर्ग संख्याएं + 1 हैं!\n    - 1² + 1 = 2\n    - 2² + 1 = 5\n    - 3² + 1 = 10\n    - 4² + 1 = 17\n    - अगला: 5² + 1 = 26.\nशॉर्टकट: सीधे वर्गों को पहचानने से बड़े नंबरों पर समय बचता है। उत्तर 26 है।"
      }
    },
    {
      id: "b_series_ex6",
      type: "example",
      content: {
        en: "Level: Medium | Example 6: 12, 6, 6, 9, 18, ?\n\nStudent Thinking: 'This is weird! The numbers go down, then stay same, then go up. What is happening?'\nIncorrect Method: Simple addition or subtraction fails here.\nCorrect Method: Check decimal multiplication!\n  - 12 × 0.5 = 6\n  - 6 × 1 = 6\n  - 6 × 1.5 = 9\n  - 9 × 2 = 18\n  Rule is: Multiply by 0.5, then 1, then 1.5, then 2, then 2.5.\nShortcut: 18 × 2.5 = 45. Answer is 45.",
        hi: "Level: Medium | उदाहरण 6: 12, 6, 6, 9, 18, ?\n\nछात्र की सोच: 'यह अजीब है! संख्या पहले नीचे गई, फिर वही रही, फिर ऊपर गई। क्या हो रहा है?'\nगलत तरीका: साधारण जोड़ या घटाव यहाँ काम नहीं करेगा।\nसही तरीका: दशमलव गुणा की जाँच करें!\n  - 12 × 0.5 = 6\n  - 6 × 1 = 6\n  - 6 × 1.5 = 9\n  - 9 × 2 = 18\n  नियम है: पहले 0.5 से गुणा, फिर 1 से, फिर 1.5 से, फिर 2 से, फिर 2.5 से।\nशॉर्टकट: 18 × 2.5 = 45. उत्तर 45 है।"
      }
    },
    {
      id: "b_series_ex7",
      type: "example",
      content: {
        en: "Level: Hard | Example 7: 3, 4, 12, 45, ?\n\nStudent Thinking: 'Gaps grow extremely fast: +1, +8, +33. Let's check mixed operations (multiply and add).'\nCorrect Method: Try multiplying and adding a growing number:\n  - (3 × 1) + 1 = 4\n  - (4 × 2) + 4 = 12\n  - (12 × 3) + 9 = 45\n  The multipliers are 1, 2, 3... and we add square numbers 1², 2², 3²...\n  - Next step: (45 × 4) + 16 = 180 + 16 = 196.\nShortcut: (Term × n) + n². Answer is 196.",
        hi: "Level: Hard | उदाहरण 7: 3, 4, 12, 45, ?\n\nछात्र की सोच: 'अंतर बहुत तेजी से बढ़ रहे हैं: +1, +8, +33। आइए मिश्रित ऑपरेशन (गुणा और जोड़) की जांच करें।'\nसही तरीका: गुणा करके एक बढ़ती हुई संख्या जोड़ने का प्रयास करें:\n  - (3 × 1) + 1 = 4\n  - (4 × 2) + 4 = 12\n  - (12 × 3) + 9 = 45\n  गुणा करने वाले अंक 1, 2, 3... हैं और जोड़े जाने वाले अंक वर्ग संख्याएँ 1², 2², 3²... हैं।\n  - अगला कदम: (45 × 4) + 16 = 180 + 16 = 196.\nशॉर्टकट: (संख्या × n) + n²। उत्तर 196 है।"
      }
    },
    {
      id: "b_series_ex8",
      type: "example",
      content: {
        en: "Level: Hard | Example 8: 1, 5, 2, 10, 4, 20, 8, ?\n\nStudent Thinking: 'Numbers go up (1 to 5), down (5 to 2), up (2 to 10)... This is a zig-zag! Let's check alternate chains.'\nCorrect Method: Split into Odd and Even positions:\n  - Odd positions: 1, 2, 4, 8 (doubling chain! 1×2=2, 2×2=4, 4×2=8)\n  - Even positions: 5, 10, 20, ? (doubling chain! 5×2=10, 10×2=20)\n  - Next number is in the Even chain.\nShortcut: 20 × 2 = 40. Answer is 40.",
        hi: "Level: Hard | उदाहरण 8: 1, 5, 2, 10, 4, 20, 8, ?\n\n🧠 छात्र की सोच: 'संख्याएँ ऊपर जाती हैं (1 से 5), नीचे आती हैं (5 से 2), फिर ऊपर (2 से 10)... यह एक जिग-जैग है! आइए एकान्तर श्रृंखला की जांच करें।'\nसही तरीका: विषम और सम स्थानों में विभाजित करें:\n  - विषम स्थान: 1, 2, 4, 8 (दोगुना करने की श्रृंखला! 1×2=2, 2×2=4...)\n  - सम स्थान: 5, 10, 20, ? (दोगुना करने की श्रृंखला! 5×2=10, 10×2=20)\n  - अगली संख्या सम श्रृंखला का हिस्सा है।\nशॉर्टकट: 20 × 2 = 40. उत्तर 40 है।"
      }
    },
    {
      id: "b_series_mistakes",
      type: "warning",
      content: {
        en: "Common Mistake: Don't jump to multiplication immediately just because you see a big jump at the end. Always look at the early gaps first. If the gaps grow by simple amounts (like +1, +3, +5, +7), it is an addition/square pattern, not multiplication. Premature multiplication guesses waste valuable time!",
        hi: "सामान्य गलती: सिर्फ इसलिए कि आपको अंत में एक बड़ा जंप दिखाई दे रहा है, तुरंत गुणा पर मत कूदें। हमेशा पहले शुरुआती गैप्स को देखें। यदि गैप सरल मात्रा में बढ़ रहे हैं (जैसे +1, +3, +5, +7), तो यह एक जोड़/वर्ग पैटर्न है, गुणा नहीं। समय से पहले गुणा का अनुमान लगाने से कीमती समय बर्बाद होता है!"
      }
    },
    {
      id: "b_series_tricks",
      type: "callout",
      content: {
        en: "Growth Speed Rule:\n  - Slow Growth ➔ Check Addition (+)\n  - Slow Shrinkage ➔ Check Subtraction (-)\n  - Fast Growth ➔ Check Multiplication (×) or Squares (n²)\n  - Zig-Zag (Up and Down) ➔ Split into two Alternate Series!",
        hi: "ग्रोथ स्पीड रूल:\n  - धीमी बढ़ोतरी ➔ जोड़ (+) की जांच करें\n  - धीमी गिरावट ➔ घटाव (-) की जांच करें\n  - तेज बढ़ोतरी ➔ गुणा (×) या वर्ग (n²) की जांच करें\n  - जिग-जैग (ऊपर-नीचे) ➔ इसे दो एकान्तर श्रृंखलाओं में विभाजित करें!"
      },
      metadata: {
        icon: "secret",
        theme: "violet"
      }
    },
    {
      id: "b_series_challenge",
      type: "challenge",
      content: {
        en: "Find the missing number in this sequence: 3, 5, 9, 17, 33, ?",
        hi: "इस अनुक्रम में लुप्त संख्या ज्ञात कीजिए: 3, 5, 9, 17, 33, ?"
      },
      metadata: {
        options: [
          { en: "45", hi: "45" },
          { en: "65", hi: "65" },
          { en: "50", hi: "50" },
          { en: "55", hi: "55" }
        ],
        correctIndex: 1,
        solution: {
          en: "The correct answer is 65.\nLet's check the gaps between neighbor numbers:\n  - 5 - 3 = +2\n  - 9 - 5 = +4\n  - 17 - 9 = +8\n  - 33 - 17 = +16\n  Notice the gaps are doubling: 2, 4, 8, 16. The next gap must be 16 × 2 = +32.\n  Therefore, the next number is 33 + 32 = 65.",
          hi: "सही उत्तर 65 है।\nआइए पड़ोसी संख्याओं के बीच के अंतर की जांच करें:\n  - 5 - 3 = +2\n  - 9 - 5 = +4\n  - 17 - 9 = +8\n  - 33 - 17 = +16\n  ध्यान दें कि गैप दोगुने हो रहे हैं: 2, 4, 8, 16। अगला गैप 16 × 2 = +32 होना चाहिए।\n  इसलिए, अगली संख्या 33 + 32 = 65 है।"
        },
        level: "standard"
      }
    },
    {
      id: "b_series_super_challenge",
      type: "challenge",
      content: {
        en: "⭐ Olympiad Challenge: Find the next term in this sequence: 2, 3, 7, 25, 121, ?",
        hi: "⭐ ओलंपियाड चुनौती: इस अनुक्रम में अगला पद ज्ञात कीजिए: 2, 3, 7, 25, 121, ?"
      },
      metadata: {
        options: [
          { en: "721", hi: "721" },
          { en: "605", hi: "605" },
          { en: "745", hi: "745" },
          { en: "726", hi: "726" }
        ],
        correctIndex: 0,
        solution: {
          en: "The correct answer is 721.\nThis is a nested multiplier sequence:\n  - 2 × 2 - 1 = 3\n  - 3 × 3 - 2 = 7\n  - 7 × 4 - 3 = 25\n  - 25 × 5 - 4 = 121\n  The rule is: Multiply by consecutive integers (2, 3, 4, 5...) and subtract consecutive integers (1, 2, 3, 4...).\n  Therefore, the next calculation is:\n  - 121 × 6 - 5 = 726 - 5 = 721.",
          hi: "सही उत्तर 721 है।\nयह एक विशेष गुणा और घटाव का पैटर्न है:\n  - 2 × 2 - 1 = 3\n  - 3 × 3 - 2 = 7\n  - 7 × 4 - 3 = 25\n  - 25 × 5 - 4 = 121\n  नियम है: लगातार संख्याओं (2, 3, 4, 5...) से गुणा करें और लगातार संख्याओं (1, 2, 3, 4...) को घटाएं।\n  इसलिए, अगली गणना होगी:\n  - 121 × 6 - 5 = 726 - 5 = 721।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_series_summary",
      type: "summary",
      content: {
        en: "Number Series Summary Card",
        hi: "नंबर सीरीज समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Always check subtraction/addition first before multiplication.", hi: "गुणा से पहले हमेशा जोड़ या घटाव के अंतर की जांच करें।" },
          { en: "Identify arithmetic tables or doubling series inside the gaps.", hi: "गैप्स के भीतर गणितीय पहाड़ा या दोगुना होने वाली सीरीज को पहचानें।" },
          { en: "Keep a lookout for squares (1, 4, 9, 16...) and cubes.", hi: "वर्ग संख्याओं (1, 4, 9, 16...) और घन संख्याओं पर नजर रखें।" }
        ],
        shortcuts: [
          { en: "Slow growth = Add. Fast growth = Multiply. Alternating values = Double Track.", hi: "धीमी बढ़त = जोड़। तेज बढ़त = गुणा। उतार-चढ़ाव = डबल ट्रैक।" },
          { en: "Subtract the first three pairs to quickly draft the gap rule.", hi: "गैप नियम का तुरंत पता लगाने के लिए पहले तीन जोड़ों को घटाएं।" }
        ],
        mistakesToAvoid: [
          { en: "Don't ignore alternating patterns; if numbers decrease then increase, check alternate terms.", hi: "एकान्तर पैटर्न को न भूलें; यदि संख्याएं घटती हैं और फिर बढ़ती हैं, तो एक छोड़कर एक पदों को देखें।" },
          { en: "Avoid guessing without calculating at least three consecutive gaps.", hi: "कम से कम तीन लगातार अंतरों की गणना किए बिना अनुमान लगाने से बचें।" }
        ]
      }
    },
    {
      id: "b_series_parent",
      type: "parent-note",
      content: {
        en: "Number Logic & Cognitive Reasoning Patterns",
        hi: "संख्या तर्क और संज्ञानात्मक विकास पैटर्न"
      },
      metadata: {
        whyItMatters: {
          en: "Number series tests a child's numeric agility, working memory, and hypothesis testing. Instead of doing mechanical calculations, children learn to seek structural logic, which forms the bedrock of algebra and coding.",
          hi: "संख्या श्रृंखला बच्चों की संख्यात्मक फुर्ती, याददाश्त और अनुमान लगाने की क्षमता का परीक्षण करती है। रटने के बजाय, बच्चे पैटर्न की संरचना को खोजना सीखते हैं, जो बीजगणित (Algebra) और कोडिंग की नींव है।"
        },
        commonStruggle: {
          en: "Many students get overwhelmed by large numbers and try to guess. They also struggle to identify alternating series because they expect a single rule to connect every single element.",
          hi: "कई बच्चे बड़ी संख्याओं को देखकर घबरा जाते हैं और अनुमान लगाने लगते हैं। वे अक्सर एकान्तर (alternate) श्रृंखलाओं को नहीं पहचान पाते क्योंकि उन्हें लगता है कि एक ही नियम सभी नंबरों को जोड़ेगा।"
        },
        homeActivity: {
          en: "While traveling or out walking, play 'Guess My Rule'. Pick a rule like +3 and say: '1, 4, 7, 10... what's next?'. Let your child name the next number and guess your secret rule, then swap roles!",
          hi: "यात्रा करते समय या टहलते समय, 'मेरा नियम पहचानो' खेलें। कोई नियम चुनें जैसे +3 और कहें: '1, 4, 7, 10... अगला क्या है?'। अपने बच्चे को अगली संख्या बताने दें और आपके सीक्रेट नियम का अनुमान लगाने दें, फिर भूमिकाएं बदलें!"
        }
      }
    }
  ]
};
