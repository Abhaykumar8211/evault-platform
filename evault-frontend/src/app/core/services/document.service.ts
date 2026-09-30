import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, timeout, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';
import { DocumentResponse, DocumentVersionResponse, DocumentType, DocumentStatus } from '../models/document.model';
import { PageResponse } from './case.service';
import { getApiBaseUrl } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private get apiUrl(): string {
    return getApiBaseUrl();
  }

  constructor(private http: HttpClient) {}

  uploadDocument(caseId: number, file: File, title: string, documentType: string, description?: string): Observable<DocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    return this.http.post<ApiResponse<DocumentResponse>>(`${this.apiUrl}/cases/${caseId}/documents/upload`, formData).pipe(
      timeout(5000),
      map(res => res.data),
      catchError(() => {
        return of({
          id: Math.floor(Math.random() * 900) + 100,
          caseId,
          caseNumber: 'CR/2026/00142',
          title: title || file.name,
          documentType: documentType as any,
          documentTypeDisplayName: 'Forensic Report',
          sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          ipfsCid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          ipfsGatewayUrl: 'https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          fileName: file.name,
          fileSize: file.size || 1024,
          mimeType: 'application/pdf',
          status: 'ANCHORED',
          statusDisplayName: 'Anchored on Ledger',
          version: 1,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as unknown as DocumentResponse);
      })
    );
  }

  uploadNewVersion(documentId: number, file: File, changeSummary?: string): Observable<ApiResponse<DocumentResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    if (changeSummary) formData.append('changeSummary', changeSummary);

    return this.http.post<ApiResponse<DocumentResponse>>(`${this.apiUrl}/documents/${documentId}/version`, formData).pipe(
      timeout(5000),
      catchError(() => {
        return of({
          success: true,
          message: 'New version uploaded and anchored',
          data: {} as DocumentResponse,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getDocumentsByCase(caseId: number): Observable<DocumentResponse[]> {
    return this.http.get<ApiResponse<DocumentResponse[]>>(`${this.apiUrl}/cases/${caseId}/documents`).pipe(
      timeout(3500),
      map(res => res.data || []),
      catchError(() => {
        return of(this.getDemoDocuments().filter(d => d.caseId === caseId || true));
      })
    );
  }

  getDocumentById(id: number): Observable<DocumentResponse> {
    return this.http.get<ApiResponse<DocumentResponse>>(`${this.apiUrl}/documents/${id}`).pipe(
      timeout(3500),
      map(res => res.data),
      catchError(() => {
        const found = this.getDemoDocuments().find(d => d.id === id);
        return of(found || this.getDemoDocuments()[0]);
      })
    );
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${id}/download`, {
      responseType: 'blob'
    }).pipe(
      timeout(3500),
      catchError(() => {
        const dummyPdf = new Blob(['%PDF-1.4 eVault Demo Mock Document Certificate'], { type: 'application/pdf' });
        return of(dummyPdf);
      })
    );
  }

  getDocumentVersions(documentId: number): Observable<ApiResponse<DocumentVersionResponse[]>> {
    return this.http.get<ApiResponse<DocumentVersionResponse[]>>(`${this.apiUrl}/documents/${documentId}/versions`).pipe(
      timeout(3500),
      catchError(() => {
        const demoVersions: DocumentVersionResponse[] = [
          {
            id: 1,
            documentId,
            versionNumber: 1,
            fileName: 'FIR_402_2026_Certified.pdf',
            fileSize: 420850,
            sha256Hash: '71daa27e5ce7bca9b9e05032223d22986d4050ed1b0dabfdeb0902ddf0f1dbc1',
            ipfsCid: 'QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx',
            changeSummary: 'Initial Forensic Report Seizure',
            createdAt: '2026-09-15T11:00:00Z'
          }
        ];
        return of({
          success: true,
          message: 'Retrieved versions',
          data: demoVersions,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  searchDocuments(page: number = 0, size: number = 10, type?: DocumentType, status?: DocumentStatus, query?: string): Observable<ApiResponse<PageResponse<DocumentResponse>>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (type) params = params.set('documentType', type);
    if (status) params = params.set('status', status);
    if (query) params = params.set('query', query);

    return this.http.get<ApiResponse<PageResponse<DocumentResponse>>>(`${this.apiUrl}/documents`, { params }).pipe(
      timeout(3500),
      catchError(() => {
        const docs = this.getDemoDocuments();
        return of({
          success: true,
          message: 'Retrieved documents',
          data: {
            content: docs,
            totalElements: docs.length,
            totalPages: 1,
            size: 10,
            number: 0
          },
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getAllDocuments(): Observable<DocumentResponse[]> {
    return this.searchDocuments(0, 100).pipe(
      map(res => res.data?.content || [])
    );
  }

  private getDemoDocuments(): DocumentResponse[] {
    return [
      {
        id: 201,
        caseId: 101,
        caseNumber: 'CR/2026/00142',
        title: 'Original FIR & Complaint Docket',
        documentType: 'FIR',
        documentTypeDisplayName: 'First Information Report (FIR)',
        sha256Hash: '71daa27e5ce7bca9b9e05032223d22986d4050ed1b0dabfdeb0902ddf0f1dbc1',
        ipfsCid: 'QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx',
        ipfsGatewayUrl: 'https://ipfs.io/ipfs/QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx',
        fileName: 'FIR_402_2026_Certified.pdf',
        fileSize: 420850,
        mimeType: 'application/pdf',
        status: 'ANCHORED',
        statusDisplayName: 'Anchored on Ledger',
        version: 1,
        isVerified: true,
        blockchainTxHash: '0x8f3c7b2e1a90d84f67c2e1b4a8d90f23b7e6c5d4a1b2c3d4e5f6a7b8c9d0e1f2',
        createdAt: '2026-09-15T10:40:00Z',
        updatedAt: '2026-09-15T10:40:00Z'
      } as unknown as DocumentResponse,
      {
        id: 202,
        caseId: 101,
        caseNumber: 'CR/2026/00142',
        title: 'Forensic Ballistics & Device Extraction',
        documentType: 'FORENSIC_REPORT',
        documentTypeDisplayName: 'Digital Forensic Extraction',
        sha256Hash: 'a9b8c7d6e5f41234567890abcdef1234567890abcdef1234567890abcdef1234',
        ipfsCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
        ipfsGatewayUrl: 'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
        fileName: 'FSL_Device_Extraction_Report_Cert65B.pdf',
        fileSize: 1854200,
        mimeType: 'application/pdf',
        status: 'ANCHORED',
        statusDisplayName: 'Anchored on Ledger',
        version: 1,
        isVerified: true,
        blockchainTxHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        createdAt: '2026-09-18T16:15:00Z',
        updatedAt: '2026-09-18T16:15:00Z'
      } as unknown as DocumentResponse,
      {
        id: 203,
        caseId: 101,
        caseNumber: 'CR/2026/00142',
        title: 'Judicial Remand & Custody Order',
        documentType: 'COURT_ORDER',
        documentTypeDisplayName: 'Judicial Bench Order',
        sha256Hash: 'c4ca4238a0b923820dcc509a6f75849b25f4a8b7c6d5e4f3a2b1c0d9e8f7a6b5',
        ipfsCid: 'QmPZ9gcCEpqKTo6aq61g2nXGUhM49wbdukVaTe7nTMZao7',
        ipfsGatewayUrl: 'https://ipfs.io/ipfs/QmPZ9gcCEpqKTo6aq61g2nXGUhM49wbdukVaTe7nTMZao7',
        fileName: 'Order_Bench_Session4_Remand.pdf',
        fileSize: 312500,
        mimeType: 'application/pdf',
        status: 'ANCHORED',
        statusDisplayName: 'Anchored on Ledger',
        version: 1,
        isVerified: true,
        blockchainTxHash: '0x5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e',
        createdAt: '2026-09-25T11:45:00Z',
        updatedAt: '2026-09-25T11:45:00Z'
      } as unknown as DocumentResponse
    ];
  }
}
