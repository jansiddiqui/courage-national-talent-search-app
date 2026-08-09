import { PayoutProvider, PayoutBatchItem, PayoutBatchSummary, ManualSettlementRecord, BulkExcelSettlementRow } from './PayoutProvider';

export abstract class AutomatedPayoutProvider implements PayoutProvider {
  abstract name: string;

  abstract createBatch(items: PayoutBatchItem[]): Promise<PayoutBatchSummary>;
  abstract generateCsvExport(batch: PayoutBatchSummary): string;
  abstract processSingleSettlement(record: ManualSettlementRecord): Promise<PayoutBatchItem>;
  abstract processBulkExcelSettlement(rows: BulkExcelSettlementRow[]): Promise<{ settledCount: number; failedCount: number; updatedIds: string[] }>;
  abstract getPayoutStatus(requestId: string): Promise<PayoutBatchItem | null>;
  abstract executeAutomatedPayout(item: PayoutBatchItem): Promise<PayoutBatchItem>;
}
