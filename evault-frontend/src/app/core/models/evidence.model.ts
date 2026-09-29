import { UserProfile } from './user.model';
import { DocumentResponse } from './document.model';

export interface ChainOfCustodyResponse {
  id: number;
  evidenceId?: number;
  documentId?: number;
  actorName: string;
  actorRole: string;
  actionType: string;
  previousCustodian?: string;
  newCustodian?: string;
  remarks?: string;
  eventHash?: string;
  timestamp: string;
  action?: string;
  actor?: string;
  fromLocation?: string;
  toLocation?: string;
  verificationHash?: string;
}

export interface EvidenceResponse {
  id: number;
  caseId: number;
  caseNumber: string;
  evidenceNumber: string;
  evidenceType: string;
  description: string;
  storageLocation: string;
  custodyStatus: string;
  collectedBy?: UserProfile;
  collectedAt: string;
  attachedDocument?: DocumentResponse;
  custodyHistory: ChainOfCustodyResponse[];
  createdAt: string;
  name?: string;
  itemNumber?: string;
  barcode?: string;
  category?: string;
  currentCustodian?: string;
  collectionLocation?: string;
  sealIntact?: boolean;
}

export interface EvidenceCreateRequest {
  caseId: number;
  documentId?: number;
  evidenceType: string;
  description: string;
  storageLocation?: string;
}

export interface EvidenceTransferRequest {
  newCustodian: string;
  actionType: string;
  newStorageLocation?: string;
  remarks?: string;
}

export type Evidence = EvidenceResponse;
export type ChainOfCustodyEvent = ChainOfCustodyResponse;
