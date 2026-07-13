import { LocalDb } from "./LocalDb";
import { AssessmentMutation, SyncRequest, SyncResponse } from "./core/types";

export class AssessmentSyncManager {
  private static sequenceCounter = 0;
  private static inFlight = false;
  private static debounceTimer: NodeJS.Timeout | null = null;
  private static syncInterval: NodeJS.Timeout | null = null;
  private static retryCount = 0;
  private static sessionId = "";
  private static onSyncSuccessCallback: ((res: SyncResponse) => void) | null = null;

  public static initialize(
    sessionId: string,
    initialSeqNum: number,
    onSyncSuccess?: (res: SyncResponse) => void
  ) {
    this.sessionId = sessionId;
    this.sequenceCounter = initialSeqNum;
    this.inFlight = false;
    this.retryCount = 0;
    this.onSyncSuccessCallback = onSyncSuccess || null;

    // Start background sync polling fallback every 15s to flush any un-synced items
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.syncInterval = setInterval(() => {
      this.triggerSync();
    }, 15000);
  }

  public static stop() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (this.syncInterval) clearInterval(this.syncInterval);
    this.debounceTimer = null;
    this.syncInterval = null;
  }

  /**
   * Enqueues a new answer response mutation locally and schedules a sync
   */
  public static async recordMutation(
    questionId: string,
    selectedOptionIds: string[]
  ): Promise<number> {
    this.sequenceCounter += 1;
    const currentSeq = this.sequenceCounter;

    const mutation: AssessmentMutation = {
      mutationId: "mut_" + Math.random().toString(36).substring(2, 15),
      sequenceNumber: currentSeq,
      sessionId: this.sessionId,
      questionId,
      selectedOptionIds,
      clientCreatedAt: Date.now()
    };

    // Save immediately and durably to IndexedDB (answering never blocks for the network)
    await LocalDb.addMutation(mutation);

    // Schedule debounced network sync (3 seconds window)
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.triggerSync();
    }, 3000);

    return currentSeq;
  }

  /**
   * Triggers the sync flush process
   */
  public static async triggerSync(): Promise<void> {
    if (this.inFlight || !this.sessionId) return;

    const pending = await LocalDb.getPendingMutations();
    if (pending.length === 0) return;

    this.inFlight = true;

    try {
      const syncRequest: SyncRequest = {
        sessionId: this.sessionId,
        mutations: pending
      };

      const response = await fetch("/api/assessment/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(syncRequest)
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result: SyncResponse = await response.json();
      if (result.success) {
        this.retryCount = 0;

        // Clean up acknowledged mutations from IndexedDB
        const ackLimit = result.highestAcknowledgedSequence;
        const acknowledgedIds = pending
          .filter(m => m.sequenceNumber <= ackLimit)
          .map(m => m.mutationId);

        await LocalDb.removeMutations(acknowledgedIds);

        if (this.onSyncSuccessCallback) {
          this.onSyncSuccessCallback(result);
        }
      } else {
        throw new Error("Server sync response marked failure");
      }
    } catch (err) {
      console.warn("[AssessmentSyncManager] Sync connection error, rescheduling:", err);
      this.retryCount++;
      // Bounded exponential backoff with jitter
      const baseDelay = Math.min(30000, 1000 * Math.pow(2, this.retryCount));
      const jitterDelay = baseDelay * (0.5 + Math.random() * 0.5);

      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.triggerSync();
      }, jitterDelay);
    } finally {
      this.inFlight = false;
    }
  }
}
