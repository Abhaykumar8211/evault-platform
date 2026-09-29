import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';
import { VerificationService } from '../../core/services/verification.service';
import { ShareService } from '../../core/services/share.service';
import { LegalDocument } from '../../core/models/document.model';
import { VerificationResult } from '../../core/models/verification.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="documents-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <span>DASHBOARD</span>
            <span class="separator">/</span>
            <span class="active">DOCUMENT VAULT</span>
          </div>
          <h1 class="page-title">Digital Evidence & Document Archive</h1>
          <p class="page-subtitle">Central repository of all notarized FIRs, chargesheets, forensics, and court orders</p>
        </div>

        <div class="header-actions">
          <a routerLink="/verification" class="gov-btn gov-btn-secondary">
            <span class="material-icons">verified</span>
            Independent Hash Verifier
          </a>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="filter-toolbar gov-card">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search by title, file name, SHA-256 hash or CID..." 
            class="gov-input"
          />
        </div>

        <div class="filter-group">
          <select [(ngModel)]="typeFilter" class="gov-select">
            <option value="ALL">All Document Types</option>
            <option value="FIR">FIR (First Info Report)</option>
            <option value="CHARGE_SHEET">Police Charge Sheet</option>
            <option value="COURT_ORDER">Court Order / Judgment</option>
            <option value="FORENSIC_REPORT">Forensic Lab Report</option>
            <option value="WITNESS_STATEMENT">Witness Statement</option>
            <option value="DIGITAL_EVIDENCE">Digital Evidence</option>
            <option value="OTHER">Other Exhibits</option>
          </select>

          <select [(ngModel)]="statusFilter" class="gov-select">
            <option value="ALL">All Ledger Statuses</option>
            <option value="VERIFIED">Verified (Match 100%)</option>
            <option value="ANCHORED">Anchored on Chain</option>
            <option value="TAMPERED">Tamper Alert</option>
          </select>

          <button (click)="resetFilters()" class="gov-btn gov-btn-secondary">
            <span class="material-icons">filter_alt_off</span>
            Reset
          </button>
        </div>
      </div>

      <!-- Summary Bar -->
      <div class="summary-bar">
        <span class="text-secondary text-sm">Displaying <strong>{{ filteredDocs().length }}</strong> legal documents across all court dockets</span>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading-state gov-card">
        <div class="spinner"></div>
        <p>Loading document ledger records...</p>
      </div>

      <!-- Table View -->
      <div *ngIf="!loading()" class="gov-card table-card">
        <div class="table-responsive">
          <table class="gov-table">
            <thead>
              <tr>
                <th>DOCUMENT NAME & TYPE</th>
                <th>CASE NUMBER</th>
                <th>FILE SPECS</th>
                <th>SHA-256 INTEGRITY DIGEST</th>
                <th>DECENTRALIZED IPFS CID</th>
                <th>LEDGER STATUS</th>
                <th style="text-align: right;">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of filteredDocs()" class="hover-row">
                <td>
                  <div class="doc-title">{{ doc.title }}</div>
                  <span class="doc-badge">{{ doc.documentType }}</span>
                </td>
                <td>
                  <a [routerLink]="['/cases', doc.legalCaseId || doc.caseId]" class="case-link font-mono">
                    {{ doc.caseNumber || ('CASE #' + (doc.legalCaseId || doc.caseId)) }}
                  </a>
                </td>
                <td>
                  <div class="doc-file-name font-mono">{{ doc.fileName }}</div>
                  <div class="text-xs text-muted">{{ formatBytes(doc.fileSize) }}</div>
                </td>
                <td>
                  <div class="hash-box font-mono" title="{{ doc.sha256Hash }}">
                    <span>{{ doc.sha256Hash | slice:0:10 }}...{{ doc.sha256Hash | slice:-6 }}</span>
                    <button (click)="copyText(doc.sha256Hash)" class="icon-btn" title="Copy Hash">
                      <span class="material-icons">content_copy</span>
                    </button>
                  </div>
                </td>
                <td>
                  <div class="cid-box font-mono" title="{{ doc.ipfsCid }}">
                    <span>{{ doc.ipfsCid | slice:0:8 }}...{{ doc.ipfsCid | slice:-6 }}</span>
                    <button (click)="copyText(doc.ipfsCid)" class="icon-btn" title="Copy CID">
                      <span class="material-icons">content_copy</span>
                    </button>
                  </div>
                </td>
                <td>
                  <span class="badge badge-success" *ngIf="doc.verificationStatus === 'VERIFIED'">
                    <span class="material-icons text-xs">verified</span> VERIFIED
                  </span>
                  <span class="badge badge-danger" *ngIf="doc.verificationStatus === 'TAMPERED'">
                    <span class="material-icons text-xs">warning</span> TAMPERED
                  </span>
                  <span class="badge badge-neutral" *ngIf="doc.verificationStatus !== 'VERIFIED' && doc.verificationStatus !== 'TAMPERED'">
                    <span class="material-icons text-xs">history</span> ANCHORED
                  </span>
                </td>
                <td style="text-align: right;">
                  <div class="actions-group">
                    <button (click)="verifyDoc(doc)" class="gov-btn gov-btn-secondary btn-xs" title="Verify Integrity">
                      <span class="material-icons">security</span>
                      Verify
                    </button>
                    <button (click)="downloadDoc(doc)" class="gov-btn gov-btn-secondary btn-xs" title="Download Document">
                      <span class="material-icons">download</span>
                    </button>
                    <button (click)="shareDoc(doc)" class="gov-btn gov-btn-secondary btn-xs" title="Share">
                      <span class="material-icons">share</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="filteredDocs().length === 0">
                <td colspan="7" class="empty-cell">
                  <div class="empty-state">
                    <span class="material-icons">search_off</span>
                    <h4>No legal documents found matching criteria</h4>
                    <p>Try resetting filters or checking other case dockets.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Verification Modal -->
      <div class="modal-backdrop" *ngIf="verificationResult">
        <div class="modal-dialog gov-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="material-icons" [ngClass]="verificationResult.verified ? 'text-success' : 'text-danger'">
                {{ verificationResult.verified ? 'verified_user' : 'gpp_bad' }}
              </span>
              <h2>{{ verificationResult.verified ? 'Document Integrity Confirmed' : 'Tamper Detection Warning!' }}</h2>
            </div>
            <button (click)="verificationResult = null" class="close-btn">
              <span class="material-icons">close</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="gov-alert" [ngClass]="verificationResult.verified ? 'gov-alert-success' : 'gov-alert-danger'">
              <span class="material-icons">{{ verificationResult.verified ? 'check_circle' : 'report' }}</span>
              <div>
                <strong>{{ verificationResult.verified ? 'SHA-256 Bitwise Parity: 100% MATCH' : 'HASH MISMATCH DETECTED' }}</strong>
                <p>{{ verificationResult.message }}</p>
              </div>
            </div>

            <div class="summary-list">
              <div class="summary-row">
                <span class="key">Current SHA-256 Hash</span>
                <span class="val font-mono text-xs">{{ verificationResult.calculatedHash }}</span>
              </div>
              <div class="summary-row" *ngIf="verificationResult.originalHash">
                <span class="key">Blockchain Anchored Hash</span>
                <span class="val font-mono text-xs text-gold-400">{{ verificationResult.originalHash }}</span>
              </div>
              <div class="summary-row" *ngIf="verificationResult.ipfsCid">
                <span class="key">Decentralized IPFS CID</span>
                <span class="val font-mono text-xs">{{ verificationResult.ipfsCid }}</span>
              </div>
              <div class="summary-row" *ngIf="verificationResult.blockchainTxHash">
                <span class="key">Ethereum Anchor Tx</span>
                <span class="val font-mono text-xs">{{ verificationResult.blockchainTxHash }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button (click)="verificationResult = null" class="gov-btn gov-btn-secondary">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-page {
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

    .doc-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }

    .doc-file-name {
      font-size: 11px;
      color: #475569;
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

    .doc-badge {
      display: inline-block;
      font-size: 10px;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 2px 6px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: var(--radius-sm);
      color: #1e40af;
      margin-top: 2px;
    }

    .case-link {
      color: #1e3a8a;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;

      &:hover { color: #1e40af; text-decoration: underline; }
    }

    .hash-box, .cid-box {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #1e3a8a;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .icon-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;

      .material-icons { font-size: 13px; }
      &:hover { color: #0f172a; }
    }

    .actions-group {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }

    .btn-xs {
      padding: 4px 8px;
      font-size: 11px;
      .material-icons { font-size: 13px; }
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

    .empty-state {
      padding: var(--space-8);
      text-align: center;
      color: #64748b;

      .material-icons { font-size: 40px; color: #94a3b8; margin-bottom: 4px; }
      h4 { color: #0f172a; margin: 0 0 4px 0; }
      p { font-size: 12px; margin: 0; }
    }

    /* Modal */
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
      max-width: 600px;
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
      h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }
    }

    .close-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      &:hover { color: #0f172a; }
    }

    .modal-body { padding: var(--space-6); }

    .summary-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-top: var(--space-4);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;
      .key { color: #64748b; }
      .val { color: #0f172a; font-weight: 600; }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--color-slate-700);
    }
  `]
})
export class DocumentListComponent implements OnInit {
  documents = signal<LegalDocument[]>([]);
  loading = signal<boolean>(true);
  searchQuery = '';
  typeFilter = 'ALL';
  statusFilter = 'ALL';

  verificationResult: VerificationResult | null = null;

  filteredDocs = computed(() => {
    let list = this.documents();
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      list = list.filter(d =>
        d.title?.toLowerCase().includes(query) ||
        d.fileName?.toLowerCase().includes(query) ||
        d.sha256Hash?.toLowerCase().includes(query) ||
        d.ipfsCid?.toLowerCase().includes(query) ||
        d.caseNumber?.toLowerCase().includes(query)
      );
    }

    if (this.typeFilter !== 'ALL') {
      list = list.filter(d => d.documentType === this.typeFilter);
    }

    if (this.statusFilter !== 'ALL') {
      if (this.statusFilter === 'VERIFIED') {
        list = list.filter(d => d.verificationStatus === 'VERIFIED');
      } else if (this.statusFilter === 'TAMPERED') {
        list = list.filter(d => d.verificationStatus === 'TAMPERED');
      } else if (this.statusFilter === 'ANCHORED') {
        list = list.filter(d => d.verificationStatus !== 'VERIFIED' && d.verificationStatus !== 'TAMPERED');
      }
    }

    return list;
  });

  constructor(
    private documentService: DocumentService,
    private verificationService: VerificationService,
    private shareService: ShareService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading.set(true);
    this.documentService.getAllDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.typeFilter = 'ALL';
    this.statusFilter = 'ALL';
  }

  verifyDoc(doc: LegalDocument): void {
    this.verificationService.verifyDocument(doc.id).subscribe({
      next: (res) => this.verificationResult = res,
      error: (err) => alert('Verification failed: ' + (err.error?.message || 'Server error'))
    });
  }

  downloadDoc(doc: LegalDocument): void {
    this.documentService.downloadDocument(doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Download failed.')
    });
  }

  shareDoc(doc: LegalDocument): void {
    this.shareService.createShareLink(doc.id, 48).subscribe({
      next: (link) => {
        const fullUrl = `${window.location.origin}/verify/share/${link.token}`;
        navigator.clipboard.writeText(fullUrl);
        alert(`Secure Court Share Link Generated!\n\n${fullUrl}\n\nCopied to clipboard.`);
      },
      error: () => alert('Failed to generate share link.')
    });
  }

  copyText(text?: string): void {
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Copied: ' + text);
    }
  }

  formatBytes(bytes?: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
