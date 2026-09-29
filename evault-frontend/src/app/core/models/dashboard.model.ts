import { CaseResponse } from './case.model';
import { DocumentResponse } from './document.model';
import { TamperIncident } from './verification.model';

export interface DashboardStats {
  totalActiveCases: number;
  totalDocuments: number;
  totalEvidenceItems: number;
  verifiedDocuments: number;
  pendingVerification: number;
  tamperAlertsCount: number;
  totalUsers: number;
  recentCases: CaseResponse[];
  recentDocuments: DocumentResponse[];
  recentTamperAlerts: TamperIncident[];
}

export interface DashboardCharts {
  casesByStatus: Record<string, number>;
  documentsByType: Record<string, number>;
  verificationStatusDistribution: Record<string, number>;
  monthlyLabels: string[];
  monthlyCases: number[];
  monthlyDocuments: number[];
}

export interface ShareResponse {
  id: number;
  documentId: number;
  documentTitle: string;
  shareUrl: string;
  token: string;
  recipientEmail: string;
  accessLevel: string;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  revoked: boolean;
  active: boolean;
  createdAt: string;
}

export interface ShareCreateRequest {
  recipientEmail: string;
  accessLevel: string;
  validityHours: number;
  maxUses: number;
}
