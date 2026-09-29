import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';
import { DocumentResponse, DocumentVersionResponse, DocumentType, DocumentStatus } from '../models/document.model';
import { PageResponse } from './case.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  uploadDocument(caseId: number, file: File, title: string, documentType: string, description?: string): Observable<DocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    return this.http.post<ApiResponse<DocumentResponse>>(`${this.apiUrl}/cases/${caseId}/documents/upload`, formData).pipe(
      map(res => res.data)
    );
  }

  uploadNewVersion(documentId: number, file: File, changeSummary?: string): Observable<ApiResponse<DocumentResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    if (changeSummary) formData.append('changeSummary', changeSummary);

    return this.http.post<ApiResponse<DocumentResponse>>(`${this.apiUrl}/documents/${documentId}/version`, formData);
  }

  getDocumentsByCase(caseId: number): Observable<DocumentResponse[]> {
    return this.http.get<ApiResponse<DocumentResponse[]>>(`${this.apiUrl}/cases/${caseId}/documents`).pipe(
      map(res => res.data || [])
    );
  }

  getDocumentById(id: number): Observable<DocumentResponse> {
    return this.http.get<ApiResponse<DocumentResponse>>(`${this.apiUrl}/documents/${id}`).pipe(
      map(res => res.data)
    );
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${id}/download`, {
      responseType: 'blob'
    });
  }

  getDocumentVersions(documentId: number): Observable<ApiResponse<DocumentVersionResponse[]>> {
    return this.http.get<ApiResponse<DocumentVersionResponse[]>>(`${this.apiUrl}/documents/${documentId}/versions`);
  }

  searchDocuments(page: number = 0, size: number = 10, type?: DocumentType, status?: DocumentStatus, query?: string): Observable<ApiResponse<PageResponse<DocumentResponse>>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (type) params = params.set('documentType', type);
    if (status) params = params.set('status', status);
    if (query) params = params.set('query', query);

    return this.http.get<ApiResponse<PageResponse<DocumentResponse>>>(`${this.apiUrl}/documents`, { params });
  }

  getAllDocuments(): Observable<DocumentResponse[]> {
    return this.searchDocuments(0, 100).pipe(
      map(res => res.data?.content || [])
    );
  }
}
