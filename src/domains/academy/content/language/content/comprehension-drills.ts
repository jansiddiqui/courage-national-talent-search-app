import { TopicContent } from "../../../core/types";

export const comprehensionDrillsContent: TopicContent = {
  id: "topic_comprehension_drills",
  slug: "comprehension-drills",
  version: 2,
  publishedAt: "2026-07-06",
  status: "published",
  title: {
    en: "Reading Comprehension",
    hi: "अपठित गद्यांश (Reading Comprehension)"
  },
  category: "Verbal",
  difficulty: "Foundation",
  prerequisites: [],
  questions: ["q_comp_easy", "q_comp_medium", "q_comp_hard"],
  aiCapabilities: {
    explainAgain: true,
    easierExample: true,
    harderQuestion: true
  },
  cheatCard: {
    keyPoints: [
      "Scan first: Quickly read the questions before reading the passage to know what details to look for.",
      "Fact vs. Inference: Facts are directly written in the text. Inferences are logical conclusions you make based on facts.",
      "Identify the main theme: Look at the opening and closing sentences to find the central message of the paragraph."
    ],
    quickTricks: [
      "Underline keywords! When you see names, years, or key terms in questions, locate them in the passage."
    ]
  },
  blocks: [
    {
      id: "b_comp_hook",
      type: "callout",
      content: {
        en: "Have you ever read a paragraph and realized at the end that you have no idea what you just read? You are not alone! \n\nActive reading is like being a detective searching for clues in a text. Let's learn how to spot main ideas and logical conclusions instantly!",
        hi: "क्या आपने कभी कोई पैराग्राफ पढ़ा है और अंत में महसूस किया है कि आपको नहीं पता कि आपने अभी क्या पढ़ा? आप अकेले नहीं हैं!\n\nसक्रिय रूप से पढ़ना (Active reading) एक जासूस की तरह पाठ में सुराग खोजने जैसा है। आइए सीखें कि मुख्य विचारों और तार्किक निष्कर्षों को तुरंत कैसे पहचानें!"
      },
      metadata: {
        icon: "detective",
        theme: "amber"
      }
    },
    {
      id: "b_comp_eli10",
      type: "callout",
      content: {
        en: "Reading comprehension is about understanding stories. Instead of just looking at words, you are looking at thoughts. The author is sending you a package of thoughts, and your job is to unpack it, find the core message, and answer questions about what is inside.",
        hi: "पढ़ना और समझना कहानियों को समझने के बारे में है। केवल शब्दों को देखने के बजाय, आप विचारों को देख रहे हैं। लेखक आपको विचारों का एक पैकेज भेज रहा है, और आपका काम इसे अनपैक करना, मूल संदेश खोजना और अंदर क्या है इसके बारे में सवालों के जवाब देना है।"
      },
      metadata: {
        icon: "idea",
        theme: "primary"
      }
    },
    {
      id: "b_comp_life",
      type: "callout",
      content: {
        en: "You use this skill when reading emails, studying textbooks, analyzing news stories, or following instructions. Reading carefully helps you avoid mistakes and learn faster.",
        hi: "आप इस कौशल का उपयोग ईमेल पढ़ते समय, पाठ्यपुस्तकें पढ़ते समय, समाचारों का विश्लेषण करते समय या निर्देशों का पालन करते समय करते हैं। ध्यान से पढ़ने से आपको गलतियों से बचने और तेजी से सीखने में मदद मिलती है।"
      },
      metadata: {
        icon: "life",
        theme: "success"
      }
    },
    {
      id: "b_comp_recipe_title",
      type: "heading",
      content: {
        en: "Active Scanning Recipe (सक्रिय स्कैनिंग विधि)",
        hi: "सक्रिय स्कैनिंग विधि रेसिपी (Active Scanning)"
      }
    },
    {
      id: "b_comp_recipe",
      type: "recipe",
      content: {
        en: "Follow these steps to extract answers from any passage without wasting time.",
        hi: "बिना समय बर्बाद किए किसी भी गद्यांश से उत्तर निकालने के लिए इन चरणों का पालन करें।"
      },
      metadata: {
        steps: [
          {
            en: "Read the questions first: Underline keywords in the questions.",
            hi: "पहले प्रश्न पढ़ें: प्रश्नों में मुख्य शब्दों (keywords) को रेखांकित करें।"
          },
          {
            en: "Scan the passage: Look for the underlined keywords or their synonyms in the text.",
            hi: "गद्यांश को स्कैन करें: पाठ में रेखांकित कीवर्ड या उनके पर्यायवाची शब्दों को खोजें।"
          },
          {
            en: "Read the surrounding sentences: The answer is usually in the sentence containing the keyword or the one right after it.",
            hi: "आसपास के वाक्यों को पढ़ें: उत्तर आमतौर पर कीवर्ड वाले वाक्य में या उसके ठीक बाद वाले वाक्य में होता है।"
          },
          {
            en: "Match with options: Eliminate options that contradict the passage facts.",
            hi: "विकल्पों के साथ मिलान करें: उन विकल्पों को हटा दें जो गद्यांश के तथ्यों के विपरीत हैं।"
          }
        ]
      }
    },
    {
      id: "b_comp_examples_h",
      type: "heading",
      content: {
        en: "Progressive Solved Examples",
        hi: "हल किए गए प्रगतिशील उदाहरण"
      }
    },
    {
      id: "b_comp_ex1",
      type: "example",
      content: {
        en: "Level: Easy | Example 1: Passage: 'The Red Panda lives in the high-altitude forests of the Himalayas. Unlike the Giant Panda which eats mostly bamboo, the Red Panda also feeds on fruits, acorns, and roots.'\n\nQuestion: What does the Red Panda eat that the Giant Panda does not?\nStep 1: Locate eating habits in text: 'Red Panda also feeds on fruits, acorns, and roots.'\nStep 2: Compare: Giant Panda eats mostly bamboo. Red Panda eats fruits, acorns, roots.\nAnswer: Fruits, acorns, and roots.",
        hi: "Level: Easy | उदाहरण 1: गद्यांश: 'रेड पांडा हिमालय के जंगलों में रहता है। विशाल पांडा के विपरीत, जो ज्यादातर बांस खाता है, रेड पांडा फल, बलूत के फल और जड़ें भी खाता है।'\n\nप्रश्न: रेड पांडा ऐसा क्या खाता है जो विशाल पांडा नहीं खाता?\nउत्तर: फल, बलूत के फल और जड़ें।"
      }
    },
    {
      id: "b_comp_ex2",
      type: "example",
      content: {
        en: "Level: Medium | Example 2: Passage: 'In polar regions, global warming is causing glaciers to melt. This raises sea levels and threatens polar bears, who rely on sea ice as a platform for hunting seals.'\n\nQuestion: What is the main reason polar bears are threatened by melting glaciers?\nStep 1: Locate polar bears in text: 'who rely on sea ice as a platform for hunting seals.'\nStep 2: Connect: Melting glaciers means less sea ice, meaning polar bears lose their hunting platforms.\nAnswer: They are losing their hunting platforms.",
        hi: "Level: Medium | उदाहरण 2: गद्यांश: 'ध्रुवीय क्षेत्रों में, ग्लोबल वार्मिंग के कारण ग्लेशियर पिघल रहे हैं। इससे समुद्र का स्तर बढ़ता है और ध्रुवीय भालूओं को खतरा होता है, जो सील का शिकार करने के लिए समुद्री बर्फ का उपयोग करते हैं।'\n\nप्रश्न: ग्लेशियरों के पिघलने से ध्रुवीय भालूओं को खतरा होने का मुख्य कारण क्या है?\nउत्तर: वे अपने शिकार के प्लेटफार्मों को खो रहे हैं।"
      }
    },
    {
      id: "b_comp_ex3",
      type: "example",
      content: {
        en: "Level: Hard | Example 3: Passage: 'Rote learning allows a student to recall facts, but critical thinking requires synthesizing contradicting viewpoints. Therefore, building logic pathways is essential for true diagnostic intelligence.'\n\nQuestion: What is the main conclusion of the passage?\nStep 1: Locate the concluding word: 'Therefore...'.\nStep 2: Read concluding statement: 'Therefore, building logic pathways is essential for true diagnostic intelligence.'\nAnswer: Logical pathways are essential for true intelligence.",
        hi: "Level: Hard | उदाहरण 3: गद्यांश: 'रटना छात्र को तथ्यों को याद रखने की अनुमति देता है, लेकिन आलोचनात्मक सोच के लिए विपरीत दृष्टिकोणों को संश्लेषित करने की आवश्यकता होती है। इसलिए, तार्किक मार्गों का निर्माण सच्ची बुद्धि के लिए आवश्यक है।'\n\nप्रश्न: गद्यांश का मुख्य निष्कर्ष क्या है?\nउत्तर: सच्ची बुद्धि के लिए तार्किक मार्ग (logic pathways) आवश्यक हैं।"
      }
    },
    {
      id: "b_comp_challenge",
      type: "challenge",
      content: {
        en: "Olympiad Challenge: Passage: 'Although electric vehicles (EVs) reduce tailpipe emissions, their overall environmental benefits depend on how local electricity is generated. In regions relying on coal plants, an EV's carbon footprint can match a hybrid gas car.'\nWhich statement is supported by the passage?",
        hi: "ओलंपियाड चुनौती: गद्यांश: 'यद्यपि इलेक्ट्रिक वाहन (EVs) टेलपाइप उत्सर्जन को कम करते हैं, उनका समग्र पर्यावरणीय लाभ इस बात पर निर्भर करता है कि स्थानीय बिजली कैसे उत्पन्न होती है। कोयला संयंत्रों पर निर्भर क्षेत्रों में, एक ईवी का कार्बन फुटप्रिंट एक हाइब्रिड गैस कार के बराबर हो सकता है।'\nकौन सा कथन गद्यांश द्वारा समर्थित है?"
      },
      metadata: {
        question: {
          en: "Select the correct inference:",
          hi: "सही निष्कर्ष चुनें:"
        },
        options: [
          { en: "EVs are always cleaner than hybrid gas cars", hi: "इलेक्ट्रिक वाहन हमेशा हाइब्रिड गैस कारों से अधिक स्वच्छ होते हैं" },
          { en: "The cleanliness of an EV depends on the local power grid source", hi: "एक इलेक्ट्रिक वाहन की स्वच्छता स्थानीय बिजली ग्रिड स्रोत पर निर्भर करती है" },
          { en: "Coal power plants are cleaner than tailpipe emissions", hi: "कोयला बिजली संयंत्र टेलपाइप उत्सर्जन से अधिक स्वच्छ हैं" },
          { en: "EVs cannot be driven in coal-powered regions", hi: "कोयला-संचालित क्षेत्रों में ईवी नहीं चलाई जा सकती" }
        ],
        correctIndex: 1,
        solution: {
          en: "The passage states that overall benefits 'depend on how local electricity is generated'. Thus, if the grid relies on coal, the benefit decreases, making the second option correct.",
          hi: "गद्यांश में कहा गया है कि समग्र लाभ 'स्थानीय बिजली के उत्पादन के तरीके पर निर्भर करता है'। इसलिए, दूसरा विकल्प सही है।"
        },
        level: "olympiad"
      }
    },
    {
      id: "b_comp_summary",
      type: "summary",
      content: {
        en: "Reading Comprehension Summary Card",
        hi: "अपठित गद्यांश समरी कार्ड"
      },
      metadata: {
        points: [
          { en: "Comprehension testing evaluates active reading and fact parsing.", hi: "गद्यांश परीक्षण सक्रिय पढ़ने और तथ्य विश्लेषण का मूल्यांकन करता है।" },
          { en: "Always differentiate between directly stated facts and logical inferences.", hi: "सीधे बताए गए तथ्यों और तार्किक निष्कर्षों के बीच हमेशा अंतर करें।" }
        ],
        shortcuts: [
          { en: "Read questions first to establish focus goals before reading the text.", hi: "पाठ पढ़ने से पहले ध्यान केंद्रित करने के लिए प्रश्न पहले पढ़ें।" },
          { en: "Look for transition words like 'However', 'Therefore', 'Although' to track structural shifts.", hi: "संरचनात्मक बदलावों को ट्रैक करने के लिए 'However', 'Therefore' जैसे शब्दों को देखें।" }
        ],
        mistakesToAvoid: [
          { en: "Never select an option that sounds true in real life but is not supported by any text in the passage.", hi: "ऐसा विकल्प कभी न चुनें जो वास्तविक जीवन में सच लगता हो लेकिन गद्यांश में उसका कोई उल्लेख न हो।" }
        ]
      }
    },
    {
      id: "b_comp_parent",
      type: "parent-note",
      content: {
        en: "Critical Reading & Fact Extraction Skills",
        hi: "आलोचनात्मक पठन और तथ्य निष्कर्षण कौशल"
      },
      metadata: {
        whyItMatters: {
          en: "Critical reading forms the baseline for academic inquiry across all domains, from science to history. Synthesizing contradictory statements prevents cognitive overload.",
          hi: "आलोचनात्मक पठन सभी क्षेत्रों में शैक्षणिक विकास का आधार है। यह बच्चों को जानकारी को समझने में मदद करता है।"
        },
        commonStruggle: {
          en: "Children often answer from memory of prior knowledge instead of pointing to the exact line in the passage.",
          hi: "बच्चे अक्सर गद्यांश में सटीक पंक्ति की पहचान करने के बजाय पुरानी स्मृति से उत्तर देते हैं।"
        },
        homeActivity: {
          en: "Read newspaper headlines or book blurbs together and ask your child to summarize the core idea in under 10 words.",
          hi: "समाचार पत्रों की सुर्खियाँ एक साथ पढ़ें और अपने बच्चे से 10 शब्दों से कम में मुख्य विचार समझाने को कहें।"
        }
      }
    }
  ]
};
