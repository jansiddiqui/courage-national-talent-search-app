import { eventBus } from "./EventBus";
import { localProgressRepository } from "./repositories/LocalRepository";
import { AchievementEngine } from "./services/AchievementEngine";
import { AnalyticsTracker } from "./services/AnalyticsTracker";
import { MasteryService } from "./services/MasteryService";

let bootstrapped = false;

export function bootstrapAcademy(): void {
  if (typeof window === "undefined" || bootstrapped) return;
  
  try {
    new AchievementEngine(eventBus);
    new AnalyticsTracker(eventBus);

    // Event-driven Mastery calculation
    eventBus.subscribe("ANSWER_SUBMITTED", (event) => {
      const { progress, topicSlug, questionId, correct, hintsUsed } = event.payload;
      if (progress && topicSlug && questionId) {
        MasteryService.updateMastery(progress, topicSlug, questionId, correct, hintsUsed || 0);
      }
    });

    bootstrapped = true;
  } catch (err) {
    console.error("[AcademyBootstrap] Error during engine initialization:", err);
  }
}
