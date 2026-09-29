import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-page">
      <!-- Background Graphic Gradients -->
      <div class="bg-pattern"></div>

      <div class="login-container">
        <!-- Brand / Header Card -->
        <div class="login-card">
          <div class="portal-header">
            <div class="emblem-wrapper">
              <span class="material-icons emblem-icon">gavel</span>
            </div>
            <div class="header-titles">
              <span class="sub-agency">DIGITAL COURTS & EVIDENCE REPOSITORY</span>
              <h1 class="main-title">eVault Judicial Portal</h1>
            </div>
          </div>

          <div class="auth-box-intro">
            <h2>Authorized Departmental Sign-In</h2>
            <p>Access case dockets, verify cryptographic anchors, and maintain evidence chain of custody.</p>
          </div>

          @if (errorMessage) {
            <div class="gov-alert gov-alert-danger">
              <span class="material-icons">error</span>
              <div>
                <strong>Authentication Failed</strong>
                <p>{{ errorMessage }}</p>
              </div>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label class="gov-label" for="email">Official Email Address</label>
              <div class="input-with-icon">
                <span class="material-icons input-icon">email</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  class="gov-input icon-pad"
                  placeholder="e.g. judge@evault.demo"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label class="gov-label" for="password">Security Password</label>
                <span class="secure-tag">256-Bit Encrypted</span>
              </div>
              <div class="input-with-icon">
                <span class="material-icons input-icon">lock</span>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  required
                  class="gov-input icon-pad password-field"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  class="password-toggle-btn"
                  (click)="showPassword = !showPassword"
                  [title]="showPassword ? 'Hide password' : 'Show password'"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                >
                  <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            @if (selectedRoleName) {
              <div class="selected-role-feedback">
                <span class="material-icons check-icon">check_circle</span>
                <span class="feedback-text">
                  Selected Role: <strong>{{ selectedRoleName }}</strong> (Credentials loaded into form)
                </span>
              </div>
            }

            <button type="submit" class="gov-btn gov-btn-primary submit-btn" [disabled]="loading">
              @if (loading) {
                <div class="spinner-sm"></div>
                <span>Authenticating Credentials...</span>
              } @else {
                <span class="material-icons">login</span>
                <span>Sign In to Vault</span>
              }
            </button>
          </form>

          <!-- SIH Demo Access Section -->
          <div class="persona-section demo-access-section">
            <div class="demo-section-header">
              <div class="demo-badge-wrap">
                <span class="material-icons-outlined demo-badge-icon">badge</span>
                <span class="demo-main-badge">SIH Demo Access</span>
              </div>
              <p class="demo-subtitle">Select a role to fill the demo credentials.</p>
              <span class="demo-note">Demo accounts are for presentation purposes only.</span>
            </div>

            <div class="personas-grid">
              <!-- 1. Judge -->
              <button 
                type="button" 
                class="persona-card" 
                [class.selected]="selectedRoleKey === 'judge'"
                (click)="selectDemoRole('judge', 'Judge')"
                title="Fill Judge credentials"
                aria-label="Select Judge demo role"
              >
                <div class="persona-icon-wrap judge">
                  <span class="material-icons">gavel</span>
                </div>
                <div class="persona-text">
                  <span class="p-name">Judge</span>
                  <span class="p-dept">Judicial Bench</span>
                </div>
                @if (selectedRoleKey === 'judge') {
                  <span class="p-active-badge">✓ Selected</span>
                }
              </button>

              <!-- 2. Investigating Officer -->
              <button 
                type="button" 
                class="persona-card" 
                [class.selected]="selectedRoleKey === 'officer'"
                (click)="selectDemoRole('officer', 'Investigating Officer')"
                title="Fill Investigating Officer credentials"
                aria-label="Select Investigating Officer demo role"
              >
                <div class="persona-icon-wrap officer">
                  <span class="material-icons">local_police</span>
                </div>
                <div class="persona-text">
                  <span class="p-name">Investigating Officer</span>
                  <span class="p-dept">Law Enforcement</span>
                </div>
                @if (selectedRoleKey === 'officer') {
                  <span class="p-active-badge">✓ Selected</span>
                }
              </button>

              <!-- 3. Prosecutor -->
              <button 
                type="button" 
                class="persona-card" 
                [class.selected]="selectedRoleKey === 'prosecutor'"
                (click)="selectDemoRole('prosecutor', 'Prosecutor')"
                title="Fill Prosecutor credentials"
                aria-label="Select Prosecutor demo role"
              >
                <div class="persona-icon-wrap prosecutor">
                  <span class="material-icons">balance</span>
                </div>
                <div class="persona-text">
                  <span class="p-name">Prosecutor</span>
                  <span class="p-dept">State Prosecution</span>
                </div>
                @if (selectedRoleKey === 'prosecutor') {
                  <span class="p-active-badge">✓ Selected</span>
                }
              </button>

              <!-- 4. Defense Advocate -->
              <button 
                type="button" 
                class="persona-card" 
                [class.selected]="selectedRoleKey === 'lawyer'"
                (click)="selectDemoRole('lawyer', 'Defense Advocate')"
                title="Fill Defense Advocate credentials"
                aria-label="Select Defense Advocate demo role"
              >
                <div class="persona-icon-wrap lawyer">
                  <span class="material-icons">work</span>
                </div>
                <div class="persona-text">
                  <span class="p-name">Defense Advocate</span>
                  <span class="p-dept">Bar Council</span>
                </div>
                @if (selectedRoleKey === 'lawyer') {
                  <span class="p-active-badge">✓ Selected</span>
                }
              </button>

              <!-- 5. Administrator -->
              <button 
                type="button" 
                class="persona-card admin-span" 
                [class.selected]="selectedRoleKey === 'admin'"
                (click)="selectDemoRole('admin', 'Administrator')"
                title="Fill Administrator credentials"
                aria-label="Select Administrator demo role"
              >
                <div class="persona-icon-wrap admin">
                  <span class="material-icons">admin_panel_settings</span>
                </div>
                <div class="persona-text">
                  <span class="p-name">Administrator</span>
                  <span class="p-dept">eVault Administration</span>
                </div>
                @if (selectedRoleKey === 'admin') {
                  <span class="p-active-badge">✓ Selected</span>
                }
              </button>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="card-footer">
            <div class="security-note">
              <span class="material-icons lock-sm">verified_user</span>
              <span>Section 65B Indian Evidence Act & BNSS Compliant Cryptographic Ledger</span>
            </div>
            <div class="footer-nav">
              <a routerLink="/" class="back-link">
                <span class="material-icons">arrow_back</span>
                <span>Return to Portal Homepage</span>
              </a>
              <a routerLink="/verification" class="back-link">
                <span class="material-icons">verified</span>
                <span>Independent Verifier</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background-color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 16px;
      position: relative;
      box-sizing: border-box;
      overflow-y: auto;
    }

    .bg-pattern {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.12) 0%, transparent 70%),
                  radial-gradient(circle at 10% 90%, rgba(217, 119, 6, 0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .login-container {
      width: 100%;
      max-width: 580px;
      margin: 20px auto;
      position: relative;
      z-index: 10;
    }

    .login-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 14px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
      padding: 36px 36px 28px 36px;
    }

    .portal-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 22px;
    }

    .emblem-wrapper {
      width: 48px;
      height: 48px;
      background: #0f172a;
      border: 2px solid #d97706;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .emblem-icon {
        color: #f59e0b;
        font-size: 26px;
      }
    }

    .header-titles {
      display: flex;
      flex-direction: column;
    }

    .sub-agency {
      font-size: 0.65rem;
      font-family: var(--font-mono);
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .main-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin: 0;
    }

    .auth-box-intro {
      margin-bottom: 22px;

      h2 {
        font-size: 1.15rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 0.8125rem;
        color: #64748b;
        margin: 0;
        line-height: 1.45;
      }
    }

    .login-form {
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .secure-tag {
      font-size: 0.6875rem;
      font-family: var(--font-mono);
      color: #15803d;
      font-weight: 600;
      background: #f0fdf4;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #bbf7d0;
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
      position: relative;

      .input-icon {
        position: absolute;
        left: 12px;
        color: #64748b;
        font-size: 18px;
        pointer-events: none;
      }

      .icon-pad {
        padding-left: 38px;
      }

      .password-field {
        padding-right: 40px;
      }

      .password-toggle-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 4px;

        &:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .material-icons {
          font-size: 18px;
        }
      }
    }

    /* Selected Role Form Feedback Banner */
    .selected-role-feedback {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 9px 12px;
      margin-bottom: 14px;
      animation: bannerFade 0.2s ease-out;

      .check-icon {
        font-size: 18px;
        color: #2563eb;
        flex-shrink: 0;
      }

      .feedback-text {
        font-size: 0.75rem;
        color: #1e40af;
        line-height: 1.35;

        strong {
          font-weight: 700;
          color: #1e3a8a;
        }
      }
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      font-size: 0.9375rem;
      font-weight: 700;
      border-radius: 8px;
      margin-top: 4px;
    }

    .spinner-sm {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes bannerFade {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* SIH Demo Access Section */
    .demo-access-section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px dashed #cbd5e1;
    }

    .demo-section-header {
      text-align: center;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .demo-badge-wrap {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4px 12px;
      border-radius: 20px;

      .demo-badge-icon {
        font-size: 16px;
        color: #2563eb;
      }
    }

    .demo-main-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: #1e40af;
      letter-spacing: 0.02em;
    }

    .demo-subtitle {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    .demo-note {
      font-size: 0.6875rem;
      color: #64748b;
      font-style: italic;
    }

    .personas-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .persona-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      cursor: pointer;
      text-align: left;
      transition: all 0.18s ease-in-out;

      &.admin-span {
        grid-column: span 2;
      }

      &:hover {
        background: #ffffff;
        border-color: #2563eb;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
        transform: translateY(-2px);
      }

      &.selected {
        background: #eff6ff;
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25), 0 4px 12px rgba(37, 99, 235, 0.12);
        transform: translateY(-1px);

        .p-name {
          color: #1d4ed8;
        }
      }
    }

    .persona-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .material-icons {
        font-size: 20px;
      }

      &.judge {
        background: #fef3c7;
        color: #b45309;
      }
      &.officer {
        background: #e0f2fe;
        color: #0369a1;
      }
      &.prosecutor {
        background: #f3e8ff;
        color: #7e22ce;
      }
      &.lawyer {
        background: #ffedd5;
        color: #c2410c;
      }
      &.admin {
        background: #fee2e2;
        color: #b91c1c;
      }
    }

    .persona-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;

      .p-name {
        font-size: 0.875rem;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.25;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
      }

      .p-dept {
        font-size: 0.6875rem;
        color: #64748b;
        line-height: 1.25;
        margin-top: 2px;
        white-space: normal;
        overflow: visible;
      }
    }

    .p-active-badge {
      margin-left: auto;
      font-size: 0.625rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: #2563eb;
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 12px;
      flex-shrink: 0;
      animation: badgePop 0.2s ease-out;
    }

    @keyframes badgePop {
      from { transform: scale(0.85); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 520px) {
      .personas-grid {
        grid-template-columns: 1fr;
      }
      .persona-card.admin-span {
        grid-column: span 1;
      }
    }

    /* Footer */
    .card-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .security-note {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.6875rem;
      color: #64748b;
      margin-bottom: 12px;

      .lock-sm {
        font-size: 14px;
        color: #16a34a;
      }
    }

    .footer-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #1e3a8a;
      text-decoration: none;

      .material-icons {
        font-size: 14px;
      }

      &:hover {
        color: #2563eb;
        text-decoration: underline;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPassword = false;

  selectedRoleKey: string | null = null;
  selectedRoleName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  selectDemoRole(roleKey: string, roleName: string): void {
    const credentials: Record<string, { email: string; pass: string }> = {
      judge: { email: 'judge@evault.demo', pass: 'Password@123' },
      officer: { email: 'officer@evault.demo', pass: 'Password@123' },
      prosecutor: { email: 'prosecutor@evault.demo', pass: 'Password@123' },
      lawyer: { email: 'lawyer@evault.demo', pass: 'Password@123' },
      admin: { email: 'admin@evault.demo', pass: 'Password@123' }
    };

    const target = credentials[roleKey];
    if (target) {
      this.email = target.email;
      this.password = target.pass;
      this.selectedRoleKey = roleKey;
      this.selectedRoleName = roleName;
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please provide both email address and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.message || 'Invalid credentials.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Authentication service unreachable or invalid credentials.';
      }
    });
  }
}
