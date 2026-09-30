import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvidenceService } from '../../core/services/evidence.service';
import { Evidence, ChainOfCustodyEvent } from '../../core/models/evidence.model';

@Component({
  selector: 'app-evidence-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="evidence-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <span>DASHBOARD</span>
            <span class="separator">/</span>
            <span class="active">EVIDENCE REGISTRY</span>
          </div>
          <h1 class="page-title">Forensic & Physical Evidence Locker</h1>
          <p class="page-subtitle">Chain-of-custody tracking with tamper-evident seal verification and forensic lifecycle logs</p>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="filter-toolbar gov-card">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search by Item Number, Barcode, Exhibit Name, Custodian or Locker..." 
            class="gov-input"
          />
        </div>

        <div class="filter-group">
          <select [(ngModel)]="categoryFilter" class="gov-select">
            <option value="ALL">All Categories</option>
            <option value="DIGITAL_STORAGE">Digital Storage (Phones, HDDs)</option>
            <option value="WEAPON">Weapons / Ballistics</option>
            <option value="DOCUMENT">Physical Documents</option>
            <option value="BIOLOGICAL">Biological / DNA</option>
            <option value="CURRENCY">Seized Currency</option>
            <option value="NARCOTICS">Contraband</option>
            <option value="OTHER">Other Exhibits</option>
          </select>

          <select [(ngModel)]="sealFilter" class="gov-select">
            <option value="ALL">All Seal States</option>
            <option value="INTACT">Seal Intact</option>
            <option value="COMPROMISED">Seal Compromised</option>
          </select>

          <button (click)="resetFilters()" class="gov-btn gov-btn-secondary">
            <span class="material-icons">filter_alt_off</span>
            Reset
          </button>
        </div>
      </div>

      <div class="summary-bar">
        <span class="text-secondary text-sm">Tracking <strong>{{ filteredEvidence().length }}</strong> registered forensic exhibits</span>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading-state gov-card">
        <div class="spinner"></div>
        <p>Loading physical evidence logs and custody seals...</p>
      </div>

      <!-- Table View -->
      <div *ngIf="!loading()" class="gov-card table-card">
        <div class="table-responsive">
          <table class="gov-table">
            <thead>
              <tr>
                <th>ITEM NUMBER / BARCODE</th>
                <th>EXHIBIT PARTICULARS</th>
                <th>CATEGORY</th>
                <th>CURRENT CUSTODIAN & LOCATION</th>
                <th>COLLECTION DETAILS</th>
                <th>SEAL INTEGRITY</th>
                <th style="text-align: right;">CUSTODY CHAIN</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ev of filteredEvidence()" class="hover-row">
                <td>
                  <div class="item-number font-mono">{{ ev.itemNumber }}</div>
                  <div class="barcode-pill font-mono">{{ ev.barcode || ('BC-' + ev.id) }}</div>
                </td>

                <td>
                  <div class="evidence-name">{{ ev.name }}</div>
                  <div class="text-xs text-muted">
                    {{ ev.description | slice:0:70 }}{{ (ev.description.length || 0) > 70 ? '...' : '' }}
                  </div>
                </td>

                <td>
                  <span class="type-pill">{{ ev.category }}</span>
                </td>

                <td>
                  <div class="custodian-cell">
                    <span class="material-icons">badge</span>
                    <span>{{ ev.currentCustodian }}</span>
                  </div>
                  <div class="text-xs text-secondary">{{ ev.storageLocation }}</div>
                </td>

                <td>
                  <div class="text-xs text-collection">{{ ev.collectionLocation }}</div>
                  <div class="text-xs text-muted font-mono">{{ ev.collectedAt | date:'dd MMM yyyy' }}</div>
                </td>

                <td>
                  <span class="badge" [ngClass]="ev.sealIntact ? 'badge-success' : 'badge-danger'">
                    <span class="material-icons text-xs">{{ ev.sealIntact ? 'verified' : 'gpp_bad' }}</span>
                    {{ ev.sealIntact ? 'INTACT' : 'COMPROMISED' }}
                  </span>
                </td>

                <td style="text-align: right;">
                  <button (click)="viewCustody(ev)" class="gov-btn gov-btn-secondary btn-xs">
                    <span class="material-icons">timeline</span>
                    <span>View Chain</span>
                  </button>
                </td>
              </tr>

              <tr *ngIf="filteredEvidence().length === 0">
                <td colspan="7" class="empty-cell">
                  <div class="empty-state">
                    <span class="material-icons">inventory_2</span>
                    <h4>No evidence items match your filters</h4>
                    <p>Evidence registered in case dockets will automatically show up here.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Custody Timeline Modal -->
      <div class="modal-backdrop" *ngIf="selectedEvidence">
        <div class="modal-dialog gov-card" style="max-width: 720px;">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="material-icons emblem-icon">timeline</span>
              <div>
                <h2>Chain of Custody: {{ selectedEvidence.name }}</h2>
                <span class="font-mono text-xs text-gold-400">{{ selectedEvidence.itemNumber }}</span>
              </div>
            </div>

            <button (click)="selectedEvidence = null" class="close-btn">
              <span class="material-icons">close</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="custody-timeline">
              <div *ngFor="let event of selectedCustodyEvents; let i = index" class="timeline-step">
                <div class="timeline-marker">
                  <span class="step-num">{{ i + 1 }}</span>
                  <div class="line" *ngIf="i < selectedCustodyEvents.length - 1"></div>
                </div>

                <div class="timeline-content gov-card">
                  <div class="event-top">
                    <h4>{{ event.action }}</h4>
                    <span class="font-mono text-xs text-slate-400">
                      {{ event.timestamp | date:'dd MMM yyyy, HH:mm' }} IST
                    </span>
                  </div>

                  <div class="text-xs text-slate-300">
                    <strong>Custodian:</strong> {{ event.actor }} ({{ event.actorRole }})
                  </div>

                  <div class="text-xs text-slate-400 mt-1" *ngIf="event.fromLocation && event.toLocation">
                    <strong>Transit:</strong> {{ event.fromLocation }} → {{ event.toLocation }}
                  </div>

                  <p class="text-xs text-slate-300 mt-2" *ngIf="event.remarks">
                    {{ event.remarks }}
                  </p>

                  <div class="font-mono text-xs text-gold-400 mt-2" *ngIf="event.verificationHash">
                    Digest: {{ event.verificationHash | slice:0:32 }}...
                  </div>
                </div>
              </div>

              <div *ngIf="selectedCustodyEvents.length === 0" class="empty-state">
                <span class="material-icons">info</span>
                <p>Initial seizure record anchored. No subsequent handovers recorded yet.</p>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button (click)="selectedEvidence = null" class="gov-btn gov-btn-secondary">
              Close Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .evidence-page {
      padding: var(--space-6);
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-6);
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

    .separator {
      color: var(--color-slate-600);
    }

    .page-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 13px;
      color: #475569;
      margin: 0;
    }

    .item-number {
      color: #1e3a8a;
      font-weight: 700;
      font-size: 13px;
    }

    .evidence-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }

    .text-collection {
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
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
      margin-bottom: var(--space-3);
      color: #475569;
    }

    .table-card {
      padding: 0;
      overflow: hidden;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .barcode-pill {
      font-size: 10px;
      color: #64748b;
      letter-spacing: 0.05em;
    }

    .type-pill {
      font-size: 10px;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 2px 6px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: var(--radius-sm);
      color: #1e40af;
    }

    .custodian-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #0f172a;
      font-weight: 600;

      .material-icons {
        font-size: 14px;
        color: #d97706;
      }
    }

    .btn-xs {
      padding: 4px 10px;
      font-size: 11px;

      .material-icons {
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
      to {
        transform: rotate(360deg);
      }
    }

    .empty-state {
      padding: var(--space-8);
      text-align: center;
      color: #64748b;

      .material-icons {
        font-size: 40px;
        color: #94a3b8;
        margin-bottom: 4px;
      }

      h4 {
        color: #0f172a;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 12px;
        margin: 0;
      }
    }

    /* Modal & Timeline */
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
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 0;
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

      h2 {
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
      }
    }

    .close-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;

      &:hover {
        color: #0f172a;
      }
    }

    .modal-body {
      padding: var(--space-6);
      max-height: 70vh;
      overflow-y: auto;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid #e2e8f0;
    }

    .custody-timeline {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding-left: var(--space-2);
    }

    .timeline-step {
      display: flex;
      gap: var(--space-4);
      position: relative;
    }

    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 28px;

      .step-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--color-navy-700);
        border: 2px solid var(--color-gold-500);
        color: var(--color-gold-400);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        font-family: var(--font-mono);
      }

      .line {
        flex: 1;
        width: 2px;
        background: var(--color-slate-700);
        margin: 4px 0;
      }
    }

    .timeline-content {
      flex: 1;
      padding: var(--space-4);
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--color-slate-700);
    }

    .event-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);

      h4 {
        margin: 0;
        font-size: 13px;
        color: var(--color-slate-100);
      }
    }
  `]
})
export class EvidenceListComponent implements OnInit {
  evidenceList = signal<Evidence[]>([]);
  loading = signal<boolean>(true);
  searchQuery = '';
  categoryFilter = 'ALL';
  sealFilter = 'ALL';

  selectedEvidence: Evidence | null = null;
  selectedCustodyEvents: ChainOfCustodyEvent[] = [];

  filteredEvidence = computed(() => {
    let list = this.evidenceList();
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      list = list.filter(e =>
        e.itemNumber?.toLowerCase().includes(query) ||
        e.barcode?.toLowerCase().includes(query) ||
        e.name?.toLowerCase().includes(query) ||
        e.currentCustodian?.toLowerCase().includes(query) ||
        e.storageLocation?.toLowerCase().includes(query)
      );
    }

    if (this.categoryFilter !== 'ALL') {
      list = list.filter(e => e.category === this.categoryFilter);
    }

    if (this.sealFilter !== 'ALL') {
      const intact = this.sealFilter === 'INTACT';
      list = list.filter(e => e.sealIntact === intact);
    }

    return list;
  });

  constructor(private evidenceService: EvidenceService) {}

  ngOnInit(): void {
    this.loadEvidence();
  }

  loadEvidence(): void {
    this.loading.set(true);
    this.evidenceService.getAllEvidence().subscribe({
      next: (list) => {
        this.evidenceList.set(list || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.categoryFilter = 'ALL';
    this.sealFilter = 'ALL';
  }

  viewCustody(ev: Evidence): void {
    this.selectedEvidence = ev;
    this.selectedCustodyEvents = [];
    this.evidenceService.getCustodyHistory(ev.id).subscribe({
      next: (events) => {
        this.selectedCustodyEvents = events || [];
      }
    });
  }
}