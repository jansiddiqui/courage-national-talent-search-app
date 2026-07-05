import { LearningPath } from "../../../core/types";

export const learningPaths: LearningPath[] = [
  {
    id: "math-basics",
    title: {
      en: "Applied Mathematics",
      hi: "व्यावहारिक गणित"
    },
    description: {
      en: "Solve word puzzles involving ages, combinations, and interval overlaps.",
      hi: "आयु, संचय और अंतराल ओवरलैप से जुड़े शब्दों की पहेलियों को हल करें।"
    },
    topics: ["applied-math", "lcm-intervals"]
  },
  {
    id: "grid-logic",
    title: {
      en: "Number & Spatial Grid Logic",
      hi: "संख्या और स्थानिक ग्रिड तर्क"
    },
    description: {
      en: "Crack matrix patterns, coordinates, and missing number wheels.",
      hi: "मैट्रिक्स पैटर्न, निर्देशांक और लुप्त संख्या पहियों को क्रैक करें।"
    },
    topics: ["number-puzzles", "coordinate-geometry"]
  }
];
