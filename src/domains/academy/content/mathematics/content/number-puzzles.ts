import { TopicContent } from "../../../core/types";

export const numberPuzzlesContent: TopicContent = {
  id: "topic_number_puzzles",
  slug: "number-puzzles",
  version: 3,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Number Puzzles",
    hi: "संख्या पहेलियाँ (Number Puzzles)"
  },
  category: "Mathematical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_puzzle_easy", "q_puzzle_medium", "q_puzzle_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "In grid matrices, check rules horizontally (row-wise) or vertically (column-wise). Common operations are sum of cells, squares, or products.",
      "Symbol operation puzzles change the standard BODMAS operators. Always rewrite the equation with the replaced symbols first.",
      "Missing corner number wheels operate by relating external outer cells to get the center answer."
    ],
    quickTricks: [
      "BODMAS: Brackets first, Orders (squares), Division/Multiplication, Addition/Subtraction."
    ]
  },
  blocks: [
    {
      id: "b_puzzle_hook",
      type: "callout",
      content: {
        en: "Look at this row of numbers: 3, 5, 9, 17, 33... What is the next number? \n\nIt is 65! The rule is: multiply by 2 and subtract 1 (3*2-1=5, 5*2-1=9...). Math puzzles are like riddles where numbers hide their secret codes. Let's learn how to spot their hiding places!",
        hi: "संख्याओं की इस पंक्ति को देखें: 3, 5, 9, 17, 33... अगली संख्या क्या होगी?\n\nयह 65 है! नियम है: 2 से गुणा करें और 1 घटाएं (3*2-1=5, 5*2-1=9...)। गणित की पहेलियाँ पहेलियों की तरह होती हैं जहाँ संख्याएँ अपने गुप्त कोड छिपाती हैं। आइए सीखें कि उनके छिपने के स्थानों को कैसे खोजा जाए!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_puzzle_eli10",
      type: "callout",
      content: {
        en: "A number puzzle is like a cross-word, but with numbers instead of letters. It gives you a shape (like a grid, circle, or triangle) filled with numbers and one blank space. Your job is to find the mathematical rule connecting them to fill in the blank. It is pure detective logic!",
        hi: "एक संख्या पहेली एक क्रॉसवर्ड (क्रॉसवर्ड) की तरह है, लेकिन अक्षरों के बजाय संख्याओं के साथ। यह आपको संख्याओं से भरा एक आकार (जैसे ग्रिड, वृत्त या त्रिभुज) और एक खाली स्थान देता है। आपका काम खाली स्थान को भरने के लिए उन्हें जोड़ने वाले गणितीय नियम को खोजना है। यह शुद्ध जासूसी तर्क है!"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_puzzle_life",
      type: "callout",
      content: {
        en: "Solving number puzzles develops flexible math thinking. It helps you recognize numerical patterns and structures, which makes algebra and mental arithmetic incredibly simple.",
        hi: "संख्या पहेलियों को हल करने से लचीली गणितीय सोच विकसित होती है। यह आपको संख्यात्मक पैटर्न और संरचनाओं को पहचानने में मदद करता है, जिससे बीजगणित और मानसिक अंकगणित अविश्वसनीय रूप से सरल हो जाते हैं।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_puzzle_lib_table",
      type: "table",
      content: {
        en: "Common Number Puzzles Structures",
        hi: "सामान्य संख्या पहेली संरचनाएं"
      },
      metadata: {
        headers: [
          { en: "Puzzle Type", hi: "पहेली प्रकार" },
          { en: "Typical Rule", hi: "सामान्य नियम" },
          { en: "Example Pattern", hi: "उदाहरण पैटर्न" }
        ],
        rows: [
          [
            { en: "3x3 Matrix Grid", hi: "3x3 मैट्रिक्स ग्रिड" },
            { en: "Row-wise square sum, or column-wise product", hi: "पंक्ति-वार वर्ग योग, या कॉलम-वार गुणन" },
            { en: "2, 4, 8 | 3, 9, 27 | 4, 16, 64", hi: "2, 4, 8 | 3, 9, 27 | 4, 16, 64" }
          ],
          [
            { en: "Operator Swap", hi: "ऑपरेटर स्वैप" },
            { en: "Replacing operators and using BODMAS rules", hi: "ऑपरेटरों को बदलना और BODMAS नियम लागू करना" },
            { en: "If '+' means '*', then 2 + 5 = 10", hi: "यदि '+' का अर्थ '*' है, तो 2 + 5 = 10" }
          ],
          [
            { en: "Triangle Corners", hi: "त्रिभुज कोने" },
            { en: "Center = (Corner 1 * Corner 2) + Corner 3", hi: "केंद्र = (कोना 1 * कोना 2) + कोना 3" },
            { en: "Corners (3, 4, 5) -> Center = 17", hi: "कोने (3, 4, 5) -> केंद्र = 17" }
          ]
        ]
      }
    },
    {
      id: "b_puzzle_recipe_title",
      type: "heading",
      content: {
        en: "Cracking Grid Matrices Recipe (मैट्रिक्स पहेली)",
        hi: "ग्रिड मैट्रिक्स क्रैक करने की रेसिपी (Matrix Puzzles)"
      }
    },
    {
      id: "b_puzzle_recipe",
      type: "recipe",
      content: {
        en: "Follow these step-by-step logic checks to crack any 3x3 number grid.",
        hi: "किसी भी 3x3 संख्या ग्रिड को हल करने के लिए इन चरण-दर-चरण तार्किक जांचों का पालन करें।"
      },
      metadata: {
        steps: [
          {
            en: "Check rows first: Does Row 1 + Row 2 = Row 3? Or Row 1 * 2 = Row 2?",
            hi: "पहले पंक्तियों की जांच करें: क्या पंक्ति 1 + पंक्ति 2 = पंक्ति 3 है? या पंक्ति 1 * 2 = पंक्ति 2?"
          },
          {
            en: "Check columns: Does Column 1 + Column 2 = Column 3? Or is Column 3 the square of Column 1?",
            hi: "स्तंभों (columns) की जांच करें: क्या कॉलम 1 + कॉलम 2 = कॉलम 3 है? या कॉलम 3, कॉलम 1 का वर्ग है?"
          },
          {
            en: "Test diagonals: If rows and columns fail, check if sums of all rows are equal (e.g. Row 1 sum = Row 2 sum = Row 3 sum).",
            hi: "विकर्णों (diagonals) का परीक्षण करें: यदि पंक्तियाँ और स्तंभ विफल हो जाते हैं, तो जांचें कि क्या सभी पंक्तियों का योग बराबर है।"
          }
        ]
      }
    },
    {
      id: "b_puzzle_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_puzzle_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Find missing number in grid: Row 1: 2, 4, 8 | Row 2: 3, 9, 27 | Row 3: 4, 16, ?\n\nStep 1: Check relation in Row 1: 2, 2²=4, 2³=8.\nStep 2: Check relation in Row 2: 3, 3²=9, 3³=27.\nStep 3: Apply to Row 3: 4, 4²=16, 4³=64.\nAnswer: 64.",
        hi: "Level: Easy | उदाहरण 1: ग्रिड में लुप्त संख्या ज्ञात करें: पंक्ति 1: 2, 4, 8 | पंक्ति 2: 3, 9, 27 | पंक्ति 3: 4, 16, ?\n\nचरण 1: पंक्ति 1 में संबंध जांचें: 2, 2²=4, 2³=8।\nचरण 2: पंक्ति 2 में संबंध जांचें: 3, 3²=9, 3³=27।\nचरण 3: पंक्ति 3 पर लागू करें: 4, 4²=16, 4³=64।\nउत्तर: 64।"
      }
    },
    {
      id: "b_puzzle_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: If '+' means '*', '*' means '-', '-' means '/', and '/' means '+', find: 8 + 4 / 12 - 3 * 5.\n\nStep 1: Rewrite equation: 8 * 4 + 12 / 3 - 5.\nStep 2: Division first: 12 / 3 = 4.\nStep 3: Multiplication: 8 * 4 = 32.\nStep 4: Addition & Subtraction: 32 + 4 - 5 = 31.\nAnswer: 31.",
        hi: "Level: Medium | उदाहरण 2: यदि '+' का अर्थ '*', '*' का अर्थ '-', '-' का अर्थ '/', और '/' का अर्थ '+' है, तो मान ज्ञात करें: 8 + 4 / 12 - 3 * 5.\n\nचरण 1: समीकरण को फिर से लिखें: 8 * 4 + 12 / 3 - 5.\nचरण 2: पहले भाग: 12 / 3 = 4.\nचरण 3: गुणा: 8 * 4 = 32.\nचरण 4: जोड़ और घटाव: 32 + 4 - 5 = 31.\nउत्तर: 31."
      }
    },
    {
      id: "b_puzzle_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Find the missing center number for the triangle: Corners are 5, 6, 7 and center is 37. Another has corners 8, 9, 10 and center is 82. What is the center for corners 4, 5, 6?\n\nStep 1: Find the rule: (Corner 1 * Corner 2) + Corner 3 = Center.\nStep 2: Check with triangle 1: (5 * 6) + 7 = 30 + 7 = 37. Valid.\nStep 3: Check with triangle 2: (8 * 9) + 10 = 72 + 10 = 82. Valid.\nStep 4: Apply to target: (4 * 5) + 6 = 20 + 6 = 26.\nAnswer: 26.",
        hi: "Level: Hard | उदाहरण 3: त्रिभुज के लिए लुप्त केंद्र संख्या ज्ञात करें: कोने 5, 6, 7 हैं और केंद्र 37 है। दूसरे के कोने 8, 9, 10 हैं और केंद्र 82 है। कोने 4, 5, 6 के लिए केंद्र क्या होगा?\n\nचरण 1: नियम खोजें: (कोना 1 * कोना 2) + कोना 3 = केंद्र।\nचरण 2: त्रिभुज 1: (5 * 6) + 7 = 37. मान्य।\nचरण 3: लक्ष्य पर लागू करें: (4 * 5) + 6 = 20 + 6 = 26.\nउत्तर: 26."
      }
    },
    {
      id: "b_puzzle_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: In a 3x3 grid, the rows are:\nRow 1: 5, 12, 13\nRow 2: 8, 15, 17\nRow 3: 7, 24, ?\nWhat is the missing number?",
        hi: "ओलंपियाड चुनौती: 3x3 ग्रिड में, पंक्तियाँ हैं:\nपंक्ति 1: 5, 12, 13\nपंक्ति 2: 8, 15, 17\nपंक्ति 3: 7, 24, ?\nलुप्त संख्या क्या है?"
      },
      metadata: {
        question: {
          en: "Find the Pythagorean triple missing value:",
          hi: "पाइथागोरस ट्रिपलेट का लुप्त मान ज्ञात करें:"
        },
        options: [
          { en: "25", hi: "25" },
          { en: "26", hi: "26" },
          { en: "27", hi: "27" },
          { en: "31", hi: "31" }
        ],
        correctIndex: 0,
        solution: {
          en: "The rule is Pythagorean triples: a² + b² = c².\nRow 1: 5² + 12² = 25 + 144 = 169 = 13².\nRow 2: 8² + 15² = 64 + 225 = 289 = 17².\nRow 3: 7² + 24² = 49 + 576 = 625 = 25². Thus, the missing number is 25.",
          hi: "नियम पाइथागोरस ट्रिपलेट का है: a² + b² = c²।\nपंक्ति 1: 5² + 12² = 13².\nपंक्ति 2: 8² + 15² = 17².\nपंक्ति 3: 7² + 24² = 625 = 25²। अतः उत्तर 25 है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_puzzle_summary",
      type: "summary",
      content: {
        en: "Number Puzzles Summary Card",
        hi: "संख्या पहेलियाँ समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Number puzzles test pattern identification across shapes and operators.", hi: "संख्या पहेलियाँ आकृतियों और ऑपरेटरों में पैटर्न की पहचान का परीक्षण करती हैं।" },
          { en: "Grid patterns operate either row-wise or column-wise.", hi: "ग्रिड पैटर्न या तो पंक्ति-वार या कॉलम-वार संचालित होते हैं।" }
        ],
        shortcuts: [
          { en: "Check square and prime connections first when differences are large.", hi: "जब अंतर बड़ा हो तो पहले वर्ग और अभाज्य संबंधों की जाँच करें।" },
          { en: "Rewrite operator swaps on draft paper before solving.", hi: "हल करने से पहले रफ पेपर पर ऑपरेटर बदलाव को फिर से लिखें।" }
        ],
        mistakesToAvoid: [
          { en: "Never skip the BODMAS calculation order when operators are switched.", hi: "ऑपरेटरों को बदलने पर BODMAS गणना क्रम को कभी न छोड़ें।" }
        ]
      }
    },
    {
      id: "b_puzzle_parent",
      type: "parent-note",
      content: {
        en: "Parent Audit Guide for Number Puzzles",
        hi: "संख्या पहेलियों के लिए पैरेंट गाइड"
      },
      metadata: {
        whyItMatters: {
          en: "Number puzzles build math flexibility. It teaches kids to see numbers not just as static symbols but as dynamic operators.",
          hi: "संख्या पहेलियाँ गणितीय लचीलापन बनाती हैं। यह बच्चों को संख्याओं को केवल स्थिर प्रतीकों के रूप में नहीं बल्कि गतिशील ऑपरेटरों के रूप में देखना सिखाती हैं।"
        },
        commonStruggle: {
          en: "Kids often forget BODMAS rules when signs are switched, resulting in calculation errors.",
          hi: "चिह्न बदले जाने पर बच्चे अक्सर BODMAS नियमों को भूल जाते हैं, जिससे गणना त्रुटियां होती हैं।"
        },
        homeActivity: {
          en: "Create small grid puzzles on paper or write down jumbled calculations with customized operators on the fridge whiteboard.",
          hi: "कागज पर छोटे ग्रिड पहेलियाँ बनाएं या फ्रिज के व्हाइटबोर्ड पर अनुकूलित ऑपरेटरों के साथ गणनाएं लिखें।"
        }
      }
    }
  ]
};
