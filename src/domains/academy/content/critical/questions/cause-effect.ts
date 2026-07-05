import { Question } from "../../../core/types";

export const causeEffectQuestions: Question[] = [
  {
    id: "q_crit_cause_easy",
    topicId: "cause-effect",
    skill: "Analytical",
    difficulty: "easy",
    bloomLevel: "understand",
    text: {
      en: "Read the two statements and determine their relationship:\nStatement I: The school cancelled all classes and outdoor activities today.\nStatement II: There was heavy rainfall and severe waterlogging across the city this morning.",
      hi: "दोनों कथनों को पढ़ें और उनके संबंध को निर्धारित करें:\nकथन I: स्कूल ने आज सभी कक्षाएं और बाहरी गतिविधियां रद्द कर दीं।\nकथन II: आज सुबह पूरे शहर में भारी बारिश और गंभीर जलभराव हुआ था।"
    },
    options: [
      { en: "Statement I is the cause and II is its effect", hi: "कथन I कारण है और II इसका प्रभाव है" },
      { en: "Statement II is the cause and I is its effect", hi: "कथन II कारण है और I इसका प्रभाव है" },
      { en: "Both statements are independent causes", hi: "दोनों कथन स्वतंत्र कारण हैं" },
      { en: "Both statements are effects of some common cause", hi: "दोनों कथन किसी सामान्य कारण के प्रभाव हैं" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Ask yourself: Which event happened first and led to the other?", hi: "खुद से पूछें: कौन सी घटना पहले हुई और किस वजह से दूसरी घटना हुई?" },
      { en: "Does waterlogging cause school cancellation, or does school cancellation cause waterlogging?", hi: "क्या जलभराव के कारण स्कूल रद्द होता है, या स्कूल रद्द होने के कारण जलभराव होता है?" }
    ],
    explanation: {
      en: "The heavy rainfall and waterlogging (Statement II) is the trigger event (cause) that made schools cancel classes (Statement I, which is the effect). Therefore, II is the cause and I is its effect.",
      hi: "भारी बारिश और जलभराव (कथन II) वह घटना (कारण) है जिसके कारण स्कूलों को कक्षाएं रद्द करनी पड़ीं (कथन I, जो कि प्रभाव है)। इसलिए, II कारण है और I इसका प्रभाव है।"
    }
  },
  {
    id: "q_crit_cause_medium",
    topicId: "cause-effect",
    skill: "Analytical",
    difficulty: "medium",
    bloomLevel: "apply",
    text: {
      en: "Statements:\nStatement I: The demand for fresh organic vegetables has increased significantly over the last month.\nStatement II: Local vegetable merchants raised prices of organic vegetables by 30%.",
      hi: "कथन:\nकथन I: पिछले महीने जैविक सब्जियों (organic vegetables) की मांग में काफी वृद्धि हुई है।\nकथन II: स्थानीय सब्जी व्यापारियों ने जैविक सब्जियों के दाम 30% बढ़ा दिए।"
    },
    options: [
      { en: "Statement I is the cause and II is its effect", hi: "कथन I कारण है और II इसका प्रभाव है" },
      { en: "Statement II is the cause and I is its effect", hi: "कथन II कारण है और I इसका प्रभाव है" },
      { en: "Both statements are independent causes", hi: "दोनों कथन स्वतंत्र कारण हैं" },
      { en: "Both statements are effects of some common cause", hi: "दोनों कथन किसी सामान्य कारण के प्रभाव हैं" }
    ],
    correctIndex: 0,
    hints: [
      { en: "Think about basic supply and demand logic in markets.", hi: "बाजार में आपूर्ति और मांग के बुनियादी नियमों के बारे में सोचें।" },
      { en: "When demand for a product goes up, merchants usually increase the price. So which one is the trigger?", hi: "जब किसी उत्पाद की मांग बढ़ती है, तो व्यापारी आमतौर पर कीमत बढ़ा देते हैं। तो कौन सा ट्रिगर है?" }
    ],
    explanation: {
      en: "An increase in demand (Statement I) is the direct cause that leads vegetable sellers to raise prices (Statement II, the effect). Therefore, Statement I is the cause and II is its effect.",
      hi: "मांग में वृद्धि (कथन I) वह सीधा कारण है जिसके कारण सब्जी विक्रेता कीमतें बढ़ाते हैं (कथन II, प्रभाव)। इसलिए, कथन I कारण है और II इसका प्रभाव है।"
    }
  },
  {
    id: "q_crit_cause_hard",
    topicId: "cause-effect",
    skill: "Analytical",
    difficulty: "hard",
    bloomLevel: "analyze",
    text: {
      en: "Statements:\nStatement I: The government announced a 40% subsidy on domestic solar panel installation.\nStatement II: The cost of coal and traditional electricity generation has risen globally.",
      hi: "कथन:\nकथन I: सरकार ने घरेलू सौर पैनल स्थापना पर 40% सब्सिडी की घोषणा की।\nकथन II: वैश्विक स्तर पर कोयले और पारंपरिक बिजली उत्पादन की लागत में वृद्धि हुई है।"
    },
    options: [
      { en: "Statement I is the cause and II is its effect", hi: "कथन I कारण है और II इसका प्रभाव है" },
      { en: "Statement II is the cause and I is its effect", hi: "कथन II कारण है और I इसका प्रभाव है" },
      { en: "Both statements are effects of some common cause", hi: "दोनों कथन किसी सामान्य कारण के प्रभाव हैं" },
      { en: "Statement II is the cause and Statement I is an effect, but they are not directly linked", hi: "कथन II कारण है और कथन I एक प्रभाव है, लेकिन वे सीधे तौर पर जुड़े नहीं हैं" }
    ],
    correctIndex: 1,
    hints: [
      { en: "Why would the government offer a subsidy on solar panels? It wants to reduce reliance on expensive traditional power.", hi: "सरकार सौर पैनलों पर सब्सिडी क्यों देगी? वह महंगी पारंपरिक बिजली पर निर्भरता को कम करना चाहती है।" },
      { en: "The increase in coal prices (Statement II) makes traditional electricity expensive, which triggers the policy shift (Statement I) to subsidize solar energy.", hi: "कोयले की कीमतों में वृद्धि (कथन II) पारंपरिक बिजली को महंगा बनाती है, जो सौर ऊर्जा को सब्सिडी देने के नीतिगत बदलाव (कथन I) को ट्रिगर करती है।" }
    ],
    explanation: {
      en: "The rising cost of traditional electricity generation (Statement II) is the macro-economic cause that forces the government to subsidize renewable solar alternatives (Statement I, the policy effect). Thus, II is the cause and I is its effect.",
      hi: "पारंपरिक बिजली उत्पादन की बढ़ती लागत (कथन II) वह व्यापक आर्थिक कारण है जो सरकार को नवीकरणीय सौर विकल्पों (कथन I, नीतिगत प्रभाव) को सब्सिडी देने के लिए मजबूर करता है। इस प्रकार, II कारण है और I इसका प्रभाव है।"
    }
  }
];
