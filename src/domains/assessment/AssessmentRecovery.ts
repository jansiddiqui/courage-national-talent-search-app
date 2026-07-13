import { LocalDb } from "./LocalDb";

export class AssessmentRecovery {
  /**
   * Deterministically reconstructs the candidate's answer state by merging
   * authoritative server-acknowledged answers with newer unacknowledged local mutations.
   * 
   * Formula:
   * Authoritative Server State + Valid Unacknowledged Local Mutations (Newer than Server Ack)
   * = Reconstructed State
   */
  public static async reconstructState(
    sessionId: string,
    serverAnswers: Record<string, string[]>,
    highestAckSequence: number
  ): Promise<Record<string, string[]>> {
    // Start with authoritative server-acknowledged answers
    const reconstructed: Record<string, string[]> = { ...serverAnswers };

    // Fetch all pending unacknowledged mutations from local IndexedDB
    const pendingMutations = await LocalDb.getPendingMutations();

    // Filter mutations that belong to the current session and are newer than the server's acknowledgement
    const validMutations = pendingMutations.filter(
      m => m.sessionId === sessionId && m.sequenceNumber > highestAckSequence
    );

    // Apply the valid mutations in strict chronological sequenceNumber order
    validMutations.forEach(mutation => {
      reconstructed[mutation.questionId] = mutation.selectedOptionIds;
    });

    return reconstructed;
  }
}
