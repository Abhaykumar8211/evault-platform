import { UserProfile } from './user.model';

export type DocumentType =
  | 'FIR'
  | 'CHARGE_SHEET'
  | 'COURT_ORDER'
  | 'TRANSCRIPT'
  | 'WITNESS_STATEMENT'
  | 'MEDICAL_REPORT'
  | 'FORENSIC_REPORT'
  | 'EVIDENCE_PHOTO'
  | 'DIGITAL_EVIDENCE'
  | 'LEGAL_NOTICE'
  | 'SUPPORTING_DOCUMENT'
  | 'OTHER';

export type DocumentStatus =
  | 'PENDING_ANCHOR'
  | 'ANCHORED'
  | 'VERIFIED'
  | 'TAMPER_DETECTED'
  | 'SUPERSEDED'
  | 'REVOKED';

export interface BlockchainProofResponse {
  transactionHash: string;
  blockNumber: number;
  contractAddress: string;
  anchoredHash: string;
  ipfsCid: string;
  registrarAddress: string;
  blockTimestamp: number;
  gasUsed: number;
  status: string;
  createdAt: string;
}

export interface DocumentResponse {
  id: number;
  caseId: number;
  caseNumber: string;
  documentType: DocumentType;
  documentTypeDisplayName: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sha256Hash: string;
  ipfsCid: string;
  ipfsGatewayUrl: string;
  uploadedBy?: UserProfile;
  version: number;
  status: DocumentStatus;
  statusDisplayName: string;
  blockchainProof?: BlockchainProofResponse;
  isVerified: boolean;
  verificationStatus?: string;
  blockchainTxHash?: string;
  legalCaseId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersionResponse {
  id: number;
  documentId: number;
  versionNumber: number;
  fileName: string;
  fileSize: number;
  sha256Hash: string;
  ipfsCid: string;
  transactionHash?: string;
  changeSummary?: string;
  uploadedBy?: UserProfile;
  createdAt: string;
}

export type LegalDocument = DocumentResponse;

