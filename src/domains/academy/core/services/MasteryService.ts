import { StudentProgress, TopicMastery } from "../types";

export class MasteryService {
  /**
   * Recalculates and updates the cognitive mastery state for a topic.
   * `attemptsCount` represents the total count of distinct question attempts.
   */
  public static updateMastery(
    progress: StudentProgress,
    topicSlug: string,
    questionId: string,
    correct: boolean,
    hintsUsedCount: number
  ): void {
    if (!progress.topicMastery) {
      progress.topicMastery = {};
    }

    let topicMastery = progress.topicMastery[topicSlug];
    if (!topicMastery) {
      topicMastery = {
        topicSlug,
        masteryPercent: 0,
        status: "Needs Revision",
        accuracy: 0,
        attemptsCount: 0,
        correctAnswersCount: 0,
        hintsUsedCount: 0,
        lastAttemptedAt: Date.now(),
        formulaVersion: "v1",
        attemptedQuestions: []
      };
    }

    if (!topicMastery.attemptedQuestions) {
      topicMastery.attemptedQuestions = [];
    }

    // Check if this is a new distinct question attempt
    const isNewAttempt = !topicMastery.attemptedQuestions.includes(questionId);
    if (isNewAttempt) {
      topicMastery.attemptedQuestions.push(questionId);
      topicMastery.attemptsCount = topicMastery.attemptedQuestions.length;

      if (correct) {
        topicMastery.correctAnswersCount += 1;
      }
    }

    // Accumulate hints used count
    topicMastery.hintsUsedCount += hintsUsedCount;
    topicMastery.lastAttemptedAt = Date.now();

    // 1. Calculate accuracy
    const attempts = topicMastery.attemptsCount;
    const correctAnswers = topicMastery.correctAnswersCount;
    const accuracy = attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;
    topicMastery.accuracy = accuracy;

    // 2. Deterministic Mastery Formula:
    // rawMastery = accuracy - min(20, hintsUsedCount * 5)
    // masteryPercent = max(0, min(100, rawMastery * min(1.0, attemptsCount / 5)))
    const hintPenalty = Math.min(20, topicMastery.hintsUsedCount * 5);
    const rawMastery = accuracy - hintPenalty;
    const coverageFactor = Math.min(1.0, attempts / 5);
    const masteryPercent = Math.max(0, Math.min(100, Math.round(rawMastery * coverageFactor)));
    topicMastery.masteryPercent = masteryPercent;

    // 3. Status determination
    if (masteryPercent >= 90) {
      topicMastery.status = "Mastered";
    } else if (masteryPercent >= 60) {
      topicMastery.status = "Practicing";
    } else {
      topicMastery.status = "Needs Revision";
    }

    progress.topicMastery[topicSlug] = topicMastery;
  }
}
