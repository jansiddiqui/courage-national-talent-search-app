import { ProgressRepository } from "../repositories/ProgressRepository";
import { StudentProgress, LanguageCode } from "../types";

export class ProgressService {
  constructor(private progressRepo: ProgressRepository) {}

  /**
   * Toggles the bookmark status of a topic
   */
  public async toggleBookmark(topicSlug: string): Promise<boolean> {
    const progress = await this.progressRepo.getProgress();
    const index = progress.bookmarks.indexOf(topicSlug);
    let bookmarked = false;

    if (index > -1) {
      progress.bookmarks.splice(index, 1);
    } else {
      progress.bookmarks.push(topicSlug);
      bookmarked = true;
    }

    await this.progressRepo.saveProgress(progress);
    return bookmarked;
  }

  /**
   * Sets preferred learning mode (beginner, revision, challenge, parent)
   */
  public async setLearningMode(mode: 'beginner' | 'revision' | 'challenge' | 'parent'): Promise<void> {
    const progress = await this.progressRepo.getProgress();
    progress.profile.preferredLearningMode = mode;
    await this.progressRepo.saveProgress(progress);
  }

  /**
   * Sets preferred UI/content language code (en, hi, etc.)
   */
  public async setPreferredLanguage(lang: LanguageCode): Promise<void> {
    const progress = await this.progressRepo.getProgress();
    progress.profile.preferredLanguage = lang;
    await this.progressRepo.saveProgress(progress);
  }

  /**
   * Calculates overall accuracy based on completed vs attempted questions in sessions
   */
  public async getOverallAccuracy(): Promise<number> {
    const sessions = await this.progressRepo.getSessions();
    if (!sessions || sessions.length === 0) return 100; // default to perfect 100%

    let totalAttempted = 0;
    let totalCorrect = 0;

    sessions.forEach(s => {
      totalAttempted += s.questionsAttempted;
      totalCorrect += s.correctAnswers;
    });

    if (totalAttempted === 0) return 100;
    return Math.round((totalCorrect / totalAttempted) * 100);
  }
}
