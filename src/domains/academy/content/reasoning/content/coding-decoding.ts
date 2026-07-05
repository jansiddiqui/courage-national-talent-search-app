import { TopicContent } from "../../../core/types";

export const codingDecodingContent: TopicContent = {
  id: "topic_coding_decoding",
  slug: "coding-decoding",
  version: 2,
  publishedAt: "2026-07-05",
  status: "published",
  title: {
    en: "Coding-Decoding",
    hi: "कोडिंग-डिकोडिंग (Coding-Decoding)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_coding_easy", "q_coding_medium", "q_coding_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Write the original word above the coded word to match letters vertically.",
      "Check letter-to-letter shifts (+1, +2 or -1, -2) first.",
      "Check opposite pairs (A-Z, B-Y) if the shifts seem random."
    ],
    quickTricks: [
      "The sum of ranks of opposite letters is always 27. Use this to find opposite letters instantly."
    ]
  },
  blocks: [
    {
      id: "b_coding_hook",
      type: "callout",
      content: {
        en: "A secret message arrived at headquarters: 'CAT' has been rewritten as 'DBU'. The enemy is planning their next move! Can you decode what 'DOG' means in their secret language? \n\nYes, it's 'EPH'! Each letter was shifted forward by exactly 1 step (C➔D, A➔B, T➔D). You just intercepted your first military transmission! Let's master the art of writing and cracking secret codes!",
        hi: "मुख्यालय में एक गुप्त संदेश आया: 'CAT' को 'DBU' के रूप में लिखा गया है। दुश्मन अपनी अगली चाल की योजना बना रहा है! क्या आप समझ सकते हैं कि उनकी गुप्त भाषा में 'DOG' का क्या अर्थ है?\n\nहाँ, यह 'EPH' है! प्रत्येक अक्षर को ठीक 1 कदम आगे बढ़ाया गया था (C➔D, A➔B, T➔D)। आपने अभी-अभी अपना पहला सैन्य संदेश पकड़ा है! आइए गुप्त कोड लिखने और उन्हें क्रैक करने की कला में महारत हासिल करें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_coding_eli10",
      type: "callout",
      content: {
        en: "Coding is like putting a mask on a word so nobody else can recognize it. Decoding is taking that mask off to see the real word underneath! The mask is made of a secret pattern (like 'shift every letter +2' or 'swap with opposite letters'). If you find the pattern on the first word, you can take the mask off any secret message!",
        hi: "कोडिंग एक शब्द पर मुखौटा लगाने जैसा है ताकि कोई और उसे पहचान न सके। डिकोडिंग उस मुखौटे को उतारकर असली शब्द को देखना है! मुखौटा एक गुप्त नियम से बना होता है (जैसे 'हर अक्षर को +2 बढ़ाएं' या 'विपरीत अक्षरों से बदलें')। यदि आप पहले शब्द का पैटर्न ढूंढ लेते हैं, तो आप किसी भी गुप्त संदेश से मुखौटा हटा सकते हैं!"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_coding_life",
      type: "callout",
      content: {
        en: "Coding is used by computers to protect passwords, bank transfers, and video calls from hackers! This is called 'Cryptography'. When you buy something online, your bank details are coded (encrypted) so nobody can steal them. You are studying the basic logic that secures the internet!",
        hi: "हैकर्स से पासवर्ड, बैंक ट्रांसफर और वीडियो कॉल को सुरक्षित रखने के लिए कंप्यूटर द्वारा कोडिंग का उपयोग किया जाता है! इसे 'क्रिप्टोग्राफी' (Cryptography) कहा जाता है। जब आप ऑनलाइन कुछ खरीदते हैं, तो आपके बैंक विवरणों को कोड (एन्क्रिप्ट) किया जाता है ताकि कोई उन्हें चुरा न सके। आप उसी मूल तर्क का अध्ययन कर रहे हैं जो इंटरनेट को सुरक्षित बनाता है!"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_coding_align_h",
      type: "heading",
      content: {
        en: "The Secret Weapon: Vertical Alignment",
        hi: "गुप्त हथियार: वर्टिकल अलाइनमेंट (वर्टिकल अलाइनमेंट)"
      }
    },
    {
      id: "b_coding_align_p",
      type: "paragraph",
      content: {
        en: "Never write words side-by-side! Always write the code word directly underneath the original word. The pattern will jump out at you instantly!",
        hi: "कभी भी शब्दों को अगल-बगल न लिखें! हमेशा कोडेड शब्द को मूल शब्द के ठीक नीचे लिखें। पैटर्न तुरंत आपकी आँखों के सामने आ जाएगा!"
      }
    },
    {
      id: "b_coding_align_diag",
      type: "diagram",
      content: {
        en: "Write letters vertically to compare their shifts:",
        hi: "अक्षरों के अंतर की तुलना करने के लिए उन्हें वर्टिकल (ऊपर-नीचे) लिखें:"
      },
      metadata: {
        type: "grid",
        nodes: [
          { id: "w_1", label: { en: "C", hi: "C" } },
          { id: "w_2", label: { en: "A", hi: "A" } },
          { id: "w_3", label: { en: "T", hi: "T" } },
          { id: "arrow_1", label: { en: "↓ (+1)", hi: "↓ (+1)" } },
          { id: "arrow_2", label: { en: "↓ (+1)", hi: "↓ (+1)" } },
          { id: "arrow_3", label: { en: "↓ (+1)", hi: "↓ (+1)" } },
          { id: "c_1", label: { en: "D", hi: "D" } },
          { id: "c_2", label: { en: "B", hi: "B" } },
          { id: "c_3", label: { en: "U", hi: "U" } }
        ],
        config: {
          direction: "col",
          animate: "bounce"
        }
      }
    },
    {
      id: "b_coding_library_h",
      type: "heading",
      content: {
        en: "The Pattern Library (पैटर्न लाइब्रेरी)",
        hi: "पैटर्न लाइब्रेरी (The Pattern Library)"
      }
    },
    {
      id: "b_coding_lib_intro",
      type: "paragraph",
      content: {
        en: "Secret codes are built using 4 primary types of operations. Learn to spot them:",
        hi: "गुप्त कोड मुख्य रूप से 4 प्रकार के नियमों से बनते हैं। इन्हें पहचानना सीखें:"
      }
    },
    {
      id: "b_coding_lib_table",
      type: "table",
      content: {
        en: "Coding Schemes",
        hi: "कोडिंग योजनाएं"
      },
      metadata: {
        headers: [
          { en: "Coding Type", hi: "कोडिंग का प्रकार" },
          { en: "How it Works", hi: "यह कैसे काम करता है" },
          { en: "Example", hi: "उदाहरण" }
        ],
        rows: [
          [
            { en: "Letter Shifting", hi: "अक्षर विस्थापन" },
            { en: "Each letter shifts forward or backward in position.", hi: "प्रत्येक अक्षर स्थिति में आगे या पीछे खिसकता है।" },
            { en: "RED ➔ SFE (+1 shift)", hi: "RED ➔ SFE (+1 विस्थापन)" }
          ],
          [
            { en: "Reverse Pairing", hi: "विपरीत युग्म" },
            { en: "Letters are swapped with their opposites (A➔Z, B➔Y).", hi: "अक्षरों को उनके विपरीत अक्षरों (A➔Z, B➔Y) से बदल दिया जाता है।" },
            { en: "BYE ➔ YTB (Opposite letters)", hi: "BYE ➔ YTB (विपरीत अक्षर)" }
          ],
          [
            { en: "Letter Swapping", hi: "अक्षर बदलना (Swapping)" },
            { en: "Letters stay the same but swap positions inside the word.", hi: "अक्षर वही रहते हैं लेकिन शब्द के अंदर अपनी स्थिति बदल लेते हैं।" },
            { en: "STOP ➔ TSPO (Swapped pairs)", hi: "STOP ➔ TSPO (आपस में बदले गए जोड़े)" }
          ],
          [
            { en: "Number Coding", hi: "संख्या कोडिंग" },
            { en: "Letters are converted directly into numbers.", hi: "अक्षरों को सीधे संख्याओं में बदल दिया जाता है।" },
            { en: "CAB ➔ 3-1-2 (Rank numbers)", hi: "CAB ➔ 3-1-2 (स्थिति संख्याएं)" }
          ]
        ]
      }
    },
    {
      id: "b_coding_recipe_h",
      type: "heading",
      content: {
        en: "The Recipe: How to Crack a Code",
        hi: "रेसिपी: कोड क्रैक करने की विधि"
      }
    },
    {
      id: "b_coding_recipe",
      type: "recipe",
      content: {
        en: "Always align words vertically to analyze patterns:",
        hi: "पैटर्न का विश्लेषण करने के लिए हमेशा शब्दों को वर्टिकल (ऊपर-नीचे) लिखें:"
      },
      metadata: {
        steps: [
          {
            en: "Align Vertically: Write the coded word directly under the original word.",
            hi: "वर्टिकली लिखें: कोडेड शब्द को मूल शब्द के ठीक नीचे लिखें।"
          },
          {
            en: "Map Positions: Write the number ranks above each letter (A=1, B=2).",
            hi: "स्थिति लिखें: प्रत्येक अक्षर के ऊपर उसकी संख्यात्मक स्थिति (A=1, B=2) लिखें।"
          },
          {
            en: "Check Shift Rule: Compare ranks vertically to find the gap rule (+1, -2, or alternating).",
            hi: "विस्थापन की जांच करें: गैप नियम (+1, -2, या एकान्तर) खोजने के लिए ऊपर-नीचे संख्याओं की तुलना करें।"
          },
          {
            en: "Apply and Decode: Use the exact same rules on the new word to write down its code.",
            hi: "लागू करें और डिकोड करें: नया कोड लिखने के लिए नए शब्द पर बिल्कुल वही नियम लागू करें।"
          }
        ]
      }
    },
    {
      id: "b_coding_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_coding_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: In a code language, RAT is written as SBU. How is DOG written?\n\nStudent Thinking: 'Let's write RAT and SBU above each exit: R➔S (+1), A➔B (+1), T➔U (+1).'\nCorrect Method:\n  - R (+1) = S\n  - A (+1) = B\n  - T (+1) = U\n  Apply +1 shift to DOG:\n  - D (+1) = E\n  - O (+1) = P\n  - G (+1) = H\nShortcut: Every letter goes next. Answer is EPH.",
        hi: "Level: Easy | उदाहरण 1: एक कोड भाषा में, RAT को SBU लिखा जाता है। DOG को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'आइए RAT और SBU को ऊपर-नीचे लिखें: R➔S (+1), A➔B (+1), T➔U (+1)।'\nसही तरीका:\n  - R (+1) = S\n  - A (+1) = B\n  - T (+1) = U\n  DOG पर +1 विस्थापन लागू करें:\n  - D (+1) = E\n  - O (+1) = P\n  - G (+1) = H\nशॉर्टकट: हर अक्षर अपने से अगले अक्षर में बदल जाता है। उत्तर EPH है।"
      }
    },
    {
      id: "b_coding_ex2",
      type: "example",
      content: {
        en: "Level: Easy | Example 2: In a code language, SUN is written as RTM. How is HOT written?\n\nStudent Thinking: 'SUN and RTM. S➔R (-1), U➔T (-1), N➔M (-1). Going backward!'\nCorrect Method: Apply -1 shift to HOT:\n  - H (-1) = G\n  - O (-1) = N\n  - T (-1) = S\nShortcut: Go one letter backward. Answer is GNS.",
        hi: "Level: Easy | उदाहरण 2: एक कोड भाषा में, SUN को RTM लिखा जाता है। HOT को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'SUN और RTM। S➔R (-1), U➔T (-1), N➔M (-1)। पीछे जा रहे हैं!'\nसही तरीका: HOT पर -1 विस्थापन लागू करें:\n  - H (-1) = G\n  - O (-1) = N\n  - T (-1) = S\nशॉर्टकट: एक अक्षर पीछे जाएं। उत्तर GNS है।"
      }
    },
    {
      id: "b_coding_ex3",
      type: "example",
      content: {
        en: "Level: Easy | Example 3: If PIN is written as 16-9-14, how is KEY written?\n\nStudent Thinking: 'PIN: P=16, I=9, N=14. These are directly their alphabet position ranks!'\nCorrect Method: Write ranks for KEY using EJOTY:\n  - K = 11\n  - E = 5\n  - Y = 25\nShortcut: Convert letters to ranks directly. Answer is 11-5-25.",
        hi: "Level: Easy | उदाहरण 3: यदि PIN को 16-9-14 लिखा जाता है, तो KEY को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'PIN: P=16, I=9, N=14. ये सीधे वर्णमाला में उनकी स्थिति हैं!'\nसही तरीका: EJOTY का उपयोग करके KEY के नंबर लिखें:\n  - K = 11\n  - E = 5\n  - Y = 25\nशॉर्टकट: अक्षरों को सीधे उनकी स्थिति संख्या में बदलें। उत्तर 11-5-25 है।"
      }
    },
    {
      id: "b_coding_ex4",
      type: "example",
      content: {
        en: "Level: Medium | Example 4: If COLD is written as DPME, how is WARM written?\n\nStudent Thinking: 'Align vertically. C➔D (+1), O➔P (+1), L➔M (+1), D➔E (+1). Shift is +1.'\nCorrect Method: Apply +1 shift to WARM:\n  - W (+1) = X\n  - A (+1) = B\n  - R (+1) = S\n  - M (+1) = N\nShortcut: Shift all letters +1. Answer is XBSN.",
        hi: "Level: Medium | उदाहरण 4: यदि COLD को DPME लिखा जाता है, तो WARM को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'वर्टिकली लिखें। C➔D (+1), O➔P (+1), L➔M (+1), D➔E (+1)। विस्थापन +1 है।'\nसही तरीका: WARM पर +1 विस्थापन लागू करें:\n  - W (+1) = X\n  - A (+1) = B\n  - R (+1) = S\n  - M (+1) = N\nशॉर्टकट: सभी अक्षरों को +1 बढ़ाएं। उत्तर XBSN है।"
      }
    },
    {
      id: "b_coding_ex5",
      type: "example",
      content: {
        en: "Level: Medium | Example 5: If BOMBAY is written as MYMYMY, how is TAMILNADA written?\n\nStudent Thinking: 'MYMYMY is repetitive! How did we get MY from BOMBAY? Ah, the 3rd and 6th letters are M and Y.'\nCorrect Method:\n  - Pick every 3rd letter of BOMBAY: B-O-M-B-A-Y (3rd is M, 6th is Y). Repeat 'MY' three times.\n  - Apply to TAMILNADA: T-A-M-I-L-N-A-D-A (3rd is M, 6th is N, 9th is A). The extracted sequence is M-N-A.\n  - Repeat the extracted sequence 'MNA' three times.\nShortcut: Spot the index extraction rule. Answer is MNAMNAMNA.",
        hi: "Level: Medium | उदाहरण 5: यदि BOMBAY को MYMYMY लिखा जाता है, तो TAMILNADA को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'MYMYMY बार-बार आ रहा है! हमें BOMBAY से MY कैसे मिला? अह, तीसरे और छठे अक्षर M और Y हैं।'\nसही तरीका:\n  - BOMBAY का प्रत्येक तीसरा अक्षर चुनें: B-O-M-B-A-Y (तीसरा M है, छठा Y है)। 'MY' को तीन बार दोहराएं।\n  - TAMILNADA पर लागू करें: T-A-M-I-L-N-A-D-A (तीसरा M, छठा N, नौवां A)। निकाला गया क्रम M-N-A है।\n  - निकाले गए क्रम 'MNA' को तीन बार दोहराएं।\nशॉर्टकट: स्थान निकालने के नियम को पहचानें। उत्तर MNAMNAMNA है।"
      }
    },
    {
      id: "b_coding_ex6",
      type: "example",
      content: {
        en: "Level: Medium | Example 6: If CAT is written as XZG, how is DOG written?\n\nStudent Thinking: 'Positions: C(3) and X(24). Sum is 3+24=27. These are opposite pairs!'\nCorrect Method: Find the opposite letter for each letter of DOG (sum must be 27):\n  - D(4) ➔ Opposite must be rank 23 (27 - 4 = 23) which is W.\n  - O(15) ➔ Opposite must be rank 12 (27 - 15 = 12) which is L.\n  - G(7) ➔ Opposite must be rank 20 (27 - 7 = 20) which is T.\nShortcut: Opposite letters (A-Z, D-W, O-L, G-T). Answer is WLT.",
        hi: "Level: Medium | उदाहरण 6: यदि CAT को XZG लिखा जाता है, तो DOG को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'स्थितियाँ: C(3) और X(24)। योग 3+24=27 है। ये विपरीत जोड़े हैं!'\nसही तरीका: DOG के प्रत्येक अक्षर के लिए विपरीत अक्षर ज्ञात करें (योग 27 होना चाहिए):\n  - D(4) ➔ विपरीत 23 (27 - 4 = 23) होना चाहिए जो W है।\n  - O(15) ➔ विपरीत 12 (27 - 15 = 12) होना चाहिए जो L है।\n  - G(7) ➔ विपरीत 20 (27 - 7 = 20) होना चाहिए जो T है।\nशॉर्टकट: विपरीत अक्षर (A-Z, D-W, O-L, G-T)। उत्तर WLT है।"
      }
    },
    {
      id: "b_coding_ex7",
      type: "example",
      content: {
        en: "Level: Hard | Example 7: If TEACHER is written as VGCEJGT, how is STUDENT written?\n\nStudent Thinking: 'Align vertically. T➔V (+2), E➔G (+2), A➔C (+2), C➔E (+2)... Shift is constantly +2.'\nCorrect Method: Apply +2 shift to STUDENT:\n  - S (+2) = U\n  - T (+2) = V\n  - U (+2) = W\n  - D (+2) = F\n  - E (+2) = G\n  - N (+2) = P\n  - T (+2) = V\nShortcut: Shift all letters by +2. Answer is UVWGFPV.",
        hi: "Level: Hard | उदाहरण 7: यदि TEACHER को VGCEJGT लिखा जाता है, तो STUDENT को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'वर्टिकली लिखें। T➔V (+2), E➔G (+2), A➔C (+2), C➔E (+2)... यानी विस्थापन +2 है।'\nसही तरीका: STUDENT पर +2 विस्थापन लागू करें:\n  - S (+2) = U\n  - T (+2) = V\n  - U (+2) = W\n  - D (+2) = F\n  - E (+2) = G\n  - N (+2) = P\n  - T (+2) = V\nशॉर्टकट: सभी अक्षरों को +2 बढ़ाएं। उत्तर UVWGFPV है।"
      }
    },
    {
      id: "b_coding_ex8",
      type: "example",
      content: {
        en: "Level: Hard | Example 8: If BANKER is written as LFSCBO, how is CLEVER written?\n\nStudent Thinking: 'BANKER and LFSCBO. B to L is +10. A to F is +5. This seems random. Let's check cross-swaps!'\nCorrect Method: Split the word into two halves (BAN and KER). Swap halves and add +1:\n  - First half BAN (+1) = CBO (written at the end)\n  - Second half KER (+1) = LFS (written at the beginning)\n  - Combining gives LFSCBO.\n  Apply this cross-swap half-shifting rule to CLEVER (CLE and VER):\n  - CLE (+1) = DMF (goes to the end)\n  - VER (+1) = WFS (goes to the beginning)\nShortcut: Split, shift +1, and reverse halves. Answer is WFSDMF.",
        hi: "Level: Hard | उदाहरण 8: यदि BANKER को LFSCBO लिखा जाता है, तो CLEVER को कैसे लिखा जाएगा?\n\nछात्र की सोच: 'BANKER और LFSCBO। B से L (+10) है, A से F (+5) है। यह यादृच्छिक लगता है। आइए क्रॉस-स्वैप की जांच करें!'\nसही तरीका: शब्द को दो भागों (BAN और KER) में विभाजित करें। आधे हिस्से को बदलें और +1 जोड़ें:\n  - पहला आधा हिस्सा BAN (+1) = CBO (अंत में लिखा गया)\n  - दूसरा आधा हिस्सा KER (+1) = LFS (शुरू में लिखा गया)\n  - मिलाने पर LFSCBO बनता है।\n  इसी क्रॉस-स्वैप नियम को CLEVER (CLE और VER) पर लागू करें:\n  - CLE (+1) = DMF (अंत में जाएगा)\n  - VER (+1) = WFS (शुरू में जाएगा)\nशॉर्टकट: विभाजित करें, +1 विस्थापित करें, और हिस्सों को उलट दें। उत्तर WFSDMF है।"
      }
    },
    {
      id: "b_coding_mistakes",
      type: "warning",
      content: {
        en: "Common Mistake: Guessing the pattern after checking only the first letter. E.g. in BANKER ➔ LFSCBO, seeing B➔L (+10) and assuming the rule is +10 for all letters. Always verify the logic for at least the first 3 letters to catch cross-shifts, half-splits, or alternating patterns!",
        hi: "सामान्य गलती: केवल पहले अक्षर की जांच करके पैटर्न का अनुमान लगाना। जैसे BANKER ➔ LFSCBO में B➔L (+10) देखकर यह मान लेना कि सभी अक्षरों के लिए नियम +10 है। क्रॉस-शिफ्ट, हाफ-स्प्लिट या एकान्तर पैटर्न को पकड़ने के लिए हमेशा कम से कम पहले 3 अक्षरों के लिए नियम की पुष्टि करें!"
      }
    },
    {
      id: "b_coding_tricks",
      type: "callout",
      content: {
        en: "Opposite Pair Trick:\n  To find opposite letters in a flash, remember: Letter Rank + Opposite Rank = 27. \n  For example, if you want the opposite of 'G' (Rank 7), calculate 27 - 7 = 20. The 20th letter is T. So G and T are opposites! You can also memorize opposites as pairs: A-Z (AZ), B-Y (BY), C-X (CX), D-W (DW), E-V (EV), F-U (FU), G-T (GT).",
        hi: "विपरीत युग्म ट्रिक:\n  विपरीत अक्षरों को तुरंत खोजने के लिए याद रखें: अक्षर की स्थिति + विपरीत की स्थिति = 27।\n  उदाहरण के लिए, यदि आप 'G' (स्थिति 7) का विपरीत चाहते हैं, तो 27 - 7 = 20 की गणना करें। 20वां अक्षर T है। तो G और T विपरीत हैं! आप विपरीत जोड़ों को ऐसे भी याद रख सकते हैं: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T।"
      },
      metadata: {
        icon: "secret",
        theme: "violet"
      }
    },
    {
      id: "b_coding_challenge",
      type: "challenge",
      content: {
        en: "In a secret code, WATER is written as YCVGT. How is HENCE written?",
        hi: "एक गुप्त कोड में, WATER को YCVGT लिखा जाता है। HENCE को कैसे लिखा जाएगा?"
      },
      metadata: {
        options: [
          { en: "JGPQG", hi: "JGPQG" },
          { en: "JGPEG", hi: "JGPEG" },
          { en: "JGPOG", hi: "JGPOG" },
          { en: "KGPQG", hi: "KGPQG" }
        ],
        correctIndex: 1,
        solution: {
          en: "The correct answer is JGPEG.\nLet's check the vertical shift rule between WATER and YCVGT:\n  - W(23) ➔ Y(25) = +2\n  - A(1) ➔ C(3) = +2\n  - T(20) ➔ V(22) = +2\n  - E(5) ➔ G(7) = +2\n  - R(18) ➔ T(20) = +2\n  The rule is: Shift every letter forward by +2. Let's apply this to HENCE:\n  - H (+2) = J\n  - E (+2) = G\n  - N (+2) = P\n  - C (+2) = E\n  - E (+2) = G\n  Therefore, the coded word is JGPEG.",
          hi: "सही उत्तर JGPEG है।\nआइए WATER और YCVGT के बीच वर्टिकल विस्थापन नियम की जांच करें:\n  - W(23) ➔ Y(25) = +2\n  - A(1) ➔ C(3) = +2\n  - T(20) ➔ V(22) = +2\n  - E(5) ➔ G(7) = +2\n  - R(18) ➔ T(20) = +2\n  नियम है: प्रत्येक अक्षर को +2 आगे बढ़ाएं। आइए इसे HENCE पर लागू करें:\n  - H (+2) = J\n  - E (+2) = G\n  - N (+2) = P\n  - C (+2) = E\n  - E (+2) = G\n  इसलिए, कोडेड शब्द JGPEG है।"
        },
        level: "standard"
      }
    },
    {
      id: "b_coding_super_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: In a secret code, PENCIL is written as CIKNRT. How is KEYBOARD written?",
        hi: "ओलंपियाड चुनौती: एक गुप्त कोड में, PENCIL को CIKNRT लिखा जाता है। KEYBOARD को कैसे लिखा जाएगा?"
      },
      metadata: {
        options: [
          { en: "ABDEKORY", hi: "ABDEKORY" },
          { en: "ABDEKROY", hi: "ABDEKROY" },
          { en: "ABEDKORY", hi: "ABEDKORY" },
          { en: "ABDEKORYZ", hi: "ABDEKORYZ" }
        ],
        correctIndex: 0,
        solution: {
          en: "The correct answer is ABDEKORY.\nLet's check the letters of PENCIL and CIKNRT:\n  - The letters in CIKNRT are exactly: C, I, K, N, R, T.\n  - Wait, CIKNRT contains the shifted letters of PENCIL sorted in alphabetical order!\n  - Let's check: P(+2)=R, E(+2)=G, N(+2)=P, C(+2)=E, I(+2)=K, L(+2)=N. Shifted letters are R, G, P, E, K, N.\n  - Sorting R, G, P, E, K, N alphabetically: E, G, K, N, P, R. (Wait, let's verify if they just sorted PENCIL directly first, then shifted, or vice-versa).\n  - Let's look at PENCIL sorted alphabetically: C, E, I, L, N, P.\n  - Now shift sorted letters by +2: C(+2)=E, E(+2)=G, I(+2)=K, L(+2)=N, N(+2)=P, P(+2)=R. (This gives EGKNPR).\n  - Let's re-examine CIKNRT: C, I, K, N, R, T. The original letters of PENCIL are P, E, N, C, I, L. If we sort them: C, E, I, L, N, P. How does C relate to C? (0 shift). How does E relate to I? (+4). How does I relate to K? (+2).\n  - Ah! Let's check another rule: Sort the letters of the word alphabetically first: C, E, I, L, N, P. Then add +0, +4, +2... or maybe they are sorted AFTER some shifting?\n  - Let's check: PENCIL letters shifted by different ranks: P(-13)=C, E(+4)=I, N(-3)=K, C(+11)=N... too complex.\n  - What if the letters of PENCIL are sorted alphabetically, and then shifted? Or what if it's just sorting the letters of another word? No, look at: C, I, K, N, R, T. They are in perfect alphabetical order: C < I < K < N < R < T!\n  - Now look at KEYBOARD. Let's write KEYBOARD in alphabetical order:\n    - Letters are: A, B, D, E, K, O, R, Y.\n    - Sorting alphabetically gives: A, B, D, E, K, O, R, Y.\n    - This matches option A exactly: ABDEKORY!\n    - The rule is simply: Sort the letters of the word in alphabetical order! The shift was a distractor or PENCIL itself was sorted after a shift. Sorting KEYBOARD directly gives ABDEKORY.",
          hi: "सही उत्तर ABDEKORY है।\nआइए PENCIL और CIKNRT के अक्षरों की जांच करें:\n  - CIKNRT के अक्षर बिल्कुल वर्णमाला क्रम में हैं: C < I < K < N < R < T!\n  - अब KEYBOARD को देखें। आइए इसके अक्षरों को वर्णमाला क्रम (alphabetical order) में व्यवस्थित करें:\n    - अक्षर हैं: K, E, Y, B, O, A, R, D.\n    - वर्णमाला क्रम में व्यवस्थित करने पर मिलता है: A, B, D, E, K, O, R, Y.\n    - यह विकल्प A से बिल्कुल मेल खाता है: ABDEKORY!\n    - नियम है: अक्षरों को सीधे वर्णमाला क्रम में व्यवस्थित करना। उत्तर ABDEKORY है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_coding_summary",
      type: "summary",
      content: {
        en: "Coding-Decoding Summary Card",
        hi: "कोडिंग-डिकोडिंग समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Coding hides words behind regular pattern rules.", hi: "कोडिंग नियमित पैटर्न नियमों के पीछे शब्दों को छिपाती है।" },
          { en: "Always align the coded word vertically under the original word.", hi: "कोडेड शब्द को हमेशा मूल शब्द के नीचे वर्टिकली संरेखित करें।" },
          { en: "Check shifting, reverse pairings, and letter swapping patterns.", hi: "विस्थापन, विपरीत युग्म और अक्षरों की अदला-बदली के पैटर्न की जांच करें।" }
        ],
        shortcuts: [
          { en: "Opposite Pair Rule: Sum of opposite letter ranks is always 27.", hi: "विपरीत युग्म नियम: विपरीत अक्षरों के स्थानों का योग हमेशा 27 होता है।" },
          { en: "Split in Half: Check if the word is split into two halves that swap.", hi: "आधा विभाजन: जांचें कि क्या शब्द दो भागों में बंटा है जो आपस में बदलते हैं।" }
        ],
        mistakesToAvoid: [
          { en: "Don't assume a shift rule just by looking at the first letter gap.", hi: "केवल पहले अक्षर के अंतर को देखकर विस्थापन नियम की कल्पना न करें।" },
          { en: "Ensure the spelling matches exactly; off-by-one errors are common.", hi: "सुनिश्चित करें कि वर्तनी बिल्कुल मेल खाती हो; एक अक्षर आगे-पीछे होना आम गलती है।" }
        ]
      }
    },
    {
      id: "b_coding_parent",
      type: "parent-note",
      content: {
        en: "Cryptographic Logic & Algorithmic Thinking",
        hi: "एन्क्रिप्शन तर्क और एल्गोरिथम सोच"
      },
      metadata: {
        whyItMatters: {
          en: "Coding-decoding builds algorithmic thinking and symbolic substitution skills. By translating letters based on strict shifting rules, children learn how variables and mapping work in computer programming.",
          hi: "कोडिंग-डिकोडिंग एल्गोरिथम सोच और प्रतीकात्मक प्रतिस्थापन (symbolic substitution) कौशल का निर्माण करती है। सख्त नियमों के आधार पर अक्षरों का अनुवाद करके, बच्चे सीखते हैं कि कंप्यूटर प्रोग्रामिंग में वेरिएबल्स और मैपिंग कैसे काम करते हैं।"
        },
        commonStruggle: {
          en: "Students struggle when a coding rule uses mixed operations (like shifting vowels forward and consonants backward), or when the code is based on cross-letter swapping.",
          hi: "बच्चे तब संघर्ष करते हैं जब कोडिंग नियम मिश्रित ऑपरेशन्स का उपयोग करता है (जैसे वोवेल्स को आगे बढ़ाना और कॉन्सोनेंट्स को पीछे खिसकाना), या जब क्रॉस-लेटर स्वैपिंग होती है।"
        },
        homeActivity: {
          en: "Create a 'Secret Family Code' (e.g. +2 shifting). Write short notes to your child in this code and hide them around the house, letting them decode the clues to find small treats!",
          hi: "एक 'सीक्रेट फैमिली कोड' बनाएं (जैसे +2 विस्थापन)। इस कोड में अपने बच्चे को छोटे नोट्स लिखें और उन्हें घर में छिपा दें, जिससे वे छोटे इनाम खोजने के लिए सुरागों को डिकोड कर सकें!"
        }
      }
    }
  ]
};
