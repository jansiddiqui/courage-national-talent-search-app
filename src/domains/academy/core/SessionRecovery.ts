import { LearningSession } from "./types";

export class SessionRecovery {
  private static DRAFT_KEY = "cnts_academy_session_recovery";

  public static saveDraftSession(session: LearningSession): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(session));
    } catch (e) {
      console.error("[SessionRecovery] Failed to save draft session:", e);
    }
  }

  public static getDraftSession(): LearningSession | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(this.DRAFT_KEY);
      if (!data) return null;
      
      const session: LearningSession = JSON.parse(data);
      // If draft session was updated more than 2 hours ago, discard it
      if (Date.now() - session.startTime > 2 * 60 * 60 * 1000) {
        this.clearDraftSession();
        return null;
      }
      
      return session;
    } catch (e) {
      console.error("[SessionRecovery] Failed to parse draft session:", e);
      return null;
    }
  }

  public static clearDraftSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.DRAFT_KEY);
  }
}
