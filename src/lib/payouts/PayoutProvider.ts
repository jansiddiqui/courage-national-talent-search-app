export interface PayoutBatchItem {
  id: string;
  partnerId: string;
  partnerName: string;
  email?: string;
  phone?: string;
  referralCode: string;
  payoutMethod: 'UPI' | 'BANK';
  destinationAddress: string; // VPA or Bank Account + IFSC
  bankName: string;
  amount: number;
  tdsDeducted: number;
  netPayable: number;
  status: 'PENDING' | 'BATCHED' | 'SETTLED' | 'FAILED' | 'REJECTED';
  transactionRef?: string;
  settledAt?: string;
  adminNote?: string;
}

export interface PayoutBatchSummary {
  batchId: string;
  batchDate: string;
  totalPartners: number;
  grossAmount: number;
  totalTds: number;
  netPayableAmount: number;
  status: 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  items: PayoutBatchItem[];
}

export interface ManualSettlementRecord {
  requestId: string;
  transactionRef: string;
  paymentDate?: string;
  remarks?: string;
}

export interface BulkExcelSettlementRow {
  requestId: string;
  referralCode?: string;
  netPayable: number;
  transactionRef: string; // UTR
  status: 'SETTLED' | 'FAILED' | 'REJECTED';
  remarks?: string;
}

export interface PayoutProvider {
  name: string;
  createBatch(items: PayoutBatchItem[]): Promise<PayoutBatchSummary>;
  generateCsvExport(batch: PayoutBatchSummary): string;
  processSingleSettlement(record: ManualSettlementRecord): Promise<PayoutBatchItem>;
  processBulkExcelSettlement(rows: BulkExcelSettlementRow[]): Promise<{ settledCount: number; failedCount: number; updatedIds: string[] }>;
  getPayoutStatus(requestId: string): Promise<PayoutBatchItem | null>;
}
