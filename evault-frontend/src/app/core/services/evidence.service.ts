import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';
import { EvidenceResponse, EvidenceCreateRequest, EvidenceTransferRequest, ChainOfCustodyResponse } from '../models/evidence.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getAllEvidence(): Observable<EvidenceResponse[]> {
    return this.http.get<ApiResponse<EvidenceResponse[]>>(`${this.apiUrl}/evidence`).pipe(
      map(res => res.data || [])
    );
  }

  getEvidenceByCase(caseId: number): Observable<EvidenceResponse[]> {
    return this.http.get<ApiResponse<EvidenceResponse[]>>(`${this.apiUrl}/cases/${caseId}/evidence`).pipe(
      map(res => res.data || [])
    );
  }

  getEvidenceById(id: number): Observable<ApiResponse<EvidenceResponse>> {
    return this.http.get<ApiResponse<EvidenceResponse>>(`${this.apiUrl}/evidence/${id}`);
  }

  createEvidence(caseId: number, request: any): Observable<ApiResponse<EvidenceResponse>> {
    const payload: EvidenceCreateRequest = {
      caseId: caseId,
      evidenceType: request.category || 'DIGITAL_STORAGE',
      description: `${request.name || ''} - ${request.description || ''}`,
      storageLocation: request.storageLocation || 'Malkhana Vault'
    };
    return this.http.post<ApiResponse<EvidenceResponse>>(`${this.apiUrl}/cases/${caseId}/evidence`, payload);
  }

  transferCustody(id: number, request: EvidenceTransferRequest): Observable<ApiResponse<EvidenceResponse>> {
    return this.http.post<ApiResponse<EvidenceResponse>>(`${this.apiUrl}/evidence/${id}/transfer`, request);
  }

  getCustodyTimeline(id: number): Observable<ApiResponse<ChainOfCustodyResponse[]>> {
    return this.http.get<ApiResponse<ChainOfCustodyResponse[]>>(`${this.apiUrl}/evidence/${id}/custody`);
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
}
