import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../../core/services/case.service';
import { DocumentService } from '../../core/services/document.service';
import { EvidenceService } from '../../core/services/evidence.service';
import { VerificationService } from '../../core/services/verification.service';
import { ShareService } from '../../core/services/share.service';
import { AuthService } from '../../core/services/auth.service';
import { LegalCase } from '../../core/models/case.model';
import { LegalDocument } from '../../core/models/document.model';
import { Evidence, ChainOfCustodyEvent } from '../../core/models/evidence.model';
import { VerificationResult } from '../../core/models/verification.model';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="case-detail-page" *ngIf="caseItem(); else loadingOrError">
      <!-- Breadcrumb & Navigation -->
      <div class="top-nav">
        <a routerLink="/cases" class="back-link">
          <span class="material-icons">arrow_back</span>
          <span>Back to Case Registry</span>
        </a>

        <div class="nav-actions">
          <button (click)="openUploadModal()" *ngIf="canUpload()" class="gov-btn gov-btn-primary btn-sm">
            <span class="material-icons">cloud_upload</span>
            Anchor New Document
          </button>
          <button (click)="openAddEvidenceModal()" *ngIf="canUpload()" class="gov-btn gov-btn-secondary btn-sm">
            <span class="material-icons">biotech</span>
            Register Evidence
          </button>
        </div>
      </div>

      <!-- Case Header Card -->
      <div class="case-banner gov-card">
        <div class="banner-top">
          <div class="docket-identity">
            <div class="docket-num font-mono">
              <span class="material-icons emblem">verified_user</span>
              <span>{{ caseItem()?.caseNumber }}</span>
            </div>
            <span class="badge" [ngClass]="getStatusBadgeClass(caseItem()?.status)">
              {{ caseItem()?.status }}
            </span>
            <span class="badge" [ngClass]="getPriorityBadgeClass(caseItem()?.priority)">
              {{ caseItem()?.priority }}
            </span>
            <span class="type-pill">{{ caseItem()?.caseType || 'CRIMINAL' }}</span>
          </div>

          <div class="quick-stats">
            <div class="stat-pill">
              <span class="label">DOCUMENTS</span>
              <span class="val">{{ documents().length }}</span>
            </div>
            <div class="stat-pill">
              <span class="label">EVIDENCE ITEMS</span>
              <span class="val">{{ evidenceList().length }}</span>
            </div>
            <div class="stat-pill">
              <span class="label">CHAIN INTEGRITY</span>
              <span class="val text-success">ANCHORED</span>
            </div>
          </div>
        </div>

        <h1 class="case-title">{{ caseItem()?.title }}</h1>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">FIR NUMBER</span>
            <span class="meta-val font-mono">{{ caseItem()?.firNumber }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">JURISDICTION COURT</span>
            <span class="meta-val">{{ caseItem()?.courtName }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">POLICE STATION / AUTHORITY</span>
            <span class="meta-val">{{ caseItem()?.policeStation }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">INVESTIGATING OFFICER</span>
            <span class="meta-val">{{ caseItem()?.assignedOfficer || 'Unassigned' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">PUBLIC PROSECUTOR</span>
            <span class="meta-val">{{ caseItem()?.prosecutor || 'Unassigned' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">PRESIDING JUDGE</span>
            <span class="meta-val highlight-gold">{{ caseItem()?.judge || 'Hon. Court Bench' }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-container">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab = tab.id" 
          [class.active]="activeTab === tab.id" 
          class="tab-btn"
        >
          <span class="material-icons">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span class="tab-count" *ngIf="tab.count !== undefined">{{ tab.count }}</span>
        </button>
      </div>

      <!-- TAB 1: OVERVIEW -->
      <div class="tab-content" *ngIf="activeTab === 'overview'">
        <div class="overview-grid">
          <div class="gov-card col-8">
            <h3 class="section-title">Case Summary & Charge Particulars</h3>
            <p class="case-desc-text">{{ caseItem()?.description || 'No detailed docket notes submitted at registration.' }}</p>

            <div class="legal-disclaimer-note">
              <span class="material-icons">info</span>
              <div>
                <strong>eVault Judicial Anchoring Integrity Statement:</strong> All uploaded affidavits, depositions, orders, and forensic exhibits attached to docket <code>{{ caseItem()?.caseNumber }}</code> undergo simultaneous SHA-256 cryptographic hashing, decentralized pinning on IPFS, and proof-of-existence anchoring onto the EVM smart contract ledger.
              </div>
            </div>
          </div>

          <div class="gov-card col-4">
            <h3 class="section-title">Custody & Chain Summary</h3>
            <div class="summary-list">
              <div class="summary-row">
                <span class="key">Date of Registration</span>
                <span class="val font-mono">{{ caseItem()?.createdAt | date:'dd MMM yyyy, HH:mm' }}</span>
              </div>
              <div class="summary-row">
                <span class="key">Last Ledger Update</span>
                <span class="val font-mono">{{ (caseItem()?.updatedAt || caseItem()?.createdAt) | date:'dd MMM yyyy, HH:mm' }}</span>
              </div>
              <div class="summary-row">
                <span class="key">Smart Contract Ledger</span>
                <span class="val text-success">DocumentRegistry.sol</span>
              </div>
              <div class="summary-row">
                <span class="key">IPFS Node Cluster</span>
                <span class="val">Active (Cluster Peer v0.26)</span>
              </div>
              <div class="summary-row">
                <span class="key">Security Classification</span>
                <span class="val text-warning">OFFICIAL SENSITIVE (GOV)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: DOCUMENTS -->
      <div class="tab-content" *ngIf="activeTab === 'documents'">
        <div class="gov-card" style="padding: 0;">
          <div class="card-toolbar">
            <div class="toolbar-title">
              <h3>Legal Document Vault</h3>
              <p class="text-secondary text-sm">Digitally notarized legal documents anchored to decentralized IPFS and Blockchain</p>
            </div>
            <button (click)="openUploadModal()" *ngIf="canUpload()" class="gov-btn gov-btn-primary btn-sm">
              <span class="material-icons">upload_file</span>
              Upload & Anchor File
            </button>
          </div>

          <div class="table-responsive">
            <table class="gov-table">
              <thead>
                <tr>
                  <th>DOCUMENT TITLE / TYPE</th>
                  <th>FILE PARTICULARS</th>
                  <th>CRYPTOGRAPHIC SHA-256 HASH</th>
                  <th>IPFS CID</th>
                  <th>BLOCKCHAIN TX</th>
                  <th>STATUS</th>
                  <th style="text-align: right;">VERIFICATION & ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let doc of documents()" class="hover-row">
                  <td>
                    <div class="doc-title font-semibold">{{ doc.title }}</div>
                    <span class="doc-type-badge">{{ doc.documentType }}</span>
                  </td>
                  <td>
                    <div class="font-mono text-sm text-slate-200">{{ doc.fileName }}</div>
                    <div class="text-xs text-muted">{{ formatBytes(doc.fileSize) }} • {{ doc.mimeType }}</div>
                  </td>
                  <td>
                    <div class="hash-cell font-mono" title="{{ doc.sha256Hash }}">
                      <span>{{ doc.sha256Hash | slice:0:10 }}...{{ doc.sha256Hash | slice:-8 }}</span>
                      <button (click)="copyToClipboard(doc.sha256Hash)" class="icon-btn" title="Copy Full Hash">
                        <span class="material-icons">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div class="cid-cell font-mono" title="{{ doc.ipfsCid }}">
                      <span>{{ doc.ipfsCid | slice:0:8 }}...{{ doc.ipfsCid | slice:-6 }}</span>
                      <button (click)="copyToClipboard(doc.ipfsCid)" class="icon-btn" title="Copy IPFS CID">
                        <span class="material-icons">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div class="tx-cell font-mono" *ngIf="doc.blockchainTxHash; else pendingTx" title="{{ doc.blockchainTxHash }}">
                      <span>{{ doc.blockchainTxHash | slice:0:8 }}...</span>
                      <button (click)="copyToClipboard(doc.blockchainTxHash)" class="icon-btn" title="Copy Tx Hash">
                        <span class="material-icons">content_copy</span>
                      </button>
                    </div>
                    <ng-template #pendingTx>
                      <span class="text-muted text-xs">Simulated Anchored</span>
                    </ng-template>
                  </td>
                  <td>
                    <span class="badge badge-success" *ngIf="doc.verificationStatus === 'VERIFIED'">
                      <span class="material-icons text-xs">check_circle</span> VERIFIED
                    </span>
                    <span class="badge badge-danger" *ngIf="doc.verificationStatus === 'TAMPERED'">
                      <span class="material-icons text-xs">warning</span> TAMPERED
                    </span>
                    <span class="badge badge-neutral" *ngIf="doc.verificationStatus === 'PENDING' || !doc.verificationStatus">
                      <span class="material-icons text-xs">history</span> ANCHORED
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-btn-group">
                      <button (click)="verifySingleDoc(doc)" class="gov-btn gov-btn-secondary btn-xs" title="Verify Integrity">
                        <span class="material-icons">verified</span>
                        Verify
                      </button>
                      <button (click)="downloadDoc(doc)" class="gov-btn gov-btn-secondary btn-xs" title="Download Document">
                        <span class="material-icons">download</span>
                        Download
                      </button>
                      <button (click)="openShareModal(doc)" class="gov-btn gov-btn-secondary btn-xs" title="Generate Secure Share Link">
                        <span class="material-icons">share</span>
                        Share
                      </button>
                    </div>
                  </td>
                </tr>

                <tr *ngIf="documents().length === 0">
                  <td colspan="7" class="empty-cell">
                    <div class="empty-state">
                      <span class="material-icons">cloud_off</span>
                      <h4>No documents uploaded yet</h4>
                      <p>Upload FIRs, witness testimonies, or court orders to anchor their cryptographic hash.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: EVIDENCE REGISTRY -->
      <div class="tab-content" *ngIf="activeTab === 'evidence'">
        <div class="gov-card" style="padding: 0;">
          <div class="card-toolbar">
            <div class="toolbar-title">
              <h3>Physical & Digital Evidence Registry</h3>
              <p class="text-secondary text-sm">Items of forensic or physical interest tagged with immutable custody tracking</p>
            </div>
            <button (click)="openAddEvidenceModal()" *ngIf="canUpload()" class="gov-btn gov-btn-primary btn-sm">
              <span class="material-icons">add</span>
              Register Evidence
            </button>
          </div>

          <div class="table-responsive">
            <table class="gov-table">
              <thead>
                <tr>
                  <th>ITEM NUMBER & BARCODE</th>
                  <th>EVIDENCE DESCRIPTION</th>
                  <th>CATEGORY</th>
                  <th>COLLECTION METRICS</th>
                  <th>CURRENT CUSTODIAN</th>
                  <th>SEAL INTEGRITY</th>
                  <th style="text-align: right;">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ev of evidenceList()" class="hover-row">
                  <td>
                    <div class="font-mono text-gold-400 font-bold">{{ ev.itemNumber }}</div>
                    <div class="barcode-pill font-mono">{{ ev.barcode || 'BC-' + ev.id }}</div>
                  </td>
                  <td>
                    <div class="font-semibold text-slate-100">{{ ev.name }}</div>
                    <div class="text-xs text-muted">{{ ev.description }}</div>
                  </td>
                  <td>
                    <span class="type-pill">{{ ev.category }}</span>
                  </td>
                  <td>
                    <div class="text-sm text-slate-200">{{ ev.collectionLocation }}</div>
                    <div class="text-xs text-muted">{{ ev.collectedAt | date:'dd MMM yyyy, HH:mm' }}</div>
                  </td>
                  <td>
                    <div class="custodian-cell">
                      <span class="material-icons">person_pin</span>
                      <span>{{ ev.currentCustodian }}</span>
                    </div>
                    <div class="text-xs text-secondary">{{ ev.storageLocation }}</div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="ev.sealIntact ? 'badge-success' : 'badge-danger'">
                      {{ ev.sealIntact ? 'SEAL INTACT' : 'SEAL COMPROMISED' }}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <button (click)="openCustodyTransferModal(ev)" class="gov-btn gov-btn-secondary btn-xs">
                      <span class="material-icons">swap_horiz</span>
                      Log Transfer
                    </button>
                  </td>
                </tr>

                <tr *ngIf="evidenceList().length === 0">
                  <td colspan="7" class="empty-cell">
                    <div class="empty-state">
                      <span class="material-icons">inventory_2</span>
                      <h4>No evidence items registered</h4>
                      <p>Register forensic exhibits, electronic storage devices, or weapons for custody tracking.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 4: CHAIN OF CUSTODY -->
      <div class="tab-content" *ngIf="activeTab === 'custody'">
        <div class="gov-card">
          <div class="custody-header">
            <div>
              <h3>Forensic Chain of Custody Timeline</h3>
              <p class="text-secondary text-sm">Every custody handoff, forensic extraction, and court presentation is timestamped and recorded</p>
            </div>
            <div class="badge badge-success">
              <span class="material-icons text-xs">verified</span> Cryptographically Unbroken Chain
            </div>
          </div>

          <div class="custody-timeline">
            <div *ngFor="let event of custodyEvents(); let i = index" class="timeline-step">
              <div class="timeline-marker">
                <span class="step-num">{{ i + 1 }}</span>
                <div class="line" *ngIf="i < custodyEvents().length - 1"></div>
              </div>
              <div class="timeline-content gov-card">
                <div class="event-top">
                  <div class="event-action">
                    <span class="material-icons action-icon">account_balance</span>
                    <h4>{{ event.action }}</h4>
                  </div>
                  <div class="event-time font-mono">{{ event.timestamp | date:'dd MMM yyyy, HH:mm:ss' }} IST</div>
                </div>

                <div class="custody-actors">
                  <div class="actor">
                    <span class="actor-label">OFFICER / ACTOR</span>
                    <span class="actor-val font-semibold">{{ event.actor }} ({{ event.actorRole }})</span>
                  </div>
                  <div class="actor" *ngIf="event.fromLocation && event.toLocation">
                    <span class="actor-label">TRANSFER ROUTE</span>
                    <span class="actor-val">{{ event.fromLocation }} → {{ event.toLocation }}</span>
                  </div>
                </div>

                <p class="event-remarks" *ngIf="event.remarks">{{ event.remarks }}</p>

                <div class="event-crypto font-mono" *ngIf="event.verificationHash">
                  <span class="crypto-label">AUDIT EVENT DIGEST:</span>
                  <span class="crypto-hash">{{ event.verificationHash }}</span>
                </div>
              </div>
            </div>

            <div *ngIf="custodyEvents().length === 0" class="empty-state">
              <span class="material-icons">timeline</span>
              <h4>No Chain of Custody events logged yet</h4>
              <p>Custody events are automatically added when evidence is handled, transferred, or examined.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: BLOCKCHAIN PROOF -->
      <div class="tab-content" *ngIf="activeTab === 'blockchain'">
        <div class="gov-card">
          <div class="blockchain-banner">
            <div class="chain-logo">
              <span class="material-icons">security</span>
            </div>
            <div>
              <h3>Ethereum Smart Contract Proof Registry</h3>
              <p class="text-secondary text-sm">Decentralized proof-of-existence anchoring state verified against the contract ABI</p>
            </div>
          </div>

          <div class="chain-meta-grid">
            <div class="meta-box">
              <div class="meta-key">CONTRACT NAME</div>
              <div class="meta-val font-mono">DocumentRegistry.sol (v1.0.0)</div>
            </div>
            <div class="meta-box">
              <div class="meta-key">CONTRACT ADDRESS</div>
              <div class="meta-val font-mono text-gold-400">0x5FbDB2315678afecb367f032d93F642f64180aa3</div>
            </div>
            <div class="meta-box">
              <div class="meta-key">EVM CONSENSUS</div>
              <div class="meta-val font-mono">Proof-of-Authority (Hardhat / Local EVM Devnet)</div>
            </div>
            <div class="meta-box">
              <div class="meta-key">IMMUTABILITY STATUS</div>
              <div class="meta-val text-success">ANCHORED ON-CHAIN</div>
            </div>
          </div>

          <h4 class="mt-6 mb-3 font-semibold text-slate-100">Anchored Document Records on Ledger:</h4>
          
          <div class="table-responsive">
            <table class="gov-table">
              <thead>
                <tr>
                  <th>DOC ID</th>
                  <th>ON-CHAIN SHA-256 HASH (bytes32)</th>
                  <th>IPFS CIDv0 POINTER</th>
                  <th>BLOCK TIMESTAMP</th>
                  <th>REGISTRAR (ETH SENDER)</th>
                  <th>TRANSACTION HASH</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let doc of documents()">
                  <td class="font-mono">#{{ doc.id }}</td>
                  <td class="font-mono text-xs text-gold-400">0x{{ doc.sha256Hash | slice:0:32 }}...</td>
                  <td class="font-mono text-xs">{{ doc.ipfsCid }}</td>
                  <td class="font-mono text-xs">{{ doc.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}</td>
                  <td class="font-mono text-xs">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                  <td class="font-mono text-xs">
                    <span class="tx-link font-mono" (click)="copyToClipboard(doc.blockchainTxHash || '0x' + doc.sha256Hash)">
                      {{ (doc.blockchainTxHash || ('0x' + doc.sha256Hash)) | slice:0:16 }}...
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Upload Document Modal -->
      <div class="modal-backdrop" *ngIf="showUploadModal">
        <div class="modal-dialog gov-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="material-icons emblem-icon">cloud_upload</span>
              <h2>Anchor Legal Document to eVault</h2>
            </div>
            <button (click)="closeUploadModal()" class="close-btn">
              <span class="material-icons">close</span>
            </button>
          </div>

          <form (ngSubmit)="submitUploadDocument()" class="modal-body">
            <div class="form-group">
              <label class="gov-label">Document Title *</label>
              <input 
                type="text" 
                [(ngModel)]="newDoc.title" 
                name="title" 
                required 
                class="gov-input" 
                placeholder="e.g. First Information Report (FIR) - Exhibit A" 
              />
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="gov-label">Document Category *</label>
                <select [(ngModel)]="newDoc.documentType" name="documentType" class="gov-select">
                  <option value="FIR">First Information Report (FIR)</option>
                  <option value="CHARGE_SHEET">Police Charge Sheet</option>
                  <option value="COURT_ORDER">Court Order / Judgment</option>
                  <option value="TRANSCRIPT">Court Deposition / Transcript</option>
                  <option value="WITNESS_STATEMENT">Witness Statement</option>
                  <option value="MEDICAL_REPORT">Medical / Post-Mortem Report</option>
                  <option value="FORENSIC_REPORT">Cyber / Forensic Lab Report</option>
                  <option value="EVIDENCE_PHOTO">Evidence Photograph</option>
                  <option value="DIGITAL_EVIDENCE">Digital Audio/Video Exhibit</option>
                  <option value="OTHER">Other Certified Legal Document</option>
                </select>
              </div>

              <div class="form-group col-6">
                <label class="gov-label">Document Description</label>
                <input 
                  type="text" 
                  [(ngModel)]="newDoc.description" 
                  name="description" 
                  class="gov-input" 
                  placeholder="Notes, seal number, certifying officer" 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="gov-label">Select Document File (.pdf, .png, .jpg, .docx) *</label>
              <div class="drop-zone" (click)="fileInput.click()">
                <input 
                  #fileInput 
                  type="file" 
                  (change)="onFileSelected($event)" 
                  style="display: none;" 
                />
                <span class="material-icons drop-icon">cloud_upload</span>
                <p *ngIf="!selectedFile" class="drop-hint">Click or drag & drop legal document file here</p>
                <p *ngIf="selectedFile" class="drop-filename font-mono text-gold-400">
                  {{ selectedFile.name }} ({{ formatBytes(selectedFile.size) }})
                </p>
              </div>
            </div>

            <div *ngIf="uploadError" class="gov-alert gov-alert-danger">
              <span class="material-icons">error</span>
              <span>{{ uploadError }}</span>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="closeUploadModal()" class="gov-btn gov-btn-secondary">
                Cancel
              </button>
              <button type="submit" [disabled]="uploading || !selectedFile" class="gov-btn gov-btn-primary">
                <span *ngIf="!uploading" class="material-icons">lock</span>
                <span *ngIf="uploading">Hashing & Anchoring to IPFS...</span>
                <span *ngIf="!uploading">Hash, Pin & Anchor</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Evidence Modal -->
      <div class="modal-backdrop" *ngIf="showEvidenceModal">
        <div class="modal-dialog gov-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="material-icons emblem-icon">biotech</span>
              <h2>Register Physical or Digital Evidence</h2>
            </div>
            <button (click)="closeEvidenceModal()" class="close-btn">
              <span class="material-icons">close</span>
            </button>
          </div>

          <form (ngSubmit)="submitAddEvidence()" class="modal-body">
            <div class="form-group">
              <label class="gov-label">Evidence Item Name *</label>
              <input 
                type="text" 
                [(ngModel)]="newEvidence.name" 
                name="name" 
                required 
                class="gov-input" 
                placeholder="e.g. Seized Samsung Galaxy S21 Ultra" 
              />
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="gov-label">Category *</label>
                <select [(ngModel)]="newEvidence.category" name="category" class="gov-select">
                  <option value="DIGITAL_STORAGE">Digital Storage Device (Phone, Hard Drive, USB)</option>
                  <option value="WEAPON">Weapon / Firearm</option>
                  <option value="DOCUMENT">Physical Document / Cheque</option>
                  <option value="BIOLOGICAL">Biological / DNA Sample</option>
                  <option value="CURRENCY">Counterfeit / Seized Currency</option>
                  <option value="NARCOTICS">Contraband / Narcotics</option>
                  <option value="OTHER">Other Forensic Exhibit</option>
                </select>
              </div>

              <div class="form-group col-6">
                <label class="gov-label">Initial Custodian *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newEvidence.currentCustodian" 
                  name="currentCustodian" 
                  required 
                  class="gov-input" 
                  placeholder="e.g. Insp. R. K. Verma, IO" 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label class="gov-label">Collection Location *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newEvidence.collectionLocation" 
                  name="collectionLocation" 
                  required 
                  class="gov-input" 
                  placeholder="e.g. Crime Scene, Flat 402, Sector 15" 
                />
              </div>

              <div class="form-group col-6">
                <label class="gov-label">Storage Vault Location *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newEvidence.storageLocation" 
                  name="storageLocation" 
                  required 
                  class="gov-input" 
                  placeholder="e.g. Malkhana Locker No. 24, Cyber Cell" 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="gov-label">Description & Physical Condition</label>
              <textarea 
                [(ngModel)]="newEvidence.description" 
                name="description" 
                rows="2" 
                class="gov-input" 
                placeholder="Describe condition, serial numbers, tamper-evident bag number..."
              ></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="closeEvidenceModal()" class="gov-btn gov-btn-secondary">
                Cancel
              </button>
              <button type="submit" [disabled]="submittingEvidence" class="gov-btn gov-btn-primary">
                <span class="material-icons">fingerprint</span>
                <span>Register & Generate Chain Token</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Verification Result Toast / Modal -->
      <div class="modal-backdrop" *ngIf="verificationModalResult">
        <div class="modal-dialog gov-card" style="max-width: 580px;">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="material-icons" [ngClass]="verificationModalResult.verified ? 'text-success' : 'text-danger'">
                {{ verificationModalResult.verified ? 'verified_user' : 'gpp_bad' }}
              </span>
              <h2>{{ verificationModalResult.verified ? 'Document Integrity Verified' : 'Cryptographic Tamper Alert!' }}</h2>
            </div>
            <button (click)="verificationModalResult = null" class="close-btn">
              <span class="material-icons">close</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="gov-alert" [ngClass]="verificationModalResult.verified ? 'gov-alert-success' : 'gov-alert-danger'">
              <span class="material-icons">{{ verificationModalResult.verified ? 'check_circle' : 'warning' }}</span>
              <div>
                <strong>{{ verificationModalResult.verified ? 'Cryptographic Match 100%' : 'Bitwise Discrepancy Found' }}</strong>
                <p>{{ verificationModalResult.message }}</p>
              </div>
            </div>

            <div class="summary-list">
              <div class="summary-row">
                <span class="key">Calculated File Hash</span>
                <span class="val font-mono text-xs">{{ verificationModalResult.calculatedHash }}</span>
              </div>
              <div class="summary-row" *ngIf="verificationModalResult.originalHash">
                <span class="key">Ledger Anchored Hash</span>
                <span class="val font-mono text-xs">{{ verificationModalResult.originalHash }}</span>
              </div>
              <div class="summary-row" *ngIf="verificationModalResult.ipfsCid">
                <span class="key">IPFS CID Pointer</span>
                <span class="val font-mono text-xs">{{ verificationModalResult.ipfsCid }}</span>
              </div>
              <div class="summary-row" *ngIf="verificationModalResult.blockchainTxHash">
                <span class="key">Ethereum Anchor Tx</span>
                <span class="val font-mono text-xs">{{ verificationModalResult.blockchainTxHash }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button (click)="verificationModalResult = null" class="gov-btn gov-btn-secondary">
              Close Inspection
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading / Error View -->
    <ng-template #loadingOrError>
      <div class="case-detail-page">
        <div class="gov-card loading-state">
          <div class="spinner"></div>
          <p>Retrieving case dossier and blockchain anchors...</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .case-detail-page {
      padding: var(--space-6);
      max-width: 1400px;
      margin: 0 auto;
    }

    .top-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--color-slate-300);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--color-gold-400);
      }
    }

    .nav-actions {
      display: flex;
      gap: var(--space-3);
    }

    .case-banner {
      margin-bottom: var(--space-6);
      border-top: 4px solid #1e3a8a;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .banner-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .docket-identity {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-wrap: wrap;
    }

    .docket-num {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 18px;
      font-weight: 800;
      color: #1e3a8a;

      .emblem {
        color: #1e3a8a;
        font-size: 20px;
      }
    }

    .type-pill {
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
    }

    .quick-stats {
      display: flex;
      gap: var(--space-4);
    }

    .stat-pill {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .label {
        font-size: 10px;
        font-family: var(--font-mono);
        color: #64748b;
        font-weight: 700;
        letter-spacing: 0.05em;
      }

      .val {
        font-size: 16px;
        font-weight: 800;
        color: #0f172a;
      }
    }

    .case-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 var(--space-4) 0;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid #e2e8f0;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .meta-label {
      font-size: 10px;
      font-family: var(--font-mono);
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .meta-val {
      font-size: 13px;
      color: #0f172a;
      font-weight: 600;
    }

    .highlight-gold {
      color: #b45309;
      font-weight: 700;
    }

    /* Tabs */
    .tabs-container {
      display: flex;
      gap: 6px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: var(--space-6);
      overflow-x: auto;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      color: #64748b;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);

      .material-icons {
        font-size: 18px;
      }

      &:hover {
        color: #0f172a;
        background: #f1f5f9;
        border-radius: 6px 6px 0 0;
      }

      &.active {
        color: #1e3a8a;
        font-weight: 700;
        border-bottom-color: #1e3a8a;
        background: #eff6ff;
        border-radius: 6px 6px 0 0;
      }
    }

    .tab-count {
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 1px 7px;
      background: #e2e8f0;
      border-radius: var(--radius-full);
      color: #1e293b;
    }

    /* Tab Content Grids */
    .overview-grid {
      display: flex;
      gap: var(--space-6);

      .col-8 { flex: 8; }
      .col-4 { flex: 4; }
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-slate-100);
      margin-bottom: var(--space-3);
    }

    .case-desc-text {
      font-size: 14px;
      line-height: 1.6;
      color: var(--color-slate-300);
      margin-bottom: var(--space-6);
    }

    .legal-disclaimer-note {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      background: rgba(14, 116, 144, 0.1);
      border: 1px solid rgba(14, 116, 144, 0.3);
      border-radius: var(--radius-md);
      font-size: 12px;
      color: var(--color-slate-300);

      .material-icons {
        color: #38bdf8;
        font-size: 20px;
      }
    }

    .summary-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid rgba(51, 65, 85, 0.5);
      font-size: 12px;

      .key { color: var(--color-slate-400); }
      .val { color: var(--color-slate-200); font-weight: 500; }
    }

    .card-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) var(--space-5);
      border-bottom: 1px solid var(--color-slate-700);

      h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 2px 0;
      }
    }

    .doc-title {
      color: var(--color-slate-100);
      font-size: 13px;
    }

    .doc-type-badge {
      display: inline-block;
      font-size: 10px;
      font-family: var(--font-mono);
      padding: 1px 6px;
      background: rgba(30, 41, 59, 0.8);
      border-radius: var(--radius-sm);
      color: var(--color-slate-400);
      margin-top: 2px;
    }

    .hash-cell, .cid-cell, .tx-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--color-slate-300);
    }

    .icon-btn {
      background: none;
      border: none;
      color: var(--color-slate-400);
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;

      .material-icons {
        font-size: 13px;
      }

      &:hover {
        color: var(--color-gold-400);
      }
    }

    .action-btn-group {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }

    .btn-xs {
      padding: 4px 8px;
      font-size: 11px;

      .material-icons {
        font-size: 13px;
      }
    }

    /* Custody Timeline */
    .custody-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);

      h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 2px 0;
      }
    }

    .custody-timeline {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding-left: var(--space-4);
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
      width: 32px;

      .step-num {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--color-navy-700);
        border: 2px solid var(--color-gold-500);
        color: var(--color-gold-400);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        font-family: var(--font-mono);
        z-index: 2;
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
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid var(--color-slate-700);
    }

    .event-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .event-action {
      display: flex;
      align-items: center;
      gap: var(--space-2);

      .action-icon {
        color: var(--color-gold-400);
        font-size: 18px;
      }

      h4 {
        margin: 0;
        font-size: 14px;
        color: var(--color-slate-100);
      }
    }

    .event-time {
      font-size: 11px;
      color: var(--color-slate-400);
    }

    .custody-actors {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-2);
    }

    .actor {
      display: flex;
      flex-direction: column;
      font-size: 11px;

      .actor-label { color: var(--color-slate-400); font-family: var(--font-mono); }
      .actor-val { color: var(--color-slate-200); }
    }

    .event-remarks {
      font-size: 12px;
      color: var(--color-slate-300);
      margin: var(--space-2) 0;
    }

    .event-crypto {
      font-size: 10px;
      padding-top: var(--space-2);
      border-top: 1px solid rgba(51, 65, 85, 0.4);
      display: flex;
      gap: 6px;

      .crypto-label { color: var(--color-slate-500); }
      .crypto-hash { color: var(--color-gold-400); }
    }

    /* Blockchain Proof */
    .blockchain-banner {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--color-slate-700);
      margin-bottom: var(--space-4);

      .chain-logo {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: rgba(217, 119, 6, 0.15);
        border: 1px solid rgba(217, 119, 6, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;

        .material-icons {
          color: var(--color-gold-400);
          font-size: 28px;
        }
      }

      h3 { margin: 0 0 2px 0; font-size: 18px; }
    }

    .chain-meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--space-3);
    }

    .meta-box {
      padding: var(--space-3);
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius-sm);

      .meta-key { font-size: 11px; font-family: var(--font-mono); color: #64748b; font-weight: 700; }
      .meta-val { font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px; }
    }

    .tx-link {
      cursor: pointer;
      color: #1e40af;
      font-weight: 600;
      &:hover { text-decoration: underline; }
    }

    /* Drop Zone */
    .drop-zone {
      border: 2px dashed #cbd5e1;
      border-radius: var(--radius-md);
      padding: var(--space-6);
      text-align: center;
      cursor: pointer;
      background: #f8fafc;
      transition: all var(--transition-fast);

      &:hover {
        border-color: #1e3a8a;
        background: #eff6ff;
      }

      .drop-icon {
        font-size: 36px;
        color: #64748b;
        margin-bottom: 4px;
      }

      .drop-hint {
        font-size: 12px;
        color: #64748b;
        margin: 0;
      }
    }

    /* Modals */
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
      max-width: 680px;
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
      .emblem-icon { color: #d97706; }
    }

    .close-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      border-radius: var(--radius-sm);

      &:hover { color: #0f172a; background: #e2e8f0; }
    }

    .modal-body {
      padding: var(--space-6);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid #e2e8f0;
      margin-top: var(--space-4);
    }

    .form-row {
      display: flex;
      gap: var(--space-4);
      .col-6 { flex: 1 1 50%; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--space-4);
    }

    .empty-state {
      padding: var(--space-8);
      text-align: center;
      color: #64748b;

      .material-icons { font-size: 40px; color: #94a3b8; margin-bottom: 4px; }
      h4 { color: #0f172a; margin: 0 0 4px 0; }
      p { font-size: 12px; margin: 0; }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-12);
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
export class CaseDetailComponent implements OnInit {
  caseId: number = 0;
  caseItem = signal<LegalCase | null>(null);
  documents = signal<LegalDocument[]>([]);
  evidenceList = signal<Evidence[]>([]);
  custodyEvents = signal<ChainOfCustodyEvent[]>([]);

  activeTab: string = 'overview';

  tabs = [
    { id: 'overview', label: 'Overview', icon: 'info' },
    { id: 'documents', label: 'Documents', icon: 'description', count: 0 },
    { id: 'evidence', label: 'Evidence', icon: 'biotech', count: 0 },
    { id: 'custody', label: 'Chain of Custody', icon: 'timeline' },
    { id: 'blockchain', label: 'Blockchain Proof', icon: 'lock' }
  ];

  // Modals state
  showUploadModal = false;
  uploading = false;
  uploadError = '';
  selectedFile: File | null = null;
  newDoc = {
    title: '',
    documentType: 'FIR',
    description: ''
  };

  showEvidenceModal = false;
  submittingEvidence = false;
  newEvidence = {
    name: '',
    category: 'DIGITAL_STORAGE',
    description: '',
    currentCustodian: '',
    collectionLocation: '',
    storageLocation: ''
  };

  verificationModalResult: VerificationResult | null = null;

  constructor(
    private route: ActivatedRoute,
    private caseService: CaseService,
    private documentService: DocumentService,
    private evidenceService: EvidenceService,
    private verificationService: VerificationService,
    private shareService: ShareService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.caseId = +params['id'];
      if (this.caseId) {
        this.loadCaseData();
      }
    });
  }

  loadCaseData(): void {
    this.caseService.getCaseById(this.caseId).subscribe({
      next: (res) => {
        this.caseItem.set(res);
      }
    });

    this.documentService.getDocumentsByCase(this.caseId).subscribe({
      next: (docs) => {
        this.documents.set(docs || []);
        const docTab = this.tabs.find(t => t.id === 'documents');
        if (docTab) docTab.count = docs?.length || 0;
      }
    });

    this.evidenceService.getEvidenceByCase(this.caseId).subscribe({
      next: (evs) => {
        this.evidenceList.set(evs || []);
        const evTab = this.tabs.find(t => t.id === 'evidence');
        if (evTab) evTab.count = evs?.length || 0;

        // Fetch custody events if evidence exists
        if (evs && evs.length > 0) {
          this.evidenceService.getCustodyHistory(evs[0].id).subscribe({
            next: (events) => this.custodyEvents.set(events || [])
          });
        }
      }
    });
  }

  canUpload(): boolean {
    return this.authService.hasRole('SUPER_ADMIN') ||
           this.authService.hasRole('INVESTIGATING_OFFICER') ||
           this.authService.hasRole('COURT_STAFF') ||
           this.authService.hasRole('PROSECUTOR');
  }

  // Upload modal handlers
  openUploadModal(): void {
    this.selectedFile = null;
    this.uploadError = '';
    this.newDoc = { title: '', documentType: 'FIR', description: '' };
    this.showUploadModal = true;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      if (!this.newDoc.title) {
        this.newDoc.title = file.name.replace(/\\.[^/.]+$/, '');
      }
    }
  }

  submitUploadDocument(): void {
    if (!this.selectedFile || !this.newDoc.title) {
      this.uploadError = 'Please specify document title and attach a file.';
      return;
    }

    this.uploading = true;
    this.uploadError = '';

    this.documentService.uploadDocument(
      this.caseId,
      this.selectedFile,
      this.newDoc.title,
      this.newDoc.documentType,
      this.newDoc.description
    ).subscribe({
      next: (doc) => {
        this.uploading = false;
        this.closeUploadModal();
        this.loadCaseData();
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = err.error?.message || 'Upload & anchoring failed. Please verify credentials.';
      }
    });
  }

  // Evidence modal handlers
  openAddEvidenceModal(): void {
    this.newEvidence = {
      name: '',
      category: 'DIGITAL_STORAGE',
      description: '',
      currentCustodian: '',
      collectionLocation: '',
      storageLocation: ''
    };
    this.showEvidenceModal = true;
  }

  closeEvidenceModal(): void {
    this.showEvidenceModal = false;
  }

  submitAddEvidence(): void {
    if (!this.newEvidence.name || !this.newEvidence.currentCustodian || !this.newEvidence.collectionLocation) {
      return;
    }

    this.submittingEvidence = true;
    this.evidenceService.createEvidence(this.caseId, this.newEvidence).subscribe({
      next: () => {
        this.submittingEvidence = false;
        this.closeEvidenceModal();
        this.loadCaseData();
      },
      error: () => {
        this.submittingEvidence = false;
      }
    });
  }

  openCustodyTransferModal(ev: Evidence): void {
    // For demo purposes, we can quickly log a custody event
    const nextCustodian = prompt(`Log Custody Transfer for: ${ev.name}\n\nEnter Name and Organization of Receiving Custodian:`, 'Central Forensic Science Laboratory (CFSL)');
    if (nextCustodian) {
      this.evidenceService.addCustodyEvent(ev.id, {
        action: 'CUSTODY_TRANSFER',
        toLocation: nextCustodian,
        fromLocation: ev.storageLocation,
        remarks: 'Physical seal checked intact. Transferred for forensic inspection.'
      }).subscribe({
        next: () => this.loadCaseData()
      });
    }
  }

  verifySingleDoc(doc: LegalDocument): void {
    this.verificationService.verifyDocument(doc.id).subscribe({
      next: (res) => {
        this.verificationModalResult = res;
      },
      error: (err) => {
        alert('Verification request failed: ' + (err.error?.message || 'Server error'));
      }
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
      error: () => alert('Download failed. Ensure document exists on IPFS.')
    });
  }

  openShareModal(doc: LegalDocument): void {
    this.shareService.createShareLink(doc.id, 48).subscribe({
      next: (link) => {
        const fullUrl = `${window.location.origin}/verify/share/${link.token}`;
        navigator.clipboard.writeText(fullUrl);
        alert(`Secure Court Share Link Generated!\n\nLink copied to clipboard:\n${fullUrl}\n\nValid for 48 hours.`);
      },
      error: () => alert('Failed to create share link.')
    });
  }

  copyToClipboard(text?: string): void {
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard: ' + text);
    }
  }

  formatBytes(bytes?: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
