import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../core/services/audit.service';
import { AuditLog } from '../../core/models/audit.model';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="audit-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <span>DASHBOARD</span>
            <span class="separator">/</span>
            <span class="active">SYSTEM AUDIT TRAIL</span>
          </div>
          <h1 class="page-title">Immutable Security Audit Ledger</h1>
          <p class="page-subtitle">Cryptographically sequenced, append-only log of all user logins, uploads, verifications, and security events</p>
        </div>

        <div class="header-badges">
          <div class="audit-status-badge">
            <span class="material-icons text-success">lock</span>
            <span>WORM (Write Once Read Many) Compliant</span>
          </div>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="filter-toolbar gov-card">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search by actor email, event details, IP address or entity..." 
            class="gov-input"
          />
        </div>

        <div class="filter-group">
          <select [(ngModel)]="eventFilter" class="gov-select">
            <option value="ALL">All Event Types</option>
            <option value="LOGIN">User Logins</option>
            <option value="CASE_CREATED">Case Dockets Created</option>
            <option value="DOCUMENT_UPLOADED">Documents Uploaded</option>
            <option value="DOCUMENT_VERIFIED">Document Verifications</option>
            <option value="TAMPER_ALERT_TRIGGERED">Tamper Alerts</option>
            <option value="EVIDENCE_ADDED">Evidence Seized</option>
            <option value="CUSTODY_TRANSFERRED">Custody Handovers</option>
            <option value="DOCUMENT_SHARED">Secure Links Shared</option>
          </select>

          <select [(ngModel)]="statusFilter" class="gov-select">
            <option value="ALL">All Event Statuses</option>
            <option value="SUCCESS">Success Only</option>
            <option value="ALERT">Security Alerts Only</option>
            <option value="FAILED">Failures</option>
          </select>

          <button (click)="resetFilters()" class="gov-btn gov-btn-secondary">
            <span class="material-icons">filter_alt_off</span>
            Reset
          </button>
        </div>
      </div>

      <!-- Count Summary -->
      <div class="summary-bar">
        <span class="text-secondary text-sm">Showing <strong>{{ filteredLogs().length }}</strong> audit events from immutable storage</span>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading-state gov-card">
        <div class="spinner"></div>
        <p>Loading append-only audit trail...</p>
      </div>

      <!-- Audit Logs Table -->
      <div *ngIf="!loading()" class="gov-card table-card">
        <div class="table-responsive">
          <table class="gov-table">
            <thead>
              <tr>
                <th>EVENT ID</th>
                <th>EVENT TYPE</th>
                <th>ACTOR & ROLE</th>
                <th>ENTITY AFFECTED</th>
                <th>SECURITY DETAILS</th>
                <th>NETWORK ORIGIN (IP)</th>
                <th>EVENT STATUS</th>
                <th>RECORDED TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of filteredLogs()" class="hover-row">
                <td class="font-mono text-audit-id font-bold">#AUD-{{ log.id }}</td>
                <td>
                  <span class="badge" [ngClass]="getEventBadgeClass(log.eventType)">
                    {{ log.eventType }}
                  </span>
                </td>
                <td>
                  <div class="actor-email font-medium">{{ log.actorEmail || 'System Process' }}</div>
                  <div class="text-xs text-secondary font-mono">{{ log.actorRole || 'SYSTEM_DAEMON' }}</div>
                </td>
                <td>
                  <div class="font-mono text-xs text-entity">{{ log.entityType || 'SYSTEM' }} #{{ log.entityId || 0 }}</div>
                </td>
                <td>
                  <div class="details-cell text-xs">{{ log.actionDetails }}</div>
                </td>
                <td>
                  <div class="font-mono text-xs text-secondary">{{ log.ipAddress || '127.0.0.1' }}</div>
                </td>
                <td>
                  <span class="badge" [ngClass]="log.status === 'ALERT' ? 'badge-danger' : (log.status === 'SUCCESS' ? 'badge-success' : 'badge-neutral')">
                    {{ log.status }}
                  </span>
                </td>
                <td>
                  <div class="font-mono text-xs text-date">{{ log.createdAt | date:'dd MMM yyyy' }}</div>
                  <div class="font-mono text-xs text-muted">{{ log.createdAt | date:'HH:mm:ss' }} IST</div>
                </td>
              </tr>

              <tr *ngIf="filteredLogs().length === 0">
                <td colspan="8" class="empty-cell text-center" style="padding: 32px;">
                  <span class="material-icons" style="font-size: 36px; color: var(--color-slate-600);">policy</span>
                  <h4 class="mt-2 text-slate-200">No matching audit events found</h4>
                  <p class="text-secondary text-sm">Adjust search keywords or filter options.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .audit-page {
      padding: var(--space-6);
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-6);
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 600;
      color: var(--color-slate-400);
      margin-bottom: 4px;
    }

    .separator { color: var(--color-slate-600); }
    .page-title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.02em; }
    .page-subtitle { font-size: 13px; color: #475569; margin: 0; }

    .text-audit-id {
      color: #1e3a8a;
      font-size: 13px;
    }

    .actor-email {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    .text-entity {
      color: #0f172a;
      font-weight: 600;
    }

    .text-date {
      color: #0f172a;
      font-weight: 600;
    }

    .audit-status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
      color: #15803d;

      .material-icons { font-size: 14px; }
    }

    .filter-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4) var(--space-5);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 280px;

      .material-icons {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 18px;
        color: #64748b;
      }

      input { padding-left: 38px; width: 100%; }
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-wrap: wrap;

      select { min-width: 160px; }
    }

    .summary-bar { margin-bottom: var(--space-3); color: #475569; }

    .table-card { padding: 0; overflow: hidden; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; }

    .details-cell {
      max-width: 320px;
      line-height: 1.4;
      color: #334155;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-10);
      gap: var(--space-3);
      color: #64748b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #e2e8f0;
      border-top-color: #1e3a8a;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AuditListComponent implements OnInit {
  logs = signal<AuditLog[]>([]);
  loading = signal<boolean>(true);
  searchQuery = '';
  eventFilter = 'ALL';
  statusFilter = 'ALL';

  filteredLogs = computed(() => {
    let list = this.logs();
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      list = list.filter(l =>
        l.actorEmail?.toLowerCase().includes(query) ||
        l.actionDetails?.toLowerCase().includes(query) ||
        l.ipAddress?.toLowerCase().includes(query) ||
        l.entityType?.toLowerCase().includes(query) ||
        l.eventType?.toLowerCase().includes(query)
      );
    }

    if (this.eventFilter !== 'ALL') {
      list = list.filter(l => l.eventType === this.eventFilter);
    }

    if (this.statusFilter !== 'ALL') {
      list = list.filter(l => l.status === this.statusFilter);
    }

    return list;
  });

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.loading.set(true);
    this.auditService.getRecentAuditLogs().subscribe({
      next: (data) => {
        this.logs.set(data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.eventFilter = 'ALL';
    this.statusFilter = 'ALL';
  }

  getEventBadgeClass(eventType?: string): string {
    if (!eventType) return 'badge-neutral';
    if (eventType.includes('TAMPER')) return 'badge-danger';
    if (eventType.includes('VERIFIED')) return 'badge-success';
    if (eventType.includes('UPLOAD') || eventType.includes('CREATED')) return 'badge-info';
    return 'badge-neutral';
  }
}
