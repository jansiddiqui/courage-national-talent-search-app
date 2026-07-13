import { AssessmentMutation } from "./core/types";

export class LocalDb {
  private static DB_NAME = "cnts_assessment_db";
  private static STORE_NAME = "mutations";
  private static DB_VERSION = 1;

  private static getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new Error("IndexedDB is not supported on this environment"));
        return;
      }

      const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: "mutationId" });
        }
      };
    });
  }

  /**
   * Save a mutation locally in the IndexedDB queue
   */
  public static async addMutation(mutation: AssessmentMutation): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.STORE_NAME, "readwrite");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.put(mutation);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn("[LocalDb] Failed to save mutation locally:", err);
    }
  }

  /**
   * Fetch all pending unacknowledged mutations from local IndexedDB
   */
  public static async getPendingMutations(): Promise<AssessmentMutation[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.STORE_NAME, "readonly");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          // Sort mutations by sequenceNumber to guarantee deterministic order
          const mutations = request.result as AssessmentMutation[];
          mutations.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          resolve(mutations);
        };
        request.onerror = () => reject(request.error);
      });
    } catch {
      return [];
    }
  }

  /**
   * Remove acknowledged mutations from local IndexedDB
   */
  public static async removeMutations(mutationIds: string[]): Promise<void> {
    if (mutationIds.length === 0) return;
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.STORE_NAME, "readwrite");
        const store = transaction.objectStore(this.STORE_NAME);

        let completed = 0;
        let errored = false;

        const checkDone = () => {
          completed++;
          if (completed === mutationIds.length && !errored) {
            resolve();
          }
        };

        mutationIds.forEach(id => {
          const request = store.delete(id);
          request.onsuccess = checkDone;
          request.onerror = () => {
            if (!errored) {
              errored = true;
              reject(request.error);
            }
          };
        });
      });
    } catch (err) {
      console.warn("[LocalDb] Failed to remove mutations:", err);
    }
  }

  /**
   * Clear the local store completely
   */
  public static async clearAll(): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.STORE_NAME, "readwrite");
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn("[LocalDb] Failed to clear IndexedDB store:", err);
    }
  }
}
