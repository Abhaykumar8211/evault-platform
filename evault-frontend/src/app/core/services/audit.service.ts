import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, timeout, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditLog } from '../models/audit.model';
import { getApiBaseUrl } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private get apiUrl(): string {
    return `${getApiBaseUrl()}/audit`;
  }

  constructor(private http: HttpClient) {}

  getAuditLogs(page: number = 0, size: number = 20): Observable<{ content: AuditLog[]; totalElements: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/logs`, { params }).pipe(
      timeout(3500),
      map(res => res.data),
      catchError(() => {
        const demoLogs = this.getDemoAuditLogs();
        return of({
          content: demoLogs,
          totalElements: demoLogs.length
        });
      })
    );
  }

  getRecentAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<any>(`${this.apiUrl}/recent`).pipe(
      timeout(3500),
      map(res => res.data),
      catchError(() => {
        return of(this.getDemoAuditLogs().slice(0, 5));
      })
    );
  }

  private getDemoAuditLogs(): AuditLog[] {
    return [
      {
        id: 1,
        eventType: 'USER_LOGIN',
        actorEmail: 'judge@evault.demo',
        actorRole: 'JUDGE',
        entityType: 'AUTH_SESSION',
        entityId: 4,
        actionDetails: 'Judicial Bench session initiated with Session Key #4091',
        ipAddress: '10.24.8.12',
        status: 'SUCCESS',
        createdAt: '2026-09-30T10:15:00Z'
      },
      {
        id: 2,
        eventType: 'DOCUMENT_VERIFIED',
        actorEmail: 'officer@evault.demo',
        actorRole: 'INVESTIGATING_OFFICER',
        entityType: 'DOCUMENT',
        entityId: 201,
        actionDetails: 'Cryptographic SHA-256 match validated on EVM block #10,044',
        ipAddress: '10.24.8.15',
        status: 'SUCCESS',
        createdAt: '2026-09-30T09:40:00Z'
      },
      {
        id: 3,
        eventType: 'CHAIN_OF_CUSTODY_TRANSFER',
        actorEmail: 'prosecutor@evault.demo',
        actorRole: 'PROSECUTOR',
        entityType: 'EVIDENCE',
        entityId: 301,
        actionDetails: 'Forensic digital custody transferred from Police Malkhana to FSL Lab',
        ipAddress: '10.24.8.18',
        status: 'SUCCESS',
        createdAt: '2026-09-30T08:20:00Z'
      }
    ];
  }
}
