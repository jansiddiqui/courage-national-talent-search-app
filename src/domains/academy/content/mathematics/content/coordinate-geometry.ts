import { TopicContent } from "../../../core/types";

export const coordinateGeometryContent: TopicContent = {
  id: "topic_coordinate_geometry",
  slug: "coordinate-geometry",
  version: 2,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Grid & Coordinate Logic",
    hi: "ग्रिड और निर्देशांक तर्क (Coordinate Logic)"
  },
  category: "Mathematical",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_coord_easy", "q_coord_medium", "q_coord_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "X-axis & Y-axis: The horizontal line is the X-axis (left-right), and the vertical line is the Y-axis (up-down).",
      "Coordinates format: Written as (x, y). First move horizontally (x), then vertically (y).",
      "Grid Movements: Moving North increases Y, South decreases Y, East increases X, West decreases X."
    ],
    quickTricks: [
      "Origin point is always (0, 0). East/North are positive, West/South are negative."
    ]
  },
  blocks: [
    {
      id: "b_coord_hook",
      type: "callout",
      content: {
        en: "If you want to find a hidden treasure on a map, you need two directions: 'How far to walk right' and 'How far to walk up'. If the map says (3, 5), it means walk 3 steps right, then 5 steps up! This is coordinate geometry. Let's learn how to navigate any grid map!",
        hi: "यदि आप मानचित्र पर कोई छिपा हुआ खजाना खोजना चाहते हैं, तो आपको दो दिशाओं की आवश्यकता होगी: 'दाएं कितना चलना है' और 'ऊपर कितना चलना है'। यदि मानचित्र पर (3, 5) लिखा है, तो इसका अर्थ है 3 कदम दाएं चलें, फिर 5 कदम ऊपर चलें! यही निर्देशांक ज्यामिति है।"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_coord_eli10",
      type: "callout",
      content: {
        en: "Imagine a giant chessboard where every square has a address like a house. The address has two numbers. The first number tells you which column (X-axis), and the second number tells you which row (Y-axis). With just these two numbers, you can pinpoint any location in the world!",
        hi: "एक विशाल शतरंज के बोर्ड की कल्पना करें जहाँ हर वर्ग का घर की तरह एक पता होता है। पते में दो संख्याएँ होती हैं। पहली संख्या आपको बताती है कि कौन सा कॉलम (X-अक्ष) है, और दूसरी संख्या आपको बताती है कि कौन सी पंक्ति (Y-अक्ष) है।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_coord_life",
      type: "callout",
      content: {
        en: "You use this when reading GPS maps, playing chess, locating seats in a cinema hall, or drawing graphics on a screen. Every digital screen uses coordinates to draw pixels!",
        hi: "आप इसका उपयोग जीपीएस मैप पढ़ने, शतरंज खेलने, सिनेमा हॉल में सीटें खोजने या स्क्रीन पर चित्र बनाने में करते हैं। प्रत्येक डिजिटल स्क्रीन पिक्सेल बनाने के लिए निर्देशांकों का उपयोग करती है!"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_coord_recipe_title",
      type: "heading",
      content: {
        en: "Grid Movement Recipe (ग्रिड विस्थापन विधि)",
        hi: "ग्रिड विस्थापन विधि रेसिपी (Grid Movement Method)"
      }
    },
    {
      id: "b_coord_recipe",
      type: "recipe",
      content: {
        en: "Track the final position of a moving object starting from the origin.",
        hi: "मूल बिंदु (origin) से शुरू होने वाली किसी गतिशील वस्तु की अंतिम स्थिति को ट्रैक करें।"
      },
      metadata: {
        steps: [
          {
            en: "Start at the origin point (0, 0) or given start coordinates.",
            hi: "मूल बिंदु (0, 0) या दिए गए प्रारंभ निर्देशांक से शुरुआत करें।"
          },
          {
            en: "If moving East (Right) or West (Left), add or subtract from the X coordinate.",
            hi: "यदि पूर्व (दाएं) या पश्चिम (बाएं) जा रहे हैं, तो X निर्देशांक में जोड़ें या घटाएं।"
          },
          {
            en: "If moving North (Up) or South (Down), add or subtract from the Y coordinate.",
            hi: "यदि उत्तर (ऊपर) या दक्षिण (नीचे) जा रहे हैं, तो Y निर्देशांक में जोड़ें या घटाएं।"
          },
          {
            en: "Combine coordinates to write final address as (X, Y).",
            hi: "निर्देशांकों को मिलाकर अंतिम पता (X, Y) के रूप में लिखें।"
          }
        ]
      }
    },
    {
      id: "b_coord_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_coord_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: A robot starts at point (2, 3). It moves 3 units East (Right) and then 4 units South (Down). What are its new coordinates?\n\nStep 1: Start point = (2, 3).\nStep 2: East movement: Add 3 to X coordinate => X = 2 + 3 = 5.\nStep 3: South movement: Subtract 4 from Y coordinate => Y = 3 - 4 = -1.\nAnswer: New coordinates = (5, -1).",
        hi: "Level: Easy | उदाहरण 1: एक रोबोट बिंदु (2, 3) से शुरू होता है। यह 3 इकाई पूर्व (दाएं) और फिर 4 इकाई दक्षिण (नीचे) चलता है। इसके नए निर्देशांक क्या हैं?\n\nचरण 1: शुरुआत = (2, 3)। पूर्व विस्थापन: X = 2 + 3 = 5।\nचरण 2: दक्षिण विस्थापन: Y = 3 - 4 = -1।\nउत्तर: नए निर्देशांक = (5, -1)।"
      }
    },
    {
      id: "b_coord_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: A mouse starts at (0, 0). It walks 4 units East, turns right and walks 3 units. What is the shortest straight-line distance of the mouse from its starting point?\n\nStep 1: The coordinates path forms a right-angled triangle with sides 4 and 3.\nStep 2: Apply Pythagoras Theorem: Distance = √(4² + 3²) = √(16 + 9) = √25 = 5.\nAnswer: 5 units.",
        hi: "Level: Medium | उदाहरण 2: एक चूहा (0, 0) से शुरू होता है। वह 4 इकाई पूर्व की ओर चलता है, दाएं मुड़ता है और 3 इकाई चलता है। चूहे की उसके शुरुआती बिंदु से सबसे छोटी सीधी-रेखा की दूरी क्या है?\n\nचरण 1: रास्ता 4 और 3 भुजाओं वाला एक समकोण त्रिभुज बनाता है।\nचरण 2: पाइथागोरस प्रमेय लागू करें: दूरी = √(4² + 3²) = 5।\nउत्तर: 5 इकाई।"
      }
    },
    {
      id: "b_coord_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Three corners of a rectangle on a coordinate grid are at (1, 1), (5, 1), and (5, 4). What are the coordinates of the fourth corner?\n\nStep 1: Identify bounds. Horizontal span goes from X = 1 to X = 5. Vertical span goes from Y = 1 to Y = 4.\nStep 2: The fourth vertex must sit at the missing boundary intersection: X = 1, Y = 4.\nAnswer: (1, 4).",
        hi: "Level: Hard | उदाहरण 3: एक निर्देशांक ग्रिड पर एक आयत के तीन कोने (1, 1), (5, 1), और (5, 4) पर हैं। चौथे कोने के निर्देशांक क्या हैं?\n\nचरण 1: सीमाएँ पहचानें। क्षैतिज सीमा X = 1 से X = 5 तक है। लंबवत सीमा Y = 1 से Y = 4 तक है।\nचरण 2: चौथा शीर्ष X = 1, Y = 4 पर होना चाहिए।\nउत्तर: (1, 4)।"
      }
    },
    {
      id: "b_coord_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: A treasure is hidden at point (3, 2). A player starts at (0, 0) and moves: 5 steps North, 4 steps East, 3 steps South, and 1 step West. How many units is the player away from the treasure?",
        hi: "ओलंपियाड चुनौती: एक खजाना बिंदु (3, 2) पर छिपा है। एक खिलाड़ी (0, 0) से शुरू होता है और चलता है: 5 कदम उत्तर, 4 कदम पूर्व, 3 कदम दक्षिण, और 1 कदम पश्चिम। खिलाड़ी खजाने से कितने यूनिट दूर है?"
      },
      metadata: {
        question: {
          en: "Calculate the straight-line distance:",
          hi: "सीधी-रेखा की दूरी ज्ञात करें:"
        },
        options: [
          { en: "0 units (On the treasure)", hi: "0 यूनिट (खजाने पर ही)" },
          { en: "1 unit", hi: "1 यूनिट" },
          { en: "2 units", hi: "2 यूनिट" },
          { en: "5 units", hi: "5 यूनिट" }
        ],
        correctIndex: 0,
        solution: {
          en: "Calculate final player coordinates:\n- Start: (0, 0)\n- 5 North => Y = 5\n- 4 East => X = 4\n- 3 South => Y = 5 - 3 = 2\n- 1 West => X = 4 - 1 = 3\n- Final location: (3, 2). Since treasure is at (3, 2), distance is 0.",
          hi: "खिलाड़ी के अंतिम निर्देशांक की गणना करें:\n- प्रारंभ: (0, 0)\n- 5 उत्तर => Y = 5\n- 4 पूर्व => X = 4\n- 3 दक्षिण => Y = 2\n- 1 पश्चिम => X = 3\n- अंतिम स्थान: (3, 2)। चूंकि खजाना भी (3, 2) पर है, इसलिए दूरी 0 है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_coord_summary",
      type: "summary",
      content: {
        en: "Grid Coordinate Summary Card",
        hi: "ग्रिड निर्देशांक समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Coordinates (x, y) pinpoint locations on a flat surface grid.", hi: "निर्देशांक (x, y) समतल सतह ग्रिड पर स्थानों को इंगित करते हैं।" },
          { en: "X tells left/right horizontal distance, Y tells up/down vertical distance.", hi: "X बाएं/दाएं क्षैतिज दूरी बताता है, Y ऊपर/नीचे लंबवत दूरी बताता है।" }
        ],
        shortcuts: [
          { en: "East (+X), West (-X), North (+Y), South (-Y).", hi: "पूर्व (+X), पश्चिम (-X), उत्तर (+Y), दक्षिण (-Y)।" },
          { en: "Shortest straight distance between perpendicular offsets is calculated using Pythagoras theorem: a² + b² = c².", hi: "समकोण विस्थापनों के बीच की सबसे छोटी दूरी की गणना पाइथागोरस प्रमेय का उपयोग करके की जाती है।" }
        ],
        mistakesToAvoid: [
          { en: "Never write the Y coordinate before the X coordinate. It must always be (X, Y).", hi: "X निर्देशांक से पहले Y निर्देशांक कभी न लिखें। यह हमेशा (X, Y) होना चाहिए।" }
        ]
      }
    },
    {
      id: "b_coord_parent",
      type: "parent-note",
      content: {
        en: "Spatial Navigation & Geometric Coordinate Grids",
        hi: "स्थानिक नेविगेशन और ज्यामितीय निर्देशांक ग्रिड"
      },
      metadata: {
        whyItMatters: {
          en: "Geometric coordinate structures form the foundation for cartography, GPS navigation, and 2D/3D graphics programming. Developing spatial indexing early prevents graphing struggles in middle school.",
          hi: "ज्यामितीय निर्देशांक संरचनाएं मानचित्रकारी, जीपीएस नेविगेशन और ग्राफिक्स प्रोग्रामिंग की नींव हैं।"
        },
        commonStruggle: {
          en: "Children often confuse relative directional commands (like turning right relative to current path) with absolute grid commands (moving East).",
          hi: "बच्चे अक्सर सापेक्ष दिशात्मक आदेशों (जैसे दाएं मुड़ना) और निरपेक्ष ग्रिड आदेशों (पूर्व की ओर बढ़ना) में भ्रमित हो जाते हैं।"
        },
        homeActivity: {
          en: "Draw a coordinates grid on a piece of paper, place small tokens, and play a coordinates guessing game together.",
          hi: "कागज पर एक निर्देशांक ग्रिड बनाएं, छोटे सिक्के या की-चेन रखें, और एक-दूसरे को निर्देशांक खोजने की पहेलियां दें।"
        }
      }
    }
  ]
};
