import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cases',
    loadComponent: () => import('./features/cases/case-list.component').then(m => m.CaseListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cases/:id',
    loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'documents',
    loadComponent: () => import('./features/documents/document-list.component').then(m => m.DocumentListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'evidence',
    loadComponent: () => import('./features/evidence/evidence-list.component').then(m => m.EvidenceListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'verification',
    loadComponent: () => import('./features/verification/verification.component').then(m => m.VerificationComponent)
  },
  {
    path: 'audit',
    loadComponent: () => import('./features/audit/audit-list.component').then(m => m.AuditListComponent),
    canActivate: [authGuard],
    data: { roles: ['SUPER_ADMIN', 'JUDGE', 'INVESTIGATING_OFFICER', 'PROSECUTOR'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
