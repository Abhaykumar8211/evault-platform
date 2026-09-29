export interface DocumentVerificationResult {
  verified: boolean;
  status: 'VERIFIED' | 'TAMPER_DETECTED' | 'NOT_FOUND';
  message: string;
  documentId?: number;
  documentTitle?: string;
  caseNumber?: string;
  originalHash?: string;
  computedHash: string;
  calculatedHash?: string;
  hashMatched: boolean;
  ipfsCid?: string;
  ipfsAvailable?: boolean;
  transactionHash?: string;
  blockchainTxHash?: string;
  blockNumber?: number;
  contractAddress?: string;
  blockTimestamp?: number;
  verifiedAt: string;
}

export interface TamperIncident {
  id: number;
  documentTitle: string;
  caseNumber?: string;
  expectedHash: string;
  attemptedHash: string;
  severity: string;
  incidentDetails: string;
  detectedAt: string;
}

export type VerificationResult = DocumentVerificationResult;

