import { DomainEvent } from "./types";

type EventListener = (event: DomainEvent) => void;

export class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();

  public subscribe(eventType: string, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public publish(event: Omit<DomainEvent, "id" | "timestamp" | "version">): void {
    const fullEvent: DomainEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9),
      version: 1,
      timestamp: Date.now()
    };
    
    // Dispatch to registered type-specific listeners
    this.listeners.get(fullEvent.type)?.forEach(listener => {
      try {
        listener(fullEvent);
      } catch (err) {
        console.error(`[EventBus] Error in listener for ${fullEvent.type}:`, err);
      }
    });

    // Also support global wildcard "*" listeners if needed
    this.listeners.get("*")?.forEach(listener => {
      try {
        listener(fullEvent);
      } catch (err) {
        console.error(`[EventBus] Error in global listener:`, err);
      }
    });
  }
}

export const eventBus = new EventBus();
