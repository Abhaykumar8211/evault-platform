import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerificationService } from '../../core/services/verification.service';
import { DocumentService } from '../../core/services/document.service';
import { LegalDocument } from '../../core/models/document.model';
import { DocumentVerificationResult, TamperIncident } from '../../core/models/verification.model';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="verification-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <span>JUDICIAL DASHBOARD</span>
          <span class="separator">/</span>
          <span class="active">INTEGRITY ADJUDICATION</span>
        </div>
        <h1 class="page-title">Cryptographic Document & Evidence Verifier</h1>
        <p class="page-subtitle">Verify bitwise document integrity against decentralized IPFS nodes and Ethereum smart contract anchors</p>
      </div>

      <!-- Quick Demo / Simulation Banner -->
      <div class="demo-banner gov-card">
        <div class="demo-banner-content">
          <div class="demo-badge">
            <span class="material-icons">security</span>
            <span>INTEGRITY VERIFICATION SUITE</span>
          </div>
          <h3>Simulate Zero-Knowledge Document Verification & Tamper Detection</h3>
          <p>
            Test how the vault validates genuine dockets or catches even a single byte modification using SHA-256 fingerprinting and blockchain consensus.
          </p>
        </div>
        <div class="demo-actions">
          <button (click)="runAuthenticSimulation()" [disabled]="verifying" class="action-sim-btn btn-sim-success">
            <span class="material-icons">verified_user</span>
            <span>Verify Authentic FIR (Match)</span>
          </button>
          <button (click)="runTamperedSimulation()" [disabled]="verifying" class="action-sim-btn btn-sim-danger">
            <span class="material-icons">gpp_bad</span>
            <span>Simulate Tampered File (Alert)</span>
          </button>
        </div>
      </div>

      <div class="main-layout-grid">
        <!-- Left Column: Upload Form -->
        <div class="gov-card upload-section">
          <div class="section-head">
            <h3>Upload Legal Document for Inspection</h3>
            <span class="badge badge-info">SHA-256 ENGINE</span>
          </div>

          <!-- Drag and Drop Zone -->
          <div 
            class="drop-zone" 
            [class.drag-over]="isDragOver"
            (dragover)="onDragOver($event)" 
            (dragleave)="onDragLeave($event)" 
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <input 
              #fileInput 
              type="file" 
              (change)="onFileSelected($event)" 
              style="display: none;" 
            />
            
            <div class="drop-zone-inner">
              <div class="icon-circle">
                <span class="material-icons drop-icon" [ngClass]="selectedFile ? 'text-primary' : 'text-muted'">
                  {{ selectedFile ? 'task' : 'cloud_upload' }}
                </span>
              </div>

              <div *ngIf="!selectedFile">
                <div class="drop-text-primary">Drag & drop court document or click to browse</div>
                <div class="drop-text-sub">Supports PDF, DOCX, PNG, JPG, TXT up to 50MB</div>
              </div>

              <div *ngIf="selectedFile" class="selected-file-meta">
                <div class="file-name font-mono">{{ selectedFile.name }}</div>
                <div class="file-size font-mono">{{ formatBytes(selectedFile.size) }}</div>
                <div class="client-hash font-mono" *ngIf="clientCalculatedHash">
                  <span class="hash-tag">Calculated SHA-256:</span>
                  <span>{{ clientCalculatedHash }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Optional Target Document Selection -->
          <div class="form-group mt-4">
            <label class="gov-label">Compare Against Specific Docket Document (Optional):</label>
            <select [(ngModel)]="selectedTargetDocId" class="gov-select">
              <option [ngValue]="null">Auto-Match (Search entire ledger by SHA-256 hash)</option>
              <option *ngFor="let doc of existingDocs()" [ngValue]="doc.id">
                #{{ doc.id }} - {{ doc.title }} ({{ doc.documentType }})
              </option>
            </select>
          </div>

          <button 
            (click)="executeVerification()" 
            [disabled]="!selectedFile || verifying" 
            class="gov-btn gov-btn-primary btn-block mt-4"
          >
            @if (verifying) {
              <div class="spinner-sm"></div>
              <span>Querying Blockchain & IPFS...</span>
            } @else {
              <span class="material-icons">search_check</span>
              <span>Execute Cryptographic Verification</span>
            }
          </button>
        </div>

        <!-- Right Column: Verification Result View -->
        <div class="gov-card result-section">
          <div class="section-head">
            <h3>Integrity Adjudication Report</h3>
            <span class="badge" [ngClass]="getResultBadgeClass()">
              {{ result() ? result()?.status : 'AWAITING INSPECTION' }}
            </span>
          </div>

          <!-- Placeholder when no verification yet -->
          <div *ngIf="!result() && !verifying" class="placeholder-state">
            <div class="placeholder-icon-wrap">
              <span class="material-icons placeholder-icon">fingerprint</span>
            </div>
            <h4>Ready to Verify Document Integrity</h4>
            <p>Select a file from your computer or click one of the automated simulation buttons above to check bitwise hash validity.</p>
          </div>

          <!-- Loading state -->
          <div *ngIf="verifying" class="loading-state">
            <div class="spinner"></div>
            <h4>Querying On-Chain Document Registry</h4>
            <p>Computing SHA-256 digest • Checking DocumentRegistry.sol contract • Validating IPFS cluster availability...</p>
          </div>

          <!-- VERIFIED RESULT -->
          <div *ngIf="result() && result()?.status === 'VERIFIED'" class="verif-report">
            <div class="verif-banner banner-success">
              <div class="icon-wrap">
                <span class="material-icons">verified</span>
              </div>
              <div class="banner-body">
                <h3 class="banner-title">DOCUMENT INTEGRITY VERIFIED</h3>
                <p class="banner-desc">{{ result()?.message }}</p>
              </div>
            </div>

            <div class="audit-details">
              <div class="detail-row">
                <span class="key">Associated Docket</span>
                <span class="val font-semibold">{{ result()?.caseNumber || 'N/A' }} — {{ result()?.documentTitle }}</span>
              </div>

              <div class="detail-row">
                <span class="key">Bitwise Hash Parity</span>
                <span class="val text-success font-bold font-mono">✓ 100% MATCH (ZERO MODIFICATIONS)</span>
              </div>

              <div class="detail-row">
                <span class="key">Computed SHA-256</span>
                <span class="val font-mono text-xs word-break">{{ result()?.computedHash }}</span>
              </div>

              <div class="detail-row">
                <span class="key">Anchored Ledger Hash</span>
                <span class="val font-mono text-xs text-primary word-break">{{ result()?.originalHash }}</span>
              </div>

              <div class="detail-row">
                <span class="key">IPFS Cluster Storage</span>
                <span class="val font-mono text-xs">
                  <span class="material-icons text-xs text-success">cloud_done</span>
                  CID: {{ result()?.ipfsCid }} (Pinned)
                </span>
              </div>

              <div class="detail-row" *ngIf="result()?.transactionHash">
                <span class="key">Ethereum Anchor Tx</span>
                <span class="val font-mono text-xs text-primary word-break">{{ result()?.transactionHash }}</span>
              </div>

              <div class="detail-row" *ngIf="result()?.contractAddress">
                <span class="key">Solidity Contract</span>
                <span class="val font-mono text-xs">{{ result()?.contractAddress }}</span>
              </div>

              <div class="detail-row">
                <span class="key">Adjudication Timestamp</span>
                <span class="val font-mono text-xs">{{ result()?.verifiedAt | date:'dd MMM yyyy, HH:mm:ss' }} IST</span>
              </div>
            </div>
          </div>

          <!-- TAMPER DETECTED RESULT -->
          <div *ngIf="result() && result()?.status === 'TAMPER_DETECTED'" class="verif-report">
            <div class="verif-banner banner-danger">
              <div class="icon-wrap">
                <span class="material-icons">gpp_bad</span>
              </div>
              <div class="banner-body">
                <h3 class="banner-title text-danger">CRITICAL: INTEGRITY TAMPER DETECTED!</h3>
                <p class="banner-desc">{{ result()?.message }}</p>
              </div>
            </div>

            <div class="tamper-alert-box">
              <span class="material-icons">warning</span>
              <div>
                <strong>Judicial Advisory:</strong> This document does NOT match the immutable cryptographic record anchored on the blockchain. A tamper incident has been recorded in the audit trail.
              </div>
            </div>

            <div class="audit-details">
              <div class="detail-row">
                <span class="key">Target Case Docket</span>
                <span class="val font-semibold">{{ result()?.caseNumber || 'N/A' }} — {{ result()?.documentTitle }}</span>
              </div>

              <div class="detail-row">
                <span class="key">Tampered Copy Hash</span>
                <span class="val font-mono text-xs text-danger word-break font-bold">{{ result()?.computedHash }}</span>
              </div>

              <div class="detail-row">
                <span class="key">Original Anchored Hash</span>
                <span class="val font-mono text-xs text-success word-break font-bold">{{ result()?.originalHash }}</span>
              </div>

              <div class="detail-row">
                <span class="key">Integrity Failure</span>
                <span class="val text-danger font-bold">1 or more bytes altered or document substituted</span>
              </div>

              <div class="detail-row" *ngIf="result()?.ipfsCid">
                <span class="key">Original IPFS CID</span>
                <span class="val font-mono text-xs">{{ result()?.ipfsCid }}</span>
              </div>

              <div class="detail-row" *ngIf="result()?.transactionHash">
                <span class="key">Original Anchor Tx</span>
                <span class="val font-mono text-xs text-primary">{{ result()?.transactionHash }}</span>
              </div>

              <div class="detail-row">
                <span class="key">Incident Logged At</span>
                <span class="val font-mono text-xs">{{ result()?.verifiedAt | date:'dd MMM yyyy, HH:mm:ss' }} IST</span>
              </div>
            </div>
          </div>

          <!-- NOT FOUND RESULT -->
          <div *ngIf="result() && result()?.status === 'NOT_FOUND'" class="verif-report">
            <div class="verif-banner banner-neutral">
              <div class="icon-wrap">
                <span class="material-icons">help_outline</span>
              </div>
              <div class="banner-body">
                <h3 class="banner-title">NO BLOCKCHAIN ANCHOR FOUND</h3>
                <p class="banner-desc">{{ result()?.message }}</p>
              </div>
            </div>

            <div class="audit-details">
              <div class="detail-row">
                <span class="key">Calculated Hash</span>
                <span class="val font-mono text-xs word-break">{{ result()?.computedHash }}</span>
              </div>
              <div class="detail-row">
                <span class="key">Ledger Status</span>
                <span class="val text-warning font-semibold">Unregistered Document Fingerprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time Tamper Detection Log Table -->
      <div class="gov-card tamper-feed-section mt-6">
        <div class="section-head">
          <div class="feed-title">
            <span class="material-icons text-danger">notifications_active</span>
            <h3>System Tamper Detection Log</h3>
          </div>
          <span class="badge badge-danger">REAL-TIME SURVEILLANCE</span>
        </div>

        <div class="table-responsive">
          <table class="gov-table">
            <thead>
              <tr>
                <th>INCIDENT ID</th>
                <th>EXHIBIT / DOCUMENT</th>
                <th>DOCKET NUMBER</th>
                <th>EXPECTED HASH (LEDGER)</th>
                <th>TAMPERED HASH RECEIVED</th>
                <th>SEVERITY</th>
                <th>DETECTED TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let inc of tamperAlerts()">
                <td class="font-mono text-primary font-bold">#INC-{{ inc.id }}</td>
                <td class="font-semibold text-slate-800">{{ inc.documentTitle }}</td>
                <td class="font-mono text-xs text-slate-600">{{ inc.caseNumber || 'CASE-2026-0001' }}</td>
                <td class="font-mono text-xs text-success" title="{{ inc.expectedHash }}">
                  {{ inc.expectedHash | slice:0:10 }}...{{ inc.expectedHash | slice:-6 }}
                </td>
                <td class="font-mono text-xs text-danger" title="{{ inc.attemptedHash }}">
                  {{ inc.attemptedHash | slice:0:10 }}...{{ inc.attemptedHash | slice:-6 }}
                </td>
                <td>
                  <span class="badge badge-danger">CRITICAL</span>
                </td>
                <td class="font-mono text-xs text-slate-600">{{ inc.detectedAt | date:'dd MMM yyyy, HH:mm:ss' }}</td>
              </tr>

              <tr *ngIf="tamperAlerts().length === 0">
                <td colspan="7" class="empty-cell text-center" style="padding: 28px;">
                  <span class="text-secondary text-sm">No unauthorized tamper incidents recorded. System integrity intact.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verification-page {
      padding: 24px 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 20px;
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

    .separator { color: #cbd5e1; }
    .page-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
    .page-subtitle { font-size: 13px; color: #475569; margin: 0; }

    /* Demo Banner */
    .demo-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      margin-bottom: 24px;
      border-left: 4px solid #1e3a8a;
      background: #ffffff;
      flex-wrap: wrap;
      gap: 16px;
    }

    .demo-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-family: var(--font-mono);
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.08em;
      margin-bottom: 4px;

      .material-icons { font-size: 14px; }
    }

    .demo-banner-content {
      max-width: 650px;

      h3 { font-size: 16px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a; }
      p { font-size: 13px; color: #475569; margin: 0; line-height: 1.5; }
    }

    .demo-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-sim-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      .material-icons { font-size: 18px; }
    }

    .btn-sim-success {
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      color: #15803d;

      &:hover:not(:disabled) {
        background: #dcfce7;
        border-color: #4ade80;
        box-shadow: 0 2px 4px rgba(22, 163, 74, 0.15);
      }
    }

    .btn-sim-danger {
      background: #fef2f2;
      border: 1.5px solid #fca5a5;
      color: #b91c1c;

      &:hover:not(:disabled) {
        background: #fee2e2;
        border-color: #f87171;
        box-shadow: 0 2px 4px rgba(220, 38, 38, 0.15);
      }
    }

    /* Layout */
    .main-layout-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;

      h3 { font-size: 15px; font-weight: 700; margin: 0; color: #0f172a; }
    }

    /* Drop Zone */
    .drop-zone {
      border: 2px dashed #cbd5e1;
      border-radius: 10px;
      padding: 32px 16px;
      text-align: center;
      cursor: pointer;
      background: #f8fafc;
      transition: all 0.15s ease-in-out;

      &:hover, &.drag-over {
        border-color: #2563eb;
        background: #eff6ff;
      }
    }

    .drop-zone-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .icon-circle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .drop-icon { font-size: 28px; }
      .text-primary { color: #2563eb; }
      .text-muted { color: #64748b; }
    }

    .drop-text-primary {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }

    .drop-text-sub {
      font-size: 12px;
      color: #64748b;
    }

    .selected-file-meta {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .file-name { font-size: 13px; color: #1e3a8a; font-weight: 700; }
      .file-size { font-size: 11px; color: #64748b; }
      .client-hash {
        font-size: 11px;
        color: #1e293b;
        word-break: break-all;
        max-width: 440px;
        margin-top: 6px;
        padding: 6px 10px;
        background: #ffffff;
        border-radius: 6px;
        border: 1px solid #cbd5e1;

        .hash-tag { color: #1e3a8a; font-weight: 700; margin-right: 4px; }
      }
    }

    .btn-block {
      width: 100%;
      justify-content: center;
      padding: 12px;
      font-size: 14px;
    }

    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }

    /* Results */
    .placeholder-state {
      padding: 40px 16px;
      text-align: center;
      color: #64748b;

      .placeholder-icon-wrap {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;

        .placeholder-icon {
          font-size: 32px;
          color: #94a3b8;
        }
      }

      h4 { color: #1e293b; margin: 0 0 6px 0; font-size: 15px; }
      p { font-size: 13px; max-width: 360px; margin: 0 auto; line-height: 1.5; color: #64748b; }
    }

    .loading-state {
      padding: 40px 16px;
      text-align: center;

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e2e8f0;
        border-top-color: #1e3a8a;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px auto;
      }

      h4 { color: #0f172a; margin-bottom: 4px; }
      p { font-size: 12px; color: #64748b; max-width: 380px; margin: 0 auto; }
    }

    .verif-banner {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;

      .icon-wrap {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .material-icons { font-size: 24px; }
      }

      .banner-title { font-size: 14px; font-weight: 800; margin: 0 0 2px 0; }
      .banner-desc { font-size: 12px; margin: 0; line-height: 1.4; }
    }

    .banner-success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;

      .icon-wrap { background: #dcfce7; color: #15803d; }
      .banner-title { color: #15803d; }
      .banner-desc { color: #166534; }
    }

    .banner-danger {
      background: #fef2f2;
      border: 1px solid #fecaca;

      .icon-wrap { background: #fee2e2; color: #b91c1c; }
      .banner-title { color: #b91c1c; }
      .banner-desc { color: #991b1b; }
    }

    .banner-neutral {
      background: #f8fafc;
      border: 1px solid #e2e8f0;

      .icon-wrap { background: #f1f5f9; color: #475569; }
      .banner-title { color: #1e293b; }
      .banner-desc { color: #64748b; }
    }

    .tamper-alert-box {
      display: flex;
      gap: 12px;
      padding: 12px 14px;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 12px;
      color: #991b1b;

      .material-icons { color: #dc2626; font-size: 20px; }
    }

    .audit-details {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 12px;

      &:last-child { border-bottom: none; padding-bottom: 0; }
      .key { color: #64748b; font-weight: 500; min-width: 140px; }
      .val { color: #0f172a; text-align: right; }
    }

    .word-break { word-break: break-all; }
    .text-primary { color: #1e40af; }
    .text-success { color: #15803d; }
    .text-danger { color: #b91c1c; }

    /* Feed */
    .feed-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class VerificationComponent implements OnInit {
  selectedFile: File | null = null;
  clientCalculatedHash = '';
  selectedTargetDocId: number | null = null;
  isDragOver = false;

  verifying = false;
  result = signal<DocumentVerificationResult | null>(null);
  existingDocs = signal<LegalDocument[]>([]);
  tamperAlerts = signal<TamperIncident[]>([]);

  constructor(
    private verificationService: VerificationService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.loadDocs();
    this.loadTamperAlerts();
  }

  loadDocs(): void {
    this.documentService.getAllDocuments().subscribe({
      next: (docs) => this.existingDocs.set(docs || [])
    });
  }

  loadTamperAlerts(): void {
    this.verificationService.getTamperAlerts().subscribe({
      next: (alerts) => this.tamperAlerts.set(alerts || [])
    });
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragOver = false;
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.handleFile(e.dataTransfer.files[0]);
    }
  }

  onFileSelected(e: any): void {
    if (e.target.files && e.target.files.length > 0) {
      this.handleFile(e.target.files[0]);
    }
  }

  async handleFile(file: File): Promise<void> {
    this.selectedFile = file;
    this.result.set(null);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      this.clientCalculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      this.clientCalculatedHash = '';
    }
  }

  executeVerification(): void {
    if (!this.selectedFile) return;

    this.verifying = true;
    this.result.set(null);

    this.verificationService.verifyFile(this.selectedFile, this.selectedTargetDocId || undefined).subscribe({
      next: (res) => {
        this.verifying = false;
        this.result.set(res);
        this.loadTamperAlerts();
      },
      error: (err) => {
        this.verifying = false;
        alert('Verification request failed: ' + (err.error?.message || 'Server error'));
      }
    });
  }

  runAuthenticSimulation(): void {
    const authenticContent = "FIRST INFORMATION REPORT (Under Section 154 Cr.P.C.)\nState of Maharashtra vs. Arvind Sharma\nFIR No: FIR-2026/CYBER/402\nPolice Station: Cyber Crime Cell, BKC Mumbai\nOffence: Section 66C/66D Information Technology Act 2000, Section 420 IPC\nStatus: Certified Authentic Judicial Copy";
    const file = new File([authenticContent], "FIR_2026_CYBER_402_Certified.pdf", { type: "application/pdf" });
    
    this.handleFile(file).then(() => {
      const docs = this.existingDocs();
      if (docs.length > 0) {
        this.selectedTargetDocId = docs[0].id;
      }
      this.executeVerification();
    });
  }

  runTamperedSimulation(): void {
    const tamperedContent = "FIRST INFORMATION REPORT (Under Section 154 Cr.P.C.)\nState of Maharashtra vs. Arvind Sharma\nFIR No: FIR-2026/CYBER/402\nPolice Station: Cyber Crime Cell, BKC Mumbai\nOffence: Section 66C/66D Information Technology Act 2000, Section 420 IPC\n[TAMPERED INJECTION: Bail recommendation added without judicial authority by hostile actor]";
    const file = new File([tamperedContent], "FIR_2026_CYBER_402_AlteredCopy.pdf", { type: "application/pdf" });
    
    this.handleFile(file).then(() => {
      const docs = this.existingDocs();
      if (docs.length > 0) {
        this.selectedTargetDocId = docs[0].id;
      }
      this.executeVerification();
    });
  }

  getResultBadgeClass(): string {
    const r = this.result();
    if (!r) return 'badge-neutral';
    if (r.status === 'VERIFIED') return 'badge-success';
    if (r.status === 'TAMPER_DETECTED') return 'badge-danger';
    return 'badge-warning';
  }

  formatBytes(bytes?: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
