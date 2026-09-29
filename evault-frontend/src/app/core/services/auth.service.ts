import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, JwtResponse, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  // Signals for modern reactive state in Angular 21
  currentUser = signal<JwtResponse | null>(this.getStoredUser());

  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);
  userFullName = computed(() => this.currentUser()?.fullName || 'User');
  badgeNumber = computed(() => this.currentUser()?.badgeNumber || '');
  department = computed(() => this.currentUser()?.department || '');

  isSuperAdmin = computed(() => this.currentUser()?.role === 'SUPER_ADMIN');
  isOfficer = computed(() => this.currentUser()?.role === 'INVESTIGATING_OFFICER');
  isProsecutor = computed(() => this.currentUser()?.role === 'PROSECUTOR');
  isJudge = computed(() => this.currentUser()?.role === 'JUDGE');
  isLawyer = computed(() => this.currentUser()?.role === 'LAWYER');
  isCourtStaff = computed(() => this.currentUser()?.role === 'COURT_STAFF');

  hasRole(role: string): boolean {
    return this.userRole() === role;
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  demoLogin(role: string): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.apiUrl}/demo-login`, { role }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  logout(): void {
    if (this.getToken()) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: () => {},
        complete: () => this.clearSession()
      });
    } else {
      this.clearSession();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('evault_token');
  }

  private setSession(authData: JwtResponse): void {
    localStorage.setItem('evault_token', authData.token);
    localStorage.setItem('evault_user', JSON.stringify(authData));
    this.currentUser.set(authData);
  }

  private clearSession(): void {
    localStorage.removeItem('evault_token');
    localStorage.removeItem('evault_user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private getStoredUser(): JwtResponse | null {
    const raw = localStorage.getItem('evault_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
