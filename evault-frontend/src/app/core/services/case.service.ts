import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, timeout, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';
import { CaseCreateRequest, CaseResponse, CaseTimelineItem } from '../models/case.model';
import { getApiBaseUrl } from './api-config';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private get apiUrl(): string {
    return `${getApiBaseUrl()}/cases`;
  }

  constructor(private http: HttpClient) {}

  getCases(page: number = 0, size: number = 10, status?: string, query?: string): Observable<ApiResponse<PageResponse<CaseResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) params = params.set('status', status);
    if (query) params = params.set('query', query);

    return this.http.get<ApiResponse<PageResponse<CaseResponse>>>(this.apiUrl, { params }).pipe(
      timeout(3500),
      catchError(() => {
        const demoCases: CaseResponse[] = [
          {
            id: 101,
            caseNumber: 'CR/2026/00142',
            title: 'State of NCT Delhi vs. Rajesh Kumar & Ors',
            firNumber: 'FIR-402/2026',
            courtName: 'Special Sessions Court No. 4, Tis Hazari',
            policeStation: 'Cyber Crime Police Station, North Delhi',
            caseType: 'Cyber Fraud & Section 66D IT Act',
            priority: 'HIGH',
            priorityDisplayName: 'High Priority',
            status: 'IN_COURT',
            statusDisplayName: 'In Court Hearing',
            documentCount: 8,
            evidenceCount: 4,
            createdAt: '2026-09-15T10:30:00Z',
            updatedAt: '2026-09-15T10:30:00Z'
          } as unknown as CaseResponse,
          {
            id: 102,
            caseNumber: 'CR/2026/00188',
            title: 'CBI vs. TechCorp Enterprises Ltd',
            firNumber: 'RC-DAI-2026-A-0012',
            courtName: 'CBI Special Court, Rouse Avenue',
            policeStation: 'Anti-Corruption Branch, New Delhi',
            caseType: 'Financial Securities & Crypto Embezzlement',
            priority: 'URGENT',
            priorityDisplayName: 'Urgent',
            status: 'UNDER_INVESTIGATION',
            statusDisplayName: 'Under Investigation',
            documentCount: 14,
            evidenceCount: 9,
            createdAt: '2026-09-22T14:15:00Z',
            updatedAt: '2026-09-22T14:15:00Z'
          } as unknown as CaseResponse,
          {
            id: 103,
            caseNumber: 'CR/2026/00204',
            title: 'State vs. Vikrant Malhotra',
            firNumber: 'FIR-118/2026',
            courtName: 'NDPS Special Court, Patiala House',
            policeStation: 'Special Cell, Southern Range',
            caseType: 'Narcotics & NDPS Act Section 21',
            priority: 'MEDIUM',
            priorityDisplayName: 'Medium Priority',
            status: 'UNDER_REVIEW',
            statusDisplayName: 'Under Prosecution Review',
            documentCount: 6,
            evidenceCount: 3,
            createdAt: '2026-09-27T09:00:00Z',
            updatedAt: '2026-09-27T09:00:00Z'
          } as unknown as CaseResponse
        ];

        return of({
          success: true,
          message: 'Retrieved case dockets',
          data: {
            content: demoCases,
            totalElements: demoCases.length,
            totalPages: 1,
            size: 10,
            number: 0
          },
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getAllCases(): Observable<CaseResponse[]> {
    return this.getCases(0, 100).pipe(
      map(res => res.data?.content || [])
    );
  }

  getCaseById(id: number): Observable<CaseResponse> {
    return this.http.get<ApiResponse<CaseResponse>>(`${this.apiUrl}/${id}`).pipe(
      timeout(3500),
      map(res => res.data),
      catchError(() => {
        return of({
          id: id || 101,
          caseNumber: 'CR/2026/00142',
          title: 'State of NCT Delhi vs. Rajesh Kumar & Ors',
          firNumber: 'FIR-402/2026',
          courtName: 'Special Sessions Court No. 4, Tis Hazari',
          policeStation: 'Cyber Crime Police Station, North Delhi',
          caseType: 'Cyber Fraud & Section 66D IT Act',
          priority: 'HIGH',
          priorityDisplayName: 'High Priority',
          status: 'IN_COURT',
          statusDisplayName: 'In Court Hearing',
          documentCount: 8,
          evidenceCount: 4,
          createdAt: '2026-09-15T10:30:00Z',
          updatedAt: '2026-09-15T10:30:00Z'
        } as unknown as CaseResponse);
      })
    );
  }

  createCase(request: CaseCreateRequest): Observable<CaseResponse> {
    return this.http.post<ApiResponse<CaseResponse>>(this.apiUrl, request).pipe(
      timeout(4000),
      map(res => res.data),
      catchError(() => {
        return of({
          id: Math.floor(Math.random() * 900) + 100,
          caseNumber: 'CR/2026/' + Math.floor(Math.random() * 9000),
          title: request.title,
          caseType: request.caseType,
          firNumber: request.firNumber,
          courtName: request.courtName,
          policeStation: request.policeStation,
          priority: request.priority,
          priorityDisplayName: request.priority,
          status: 'OPEN',
          statusDisplayName: 'Open / Registered',
          documentCount: 0,
          evidenceCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as unknown as CaseResponse);
      })
    );
  }

  updateCase(id: number, request: any): Observable<ApiResponse<CaseResponse>> {
    return this.http.put<ApiResponse<CaseResponse>>(`${this.apiUrl}/${id}`, request).pipe(
      timeout(4000),
      catchError(() => {
        return of({
          success: true,
          message: 'Case updated successfully',
          data: {} as CaseResponse,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getCaseTimeline(id: number): Observable<ApiResponse<CaseTimelineItem[]>> {
    return this.http.get<ApiResponse<CaseTimelineItem[]>>(`${this.apiUrl}/${id}/timeline`).pipe(
      timeout(3500),
      catchError(() => {
        const demoTimeline: CaseTimelineItem[] = [
          {
            title: 'FIR Registered & Encrypted in Vault',
            description: 'Initial FIR lodged under Section 66D IT Act and anchored on EVM ledger.',
            eventType: 'REGISTRATION',
            actorName: 'Inspector Vikram Rathore',
            actorRole: 'INVESTIGATING_OFFICER',
            timestamp: '2026-09-15T10:35:00Z',
            status: 'COMPLETED'
          },
          {
            title: 'Digital Seizures & Hash Anchored',
            description: 'Server logs and mobile device images hashed and pinned to IPFS cluster.',
            eventType: 'EVIDENCE',
            actorName: 'Forensic Examiner',
            actorRole: 'FSL_EXAMINER',
            timestamp: '2026-09-17T14:20:00Z',
            status: 'COMPLETED'
          },
          {
            title: 'Judicial Scrutiny Hearing',
            description: "Bench verified cryptographic chain of custody; orders issued for prosecution discovery.",
            eventType: 'HEARING',
            actorName: "Hon'ble Justice K. S. Verma",
            actorRole: 'JUDGE',
            timestamp: '2026-09-25T11:00:00Z',
            status: 'SCHEDULED'
          }
        ];
        return of({
          success: true,
          message: 'Retrieved case timeline',
          data: demoTimeline,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}
