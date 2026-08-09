import { VerificationProvider } from './VerificationProvider';
import { ManualVerificationProvider } from './ManualVerificationProvider';
import { RazorpayVerificationProvider } from './RazorpayVerificationProvider';

import { PayoutProvider } from './PayoutProvider';
import { ManualSettlementProvider } from './ManualSettlementProvider';
import { RazorpayXProvider } from './RazorpayXProvider';

export class ProviderFactory {
  static getVerificationProvider(): VerificationProvider {
    const providerName = (process.env.VERIFICATION_PROVIDER || 'MANUAL').toUpperCase();

    switch (providerName) {
      case 'RAZORPAY':
      case 'RAZORPAYX':
        return new RazorpayVerificationProvider();
      case 'MANUAL':
      default:
        return new ManualVerificationProvider();
    }
  }

  static getPayoutProvider(): PayoutProvider {
    const providerName = (process.env.PAYOUT_PROVIDER || 'MANUAL').toUpperCase();

    switch (providerName) {
      case 'RAZORPAYX':
      case 'RAZORPAY':
        return new RazorpayXProvider();
      case 'MANUAL':
      default:
        return new ManualSettlementProvider();
    }
  }
}
