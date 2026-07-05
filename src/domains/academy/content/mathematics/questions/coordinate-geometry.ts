import { Question } from "../../../core/types";

export const coordinateGeometryQuestions: Question[] = [
  {
    id: "q_coord_easy",
    topicId: "coordinate-geometry",
    skill: "Spatial Thinking",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "A token is placed at coordinates (3, 4) on a grid. If it is moved 2 units West (Left) and 3 units North (Up), what will be its new coordinates?",
      hi: "एक टोकन को ग्रिड पर निर्देशांक (3, 4) पर रखा गया है। यदि इसे 2 इकाई पश्चिम (बाएं) और 3 इकाई उत्तर (ऊपर) स्थानांतरित किया जाता है, तो इसके नए निर्देशांक क्या होंगे?"
    },
    options: [
      { en: "(1, 7)", hi: "(1, 7)" },
      { en: "(5, 7)", hi: "(5, 7)" },
      { en: "(1, 1)", hi: "(1, 1)" },
      { en: "(5, 1)", hi: "(5, 1)" }
    ],
    correctIndex: 0,
    hints: [
      { en: "West (Left) means subtracting from the X coordinate: 3 - 2.", hi: "पश्चिम (बाएं) का अर्थ X निर्देशांक में से घटाना है: 3 - 2।" },
      { en: "North (Up) means adding to the Y coordinate: 4 + 3.", hi: "उत्तर (ऊपर) का अर्थ Y निर्देशांक में जोड़ना है: 4 + 3।" }
    ],
    explanation: {
      en: "Starting at (3, 4): X-coordinate decreases by 2 (West) => 3 - 2 = 1. Y-coordinate increases by 3 (North) => 4 + 3 = 7. The new coordinates are (1, 7).",
      hi: "शुरुआत (3, 4) से: X-निर्देशांक 2 कम हो जाता है (पश्चिम) => 3 - 2 = 1. Y-निर्देशांक 3 बढ़ जाता है (उत्तर) => 4 + 3 = 7. नए निर्देशांक (1, 7) हैं।"
    }
  },
  {
    id: "q_coord_medium",
    topicId: "coordinate-geometry",
    skill: "Spatial Thinking",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "A mouse starts at (0, 0). It walks 4 units East, turns right and walks 3 units. What is the shortest straight-line distance of the mouse from its starting point?",
      hi: "एक चूहा (0, 0) से शुरू होता है। वह 4 इकाई पूर्व की ओर चलता है, दाएं मुड़ता है और 3 इकाई चलता है। चूहे की उसके शुरुआती बिंदु से सबसे छोटी सीधी-रेखा की दूरी क्या है?"
    },
    options: [
      { en: "5 units", hi: "5 इकाई" },
      { en: "7 units", hi: "7 इकाई" },
      { en: "1 unit", hi: "1 इकाई" },
      { en: "25 units", hi: "25 इकाई" }
    ],
    correctIndex: 0,
    hints: [
      { en: "The path forms a right-angled triangle with sides 4 and 3.", hi: "रास्ता 4 और 3 भुजाओं वाला एक समकोण त्रिभुज बनाता है।" },
      { en: "Apply Pythagoras Theorem: Distance = √(4² + 3²).", hi: "पाइथागोरस प्रमेय लागू करें: दूरी = √(4² + 3²)।" }
    ],
    explanation: {
      en: "The straight-line path forms a right triangle with base 4 and height 3. By Pythagoras Theorem, hypotenuse = √(4² + 3²) = √(16 + 9) = √25 = 5 units.",
      hi: "सीधी-रेखा वाला रास्ता आधार 4 और ऊंचाई 3 वाला एक समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय द्वारा, कर्ण = √(4² + 3²) = √(16 + 9) = √25 = 5 इकाई।"
    }
  },
  {
    id: "q_coord_hard",
    topicId: "coordinate-geometry",
    skill: "Spatial Thinking",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Three vertices of a rectangle on a coordinate grid are at (1, 1), (5, 1), and (5, 4). What are the coordinates of the fourth vertex?",
      hi: "एक निर्देशांक ग्रिड पर एक आयत (rectangle) के तीन शीर्ष (vertices) (1, 1), (5, 1), और (5, 4) पर हैं। चौथे शीर्ष के निर्देशांक क्या हैं?"
    },
    options: [
      { en: "(1, 4)", hi: "(1, 4)" },
      { en: "(1, 5)", hi: "(1, 5)" },
      { en: "(4, 1)", hi: "(4, 1)" },
      { en: "(4, 5)", hi: "(4, 5)" }
    ],
    correctIndex: 0,
    hints: [
      { en: "A rectangle has opposite sides of equal length and parallel to the axes.", hi: "एक आयत की विपरीत भुजाएँ समान लंबाई की और अक्षों के समानांतर होती हैं।" },
      { en: "The bottom edge goes from (1, 1) to (5, 1) (length 4). The right edge goes from (5, 1) to (5, 4) (height 3). The fourth corner must be directly above (1, 1) at the same height as (5, 4).", hi: "नीचे का किनारा (1, 1) से (5, 1) (लंबाई 4) तक जाता है। दायां किनारा (5, 1) से (5, 4) (ऊंचाई 3) तक जाता है। चौथा कोना (1, 1) के ठीक ऊपर होना चाहिए।" }
    ],
    explanation: {
      en: "The vertical edge goes from Y = 1 to Y = 4. The horizontal edge goes from X = 1 to X = 5. The missing fourth vertex must align horizontally with X = 1 and vertically with Y = 4, resulting in the point (1, 4).",
      hi: "लंबवत किनारा Y = 1 से Y = 4 तक जाता है। क्षैतिज किनारा X = 1 से X = 5 तक जाता है। लुप्त चौथा शीर्ष X = 1 और Y = 4 के साथ संरेखित होना चाहिए, जिससे बिंदु (1, 4) प्राप्त होता है।"
    }
  }
];
