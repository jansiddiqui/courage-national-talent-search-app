import { LearningPath } from "../../../core/types";

export const learningPaths: LearningPath[] = [
  {
    id: "critical-basics",
    title: {
      en: "Deductive & Event Logic",
      hi: "कटौतीत्मक और घटना तर्क"
    },
    description: {
      en: "Learn to test statements using Venn diagrams and determine cause-effect timelines.",
      hi: "वेन आरेखों का उपयोग करके कथनों का परीक्षण करना और कार्य-कारण समय-सीमा निर्धारित करना सीखें।"
    },
    topics: ["syllogisms", "cause-effect"]
  },
  {
    id: "advanced-logic",
    title: {
      en: "Analytical Arguments & Data",
      hi: "विश्लेषणात्मक तर्क और डेटा"
    },
    description: {
      en: "Evaluate argument strengths, assumptions, and check if data clues are sufficient.",
      hi: "तर्कों की ताकत, धारणाओं का मूल्यांकन करें और जांचें कि क्या डेटा सुराग पर्याप्त हैं।"
    },
    topics: ["data-sufficiency", "argument-evaluation"]
  }
];
