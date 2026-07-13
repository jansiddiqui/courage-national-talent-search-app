import { EventBus } from "../EventBus";
import { DomainEvent } from "../types";

export class AnalyticsTracker {
  private static LOGS_KEY = "cnts_academy_telemetry_logs";
  private sessionId: string;

  constructor(private eventBus: EventBus) {
    this.sessionId = this.getOrCreateSessionId();
    this.initListeners();
  }

  private getOrCreateSessionId(): string {
    if (typeof window === "undefined") return "";
    try {
      let sid = sessionStorage.getItem("cnts_telemetry_sid");
      if (!sid) {
        sid = (typeof crypto !== "undefined" && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("cnts_telemetry_sid", sid);
      }
      return sid;
    } catch {
      return "fallback-session-id";
    }
  }

  private initListeners(): void {
    // Wildcard subscriber to record every event on the event bus
    this.eventBus.subscribe("*", (event: DomainEvent) => {
      this.logEvent(event);
      this.sendTelemetryToServer(event);
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

  private sendTelemetryToServer(event: DomainEvent): void {
    if (typeof window === "undefined") return;

    const eventId = event.id || (
      (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36)
    );

    // Fire-and-forget POST request to telemetry ingest endpoint
    fetch("/api/telemetry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        eventType: event.type,
        eventId: eventId,
        correlationId: (event as any).correlationId || null,
        sessionIdentity: this.sessionId,
        metadata: {
          payload: event.payload || {},
          timestamp: event.timestamp || Date.now()
        }
      })
    }).catch(err => {
      console.error("[AnalyticsTracker] Server telemetry post failed:", err);
    });
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

