export interface VerificationResult {
  verified: boolean;
  upiId?: string;
  accountNumber?: string;
  ifsc?: string;
  receiverName: string;
  bankName: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  source: string;
  verificationBadge: string;
  message?: string;
  verifiedAt: string;
}

export interface VerifyVpaParams {
  upiId: string;
  partnerName?: string;
}

export interface VerifyBankParams {
  accountNumber: string;
  ifsc: string;
  accountHolderName?: string;
  partnerName?: string;
}

export interface VerificationProvider {
  name: string;
  verifyVpa(params: VerifyVpaParams): Promise<VerificationResult>;
  verifyBankAccount(params: VerifyBankParams): Promise<VerificationResult>;
}
