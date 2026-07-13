export interface SkillWeight {
  skill: string;
  weight: number;
}

export class SkillGraph {
  private static graph: Record<string, SkillWeight[]> = {
    "analogy": [
      { skill: "Pattern Recognition", weight: 0.50 },
      { skill: "Verbal Reasoning", weight: 0.30 },
      { skill: "Logical Deduction", weight: 0.20 }
    ],
    "classification": [
      { skill: "Pattern Recognition", weight: 0.60 },
      { skill: "Logical Deduction", weight: 0.40 }
    ],
    "coding-decoding": [
      { skill: "Pattern Recognition", weight: 0.50 },
      { skill: "Logical Deduction", weight: 0.50 }
    ],
    "number-series": [
      { skill: "Mathematical", weight: 0.60 },
      { skill: "Analytical", weight: 0.40 }
    ],
    "alphabet-series": [
      { skill: "Pattern Recognition", weight: 0.60 },
      { skill: "Verbal Reasoning", weight: 0.40 }
    ]
  };

  /**
   * Returns the mapped skills and weights for a given topic slug.
   * Falls back to a default weight mapping if the topic is not mapped.
   */
  public static getTopicSkills(topicSlug: string, category: string): SkillWeight[] {
    const slug = topicSlug.toLowerCase().trim();
    if (this.graph[slug]) {
      return this.graph[slug];
    }
    // Dynamic fallback matching subject categories
    return [{ skill: category, weight: 1.0 }];
  }
}
