import { VerificationProvider, VerifyVpaParams, VerifyBankParams, VerificationResult } from './VerificationProvider';

export class RazorpayVerificationProvider implements VerificationProvider {
  name = 'RAZORPAY_VERIFICATION_PROVIDER';

  async verifyVpa(_params: VerifyVpaParams): Promise<VerificationResult> {
    throw new Error('RazorpayVerificationProvider is not yet active. MSME Proprietorship conversion in progress by Razorpay Support. Use ManualVerificationProvider.');
  }

  async verifyBankAccount(_params: VerifyBankParams): Promise<VerificationResult> {
    throw new Error('RazorpayVerificationProvider is not yet active. MSME Proprietorship conversion in progress by Razorpay Support. Use ManualVerificationProvider.');
  }
}
