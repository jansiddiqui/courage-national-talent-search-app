import { ProgressRepository } from "./ProgressRepository";
import { StudentProgress, LearningSession, StudentProfile } from "../types";

export class LocalRepository implements ProgressRepository {
  private static PROGRESS_KEY = "cnts_academy_student_progress";

  private createDefaultProgress(): StudentProgress {
    const now = Date.now();
    const profile: StudentProfile = {
      id: "student_" + Math.random().toString(36).substring(2, 9),
      preferredLanguage: "en",
      preferredLearningMode: "beginner",
      totalXP: 0,
      streak: 0,
      joinedAt: now,
      lastActive: now,
    };

    return {
      profile,
      completedTopics: [],
      completedQuestions: [],
      bookmarks: [],
      achievements: [],
      skillsXP: {
        "Verbal": 0,
        "Non-Verbal": 0,
        "Spatial": 0,
        "Analytical": 0,
        "Mathematical": 0
      },
      sessions: []
    };
  }

  public async getProgress(): Promise<StudentProgress> {
    if (typeof window === "undefined") {
      return this.createDefaultProgress();
    }

    try {
      // 1. Fetch from server first to identify the active authenticated student (authoritative source)
      const res = await fetch("/api/student/progress");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.progress) {
          const serverProg = data.progress;
          const studentId = serverProg.profile.id;
          const partitionedKey = `${LocalRepository.PROGRESS_KEY}_${studentId}`;

          // Load from partitioned local cache
          let localProg = serverProg;
          const localData = localStorage.getItem(partitionedKey);
          if (localData) {
            try {
              const parsedLocal = JSON.parse(localData);
              // Merge logic: take the one with higher totalXP or later timestamp to prevent stale overwrite
              if ((parsedLocal.profile?.totalXP || 0) > (serverProg.profile?.totalXP || 0)) {
                localProg = parsedLocal;
                // Sync back to server since local was newer
                await this.saveProgress(localProg);
              }
            } catch (e) {
              // ignore
            }
          } else {
            // Check if legacy unpartitioned data can be migrated (only once)
            const legacyData = localStorage.getItem(LocalRepository.PROGRESS_KEY);
            if (legacyData) {
              try {
                const parsedLegacy = JSON.parse(legacyData);
                // Verify that the legacy data has some XP or is initialized, and merge it safely
                if (parsedLegacy.profile && parsedLegacy.profile.totalXP > 0) {
                  localProg = {
                    ...parsedLegacy,
                    profile: {
                      ...parsedLegacy.profile,
                      id: studentId // Re-map ID to active student
                    }
                  };
                  // Sync migrated data to server
                  await this.saveProgress(localProg);
                }
              } catch (e) {
                // ignore
              }
              // Remove legacy key so other siblings cannot inherit it
              localStorage.removeItem(LocalRepository.PROGRESS_KEY);
            }
          }

          // Cache the merged/synced progress locally under the partitioned key
          localStorage.setItem(partitionedKey, JSON.stringify(localProg));
          return localProg;
        }
      }

      // 2. Offline / Guest Fallback
      const localData = localStorage.getItem(LocalRepository.PROGRESS_KEY);
      if (!localData) {
        const defaultProg = this.createDefaultProgress();
        localStorage.setItem(LocalRepository.PROGRESS_KEY, JSON.stringify(defaultProg));
        return defaultProg;
      }
      return JSON.parse(localData);
    } catch (e) {
      console.error("[LocalRepository] Error loading progress:", e);
      const data = localStorage.getItem(LocalRepository.PROGRESS_KEY);
      return data ? JSON.parse(data) : this.createDefaultProgress();
    }
  }

  public async saveProgress(progress: StudentProgress): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      progress.profile.lastActive = Date.now();
      const studentId = progress.profile.id;

      // Cache locally under partitioned key if it's an authenticated student (not student_ guest prefix)
      const isGuest = studentId.startsWith("student_");
      const cacheKey = isGuest ? LocalRepository.PROGRESS_KEY : `${LocalRepository.PROGRESS_KEY}_${studentId}`;

      localStorage.setItem(cacheKey, JSON.stringify(progress));

      // Sync to database if authenticated student (non-guest)
      if (!isGuest) {
        await fetch("/api/student/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress })
        });
      }
    } catch (e) {
      console.error("[LocalRepository] Error saving progress:", e);
    }
  }

  public async saveSession(session: LearningSession): Promise<void> {
    const progress = await this.getProgress();
    
    if (!progress.sessions) {
      progress.sessions = [];
    }
    progress.sessions.push(session);

    // XP double-award fix: Do not add session.xpEarned to profile.totalXP here,
    // as it is already added incrementally in LearningService.submitAnswer.

    this.updateStreak(progress);

    await this.saveProgress(progress);
  }

  public async getSessions(): Promise<LearningSession[]> {
    const progress = await this.getProgress();
    return progress.sessions || [];
  }

  private updateStreak(progress: StudentProgress): void {
    const now = new Date();
    const lastActiveDate = new Date(progress.profile.lastActive);
    
    // Check if the last activity was yesterday
    const differenceInTime = now.getTime() - lastActiveDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays === 1) {
      progress.profile.streak += 1;
    } else if (differenceInDays > 1) {
      progress.profile.streak = 1; // reset streak if gap > 1 day
    } else if (progress.profile.streak === 0) {
      progress.profile.streak = 1; // start streak
    }
  }
}

export const localProgressRepository = new LocalRepository();
