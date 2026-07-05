export class PrerequisiteGraph {
  // Prerequisite mapping for each topic slug
  private static graph: Record<string, string[]> = {
    "analogy": [],
    "classification": [],
    "alphabet-series": [],
    "number-series": [],
    "coding-decoding": ["alphabet-series"],
    // Mathematics (all unlocked by default)
    "applied-math": [],
    "number-puzzles": [],
    "lcm-intervals": [],
    "coordinate-geometry": [],
    // Language Skills (all unlocked by default)
    "word-analogies": [],
    "syntax-logic": [],
    "comprehension-drills": [],
    "prepositions-conjunctions": [],
    // Critical Thinking (all unlocked by default)
    "syllogisms": [],
    "cause-effect": [],
    "data-sufficiency": [],
    "argument-evaluation": []
  };

  /**
   * Check if a topic slug is unlocked based on completed slugs list
   */
  public static isUnlocked(topicSlug: string, completedSlugs: string[]): boolean {
    const prerequisites = this.graph[topicSlug];
    if (!prerequisites || prerequisites.length === 0) {
      return true;
    }
    return prerequisites.every(prereq => completedSlugs.includes(prereq));
  }

  /**
   * Get prerequisite list for a specific topic
   */
  public static getPrerequisites(topicSlug: string): string[] {
    return this.graph[topicSlug] || [];
  }

  /**
   * Get related sibling topics
   */
  public static getRelatedTopics(topicSlug: string): string[] {
    const categoryMap: Record<string, string[]> = {
      "analogy": ["classification", "coding-decoding"],
      "classification": ["analogy"],
      "coding-decoding": ["alphabet-series"],
      "alphabet-series": ["coding-decoding", "number-series"],
      "number-series": ["alphabet-series"],
      // Mathematics
      "applied-math": ["number-puzzles", "lcm-intervals"],
      "number-puzzles": ["applied-math", "coordinate-geometry"],
      "lcm-intervals": ["applied-math"],
      "coordinate-geometry": ["number-puzzles"],
      // Language Skills
      "word-analogies": ["syntax-logic", "comprehension-drills"],
      "syntax-logic": ["word-analogies", "prepositions-conjunctions"],
      "comprehension-drills": ["word-analogies"],
      "prepositions-conjunctions": ["syntax-logic"],
      // Critical Thinking
      "syllogisms": ["cause-effect", "data-sufficiency"],
      "cause-effect": ["syllogisms", "argument-evaluation"],
      "data-sufficiency": ["syllogisms"],
      "argument-evaluation": ["cause-effect"]
    };
    return categoryMap[topicSlug] || [];
  }
}
