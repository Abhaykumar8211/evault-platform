import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditLog } from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = '/api/v1/audit';

  constructor(private http: HttpClient) {}

  getAuditLogs(page: number = 0, size: number = 20): Observable<{ content: AuditLog[]; totalElements: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/logs`, { params }).pipe(
      map(res => res.data)
    );
  }

  getRecentAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<any>(`${this.apiUrl}/recent`).pipe(
      map(res => res.data)
    );
  }
}
