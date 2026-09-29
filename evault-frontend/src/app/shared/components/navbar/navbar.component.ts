import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-navbar">
      <div class="navbar-left">
        <a routerLink="/dashboard" class="brand-link">
          <div class="emblem-container">
            <span class="material-icons emblem-icon">gavel</span>
          </div>

          <div class="brand-text">
            <span class="brand-title">eVault</span>
            <span class="brand-subtitle">National Digital Legal & Evidence Vault</span>
          </div>
        </a>
      </div>

      <div class="navbar-center">
        <a routerLink="/verification" class="verify-badge-btn" title="Instant Cryptographic Verification">
          <span class="material-icons shield-icon">verified_user</span>
          <span>Verify Document</span>
        </a>
      </div>

      <div class="navbar-right">
        @if (authService.isAuthenticated()) {
          <div class="user-identity-pill">
            <div class="avatar-circle">
              {{ getUserInitials() }}
            </div>

            <div class="user-info">
              <span class="user-name">{{ authService.userFullName() }}</span>
              <span class="user-role-badge">{{ formatRole(authService.userRole()) }}</span>
            </div>
          </div>
        } @else {
          <a routerLink="/auth/login" class="gov-btn gov-btn-primary btn-sm">
            <span class="material-icons">login</span>
            <span>Judicial Login</span>
          </a>
        }
      </div>
    </header>
  `,

  styles: [`
    /* =========================================================
       MAIN NAVBAR
       ========================================================= */

    .app-navbar {
      height: 64px;
      flex-shrink: 0;
      background-color: #0f172a;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      border-bottom: 2px solid #1e293b;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      width: 100%;
    }


    /* =========================================================
       LEFT / BRAND
       ========================================================= */

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 0;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      min-width: 0;
    }

    .emblem-container {
      width: 38px;
      height: 38px;
      background: rgba(217, 119, 6, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f59e0b;
      flex-shrink: 0;
    }

    .emblem-icon {
      font-size: 20px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand-title {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      color: #ffffff;
    }

    .brand-subtitle {
      font-size: 0.65rem;
      color: #94a3b8;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      font-weight: 600;
      white-space: nowrap;
    }


    /* =========================================================
       CENTER VERIFY BUTTON
       ========================================================= */

    .navbar-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .verify-badge-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .shield-icon {
      font-size: 16px;
    }

    .verify-badge-btn:hover {
      background: rgba(16, 185, 129, 0.25);
      color: #6ee7b7;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
    }


    /* =========================================================
       RIGHT / USER
       ========================================================= */

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .user-identity-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #1e293b;
      border: 1px solid #334155;
      padding: 5px 14px 5px 6px;
      border-radius: 9999px;
      user-select: none;
      max-width: 260px;
    }

    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #2563eb;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.15);
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.15;
      min-width: 0;
    }

    .user-name {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 190px;
    }

    .user-role-badge {
      font-size: 0.625rem;
      font-weight: 700;
      color: #93c5fd;
      letter-spacing: 0.05em;
    }


    /* =========================================================
       TABLET
       ========================================================= */

    @media (max-width: 900px) {

      .app-navbar {
        padding: 0 16px;
      }

      .brand-subtitle {
        font-size: 0.58rem;
      }

      .user-name {
        max-width: 150px;
      }

    }


    /* =========================================================
       MOBILE
       ========================================================= */

    @media (max-width: 768px) {

      .app-navbar {
        height: 58px;
        padding: 0 12px;
        gap: 8px;
      }

      .navbar-left {
        flex: 1;
        min-width: 0;
      }

      .brand-link {
        gap: 8px;
        min-width: 0;
      }

      .emblem-container {
        width: 34px;
        height: 34px;
      }

      .emblem-icon {
        font-size: 18px;
      }

      .brand-text {
        min-width: 0;
      }

      .brand-title {
        font-size: 1rem;
      }

      .brand-subtitle {
        font-size: 0.52rem;
        line-height: 1.15;
        max-width: 150px;
        white-space: normal;
      }

      .navbar-center {
        flex-shrink: 0;
      }

      .verify-badge-btn {
        padding: 6px 10px;
        gap: 5px;
        font-size: 0.7rem;
        white-space: nowrap;
      }

      .shield-icon {
        font-size: 14px;
      }

      .navbar-right {
        flex-shrink: 0;
        gap: 0;
      }

      .user-identity-pill {
        padding: 4px;
        border-radius: 50%;
        max-width: none;
      }

      .avatar-circle {
        width: 32px;
        height: 32px;
      }

      .user-info {
        display: none;
      }

    }


    /* =========================================================
       SMALL MOBILE
       ========================================================= */

    @media (max-width: 480px) {

      .app-navbar {
        height: 56px;
        padding: 0 8px;
        gap: 6px;
      }

      .brand-link {
        gap: 6px;
      }

      .emblem-container {
        width: 32px;
        height: 32px;
      }

      .emblem-icon {
        font-size: 17px;
      }

      .brand-title {
        font-size: 0.95rem;
      }

      .brand-subtitle {
        display: none;
      }

      .verify-badge-btn {
        padding: 6px 9px;
        font-size: 0.68rem;
        gap: 4px;
      }

      .shield-icon {
        font-size: 13px;
      }

      .avatar-circle {
        width: 31px;
        height: 31px;
      }

    }


    /* =========================================================
       VERY SMALL MOBILE
       ========================================================= */

    @media (max-width: 360px) {

      .app-navbar {
        padding: 0 6px;
        gap: 5px;
      }

      .emblem-container {
        width: 30px;
        height: 30px;
      }

      .emblem-icon {
        font-size: 16px;
      }

      .brand-title {
        font-size: 0.9rem;
      }

      .verify-badge-btn {
        padding: 5px 7px;
        font-size: 0.62rem;
      }

      .shield-icon {
        font-size: 12px;
      }

      .avatar-circle {
        width: 30px;
        height: 30px;
        font-size: 0.7rem;
      }

    }

  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  getUserInitials(): string {
    const name = this.authService.userFullName();

    if (!name) return 'U';

    const parts = name.split(' ');

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }

  formatRole(role: string | null): string {
    if (!role) return 'OFFICIAL';

    return role.replace(/_/g, ' ');
  }
}