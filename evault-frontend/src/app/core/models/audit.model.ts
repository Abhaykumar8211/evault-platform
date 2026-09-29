export interface AuditLog {
  id: number;
  eventType: string;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  entityType?: string;
  entityId?: number;
  actionDetails?: string;
  status: string;
  createdAt: string;
}
