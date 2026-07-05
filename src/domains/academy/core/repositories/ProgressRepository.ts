import { StudentProgress, LearningSession } from "../types";

export interface ProgressRepository {
  /**
   * Retrieves the student's progress state
   */
  getProgress(): Promise<StudentProgress>;

  /**
   * Saves the student's progress state
   */
  saveProgress(progress: StudentProgress): Promise<void>;

  /**
   * Saves/Appends a completed learning session
   */
  saveSession(session: LearningSession): Promise<void>;

  /**
   * Fetches all registered sessions
   */
  getSessions(): Promise<LearningSession[]>;
}
