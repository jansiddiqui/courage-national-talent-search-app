import { LearningPath } from "../../../core/types";

export const learningPaths: LearningPath[] = [
  {
    id: "reasoning-basics",
    title: {
      en: "Reasoning Basics",
      hi: "रीजनिंग बेसिक्स"
    },
    description: {
      en: "Establish fundamental verbal and logical categorization skills.",
      hi: "मौलिक मौखिक और तार्किक वर्गीकरण कौशल स्थापित करें।"
    },
    topics: ["analogy", "classification"]
  },
  {
    id: "pattern-master",
    title: {
      en: "Pattern Master",
      hi: "पैटर्न मास्टर"
    },
    description: {
      en: "Master numerical, character, and code-based progression patterns.",
      hi: "संख्यात्मक, वर्ण और कोड-आधारित प्रगति पैटर्न में महारत हासिल करें।"
    },
    topics: ["alphabet-series", "number-series", "coding-decoding"]
  }
];
