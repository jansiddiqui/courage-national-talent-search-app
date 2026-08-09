import { AutomatedPayoutProvider } from './AutomatedPayoutProvider';
import { PayoutBatchItem, PayoutBatchSummary, ManualSettlementRecord, BulkExcelSettlementRow } from './PayoutProvider';

export class RazorpayXProvider extends AutomatedPayoutProvider {
  name = 'RAZORPAYX_PROVIDER';

  async createBatch(_items: PayoutBatchItem[]): Promise<PayoutBatchSummary> {
    throw new Error('RazorpayXProvider is not yet active. MSME Proprietorship conversion in progress by Razorpay Support. Use ManualSettlementProvider.');
  }

  generateCsvExport(_batch: PayoutBatchSummary): string {
    throw new Error('RazorpayXProvider is not yet active. Use ManualSettlementProvider.');
  }

  async processSingleSettlement(_record: ManualSettlementRecord): Promise<PayoutBatchItem> {
    throw new Error('RazorpayXProvider is not yet active. Use ManualSettlementProvider.');
  }

  async processBulkExcelSettlement(_rows: BulkExcelSettlementRow[]): Promise<{ settledCount: number; failedCount: number; updatedIds: string[] }> {
    throw new Error('RazorpayXProvider is not yet active. Use ManualSettlementProvider.');
  }

  async getPayoutStatus(_requestId: string): Promise<PayoutBatchItem | null> {
    throw new Error('RazorpayXProvider is not yet active. Use ManualSettlementProvider.');
  }

  async executeAutomatedPayout(_item: PayoutBatchItem): Promise<PayoutBatchItem> {
    throw new Error('RazorpayXProvider automated API payouts will be active after Razorpay Support completes MSME Proprietorship conversion.');
  }
}
