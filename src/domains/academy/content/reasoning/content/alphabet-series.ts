import { TopicContent } from "../../../core/types";

export const alphabetSeriesContent: TopicContent = {
  id: "topic_alphabet_series",
  slug: "alphabet-series",
  version: 2,
  publishedAt: "2026-07-05",
  status: "published",
  title: {
    en: "Alphabet Series",
    hi: "वर्णमाला श्रृंखला (Alphabet Series)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_alphabet_easy", "q_alphabet_medium", "q_alphabet_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Convert letters to numbers immediately to solve them easily.",
      "Use EJOTY (5, 10, 15, 20, 25) to map letters quickly.",
      "Check both forward (+1, +2) and backward (-1, -2) shifting patterns."
    ],
    quickTricks: [
      "Always write down the numerical position of the letters above them."
    ]
  },
  blocks: [
    {
      id: "b_alphabet_hook",
      type: "callout",
      content: {
        en: "A secret spy sent this urgent message: 'Meet me at point B, then D, then F, then H...' Where is the next meeting spot? \n\nIf you guessed 'J', you just cracked your first alphabet code! But how did your brain do it? Let's find out how letters hide numbers behind their masks!",
        hi: "एक सीक्रेट जासूस ने यह जरूरी संदेश भेजा: 'मुझसे पहले पॉइंट B पर मिलें, फिर D पर, फिर F पर, फिर H पर...' अगला मिलने का स्थान कौन सा है?\n\nयदि आपका अनुमान 'J' था, तो आपने अपना पहला वर्णमाला कोड क्रैक कर लिया है! लेकिन आपके दिमाग ने यह कैसे किया? आइए जानें कि अक्षर अपने पीछे संख्याओं को कैसे छिपाते हैं!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_alphabet_eli10",
      type: "callout",
      content: {
        en: "Letters are just numbers wearing costumes! 'A' is just 1 in a fancy hat, 'B' is 2, and 'Z' is 26. When we skip letters (like skipping C to go from B to D), we are actually just adding numbers (+2). If you convert letters to their number ranks, every letter puzzle becomes a simple addition/subtraction game!",
        hi: "अक्षर और कुछ नहीं, बस वेश बदले हुए नंबर हैं! 'A' वास्तव में 1 है जिसने एक सुंदर टोपी पहन रखी है, 'B' का मतलब 2 है, और 'Z' का मतलब 26 है। जब हम अक्षरों को छोड़ते हैं (जैसे B से D पर जाने के लिए C को छोड़ना), तो हम वास्तव में सिर्फ संख्याओं को जोड़ रहे होते हैं (+2)। यदि आप अक्षरों को उनकी संख्याओं में बदल देते हैं, तो हर वर्णमाला पहेली एक आसान जोड़/घटाव का खेल बन जाती है!"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_alphabet_life",
      type: "callout",
      content: {
        en: "We see alphabet sequences everywhere! Have you noticed library books sorted by categories A, B, C, D? Or clothing sizes going from S (Small) to M (Medium), L (Large), XL (Extra Large)? Recognizing alphabetical orders helps us organize and find things in a flash.",
        hi: "हम हर जगह वर्णमाला के क्रम देखते हैं! क्या आपने ध्यान दिया है कि लाइब्रेरी की किताबें A, B, C, D श्रेणियों में बंटी होती हैं? या कपड़ों के साइज S (स्मॉल) से M (मीडियम), L (लार्ज), XL (एक्स्ट्रा लार्ज) की ओर बढ़ते हैं? वर्णमाला क्रम को पहचानने से हमें चीजों को चुटकी में व्यवस्थित करने और ढूंढने में मदद मिलती है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_alphabet_ejoty_h",
      type: "heading",
      content: {
        en: "The Magic Tool: EJOTY (जादुई टूल: EJOTY)",
        hi: "जादुई टूल: EJOTY (The Magic Tool: EJOTY)"
      }
    },
    {
      id: "b_alphabet_ejoty_p",
      type: "paragraph",
      content: {
        en: "Instead of counting A, B, C, D... on your fingers, memorize this single word: **EJOTY**. It marks every 5th letter in the alphabet!",
        hi: "अपनी उंगलियों पर A, B, C, D... गिनने के बजाय, इस एक शब्द को याद कर लें: **EJOTY**। यह वर्णमाला के प्रत्येक 5वें अक्षर को दर्शाता है!"
      }
    },
    {
      id: "b_alphabet_ejoty_table",
      type: "table",
      content: {
        en: "EJOTY Reference Grid",
        hi: "EJOTY संदर्भ ग्रिड"
      },
      metadata: {
        headers: [
          { en: "Letter (अक्षर)", hi: "अक्षर (Letter)" },
          { en: "E", hi: "E" },
          { en: "J", hi: "J" },
          { en: "O", hi: "O" },
          { en: "T", hi: "T" },
          { en: "Y", hi: "Y" }
        ],
        rows: [
          [
            { en: "Position (स्थिति)", hi: "स्थिति (Position)" },
            { en: "5", hi: "5" },
            { en: "10", hi: "10" },
            { en: "15", hi: "15" },
            { en: "20", hi: "20" },
            { en: "25", hi: "25" }
          ]
        ]
      }
    },
    {
      id: "b_alphabet_ejoty_callout",
      type: "callout",
      content: {
        en: "Want to find the position of 'S'? You know T is 20, and S comes just before T. So S must be 19! It's that fast!",
        hi: "क्या आप 'S' की स्थिति जानना चाहते हैं? आप जानते हैं कि T का मान 20 है, और S ठीक T से पहले आता है। इसलिए S का मान 19 होना चाहिए! यह इतना तेज़ है!"
      },
      metadata: {
        icon: "secret",
        theme: "violet"
      }
    },
    {
      id: "b_alphabet_library_h",
      type: "heading",
      content: {
        en: "The Pattern Library (पैटर्न लाइब्रेरी)",
        hi: "पैटर्न लाइब्रेरी (The Pattern Library)"
      }
    },
    {
      id: "b_alphabet_lib_table",
      type: "table",
      content: {
        en: "Alphabet Pattern Categories",
        hi: "वर्णमाला पैटर्न श्रेणियां"
      },
      metadata: {
        headers: [
          { en: "Pattern Type", hi: "पैटर्न का प्रकार" },
          { en: "What Happens", hi: "क्या होता है" },
          { en: "Example", hi: "उदाहरण" }
        ],
        rows: [
          [
            { en: "Constant Skip (+1, +2)", hi: "निश्चित उछाल (+1, +2)" },
            { en: "Skip the same number of letters every step.", hi: "हर कदम पर समान संख्या में अक्षरों को छोड़ें।" },
            { en: "A, C, E, G (skip 1 letter: +2 rank)", hi: "A, C, E, G (1 अक्षर छोड़कर: +2 स्थिति)" }
          ],
          [
            { en: "Backward Count (-)", hi: "उल्टी गिनती (-)" },
            { en: "Letters move backwards from Z to A.", hi: "अक्षर Z से A की ओर पीछे की तरफ चलते हैं।" },
            { en: "Z, X, V, T (-2 rank each time)", hi: "Z, X, V, T (हर बार -2 स्थिति)" }
          ],
          [
            { en: "Growing Skip (+1, +2, +3)", hi: "बढ़ता हुआ उछाल (+1, +2, +3)" },
            { en: "The gap between letters grows larger each step.", hi: "अक्षरों के बीच का गैप हर बार बड़ा होता जाता है।" },
            { en: "A, B, D, G (+1, +2, +3...)", hi: "A, B, D, G (+1, +2, +3...)" }
          ],
          [
            { en: "Double Letter Pairs", hi: "दोहरे अक्षरों के जोड़े" },
            { en: "Pairs of letters follow a rule together.", hi: "दो-दो अक्षरों के जोड़े एक नियम का पालन करते हैं।" },
            { en: "AB, CD, EF, GH (consecutive pairs)", hi: "AB, CD, EF, GH (लगातार जोड़े)" }
          ]
        ]
      }
    },
    {
      id: "b_alphabet_recipe_h",
      type: "heading",
      content: {
        en: "The Recipe: How to Solve Any Alphabet Series",
        hi: "रेसिपी: किसी भी वर्णमाला श्रृंखला को हल करने का तरीका"
      }
    },
    {
      id: "b_alphabet_recipe",
      type: "recipe",
      content: {
        en: "Follow these 4 simple steps to crack the code:",
        hi: "कोड क्रैक करने के लिए इन 4 आसान चरणों का पालन करें:"
      },
      metadata: {
        steps: [
          {
            en: "Translate to Numbers: Use EJOTY to write the numerical rank above each letter immediately.",
            hi: "संख्याओं में बदलें: प्रत्येक अक्षर के ऊपर उसकी संख्यात्मक स्थिति लिखने के लिए EJOTY का उपयोग करें।"
          },
          {
            en: "Write Gaps: Calculate the differences (+2, -3, etc.) between the number ranks.",
            hi: "गैप लिखें: नंबरों के बीच के अंतर (+2, -3, आदि) की गणना करें।"
          },
          {
            en: "Predict Next Number: Apply the gap rule to find the next number in the pattern.",
            hi: "अगली संख्या का अनुमान लगाएं: पैटर्न में अगली संख्या खोजने के लिए गैप नियम लागू करें।"
          },
          {
            en: "Translate Back: Convert that final number back into its matching alphabet letter.",
            hi: "वापस अक्षर में बदलें: उस अंतिम संख्या को उसके संगत वर्णमाला अक्षर में बदलें।"
          }
        ]
      }
    },
    {
      id: "b_alphabet_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_alphabet_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: C, F, I, L, ?\n\nStudent Thinking: 'Let's write down positions: C=3, F=6, I=9, L=12.'\nCorrect Method:\n  - C(3) ➔ F(6) = +3\n  - F(6) ➔ I(9) = +3\n  - I(9) ➔ L(12) = +3\n  Rule is: Add 3 to the position.\nShortcut: 12 + 3 = 15. The 15th letter is O. Answer is O.",
        hi: "Level: Easy | उदाहरण 1: C, F, I, L, ?\n\nछात्र की सोच: 'आइए स्थितियों को लिखें: C=3, F=6, I=9, L=12।'\nसही तरीका:\n  - C(3) ➔ F(6) = +3\n  - F(6) ➔ I(9) = +3\n  - I(9) ➔ L(12) = +3\n  नियम है: स्थिति में 3 जोड़ें।\nशॉर्टकट: 12 + 3 = 15. 15वां अक्षर O होता है। उत्तर O है।"
      }
    },
    {
      id: "b_alphabet_ex2",
      type: "example",
      content: {
        en: "Level: Easy | Example 2: Z, X, V, T, ?\n\nStudent Thinking: 'Letters are going backward! Positions: Z=26, X=24, V=22, T=20.'\nCorrect Method:\n  - 26 ➔ 24 (-2)\n  - 24 ➔ 22 (-2)\n  - 22 ➔ 20 (-2)\n  Rule is: Subtract 2 each time.\nShortcut: 20 - 2 = 18. The 18th letter is R. Answer is R.",
        hi: "Level: Easy | उदाहरण 2: Z, X, V, T, ?\n\nछात्र की सोच: 'अक्षर पीछे की ओर जा रहे हैं! स्थितियाँ: Z=26, X=24, V=22, T=20।'\nसही तरीका:\n  - 26 ➔ 24 (-2)\n  - 24 ➔ 22 (-2)\n  - 22 ➔ 20 (-2)\n  नियम है: हर बार 2 घटाएं।\nशॉर्टकट: 20 - 2 = 18. 18वां अक्षर R है। उत्तर R है।"
      }
    },
    {
      id: "b_alphabet_ex3",
      type: "example",
      content: {
        en: "Level: Easy | Example 3: A, C, F, J, ?\n\nStudent Thinking: 'Positions: A=1, C=3, F=6, J=10. The gaps are +2, +3, +4...'\nCorrect Method:\n  - 1 + 2 = 3\n  - 3 + 3 = 6\n  - 6 + 4 = 10\n  The next gap must be +5.\nShortcut: 10 + 5 = 15. The 15th letter is O. Answer is O.",
        hi: "Level: Easy | उदाहरण 3: A, C, F, J, ?\n\nछात्र की सोच: 'स्थितियाँ: A=1, C=3, F=6, J=10. गैप्स हैं +2, +3, +4...'\nसही तरीका:\n  - 1 + 2 = 3\n  - 3 + 3 = 6\n  - 6 + 4 = 10\n  अगला गैप +5 होना चाहिए।\nशॉर्टकट: 10 + 5 = 15. 15वां अक्षर O है। उत्तर O है।"
      }
    },
    {
      id: "b_alphabet_ex4",
      type: "example",
      content: {
        en: "Level: Medium | Example 4: AB, DE, GH, JK, ?\n\nStudent Thinking: 'These are pairs of letters! Let's check the first letters of each pair: A, D, G, J.'\nCorrect Method:\n  - First letters: A(1) ➔ D(4) = +3; D(4) ➔ G(7) = +3; G(7) ➔ J(10) = +3. Next first letter is 13 (M).\n  - Second letters: B(2) ➔ E(5) = +3; E(5) ➔ H(8) = +3; H(8) ➔ K(11) = +3. Next second letter is 14 (N).\nShortcut: Apply +3 to both parts. MN is the answer.",
        hi: "Level: Medium | उदाहरण 4: AB, DE, GH, JK, ?\n\nछात्र की सोच: 'ये अक्षरों के जोड़े हैं! आइए प्रत्येक जोड़े के पहले अक्षर की जाँच करें: A, D, G, J।'\nसही तरीका:\n  - पहले अक्षर: A(1) ➔ D(4) = +3; D(4) ➔ G(7) = +3; G(7) ➔ J(10) = +3. अगला पहला अक्षर 13 (M) होगा।\n  - दूसरे अक्षर: B(2) ➔ E(5) = +3; E(5) ➔ H(8) = +3; H(8) ➔ K(11) = +3. अगला दूसरा अक्षर 14 (N) होगा।\nशॉर्टकट: दोनों हिस्सों में +3 जोड़ें। उत्तर MN है।"
      }
    },
    {
      id: "b_alphabet_ex5",
      type: "example",
      content: {
        en: "Level: Medium | Example 5: AZ, CX, EV, GT, ?\n\nStudent Thinking: 'The first letter increases: A, C, E, G (+2 each). The second letter decreases: Z, X, V, T (-2 each).'\nCorrect Method:\n  - First letters: A(1) ➔ C(3) ➔ E(5) ➔ G(7) ➔ Next is I(9).\n  - Second letters: Z(26) ➔ X(24) ➔ V(22) ➔ T(20) ➔ Next is R(18).\nShortcut: First increases (+2), second decreases (-2). Answer is IR.",
        hi: "Level: Medium | उदाहरण 5: AZ, CX, EV, GT, ?\n\nछात्र की सोच: 'पहला अक्षर बढ़ता है: A, C, E, G (प्रत्येक +2)। दूसरा अक्षर घटता है: Z, X, V, T (प्रत्येक -2)।'\nसही तरीका:\n  - पहले अक्षर: A(1) ➔ C(3) ➔ E(5) ➔ G(7) ➔ अगला I(9) है।\n  - दूसरे अक्षर: Z(26) ➔ X(24) ➔ V(22) ➔ T(20) ➔ अगला R(18) है।\nशॉर्टकट: पहला बढ़ा (+2), दूसरा घटा (-2)। उत्तर IR है।"
      }
    },
    {
      id: "b_alphabet_ex6",
      type: "example",
      content: {
        en: "Level: Medium | Example 6: W, T, P, M, I, ?\n\nStudent Thinking: 'Positions are W=23, T=20, P=16, M=13, I=9. Let's look at the gaps: -3, -4, -3, -4.'\nCorrect Method:\n  - 23 - 3 = 20\n  - 20 - 4 = 16\n  - 16 - 3 = 13\n  - 13 - 4 = 9\n  - Pattern is alternating subtraction: -3, -4, -3, -4. Next must be -3.\nShortcut: 9 - 3 = 6. The 6th letter is F. Answer is F.",
        hi: "Level: Medium | उदाहरण 6: W, T, P, M, I, ?\n\nछात्र की सोच: 'अक्षरों की संख्या: W=23, T=20, P=16, M=13, I=9. आइए अंतर देखें: -3, -4, -3, -4।'\nसही तरीका:\n  - 23 - 3 = 20\n  - 20 - 4 = 16\n  - 16 - 3 = 13\n  - 13 - 4 = 9\n  - पैटर्न एकान्तर घटाव है: -3, -4, -3, -4। अगला घटाव -3 होना चाहिए।\nशॉर्टकट: 9 - 3 = 6. छठा अक्षर F है। उत्तर F है।"
      }
    },
    {
      id: "b_alphabet_ex7",
      type: "example",
      content: {
        en: "Level: Hard | Example 7: Y, W, T, P, K, ?\n\nStudent Thinking: 'Positions: Y=25, W=23, T=20, P=16, K=11. Gaps are: -2, -3, -4, -5. The gap grows in subtraction!'\nCorrect Method:\n  - 25 - 2 = 23\n  - 23 - 3 = 20\n  - 20 - 4 = 16\n  - 16 - 5 = 11\n  - Next gap must be -6.\nShortcut: 11 - 6 = 5. The 5th letter is E. Answer is E.",
        hi: "Level: Hard | उदाहरण 7: Y, W, T, P, K, ?\n\nछात्र की सोच: 'स्थितियाँ: Y=25, W=23, T=20, P=16, K=11. गैप्स हैं: -2, -3, -4, -5. घटाव का अंतर बढ़ रहा है!'\nसही तरीका:\n  - 25 - 2 = 23\n  - 23 - 3 = 20\n  - 20 - 4 = 16\n  - 16 - 5 = 11\n  - अगला गैप -6 होना चाहिए।\nशॉर्टकट: 11 - 6 = 5. 5वां अक्षर E है। उत्तर E है।"
      }
    },
    {
      id: "b_alphabet_ex8",
      type: "example",
      content: {
        en: "Level: Hard | Example 8: CX, EV, HS, LO, ?\n\nStudent Thinking: 'Pairs! Let's check first letters: C(3), E(5), H(8), L(12). Gaps are +2, +3, +4. Next first letter is 12 + 5 = 17 (Q).'\nCorrect Method: Now look at second letters: X(24), V(22), S(19), O(15). Gaps are -2, -3, -4. Next second letter is 15 - 5 = 10 (J).\nShortcut: First increases (+2, +3, +4, +5), second decreases (-2, -3, -4, -5). Answer is QJ.",
        hi: "Level: Hard | उदाहरण 8: CX, EV, HS, LO, ?\n\nछात्र की सोच: 'जोड़े! पहले अक्षरों को देखें: C(3), E(5), H(8), L(12)। अंतर +2, +3, +4 हैं। अगला पहला अक्षर 12 + 5 = 17 (Q) होगा।'\nसही तरीका: अब दूसरे अक्षरों को देखें: X(24), V(22), S(19), O(15)। अंतर -2, -3, -4 हैं। अगला दूसरा अक्षर 15 - 5 = 10 (J) होगा।\nशॉर्टकट: पहला बढ़ता है (+2, +3, +4, +5), दूसरा घटता है (-2, -3, -4, -5)। उत्तर QJ है।"
      }
    },
    {
      id: "b_alphabet_mistakes",
      type: "warning",
      content: {
        en: "Common Mistake: Don't guess the next letter just by looking at standard alphabetical flow. Students often write 'N' after 'L' because they skip 'M', without verifying the actual skip count (+2 vs +3). Always check at least three intervals to be 100% sure!",
        hi: "सामान्य गलती: केवल सामान्य वर्णमाला प्रवाह को देखकर अगले अक्षर का अनुमान न लगाएं। छात्र अक्सर 'L' के बाद सीधे 'N' लिख देते हैं क्योंकि वे बिना नियम की पुष्टि किए केवल एक अक्षर 'M' छोड़ने की आदत में होते हैं। हमेशा 100% सुनिश्चित होने के लिए कम से कम तीन अंतरालों की जांच करें!"
      }
    },
    {
      id: "b_alphabet_challenge",
      type: "challenge",
      content: {
        en: "Find the next term in this letter sequence: B, E, I, N, ?",
        hi: "इस अक्षर अनुक्रम में अगला पद ज्ञात कीजिए: B, E, I, N, ?"
      },
      metadata: {
        options: [
          { en: "S", hi: "S" },
          { en: "T", hi: "T" },
          { en: "R", hi: "R" },
          { en: "U", hi: "U" }
        ],
        correctIndex: 1,
        solution: {
          en: "The correct answer is T.\nLet's write down the numerical ranks first:\n  - B = 2\n  - E = 5\n  - I = 9\n  - N = 14\n  Now calculate the differences:\n  - 2 ➔ 5 (+3)\n  - 5 ➔ 9 (+4)\n  - 9 ➔ 14 (+5)\n  The gap is growing: +3, +4, +5. The next gap must be +6.\n  - 14 + 6 = 20.\n  The 20th letter is T (using EJOTY!). Therefore, the answer is T.",
          hi: "सही उत्तर T है।\nआइए सबसे पहले वर्णमाला की संख्यात्मक स्थिति लिखें:\n  - B = 2\n  - E = 5\n  - I = 9\n  - N = 14\n  Now calculate the differences:\n  - 2 ➔ 5 (+3)\n  - 5 ➔ 9 (+4)\n  - 9 ➔ 14 (+5)\n  गैप बढ़ रहा है: +3, +4, +5। अगला गैप +6 होना चाहिए।\n  - 14 + 6 = 20.\n  20वां अक्षर T है (EJOTY याद करें!)। इसलिए, उत्तर T है।"
        },
        level: "standard"
      }
    },
    {
      id: "b_alphabet_super_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: What is the next pair in this sequence: AZ, BY, EV, GT, KP, ?",
        hi: "ओलंपियाड चुनौती: इस अनुक्रम में अगला जोड़ा क्या होगा: AZ, BY, EV, GT, KP, ?"
      },
      metadata: {
        options: [
          { en: "MN", hi: "MN" },
          { en: "LO", hi: "LO" },
          { en: "NM", hi: "NM" },
          { en: "OL", hi: "OL" }
        ],
        correctIndex: 2,
        solution: {
          en: "The correct answer is NM.\nLet's inspect the first letters of each pair: A(1), B(2), E(5), G(7), K(11).\nLet's find the gaps:\n  - 1 ➔ 2 = +1\n  - 2 ➔ 5 = +3\n  - 5 ➔ 7 = +2\n  - 7 ➔ 11 = +4\n  This is an alternating gap pattern: +1, then +3, then +2, then +4. The next gap should be +3.\n  - 11 + 3 = 14.\n  The 14th letter is N. The opposite of N is M. Thus, the next pair is NM.",
          hi: "सही उत्तर NM है।\nआइए प्रत्येक जोड़े के पहले अक्षरों का निरीक्षण करें: A(1), B(2), E(5), G(7), K(11)।\nआइए अंतर देखें:\n  - 1 ➔ 2 = +1\n  - 2 ➔ 5 = +3\n  - 5 ➔ 7 = +2\n  - 7 ➔ 11 = +4\n  यह एकान्तर गैप पैटर्न है: +1, फिर +3, फिर +2, फिर +4। अगला गैप +3 होना चाहिए।\n  - 11 + 3 = 14.\n  14वां अक्षर N होता है। N का विपरीत अक्षर M है। इसलिए, अगला जोड़ा NM है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_alphabet_summary",
      type: "summary",
      content: {
        en: "Alphabet Series Summary Card",
        hi: "वर्णमाला श्रृंखला समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Always convert letters to number ranks (A=1, Z=26) immediately.", hi: "अक्षरों को तुरंत संख्यात्मक स्थानों (A=1, Z=26) में बदलें।" },
          { en: "Memorize EJOTY (5, 10, 15, 20, 25) to map ranks under 2 seconds.", hi: "2 सेकंड में स्थिति खोजने के लिए EJOTY (5, 10, 15, 20, 25) याद रखें।" },
          { en: "Watch out for paired chains; check first and second letters separately.", hi: "जोड़े वाले अनुक्रमों पर ध्यान दें; पहले और दूसरे अक्षरों की अलग-अलग जाँच करें।" }
        ],
        shortcuts: [
          { en: "EJOTY: E=5, J=10, O=15, T=20, Y=25.", hi: "EJOTY: E=5, J=10, O=15, T=20, Y=25." },
          { en: "Sum of opposite letters is always 27 (e.g., A(1) + Z(26) = 27).", hi: "विपरीत अक्षरों की स्थिति का योग हमेशा 27 होता है (जैसे A(1) + Z(26) = 27)।" }
        ],
        mistakesToAvoid: [
          { en: "Don't count on fingers; it leads to off-by-one errors.", hi: "उंगलियों पर न गिनें; इससे एक अंक की गलती (off-by-one error) होने की संभावना बढ़ जाती है।" },
          { en: "Check if the series wraps around from Z to A (+1 from Z is A).", hi: "जांचें कि क्या श्रृंखला Z से A पर वापस घूम रही है (Z के बाद अगला अक्षर A है)।" }
        ]
      }
    },
    {
      id: "b_alphabet_parent",
      type: "parent-note",
      content: {
        en: "Alphabet Logic & Spatial Indexing Skills",
        hi: "अक्षर तर्क और संज्ञानात्मक विकास कौशल"
      },
      metadata: {
        whyItMatters: {
          en: "Alphabet series tests a child's spatial sequencing and alphabetical index mapping. Rather than just seeing letters, children learn to translate symbolic categories (letters) into logical ranks (numbers), which boosts abstract logic skills.",
          hi: "वर्णमाला श्रृंखला बच्चों के अनुक्रम बनाने और वर्णमाला को दिमाग में व्यवस्थित करने की क्षमता का परीक्षण करती है। केवल अक्षरों को देखने के बजाय, वे प्रतीकों को संख्यात्मक मानों में बदलना सीखते हैं, जो अमूर्त तर्क (Abstract Logic) को बढ़ावा देता है।"
        },
        commonStruggle: {
          en: "Students struggle most when counting backwards or when the series jumps by irregular intervals. Finger counting is slow and prone to errors under pressure.",
          hi: "बच्चे सबसे ज्यादा तब परेशान होते हैं जब उन्हें पीछे की तरफ वर्णमाला गिननी होती है या जब अंतराल विषम होता है। उंगलियों पर गिनना धीमा होता है और दबाव में गलतियाँ कराता है।"
        },
        homeActivity: {
          en: "When reading street signs or product wrappers, ask your child to spell out words using the EJOTY values (e.g., 'CAT' is 3, 1, 20). It makes mental translation second nature and builds sharp concentration!",
          hi: "सड़क के बोर्ड या पैकेटों पर लिखे शब्दों को पढ़ते समय, अपने बच्चे से शब्दों को EJOTY नंबरों में बताने को कहें (जैसे 'CAT' का मतलब 3, 1, 20 है)। इससे मानसिक गणना उनके स्वभाव में आ जाएगी और ध्यान केंद्रित करने की शक्ति बढ़ेगी!"
        }
      }
    }
  ]
};
