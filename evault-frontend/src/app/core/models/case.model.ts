import { UserProfile } from './user.model';

export type CaseStatus =
  | 'OPEN'
  | 'UNDER_INVESTIGATION'
  | 'UNDER_REVIEW'
  | 'IN_COURT'
  | 'CLOSED'
  | 'ARCHIVED';

export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CaseResponse {
  id: number;
  caseNumber: string;
  title: string;
  firNumber: string;
  courtName: string;
  policeStation: string;
  caseType: string;
  description?: string;
  priority: CasePriority;
  priorityDisplayName: string;
  status: CaseStatus;
  statusDisplayName: string;
  assignedOfficer?: UserProfile;
  prosecutor?: UserProfile;
  judge?: UserProfile;
  createdBy?: UserProfile;
  documentCount: number;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseCreateRequest {
  title: string;
  firNumber: string;
  courtName: string;
  policeStation: string;
  caseType: string;
  description?: string;
  priority: CasePriority;
  assignedOfficerId?: number;
  assignedOfficer?: string;
  prosecutorId?: number;
  prosecutor?: string;
  judgeId?: number;
  judge?: string;
}

export interface CaseTimelineItem {
  title: string;
  description: string;
  eventType: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  referenceId?: string;
  status: string;
}

export type LegalCase = CaseResponse;
export type CreateCaseRequest = CaseCreateRequest;

