import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../core/services/case.service';
import { AuthService } from '../../core/services/auth.service';
import { LegalCase, CreateCaseRequest } from '../../core/models/case.model';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cases-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <span>DASHBOARD</span>
            <span class="separator">/</span>
            <span class="active">CASE MANAGEMENT</span>
          </div>
          <h1 class="page-title">Court Case Registry</h1>
          <p class="page-subtitle">Digitally anchored legal dockets with cryptographic evidence chains and role-gated access</p>
        </div>

        <div class="header-actions">
          <button *ngIf="canCreateCase()" (click)="openCreateModal()" class="gov-btn gov-btn-primary">
            <span class="material-icons">add_circle</span>
            Register New Docket
          </button>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="filter-toolbar gov-card">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search by Case No, FIR, Title, Police Station, or Court..."
            class="gov-input"
          />
        </div>

        <div class="filter-group">
          <select [(ngModel)]="statusFilter" class="gov-select">
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_COURT">In Court</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select [(ngModel)]="priorityFilter" class="gov-select">
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <button (click)="resetFilters()" class="gov-btn gov-btn-secondary" title="Reset Filters">
            <span class="material-icons">filter_alt_off</span>
            Reset
          </button>
        </div>
      </div>

      <!-- Cases Count Summary -->
      <div class="summary-bar">
        <span class="text-secondary">Showing <strong>{{ filteredCases().length }}</strong> of <strong>{{ cases().length }}</strong> registered cases</span>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading-state gov-card">
        <div class="spinner"></div>
        <p>Loading legal records from vault database...</p>
      </div>

      <!-- Cases Table -->
      <div *ngIf="!loading()" class="gov-card table-card">
        <div class="table-responsive">
          <table class="gov-table">
            <thead>
              <tr>
                <th>CASE NUMBER / FIR</th>
                <th>DOCKET TITLE</th>
                <th>JURISDICTION & POLICE STATION</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>ASSIGNED PERSONNEL</th>
                <th>REGISTERED</th>
                <th style="text-align: right;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filteredCases()" class="hover-row">
                <td>
                  <div class="case-num font-mono">{{ c.caseNumber }}</div>
                  <div class="fir-badge" *ngIf="c.firNumber">
                    <span class="material-icons">local_police</span> FIR: {{ c.firNumber }}
                  </div>
                </td>
                <td>
                  <div class="case-title-cell">
                    <a [routerLink]="['/cases', c.id]" class="title-link">{{ c.title }}</a>
                    <span class="case-type-pill">{{ c.caseType || 'CRIMINAL' }}</span>
                  </div>
                  <div class="case-desc-preview text-muted">{{ c.description | slice:0:85 }}{{ (c.description?.length || 0) > 85 ? '...' : '' }}</div>
                </td>
                <td>
                  <div class="court-cell font-medium">{{ c.courtName || 'Sessions Court' }}</div>
                  <div class="station-cell text-secondary">{{ c.policeStation || 'Central Bureau' }}</div>
                </td>
                <td>
                  <span class="badge" [ngClass]="getPriorityBadgeClass(c.priority)">
                    {{ c.priority }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getStatusBadgeClass(c.status)">
                    {{ c.status }}
                  </span>
                </td>
                <td>
                  <div class="personnel-pill" *ngIf="c.assignedOfficer">
                    <span class="material-icons">badge</span> {{ c.assignedOfficer }}
                  </div>
                  <div class="personnel-pill judge" *ngIf="c.judge">
                    <span class="material-icons">gavel</span> {{ c.judge }}
                  </div>
                </td>
                <td>
                  <div class="date-cell">{{ c.createdAt | date:'dd MMM yyyy' }}</div>
                  <div class="time-cell font-mono">{{ c.createdAt | date:'HH:mm' }} IST</div>
                </td>
                <td style="text-align: right;">
                  <a [routerLink]="['/cases', c.id]" class="gov-btn gov-btn-secondary btn-sm">
                    <span>View Dossier</span>
                    <span class="material-icons">arrow_forward</span>
                  </a>
                </td>
              </tr>

              <tr *ngIf="filteredCases().length === 0">
                <td colspan="8" class="empty-cell">
                  <div class="empty-state">
                    <span class="material-icons empty-icon">folder_off</span>
                    <h3>No matching court cases found</h3>
                    <p>Try adjusting your search criteria or register a new case docket.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Case Modal -->
      <div class="modal-backdrop" *ngIf="showCreateModal">
        <div class="modal-dialog gov-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="material-icons emblem-icon">gavel</span>
              <h2>Register New Judicial Docket</h2>
            </div>
            <button (click)="closeCreateModal()" class="close-btn">
              <span class="material-icons">close</span>
            </button>
          </div>

          <form (ngSubmit)="submitCreateCase()" class="modal-body">
            <div class="form-row">
              <div class="form-group col-12">
                <label class="gov-label">Case Docket Title *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCase.title" 
                  name="title" 
                  required 
                  class="gov-input" 
                  placeholder="e.g. State of Maharashtra vs. Arvind Sharma & Ors" 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="gov-label">FIR Number *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCase.firNumber" 
                  name="firNumber" 
                  required 
                  class="gov-input" 
                  placeholder="e.g. FIR-2026/CYBER/402" 
                />
              </div>
              <div class="form-group col-6">
                <label class="gov-label">Case Category *</label>
                <select [(ngModel)]="newCase.caseType" name="caseType" class="gov-select">
                  <option value="CRIMINAL">Criminal</option>
                  <option value="CIVIL">Civil</option>
                  <option value="CYBER_CRIME">Cyber Crime</option>
                  <option value="CORRUPTION">Anti-Corruption</option>
                  <option value="FINANCIAL_FRAUD">Financial Fraud</option>
                  <option value="CONSTITUTIONAL">Constitutional</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="gov-label">Jurisdiction Court *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCase.courtName" 
                  name="courtName" 
                  required 
                  class="gov-input" 
                  placeholder="e.g. Principal District & Sessions Court, Delhi" 
                />
              </div>
              <div class="form-group col-6">
                <label class="gov-label">Police Station / Authority *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCase.policeStation" 
                  name="policeStation" 
                  required 
                  class="gov-input" 
                  placeholder="e.g. Cyber Crime Cell, Mandir Marg PS" 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="gov-label">Priority Level *</label>
                <select [(ngModel)]="newCase.priority" name="priority" class="gov-select">
                  <option value="CRITICAL">Critical (Fast Track)</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div class="form-group col-6">
                <label class="gov-label">Investigating Officer (IO)</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCase.assignedOfficer" 
                  name="assignedOfficer" 
                  class="gov-input" 
                  placeholder="e.g. Inspector R. K. Verma" 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="gov-label">Public Prosecutor</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCase.prosecutor" 
                  name="prosecutor" 
                  class="gov-input" 
                  placeholder="e.g. Adv. Meenakshi Sundaram" 
                />
              </div>
              <div class="form-group col-6">
                <label class="gov-label">Presiding Judge</label>
                <input 
                  type="text" 
                  [(ngModel)]="newCase.judge" 
                  name="judge" 
                  class="gov-input" 
                  placeholder="e.g. Hon'ble Justice S. K. Kaul" 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="gov-label">Case Summary & Particulars</label>
              <textarea 
                [(ngModel)]="newCase.description" 
                name="description" 
                rows="3" 
                class="gov-input" 
                placeholder="Brief summary of charges, key statutory sections (IPC/CrPC/IT Act), and allegations..."
              ></textarea>
            </div>

            <div *ngIf="createError" class="gov-alert gov-alert-danger">
              <span class="material-icons">error</span>
              <span>{{ createError }}</span>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="closeCreateModal()" class="gov-btn gov-btn-secondary">
                Cancel
              </button>
              <button type="submit" [disabled]="submitting" class="gov-btn gov-btn-primary">
                <span class="material-icons" *ngIf="!submitting">check_circle</span>
                <span *ngIf="submitting">Registering on Ledger...</span>
                <span *ngIf="!submitting">Anchor & Register Docket</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cases-page {
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
      font-weight: 700;
      color: #64748b;
      margin-bottom: 4px;
      letter-spacing: 0.05em;
    }

    .separator {
      color: #94a3b8;
    }

    .page-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 13px;
      color: #475569;
      margin: 0;
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

      input {
        padding-left: 38px;
        width: 100%;
      }
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-wrap: wrap;

      select {
        min-width: 160px;
      }
    }

    .summary-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
      font-size: 13px;
      color: #475569;
    }

    .table-card {
      padding: 0;
      overflow: hidden;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .case-num {
      font-weight: 700;
      color: #1e3a8a;
      font-size: 13px;
    }

    .fir-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;

      .material-icons {
        font-size: 13px;
      }
    }

    .case-title-cell {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: 2px;
    }

    .title-link {
      font-weight: 700;
      color: #0f172a;
      text-decoration: none;
      font-size: 14px;
      transition: color var(--transition-fast);

      &:hover {
        color: #1e40af;
        text-decoration: underline;
      }
    }

    .case-type-pill {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: var(--radius-sm);
      color: #1e40af;
      text-transform: uppercase;
      font-family: var(--font-mono);
    }

    .case-desc-preview {
      font-size: 12px;
      color: #64748b;
      max-width: 320px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .court-cell {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .station-cell {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }

    .personnel-pill {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #334155;
      margin-bottom: 2px;

      .material-icons {
        font-size: 13px;
        color: #64748b;
      }

      &.judge .material-icons {
        color: #d97706;
      }
    }

    .date-cell {
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
    }

    .time-cell {
      font-size: 11px;
      color: #64748b;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
    }

    .empty-state {
      padding: var(--space-8);
      text-align: center;

      .empty-icon {
        font-size: 48px;
        color: #94a3b8;
        margin-bottom: var(--space-2);
      }

      h3 {
        color: #0f172a;
        margin-bottom: 4px;
      }

      p {
        color: #64748b;
        font-size: 13px;
      }
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

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      padding: var(--space-4);
    }

    .modal-dialog {
      width: 100%;
      max-width: 720px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 0;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 12px 12px 0 0;
    }

    .modal-title-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-3);

      .emblem-icon {
        color: #d97706;
        font-size: 24px;
      }

      h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
        color: #0f172a;
      }
    }

    .close-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: var(--radius-sm);

      &:hover {
        color: #0f172a;
        background: #e2e8f0;
      }
    }

    .modal-body {
      padding: var(--space-6);
    }

    .form-row {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);

      .col-12 { flex: 1 1 100%; }
      .col-6 { flex: 1 1 50%; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--space-4);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid #e2e8f0;
      margin-top: var(--space-4);
    }
  `]
})
export class CaseListComponent implements OnInit {
  cases = signal<LegalCase[]>([]);
  loading = signal<boolean>(true);
  searchQuery = '';
  statusFilter = 'ALL';
  priorityFilter = 'ALL';

  showCreateModal = false;
  submitting = false;
  createError = '';

  newCase: CreateCaseRequest = {
    title: '',
    firNumber: '',
    courtName: '',
    policeStation: '',
    caseType: 'CRIMINAL',
    description: '',
    priority: 'HIGH',
    assignedOfficer: '',
    prosecutor: '',
    judge: ''
  };

  filteredCases = computed(() => {
    let list = this.cases();
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      list = list.filter(c =>
        c.caseNumber?.toLowerCase().includes(query) ||
        c.title?.toLowerCase().includes(query) ||
        c.firNumber?.toLowerCase().includes(query) ||
        c.courtName?.toLowerCase().includes(query) ||
        c.policeStation?.toLowerCase().includes(query)
      );
    }

    if (this.statusFilter !== 'ALL') {
      list = list.filter(c => c.status === this.statusFilter);
    }

    if (this.priorityFilter !== 'ALL') {
      list = list.filter(c => c.priority === this.priorityFilter);
    }

    return list;
  });

  constructor(
    private caseService: CaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.loading.set(true);
    this.caseService.getAllCases().subscribe({
      next: (res) => {
        this.cases.set(res || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading cases', err);
        this.loading.set(false);
      }
    });
  }

  canCreateCase(): boolean {
    return this.authService.hasRole('SUPER_ADMIN') ||
           this.authService.hasRole('INVESTIGATING_OFFICER') ||
           this.authService.hasRole('COURT_STAFF');
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'ALL';
    this.priorityFilter = 'ALL';
  }

  openCreateModal(): void {
    this.createError = '';
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  submitCreateCase(): void {
    if (!this.newCase.title || !this.newCase.firNumber || !this.newCase.courtName || !this.newCase.policeStation) {
      this.createError = 'Please fill in all mandatory docket particulars.';
      return;
    }

    this.submitting = true;
    this.createError = '';

    this.caseService.createCase(this.newCase).subscribe({
      next: (created) => {
        this.submitting = false;
        this.closeCreateModal();
        this.loadCases();
        // Reset form
        this.newCase = {
          title: '',
          firNumber: '',
          courtName: '',
          policeStation: '',
          caseType: 'CRIMINAL',
          description: '',
          priority: 'HIGH',
          assignedOfficer: '',
          prosecutor: '',
          judge: ''
        };
      },
      error: (err) => {
        this.submitting = false;
        this.createError = err.error?.message || 'Failed to create case. Please verify credentials.';
      }
    });
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'OPEN': return 'badge-status-open';
      case 'UNDER_INVESTIGATION': return 'badge-status-investigation';
      case 'UNDER_REVIEW': return 'badge-status-review';
      case 'IN_COURT': return 'badge-status-incourt';
      case 'CLOSED': return 'badge-status-closed';
      default: return 'badge-neutral';
    }
  }

  getPriorityBadgeClass(priority?: string): string {
    switch (priority) {
      case 'CRITICAL': return 'badge-priority-critical';
      case 'HIGH': return 'badge-priority-high';
      case 'MEDIUM': return 'badge-priority-medium';
      case 'LOW': return 'badge-priority-low';
      default: return 'badge-neutral';
    }
  }
}
