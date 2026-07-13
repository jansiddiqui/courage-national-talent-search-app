import { eventBus } from "./EventBus";
import { localProgressRepository } from "./repositories/LocalRepository";
import { AchievementEngine } from "./services/AchievementEngine";
import { AnalyticsTracker } from "./services/AnalyticsTracker";

let bootstrapped = false;

export function bootstrapAcademy(): void {
  if (typeof window === "undefined" || bootstrapped) return;
  
  try {
    new AchievementEngine(localProgressRepository, eventBus);
    new AnalyticsTracker(eventBus);
    bootstrapped = true;
  } catch (err) {
    console.error("[AcademyBootstrap] Error during engine initialization:", err);
  }
}
