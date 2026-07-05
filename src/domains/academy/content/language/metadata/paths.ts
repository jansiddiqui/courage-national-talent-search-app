import { LearningPath } from "../../../core/types";

export const learningPaths: LearningPath[] = [
  {
    id: "language-basics",
    title: {
      en: "Vocabulary & Comprehension",
      hi: "शब्दावली और समझ"
    },
    description: {
      en: "Master vocabulary relationships, synonyms, and fact extraction from passages.",
      hi: "शब्दावली संबंध, पर्यायवाची और गद्यांशों से तथ्यों को निकालने में महारत हासिल करें।"
    },
    topics: ["word-analogies", "comprehension-drills"]
  },
  {
    id: "grammar-logic",
    title: {
      en: "Syntax & Sentence Logic",
      hi: "वाक्य-रचना और वाक्य तर्क"
    },
    description: {
      en: "Develop structural grammar rules, relative clauses, and conjunction pairings.",
      hi: "संरचनात्मक व्याकरण नियम, संबंधवाचक उपवाक्य और संयोजकों के जोड़ों का विकास करें।"
    },
    topics: ["syntax-logic", "prepositions-conjunctions"]
  }
];
