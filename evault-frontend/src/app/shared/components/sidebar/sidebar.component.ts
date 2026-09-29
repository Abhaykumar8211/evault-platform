import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- =========================================================
         MOBILE MENU BUTTON
         ========================================================= -->
    <button
      class="mobile-menu-btn"
      type="button"
      (click)="toggleMobileSidebar()"
      [attr.aria-label]="mobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'"
      [attr.aria-expanded]="mobileSidebarOpen">

      <span class="material-icons">
        {{ mobileSidebarOpen ? 'close' : 'menu' }}
      </span>
    </button>


    <!-- =========================================================
         MOBILE OVERLAY
         ========================================================= -->
    @if (mobileSidebarOpen) {
      <div
        class="sidebar-overlay"
        (click)="closeMobileSidebar()"
        aria-hidden="true">
      </div>
    }


    <!-- =========================================================
         SIDEBAR
         ========================================================= -->
    <aside
      class="app-sidebar"
      [class.mobile-open]="mobileSidebarOpen">

      <!-- Mobile Sidebar Header -->
      <div class="mobile-sidebar-header">
        <div class="mobile-sidebar-brand">
          <div class="mobile-brand-icon">
            <span class="material-icons">gavel</span>
          </div>

          <div>
            <strong>eVault</strong>
            <span>Digital Legal Vault</span>
          </div>
        </div>

        <button
          type="button"
          class="mobile-close-btn"
          (click)="closeMobileSidebar()"
          aria-label="Close navigation menu">

          <span class="material-icons">close</span>
        </button>
      </div>


      <!-- =======================================================
           SIDEBAR TOP
           ======================================================= -->
      <div class="sidebar-top">

        <!-- CORE REGISTRIES -->
        <div class="sidebar-section">

          <span class="section-title">
            CORE REGISTRIES
          </span>

          <nav class="nav-menu">

            <a
              routerLink="/dashboard"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-item"
              (click)="closeMobileSidebar()">

              <span class="material-icons">
                dashboard
              </span>

              <span>
                Judicial Dashboard
              </span>

            </a>


            <a
              routerLink="/cases"
              routerLinkActive="active"
              class="nav-item"
              (click)="closeMobileSidebar()">

              <span class="material-icons">
                folder_shared
              </span>

              <span>
                Case Dockets
              </span>

            </a>


            <a
              routerLink="/documents"
              routerLinkActive="active"
              class="nav-item"
              (click)="closeMobileSidebar()">

              <span class="material-icons">
                description
              </span>

              <span>
                Legal Document Vault
              </span>

            </a>


            <a
              routerLink="/evidence"
              routerLinkActive="active"
              class="nav-item"
              (click)="closeMobileSidebar()">

              <span class="material-icons">
                inventory_2
              </span>

              <span>
                Evidence Registry
              </span>

            </a>

          </nav>

        </div>


        <!-- INTEGRITY & CONSENSUS -->
        <div class="sidebar-section">

          <span class="section-title">
            INTEGRITY & CONSENSUS
          </span>

          <nav class="nav-menu">

            <a
              routerLink="/verification"
              routerLinkActive="active"
              class="nav-item highlight-item"
              (click)="closeMobileSidebar()">

              <span class="material-icons">
                verified_user
              </span>

              <span>
                Verify Integrity
              </span>

            </a>


            @if (
              authService.isSuperAdmin() ||
              authService.isJudge() ||
              authService.isOfficer() ||
              authService.isProsecutor()
            ) {

              <a
                routerLink="/audit"
                routerLinkActive="active"
                class="nav-item"
                (click)="closeMobileSidebar()">

                <span class="material-icons">
                  policy
                </span>

                <span>
                  Immutable Audit Trail
                </span>

              </a>

            }

          </nav>

        </div>

      </div>


      <!-- =======================================================
           SIDEBAR FOOTER
           ======================================================= -->
      <div class="sidebar-footer">

        <!-- Live Consensus Status -->
        <div class="network-status-badge">

          <div class="pulse-indicator">
            <span class="pulse-dot"></span>
            <span class="pulse-ring"></span>
          </div>

          <div class="status-info">

            <span class="net-name">
              EVM Ledger & IPFS
            </span>

            <span class="net-status">
              Consensus Active
            </span>

          </div>

        </div>


        <!-- Authenticated User -->
        @if (authService.isAuthenticated()) {

          <div class="sidebar-user-card">

            <div class="user-avatar">
              {{ getUserInitials() }}
            </div>

            <div class="user-meta">

              <span
                class="user-fullname"
                [title]="authService.userFullName()">

                {{ authService.userFullName() }}

              </span>

              <span class="user-designation">
                {{ formatRole(authService.userRole()) }}
              </span>

            </div>

          </div>


          <!-- Logout -->
          <button
            type="button"
            (click)="handleLogout()"
            class="sidebar-logout-btn"
            title="Sign out of current judicial session">

            <span class="material-icons logout-icon">
              logout
            </span>

            <span>
              Sign Out of Vault
            </span>

          </button>

        }

      </div>

    </aside>
  `,


  styles: [`

    /* =========================================================
       DESKTOP SIDEBAR
       ========================================================= */

    .app-sidebar {
      width: 250px;
      min-width: 250px;

      background: #ffffff;

      border-right: 1px solid #e2e8f0;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      padding: 16px 14px;

      height: 100%;
      max-height: 100%;

      overflow-y: auto;
      overflow-x: hidden;

      flex-shrink: 0;

      box-shadow: 1px 0 3px rgba(0, 0, 0, 0.02);

      box-sizing: border-box;

      z-index: 1100;
    }


    /* =========================================================
       MOBILE HEADER INSIDE SIDEBAR
       Hidden on desktop
       ========================================================= */

    .mobile-sidebar-header {
      display: none;
    }


    /* =========================================================
       MOBILE MENU BUTTON
       Hidden on desktop
       ========================================================= */

    .mobile-menu-btn {
      display: none;
    }


    /* =========================================================
       MOBILE OVERLAY
       Hidden on desktop
       ========================================================= */

    .sidebar-overlay {
      display: none;
    }


    /* =========================================================
       SIDEBAR SECTION
       ========================================================= */

    .sidebar-section {
      margin-bottom: 20px;
    }


    .section-title {
      font-size: 0.6875rem;
      font-weight: 800;

      color: #64748b;

      letter-spacing: 0.08em;

      margin-bottom: 8px;

      display: block;

      padding-left: 10px;
    }


    /* =========================================================
       NAVIGATION
       ========================================================= */

    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }


    .nav-item {
      display: flex;
      align-items: center;

      gap: 12px;

      padding: 10px 12px;

      color: #334155;

      text-decoration: none;

      font-size: 0.875rem;

      font-weight: 500;

      border-radius: 8px;

      transition:
        background-color 0.15s ease,
        color 0.15s ease,
        transform 0.15s ease;

      min-width: 0;

      box-sizing: border-box;
    }


    .nav-item .material-icons {
      font-size: 20px;

      color: #64748b;

      transition: color 0.15s ease;

      flex-shrink: 0;
    }


    .nav-item > span:last-child {
      min-width: 0;
      overflow: hidden;

      text-overflow: ellipsis;
      white-space: nowrap;
    }


    .nav-item:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }


    .nav-item:hover .material-icons {
      color: #1e3a8a;
    }


    .nav-item.active {
      background-color: #eff6ff;

      color: #1e40af;

      font-weight: 700;
    }


    .nav-item.active .material-icons {
      color: #2563eb;
    }


    /* =========================================================
       VERIFY INTEGRITY
       ========================================================= */

    .nav-item.highlight-item {
      color: #15803d;
    }


    .nav-item.highlight-item .material-icons {
      color: #16a34a;
    }


    .nav-item.highlight-item:hover {
      background-color: #f0fdf4;
      color: #166534;
    }


    .nav-item.highlight-item.active {
      background-color: #dcfce7;
      color: #14532d;
    }


    .nav-item.highlight-item.active .material-icons {
      color: #15803d;
    }


    /* =========================================================
       FOOTER
       ========================================================= */

    .sidebar-footer {
      border-top: 1px solid #e2e8f0;

      padding-top: 14px;

      display: flex;
      flex-direction: column;

      gap: 10px;

      margin-top: auto;
    }


    /* =========================================================
       NETWORK STATUS
       ========================================================= */

    .network-status-badge {
      display: flex;
      align-items: center;

      gap: 10px;

      background: #f8fafc;

      border: 1px solid #e2e8f0;

      padding: 8px 12px;

      border-radius: 8px;

      box-sizing: border-box;
    }


    .pulse-indicator {
      position: relative;

      width: 10px;
      height: 10px;

      display: flex;
      align-items: center;
      justify-content: center;

      flex-shrink: 0;
    }


    .pulse-dot {
      width: 8px;
      height: 8px;

      border-radius: 50%;

      background-color: #16a34a;
    }


    .pulse-ring {
      position: absolute;

      width: 16px;
      height: 16px;

      border-radius: 50%;

      border: 2px solid rgba(22, 163, 74, 0.4);

      animation: pulse 2s infinite;
    }


    .status-info {
      display: flex;
      flex-direction: column;

      min-width: 0;
    }


    .net-name {
      font-size: 0.75rem;

      font-weight: 700;

      color: #1e293b;

      white-space: nowrap;
    }


    .net-status {
      font-size: 0.6875rem;

      color: #15803d;

      font-weight: 600;
    }


    /* =========================================================
       USER CARD
       ========================================================= */

    .sidebar-user-card {
      display: flex;
      align-items: center;

      gap: 10px;

      padding: 8px 10px;

      background: #f8fafc;

      border: 1px solid #e2e8f0;

      border-radius: 8px;

      min-width: 0;
    }


    .user-avatar {
      width: 34px;
      height: 34px;

      border-radius: 50%;

      background: #1e3a8a;

      color: #ffffff;

      font-weight: 700;

      font-size: 0.75rem;

      display: flex;
      align-items: center;
      justify-content: center;

      flex-shrink: 0;
    }


    .user-meta {
      display: flex;
      flex-direction: column;

      overflow: hidden;

      min-width: 0;
    }


    .user-fullname {
      font-size: 0.8125rem;

      font-weight: 700;

      color: #0f172a;

      white-space: nowrap;

      overflow: hidden;

      text-overflow: ellipsis;
    }


    .user-designation {
      font-size: 0.6875rem;

      font-weight: 700;

      color: #2563eb;

      letter-spacing: 0.04em;

      white-space: nowrap;
    }


    /* =========================================================
       LOGOUT
       ========================================================= */

    .sidebar-logout-btn {
      display: flex;

      align-items: center;

      justify-content: center;

      gap: 8px;

      width: 100%;

      padding: 9px 14px;

      background: #fef2f2;

      border: 1px solid #fecaca;

      border-radius: 8px;

      color: #b91c1c;

      font-size: 0.8125rem;

      font-weight: 700;

      cursor: pointer;

      transition: all 0.15s ease-in-out;

      box-sizing: border-box;
    }


    .logout-icon {
      font-size: 16px;

      color: #dc2626;
    }


    .sidebar-logout-btn:hover {
      background: #fee2e2;

      border-color: #fca5a5;

      color: #991b1b;

      transform: translateY(-1px);

      box-shadow: 0 2px 4px rgba(220, 38, 38, 0.1);
    }


    /* =========================================================
       PULSE ANIMATION
       ========================================================= */

    @keyframes pulse {

      0% {
        transform: scale(0.8);
        opacity: 1;
      }

      100% {
        transform: scale(1.6);
        opacity: 0;
      }

    }


    /* =========================================================
       TABLET
       ========================================================= */

    @media (max-width: 900px) {

      .app-sidebar {
        width: 230px;
        min-width: 230px;
      }

      .nav-item {
        padding: 9px 10px;
      }

    }


    /* =========================================================
       MOBILE
       ========================================================= */

    @media (max-width: 768px) {

      /*
       * IMPORTANT:
       * Remove sidebar from normal flex layout.
       * This gives the dashboard the complete screen width.
       */

      .app-sidebar {
        position: fixed;

        top: 58px;
        left: 0;

        width: 280px;
        min-width: 280px;

        height: calc(100vh - 58px);

        max-height: calc(100vh - 58px);

        padding: 0 14px 14px;

        transform: translateX(-105%);

        transition: transform 0.25s ease;

        box-shadow: 8px 0 30px rgba(15, 23, 42, 0.18);

        z-index: 1100;

        overflow-y: auto;

        overscroll-behavior: contain;
      }


      /*
       * Open sidebar
       */

      .app-sidebar.mobile-open {
        transform: translateX(0);
      }


      /*
       * Mobile sidebar header
       */

      .mobile-sidebar-header {
        height: 58px;

        display: flex;

        align-items: center;

        justify-content: space-between;

        border-bottom: 1px solid #e2e8f0;

        margin: 0 -14px 14px;

        padding: 0 14px;

        background: #ffffff;

        position: sticky;

        top: 0;

        z-index: 5;
      }


      .mobile-sidebar-brand {
        display: flex;

        align-items: center;

        gap: 9px;

        min-width: 0;
      }


      .mobile-brand-icon {
        width: 34px;
        height: 34px;

        display: flex;

        align-items: center;
        justify-content: center;

        background: rgba(217, 119, 6, 0.12);

        border: 1px solid rgba(245, 158, 11, 0.35);

        border-radius: 8px;

        color: #d97706;

        flex-shrink: 0;
      }


      .mobile-brand-icon .material-icons {
        font-size: 19px;
      }


      .mobile-sidebar-brand > div:last-child {
        display: flex;

        flex-direction: column;

        min-width: 0;
      }


      .mobile-sidebar-brand strong {
        font-size: 0.95rem;

        color: #0f172a;

        line-height: 1.2;
      }


      .mobile-sidebar-brand span {
        font-size: 0.6rem;

        color: #64748b;

        text-transform: uppercase;

        letter-spacing: 0.04em;

        white-space: nowrap;
      }


      /*
       * Close button
       */

      .mobile-close-btn {
        width: 34px;
        height: 34px;

        display: flex;

        align-items: center;
        justify-content: center;

        border: 1px solid #e2e8f0;

        background: #f8fafc;

        color: #334155;

        border-radius: 8px;

        cursor: pointer;

        flex-shrink: 0;
      }


      .mobile-close-btn .material-icons {
        font-size: 20px;
      }


      /*
       * Hamburger
       */

      .mobile-menu-btn {
        position: fixed;

        top: 67px;
        left: 10px;

        width: 42px;
        height: 42px;

        display: flex;

        align-items: center;
        justify-content: center;

        background: #0f172a;

        color: #ffffff;

        border: 1px solid #334155;

        border-radius: 10px;

        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);

        cursor: pointer;

        z-index: 1200;

        transition: all 0.2s ease;
      }


      .mobile-menu-btn:hover {
        background: #1e293b;
      }


      .mobile-menu-btn .material-icons {
        font-size: 23px;
      }


      /*
       * Overlay
       */

      .sidebar-overlay {
        display: block;

        position: fixed;

        top: 58px;
        left: 0;
        right: 0;
        bottom: 0;

        background: rgba(15, 23, 42, 0.45);

        z-index: 1050;

        backdrop-filter: blur(1px);
      }


      /*
       * Better mobile spacing
       */

      .sidebar-section {
        margin-bottom: 18px;
      }


      .section-title {
        padding-left: 8px;
      }


      .nav-item {
        padding: 11px 12px;

        min-height: 44px;

        font-size: 0.875rem;
      }


      .nav-item .material-icons {
        font-size: 20px;
      }


      .sidebar-footer {
        padding-top: 14px;

        margin-top: 20px;
      }

    }


    /* =========================================================
       SMALL MOBILE
       ========================================================= */

    @media (max-width: 480px) {

      .app-sidebar {
        top: 56px;

        height: calc(100vh - 56px);

        max-height: calc(100vh - 56px);

        width: 280px;
        min-width: 280px;
      }


      .sidebar-overlay {
        top: 56px;
      }


      .mobile-menu-btn {
        top: 64px;

        left: 8px;

        width: 40px;
        height: 40px;
      }


      .mobile-sidebar-header {
        height: 54px;
      }


      .network-status-badge {
        padding: 9px 10px;
      }


      .sidebar-user-card {
        padding: 8px;
      }


      .sidebar-logout-btn {
        min-height: 42px;
      }

    }


    /* =========================================================
       VERY SMALL MOBILE
       ========================================================= */

    @media (max-width: 360px) {

      .app-sidebar {
        width: 270px;
        min-width: 270px;
      }


      .mobile-menu-btn {
        width: 38px;
        height: 38px;
      }


      .nav-item {
        padding: 10px;
      }


      .nav-item .material-icons {
        font-size: 19px;
      }


      .mobile-sidebar-brand strong {
        font-size: 0.9rem;
      }

    }

  `]
})
export class SidebarComponent {

  /*
   * Mobile sidebar state
   */
  mobileSidebarOpen = false;


  constructor(public authService: AuthService) {}


  /*
   * Open / close mobile sidebar
   */
  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;

    this.updateBodyScroll();
  }


  /*
   * Close mobile sidebar
   */
  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;

    this.updateBodyScroll();
  }


  /*
   * Prevent page scrolling when drawer is open
   */
  private updateBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    if (window.innerWidth <= 768) {
      document.body.style.overflow = this.mobileSidebarOpen
        ? 'hidden'
        : '';
    }
  }


  /*
   * Get user initials
   */
  getUserInitials(): string {

    const name = this.authService.userFullName();

    if (!name) {
      return 'U';
    }

    const parts = name.split(' ');

    if (parts.length >= 2) {
      return (
        parts[0][0] +
        parts[parts.length - 1][0]
      ).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }


  /*
   * Format user role
   */
  formatRole(role: string | null): string {

    if (!role) {
      return 'OFFICIAL';
    }

    return role.replace(/_/g, ' ');
  }


  /*
   * Logout
   */
  handleLogout(): void {

    this.closeMobileSidebar();

    this.authService.logout();
  }

}