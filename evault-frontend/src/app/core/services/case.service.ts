import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';
import { CaseCreateRequest, CaseResponse, CaseTimelineItem } from '../models/case.model';

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
  private apiUrl = 'http://localhost:8080/api/v1/cases';

  constructor(private http: HttpClient) {}

  getCases(page: number = 0, size: number = 10, status?: string, query?: string): Observable<ApiResponse<PageResponse<CaseResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) params = params.set('status', status);
    if (query) params = params.set('query', query);

    return this.http.get<ApiResponse<PageResponse<CaseResponse>>>(this.apiUrl, { params });
  }

  getAllCases(): Observable<CaseResponse[]> {
    return this.getCases(0, 100).pipe(
      map(res => res.data?.content || [])
    );
  }

  getCaseById(id: number): Observable<CaseResponse> {
    return this.http.get<ApiResponse<CaseResponse>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createCase(request: CaseCreateRequest): Observable<CaseResponse> {
    return this.http.post<ApiResponse<CaseResponse>>(this.apiUrl, request).pipe(
      map(res => res.data)
    );
  }

  updateCase(id: number, request: any): Observable<ApiResponse<CaseResponse>> {
    return this.http.put<ApiResponse<CaseResponse>>(`${this.apiUrl}/${id}`, request);
  }

  getCaseTimeline(id: number): Observable<ApiResponse<CaseTimelineItem[]>> {
    return this.http.get<ApiResponse<CaseTimelineItem[]>>(`${this.apiUrl}/${id}/timeline`);
  }
}
