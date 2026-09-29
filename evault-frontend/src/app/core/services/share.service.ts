import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';
import { ShareCreateRequest, ShareResponse } from '../models/dashboard.model';
import { DocumentResponse } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  createShareLink(documentId: number, reqOrHours: number | ShareCreateRequest = 48): Observable<ShareResponse> {
    const payload: ShareCreateRequest = typeof reqOrHours === 'number' ? {
      recipientEmail: 'authorized.counsel@judiciary.gov.in',
      accessLevel: 'READ_ONLY',
      validityHours: reqOrHours,
      maxUses: 10
    } : reqOrHours;

    return this.http.post<ApiResponse<ShareResponse>>(`${this.apiUrl}/documents/${documentId}/share`, payload).pipe(
      map(res => res.data)
    );
  }

  accessSharedDocument(token: string): Observable<ApiResponse<DocumentResponse>> {
    return this.http.get<ApiResponse<DocumentResponse>>(`${this.apiUrl}/share/${token}`);
  }

  revokeShareLink(token: string): Observable<ApiResponse<ShareResponse>> {
    return this.http.post<ApiResponse<ShareResponse>>(`${this.apiUrl}/share/${token}/revoke`, {});
  }

  getDocumentShares(documentId: number): Observable<ApiResponse<ShareResponse[]>> {
    return this.http.get<ApiResponse<ShareResponse[]>>(`${this.apiUrl}/documents/${documentId}/shares`);
  }
}
