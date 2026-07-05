import { StudentProgress } from "../types";

export class RecommendationService {
  /**
   * Generates a study recommendation string
   */
  public static async getAdvice(
    progress: StudentProgress,
    topicSlug: string,
    correct: boolean
  ): Promise<string> {
    if (!correct) {
      // Suggest revising prerequisites or reading the explainers again
      if (topicSlug === "coding-decoding" && !progress.completedTopics.includes("alphabet-series")) {
        return "We recommend revising Alphabet Series before attempting Coding-Decoding.";
      }
      return "Let's read the conceptual explanation and quick trick again before retrying.";
    }

    // If correct, suggest proceeding to the next topic in their path or attempting a challenge
    const remainingInPath = this.getRemainingTopics(progress);
    if (remainingInPath.length > 0) {
      const nextTopic = remainingInPath[0];
      return `Great job! Ready for the next topic? Try out ${this.formatTitle(nextTopic)}.`;
    }

    return "Superb! You've unlocked all current topics in this path. Try the Mini Assessment!";
  }

  private static getRemainingTopics(progress: StudentProgress): string[] {
    // Default list of MVP topics in order of difficulty
    const mvpTopics = ["analogy", "classification", "coding-decoding", "number-series", "alphabet-series"];
    return mvpTopics.filter(t => !progress.completedTopics.includes(t));
  }

  private static formatTitle(slug: string): string {
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
