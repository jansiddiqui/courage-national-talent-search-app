import { EventBus } from "../EventBus";
import { ProgressRepository } from "../repositories/ProgressRepository";
import { Achievement, StudentProgress } from "../types";

export class AchievementEngine {
  private static BADGES = {
    first_step: {
      id: "first_step",
      title: { en: "First Step", hi: "पहला कदम" },
      description: { en: "Completed your first reasoning topic!", hi: "आपने अपना पहला रीजनिंग विषय पूरा किया!" },
      icon: "🎯"
    },
    quest_begun: {
      id: "quest_begun",
      title: { en: "Quest Begun", hi: "खोज शुरू" },
      description: { en: "Solved your first practice question correctly.", hi: "पहला अभ्यास प्रश्न सही हल किया।" },
      icon: "⭐"
    },
    logic_novice: {
      id: "logic_novice",
      title: { en: "Logic Novice", hi: "तर्क नौसिखिया" },
      description: { en: "Reached 100 total XP points.", hi: "कुल 100 XP अंक प्राप्त किए।" },
      icon: "🏆"
    }
  };

  constructor(
    private eventBus: EventBus
  ) {
    this.initListeners();
  }

  private initListeners(): void {
    // Listen to topic completions
    this.eventBus.subscribe("TOPIC_COMPLETED", (event) => {
      const { progress } = event.payload;
      if (progress && !this.hasBadge(progress, "first_step") && progress.completedTopics.length >= 1) {
        this.unlockBadge(progress, "first_step");
      }
    });

    // Listen to answer submissions
    this.eventBus.subscribe("ANSWER_SUBMITTED", (event) => {
      const { progress, correct } = event.payload;
      if (!progress) return;

      // Check "quest_begun"
      if (correct && !this.hasBadge(progress, "quest_begun")) {
        this.unlockBadge(progress, "quest_begun");
      }

      // Check "logic_novice"
      if (progress.profile.totalXP >= 100 && !this.hasBadge(progress, "logic_novice")) {
        this.unlockBadge(progress, "logic_novice");
      }
    });
  }

  private hasBadge(progress: StudentProgress, badgeId: string): boolean {
    return progress.achievements.some(a => a.id === badgeId);
  }

  private unlockBadge(progress: StudentProgress, badgeId: string): void {
    const template = AchievementEngine.BADGES[badgeId as keyof typeof AchievementEngine.BADGES];
    if (!template) return;

    const newBadge: Achievement = {
      id: template.id,
      title: template.title,
      description: template.description,
      icon: template.icon,
      unlockedAt: Date.now()
    };

    progress.achievements.push(newBadge);

    // Emit event that a badge has been unlocked (can trigger a popup on screen)
    this.eventBus.publish({
      type: "ACHIEVEMENT_UNLOCKED",
      payload: { badge: newBadge }
    });
  }
}
