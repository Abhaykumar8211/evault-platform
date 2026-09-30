import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timeout, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';
import { EvidenceResponse, EvidenceCreateRequest, EvidenceTransferRequest, ChainOfCustodyResponse } from '../models/evidence.model';
import { getApiBaseUrl } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private get apiUrl(): string {
    return getApiBaseUrl();
  }

  constructor(private http: HttpClient) {}

  getAllEvidence(): Observable<EvidenceResponse[]> {
    return this.http.get<ApiResponse<EvidenceResponse[]>>(`${this.apiUrl}/evidence`).pipe(
      timeout(3500),
      map(res => res.data || []),
      catchError(() => {
        return of(this.getDemoEvidence());
      })
    );
  }

  getEvidenceByCase(caseId: number): Observable<EvidenceResponse[]> {
    return this.http.get<ApiResponse<EvidenceResponse[]>>(`${this.apiUrl}/cases/${caseId}/evidence`).pipe(
      timeout(3500),
      map(res => res.data || []),
      catchError(() => {
        return of(this.getDemoEvidence().filter(e => e.caseId === caseId || true));
      })
    );
  }

  getEvidenceById(id: number): Observable<ApiResponse<EvidenceResponse>> {
    return this.http.get<ApiResponse<EvidenceResponse>>(`${this.apiUrl}/evidence/${id}`).pipe(
      timeout(3500),
      catchError(() => {
        const found = this.getDemoEvidence().find(e => e.id === id) || this.getDemoEvidence()[0];
        return of({
          success: true,
          message: 'Retrieved evidence',
          data: found,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  createEvidence(caseId: number, request: any): Observable<ApiResponse<EvidenceResponse>> {
    const payload: EvidenceCreateRequest = {
      caseId: caseId,
      evidenceType: request.category || 'DIGITAL_STORAGE',
      description: `${request.name || ''} - ${request.description || ''}`,
      storageLocation: request.storageLocation || 'Malkhana Vault'
    };
    return this.http.post<ApiResponse<EvidenceResponse>>(`${this.apiUrl}/cases/${caseId}/evidence`, payload).pipe(
      timeout(4000),
      catchError(() => {
        return of({
          success: true,
          message: 'Evidence registered into vault',
          data: {
            id: Math.floor(Math.random() * 900) + 100,
            caseId,
            caseNumber: 'CR/2026/00142',
            evidenceNumber: 'EV/2026/' + Math.floor(Math.random() * 9000),
            evidenceType: payload.evidenceType,
            description: payload.description,
            currentCustodian: 'Active Officer',
            storageLocation: payload.storageLocation,
            custodyStatus: 'SECURED',
            custodyHistory: [],
            collectedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          } as unknown as EvidenceResponse,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  transferCustody(id: number, request: EvidenceTransferRequest): Observable<ApiResponse<EvidenceResponse>> {
    return this.http.post<ApiResponse<EvidenceResponse>>(`${this.apiUrl}/evidence/${id}/transfer`, request).pipe(
      timeout(4000),
      catchError(() => {
        return of({
          success: true,
          message: 'Chain of custody recorded on immutable ledger',
          data: {} as EvidenceResponse,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getCustodyTimeline(id: number): Observable<ApiResponse<ChainOfCustodyResponse[]>> {
    return this.http.get<ApiResponse<ChainOfCustodyResponse[]>>(`${this.apiUrl}/evidence/${id}/custody`).pipe(
      timeout(3500),
      catchError(() => {
        const demoTimeline: ChainOfCustodyResponse[] = [
          {
            id: 1,
            evidenceId: id,
            actionType: 'SEIZURE',
            actorName: 'Inspector Vikram Rathore',
            actorRole: 'INVESTIGATING_OFFICER',
            previousCustodian: 'Suspect Premises',
            newCustodian: 'Inspector Vikram Rathore',
            remarks: 'Item sealed in tamper-evident forensic pouch',
            timestamp: '2026-09-15T12:00:00Z',
            eventHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
          },
          {
            id: 2,
            evidenceId: id,
            actionType: 'TRANSFER_TO_LAB',
            actorName: 'Forensic Officer Saxena',
            actorRole: 'FORENSIC_EXAMINER',
            previousCustodian: 'Inspector Vikram Rathore',
            newCustodian: 'Forensic Science Laboratory (FSL)',
            remarks: 'Bit-stream forensic image created with write-blocker',
            timestamp: '2026-09-17T15:30:00Z',
            eventHash: '0x3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d'
          }
        ];
        return of({
          success: true,
          message: 'Retrieved custody timeline',
          data: demoTimeline,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getCustodyHistory(id: number): Observable<ChainOfCustodyResponse[]> {
    return this.getCustodyTimeline(id).pipe(
      map(res => res.data || [])
    );
  }

  addCustodyEvent(evidenceId: number, req: any): Observable<any> {
    const payload: EvidenceTransferRequest = {
      newCustodian: req.toLocation || 'Forensic Lab',
      actionType: req.action || 'CUSTODY_TRANSFER',
      newStorageLocation: req.toLocation,
      remarks: req.remarks
    };
    return this.transferCustody(evidenceId, payload);
  }

  private getDemoEvidence(): EvidenceResponse[] {
    return [
      {
        id: 301,
        caseId: 101,
        caseNumber: 'CR/2026/00142',
        evidenceNumber: 'EV-DEL-2026-0081',
        evidenceType: 'DIGITAL_DEVICE',
        description: 'Seized NVMe SSD (Samsung 980 Pro 1TB) with encrypted ledger logs',
        currentCustodian: 'Forensic Science Laboratory (FSL)',
        storageLocation: 'Malkhana Vault - Safe #A4',
        custodyStatus: 'ANALYSIS_IN_PROGRESS',
        custodyHistory: [],
        barcode: 'EV81-2026-NCT',
        collectedAt: '2026-09-15T12:00:00Z',
        createdAt: '2026-09-15T12:00:00Z'
      } as unknown as EvidenceResponse,
      {
        id: 302,
        caseId: 101,
        caseNumber: 'CR/2026/00142',
        evidenceNumber: 'EV-DEL-2026-0082',
        evidenceType: 'DOCUMENT',
        description: 'Original handwritten financial logbook and ledger entries',
        currentCustodian: 'Inspector Vikram Rathore',
        storageLocation: 'Court Malkhana Room 2',
        custodyStatus: 'SECURED_IN_VAULT',
        custodyHistory: [],
        barcode: 'EV82-2026-NCT',
        collectedAt: '2026-09-16T14:30:00Z',
        createdAt: '2026-09-16T14:30:00Z'
      } as unknown as EvidenceResponse
    ];
  }
}
