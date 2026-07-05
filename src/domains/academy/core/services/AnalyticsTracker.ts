import { EventBus } from "../EventBus";
import { DomainEvent } from "../types";

export class AnalyticsTracker {
  private static LOGS_KEY = "cnts_academy_telemetry_logs";

  constructor(private eventBus: EventBus) {
    this.initListeners();
  }

  private initListeners(): void {
    // Wildcard subscriber to record every event on the event bus
    this.eventBus.subscribe("*", (event: DomainEvent) => {
      this.logEvent(event);
    });
  }

  private logEvent(event: DomainEvent): void {
    if (typeof window === "undefined") return;

    try {
      const logs = this.getLogs();
      logs.push(event);
      
      // Limit to last 200 telemetry logs to prevent local storage bloat
      if (logs.length > 200) {
        logs.shift();
      }

      localStorage.setItem(AnalyticsTracker.LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("[AnalyticsTracker] Failed to record event telemetry:", e);
    }
  }

  public getLogs(): DomainEvent[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(AnalyticsTracker.LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("[AnalyticsTracker] Failed to load telemetry logs:", e);
      return [];
    }
  }
}
