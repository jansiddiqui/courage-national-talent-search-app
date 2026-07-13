export type SessionStatus = 
  | "CREATED" 
  | "IN_PROGRESS" 
  | "SUBMITTING" 
  | "AUTO_SUBMITTING" 
  | "SUBMITTED" 
  | "SCORING" 
  | "SCORED" 
  | "LOCKED";

export interface CandidateOptionDTO {
  id: string;
  text: string;
}

export interface CandidateQuestionDTO {
  id: string;
  domain: string;
  text: string;
  options: CandidateOptionDTO[];
}

export interface AssessmentSessionDTO {
  sessionId: string;
  candidateId: string;
  assessmentId: string;
  status: SessionStatus;
  expiresAt: string;
  seed: number;
  startedAt?: string;
}

export interface AssessmentMutation {
  mutationId: string;
  sequenceNumber: number;
  sessionId: string;
  questionId: string;
  selectedOptionIds: string[];
  clientCreatedAt: number;
}

export interface SyncRequest {
  sessionId: string;
  mutations: AssessmentMutation[];
}

export interface SyncResponse {
  success: boolean;
  highestAcknowledgedSequence: number;
  timeRemainingSeconds: number;
  status: SessionStatus;
}

export interface SubmitRequest {
  sessionId: string;
  idempotencyKey: string;
  isAutoSubmit?: boolean;
}

export interface SubmissionReceipt {
  receiptId: string;
  sessionId: string;
  candidateId: string;
  score: number;
  submittedAt: string;
  status: SessionStatus;
}
