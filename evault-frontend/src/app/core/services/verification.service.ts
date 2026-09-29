import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentVerificationResult, TamperIncident } from '../models/verification.model';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = '/api/v1/verify';

  constructor(private http: HttpClient) {}

  verifyFile(file: File, targetDocumentId?: number): Observable<DocumentVerificationResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (targetDocumentId) {
      formData.append('targetDocumentId', targetDocumentId.toString());
    }

    return this.http.post<any>(`${this.apiUrl}/file`, formData).pipe(
      map(res => res.data)
    );
  }

  verifyDocument(documentId: number): Observable<DocumentVerificationResult> {
    return this.http.get<any>(`${this.apiUrl}/document/${documentId}`).pipe(
      map(res => res.data)
    );
  }

  getTamperAlerts(): Observable<TamperIncident[]> {
    return this.http.get<any>(`${this.apiUrl}/tamper-alerts`).pipe(
      map(res => res.data)
    );
  }
}
