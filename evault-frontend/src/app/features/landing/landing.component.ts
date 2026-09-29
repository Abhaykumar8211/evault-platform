import { Component, HostListener, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-page">
      <!-- 1. Main Sticky Navigation Header (Starts directly at top of viewport) -->
      <header class="main-navbar" [class.scrolled]="isScrolled()">
        <div class="container navbar-container">
          <!-- Brand Identity (Left) -->
          <a (click)="scrollToSection('home', $event)" href="#home" class="brand" aria-label="eVault Home">
            <div class="brand-emblem">
              <span class="material-icons-outlined">gavel</span>
            </div>
            <div class="brand-text">
              <span class="brand-title">eVault</span>
              <span class="brand-subtitle">DECENTRALIZED EVIDENCE VAULT</span>
            </div>
          </a>

          <!-- Navigation Links (Center) -->
          <nav class="desktop-nav" aria-label="Main Navigation">
            <a 
              (click)="scrollToSection('home', $event)" 
              href="#home"
              class="nav-link" 
              [class.active]="activeSection() === 'home'"
            >
              <span>Home</span>
            </a>
            <a 
              (click)="scrollToSection('how-it-works', $event)" 
              href="#how-it-works"
              class="nav-link" 
              [class.active]="activeSection() === 'how-it-works'"
            >
              <span>How It Works</span>
            </a>
            <a 
              (click)="scrollToSection('security', $event)" 
              href="#security"
              class="nav-link" 
              [class.active]="activeSection() === 'security'"
            >
              <span>Security</span>
            </a>
            <a 
              (click)="scrollToSection('features', $event)" 
              href="#features"
              class="nav-link" 
              [class.active]="activeSection() === 'features'"
            >
              <span>Features</span>
            </a>
            <a 
              (click)="scrollToSection('verification', $event)" 
              href="#verification"
              class="nav-link" 
              [class.active]="activeSection() === 'verification'"
            >
              <span>Verification</span>
            </a>
            <a 
              (click)="scrollToSection('about', $event)" 
              href="#about"
              class="nav-link" 
              [class.active]="activeSection() === 'about'"
            >
              <span>About</span>
            </a>
          </nav>

          <!-- Action Buttons (Right) -->
          <div class="header-actions">
            <!-- Secondary CTA: Verify Document -->
            <a 
              routerLink="/verification" 
              class="btn-nav btn-verify" 
              title="Public Cryptographic Integrity Verifier"
              aria-label="Public Document Verifier"
            >
              <span class="material-icons-outlined btn-icon">verified_user</span>
              <span>Verify Document</span>
            </a>

            <!-- Primary CTA: Official Sign In -->
            <a 
              routerLink="/auth/login" 
              class="btn-nav btn-portal" 
              title="Official Sign In"
              aria-label="Official Sign In"
            >
              <span class="material-icons-outlined btn-icon">lock</span>
              <span>Official Sign In</span>
            </a>
          </div>

          <!-- Mobile Hamburger Toggle Button -->
          <button 
            type="button" 
            class="hamburger-btn" 
            (click)="toggleMobileMenu()" 
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Toggle Navigation Menu"
          >
            <span class="material-icons-outlined">
              {{ mobileMenuOpen() ? 'close' : 'menu' }}
            </span>
          </button>
        </div>

        <!-- Mobile Slide-Down Menu Drawer -->
        @if (mobileMenuOpen()) {
          <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <nav class="mobile-nav-links">
              <a (click)="scrollToSection('home', $event)" href="#home" class="mobile-link" [class.active]="activeSection() === 'home'">
                <span class="material-icons-outlined">home</span>
                <span>Home</span>
              </a>
              <a (click)="scrollToSection('how-it-works', $event)" href="#how-it-works" class="mobile-link" [class.active]="activeSection() === 'how-it-works'">
                <span class="material-icons-outlined">account_tree</span>
                <span>How It Works</span>
              </a>
              <a (click)="scrollToSection('security', $event)" href="#security" class="mobile-link" [class.active]="activeSection() === 'security'">
                <span class="material-icons-outlined">shield</span>
                <span>Security</span>
              </a>
              <a (click)="scrollToSection('features', $event)" href="#features" class="mobile-link" [class.active]="activeSection() === 'features'">
                <span class="material-icons-outlined">star_outline</span>
                <span>Features</span>
              </a>
              <a (click)="scrollToSection('verification', $event)" href="#verification" class="mobile-link" [class.active]="activeSection() === 'verification'">
                <span class="material-icons-outlined">verified</span>
                <span>Verification</span>
              </a>
              <a (click)="scrollToSection('about', $event)" href="#about" class="mobile-link" [class.active]="activeSection() === 'about'">
                <span class="material-icons-outlined">info</span>
                <span>About</span>
              </a>
            </nav>

            <div class="mobile-drawer-actions">
              <a routerLink="/verification" (click)="closeMobileMenu()" class="btn-mobile btn-mobile-verify">
                <span class="material-icons-outlined">verified_user</span>
                <span>Verify Document</span>
              </a>
              <a routerLink="/auth/login" (click)="closeMobileMenu()" class="btn-mobile btn-mobile-portal" aria-label="Official Sign In">
                <span class="material-icons-outlined">lock</span>
                <span>Official Sign In</span>
              </a>
            </div>
          </div>
        }
      </header>

      <!-- 2. Section: Home (Hero Section with Legal-Tech Visual) -->
      <section id="home" class="hero-section">
        <div class="container hero-container">
          <div class="hero-grid">
            <!-- Left Column: Content & Calls to Action -->
            <div class="hero-content">
              <div class="hero-badge">
                <span class="material-icons-outlined badge-icon">shield</span>
                <span>Zero-Trust Cryptographic Anchoring for Judicial Records</span>
              </div>

              <h1 class="hero-title">
                Decentralized Legal Document & Court Evidence Vault
              </h1>

              <p class="hero-subtitle">
                Secure. Verifiable. Tamper-Evident. Empowering law-enforcement agencies, public prosecutors, judicial benches, and defense advocates with trustless cryptographic proof of integrity and unbroken chain-of-custody.
              </p>

              <div class="hero-cta-group">
                <a routerLink="/auth/login" class="hero-cta-primary" aria-label="Official Sign In">
                  <span class="material-icons-outlined">lock</span>
                  <span>Official Sign In</span>
                </a>
                <a routerLink="/verification" class="hero-cta-secondary">
                  <span class="material-icons-outlined">find_in_page</span>
                  <span>Test Integrity Verifier</span>
                </a>
              </div>

              <!-- Trust / Compliance Micro-Badges -->
              <div class="hero-trust-row">
                <div class="trust-item">
                  <span class="material-icons-outlined text-green">verified</span>
                  <span>Section 65B Certified</span>
                </div>
                <div class="trust-item">
                  <span class="material-icons-outlined text-blue">lock</span>
                  <span>FIPS 180-4 SHA-256</span>
                </div>
                <div class="trust-item">
                  <span class="material-icons-outlined text-gold">token</span>
                  <span>EVM Blockchain Anchor</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Professional Legal-Tech Evidence Graphic -->
            <div class="hero-visual-col">
              <div class="evidence-vault-card">
                <!-- Card Header with Seal -->
                <div class="ev-card-top">
                  <div class="ev-docket-info">
                    <span class="ev-docket-num">DOCKET #2026/DEL/CR-8094</span>
                    <span class="ev-seal-badge">
                      <span class="pulse-dot"></span>
                      SEAL INTACT
                    </span>
                  </div>
                  <div class="ev-verif-badge">
                    <span class="material-icons-outlined">verified</span>
                    <span>ON-CHAIN VERIFIED</span>
                  </div>
                </div>

                <!-- Document Details -->
                <div class="ev-doc-particulars">
                  <div class="doc-icon-wrap">
                    <span class="material-icons-outlined">description</span>
                  </div>
                  <div class="doc-text-wrap">
                    <div class="doc-name">Forensic Toxicology & Ballistics Exhibit</div>
                    <div class="doc-meta">FIR No. 2026/CR/402 • Central Forensic Science Lab</div>
                  </div>
                </div>

                <!-- Cryptographic Fingerprint Stream -->
                <div class="ev-crypto-box">
                  <div class="crypto-row">
                    <span class="crypto-label">SHA-256 DIGEST</span>
                    <span class="crypto-val font-mono">7f83b1657ff1...d9069</span>
                  </div>
                  <div class="crypto-row">
                    <span class="crypto-label">IPFS CIDv0</span>
                    <span class="crypto-val font-mono text-blue">QmXoypizjW3...4uco</span>
                  </div>
                  <div class="crypto-row">
                    <span class="crypto-label">SMART CONTRACT</span>
                    <span class="crypto-val font-mono text-gold">DocumentRegistry.sol</span>
                  </div>
                  <div class="crypto-row">
                    <span class="crypto-label">LEDGER STATUS</span>
                    <span class="crypto-val text-green font-bold">BLOCK #10,044 • ZERO TAMPERING</span>
                  </div>
                </div>

                <!-- Custody Chain Visual Stepper -->
                <div class="ev-chain-footer">
                  <div class="custody-tag">
                    <span class="material-icons-outlined">gavel</span>
                    <span>Current Custody: Hon'ble Sessions Court Bench</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Architecture Highlight Cards Ribbon -->
          <div class="stats-ribbon">
            <div class="ribbon-card">
              <span class="material-icons-outlined card-icon">fingerprint</span>
              <h4>SHA-256 Digest</h4>
              <p>Deterministic mathematical fingerprinting for every uploaded legal file</p>
            </div>
            <div class="ribbon-card">
              <span class="material-icons-outlined card-icon">share</span>
              <h4>IPFS Content Storage</h4>
              <p>Decentralized content-addressed storage preventing unauthorized alterations</p>
            </div>
            <div class="ribbon-card">
              <span class="material-icons-outlined card-icon">link</span>
              <h4>EVM Smart Contract</h4>
              <p>Immutable on-chain anchoring of hash, CID, registrar, and timestamp</p>
            </div>
            <div class="ribbon-card">
              <span class="material-icons-outlined card-icon">timeline</span>
              <h4>Chain of Custody</h4>
              <p>Cryptographically logged custodial handoffs from initial seizure to court decree</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Section: How It Works -->
      <section id="how-it-works" class="workflow-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-eyebrow">HOW IT WORKS</span>
            <h2>The Cryptographic Verification Pipeline</h2>
            <p>Documents are never stored raw on the blockchain. Instead, an off-chain content-addressed model anchors trustless integrity.</p>
          </div>

          <div class="flow-steps">
            <div class="step-card">
              <div class="step-num">01</div>
              <h3>Document Upload</h3>
              <p>Officer submits FIR, forensic toxicology report, or court decree via secure portal.</p>
            </div>
            <div class="step-card">
              <div class="step-num">02</div>
              <h3>SHA-256 Generation</h3>
              <p>A 256-bit cryptographic digest is immediately computed from the byte stream.</p>
            </div>
            <div class="step-card">
              <div class="step-num">03</div>
              <h3>IPFS Offloading</h3>
              <p>File content is stored across IPFS nodes, returning a unique immutable CID.</p>
            </div>
            <div class="step-card">
              <div class="step-num">04</div>
              <h3>Blockchain Anchoring</h3>
              <p>Web3j writes <code>(docHash, ipfsCid, timestamp)</code> to the Solidity contract.</p>
            </div>
            <div class="step-card">
              <div class="step-num">05</div>
              <h3>Instant Verification</h3>
              <p>Any judge, lawyer, or citizen can verify integrity: a single modified byte flags <strong>TAMPER DETECTED</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Section: Security -->
      <section id="security" class="security-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-eyebrow">SECURITY ARCHITECTURE</span>
            <h2>Zero-Trust Cryptographic Proofs</h2>
            <p>Engineered to satisfy Section 65B Indian Evidence Act digital forensics standards with mathematical immutability.</p>
          </div>

          <div class="security-grid">
            <div class="sec-card">
              <div class="sec-icon-wrap">
                <span class="material-icons-outlined">enhanced_encryption</span>
              </div>
              <h3>Collision-Resistant Hashing</h3>
              <p>FIPS 180-4 SHA-256 generates a deterministic 64-character hexadecimal digest. Modifying even 1 bit in a 500-page charge sheet completely changes the digest.</p>
            </div>

            <div class="sec-card">
              <div class="sec-icon-wrap">
                <span class="material-icons-outlined">layers</span>
              </div>
              <h3>Dual-Layer Architecture</h3>
              <p>Separation of concerns guarantees scalable performance: heavy binary files reside in IPFS, while lightweight cryptographic proofs anchor on the blockchain ledger.</p>
            </div>

            <div class="sec-card">
              <div class="sec-icon-wrap">
                <span class="material-icons-outlined">history_edu</span>
              </div>
              <h3>Append-Only WORM Audit Trail</h3>
              <p>Write Once, Read Many (WORM) audit logging records all logins, uploads, views, verifications, and custody transfers with immutable event sequencing.</p>
            </div>

            <div class="sec-card">
              <div class="sec-icon-wrap">
                <span class="material-icons-outlined">admin_panel_settings</span>
              </div>
              <h3>Granular Judicial RBAC</h3>
              <p>Strict role-based access control segregates duties across Investigating Officers, Prosecutors, Court Staff, Judges, and Defense Advocates.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Section: Features -->
      <section id="features" class="features-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-eyebrow">ENTERPRISE CAPABILITIES</span>
            <h2>Comprehensive Evidence Management Suite</h2>
            <p>End-to-end tooling purpose-built for law enforcement agencies, prosecution departments, and courtrooms.</p>
          </div>

          <div class="features-grid">
            <div class="feat-item">
              <span class="material-icons-outlined feat-icon">gavel</span>
              <div>
                <h4>Court Docket Management</h4>
                <p>Track full case particulars, FIR numbers, police stations, assigned magistrates, and hearing timelines.</p>
              </div>
            </div>

            <div class="feat-item">
              <span class="material-icons-outlined feat-icon">inventory_2</span>
              <div>
                <h4>Physical & Digital Evidence Locker</h4>
                <p>Manage barcode seals, storage lockers, and physical custody transfers alongside digital forensic reports.</p>
              </div>
            </div>

            <div class="feat-item">
              <span class="material-icons-outlined feat-icon">notifications_active</span>
              <div>
                <h4>Automated Tamper Alerts</h4>
                <p>Instant visual and telemetry alarms trigger when an altered file fails hash comparison against the anchored ledger.</p>
              </div>
            </div>

            <div class="feat-item">
              <span class="material-icons-outlined feat-icon">share</span>
              <div>
                <h4>Expiring Secure Sharing</h4>
                <p>Generate time-bound, permission-gated access links for defense attorneys with comprehensive audit trails.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Section: Verification Suite Preview -->
      <section id="verification" class="verification-preview-section">
        <div class="container">
          <div class="verif-box">
            <div class="verif-info">
              <span class="section-eyebrow">PUBLIC INTEGRITY SUITE</span>
              <h2>Verify Any Court Document in Seconds</h2>
              <p>No login required for hash verification. Anyone can calculate a file's SHA-256 fingerprint in the browser and compare it against the anchored smart contract ledger to detect tampering.</p>
              <div class="verif-features">
                <div class="vf-item">
                  <span class="material-icons-outlined text-success">check_circle</span>
                  <span>100% Client-Side Privacy (File never leaves device)</span>
                </div>
                <div class="vf-item">
                  <span class="material-icons-outlined text-success">check_circle</span>
                  <span>Direct EVM Smart Contract Consensus Query</span>
                </div>
                <div class="vf-item">
                  <span class="material-icons-outlined text-success">check_circle</span>
                  <span>Live Tamper Detection Simulation Available</span>
                </div>
              </div>
              <a routerLink="/verification" class="btn-launch-verif">
                <span class="material-icons-outlined">verified_user</span>
                <span>Launch Integrity Verifier</span>
              </a>
            </div>
            <div class="verif-visual">
              <div class="visual-card">
                <div class="vc-header">
                  <span class="material-icons-outlined text-success">verified</span>
                  <strong>INTEGRITY VERIFIED</strong>
                </div>
                <div class="vc-row">
                  <span>Computed Hash</span>
                  <code>0x7f83b1657ff1...</code>
                </div>
                <div class="vc-row">
                  <span>Ledger Status</span>
                  <span class="badge-match">100% MATCH</span>
                </div>
                <div class="vc-row">
                  <span>Blockchain Anchor</span>
                  <span class="text-blue">Block #10,044</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Section: About -->
      <section id="about" class="about-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-eyebrow">ABOUT THE PLATFORM</span>
            <h2>Next-Generation Judicial Evidence Infrastructure</h2>
            <p>eVault is engineered to establish cryptographic truth and eliminate record tampering in criminal and civil judicial administration.</p>
          </div>

          <div class="about-grid">
            <div class="about-card">
              <h3>Our Mandate</h3>
              <p>To provide modern law enforcement, prosecutors, advocates, and judicial benches with an impenetrable, tamper-evident digital evidence repository that guarantees document authenticity throughout legal proceedings.</p>
            </div>
            <div class="about-card">
              <h3>Judicial Standards Alignment</h3>
              <p>Architected in alignment with the Indian e-Courts Integrated Mission Mode Project, Section 65B of the Indian Evidence Act, and ISO/IEC 27037 standards for digital evidence handling.</p>
            </div>
            <div class="about-card">
              <h3>Zero-Knowledge Verifiability</h3>
              <p>By leveraging cryptographic hashes on Ethereum-compatible blockchains, anyone can verify whether a judicial record has been modified without requiring access to sensitive case contents.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container footer-content">
          <div class="footer-left">
            <div class="footer-brand">
              <span class="material-icons-outlined">gavel</span>
              <strong>eVault</strong>
            </div>
            <p>© 2026 eVault — National Digital Legal Document & Court Evidence Vault. Section 65B Certified Forensic Architecture.</p>
          </div>
          <div class="footer-links">
            <a routerLink="/verification">Public Verifier</a>
            <a routerLink="/auth/login">Official Sign In</a>
            <a (click)="scrollToSection('security', $event)" href="#security">Security Specs</a>
            <a (click)="scrollToSection('how-it-works', $event)" href="#how-it-works">Pipeline</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* ==========================================================================
       eVault Judicial Platform Theme Variables
       ========================================================================== */
    :host {
      --primary-navy: #0B1F3A;
      --royal-blue:   #163A70;
      --accent-blue:  #2F6BFF;
      --verif-green:  #1F9D68;
      --gold-accent:  #D97706;
      --bg-slate:     #F7F9FC;
      --text-dark:    #0F172A;
      --text-muted:   #64748B;
      --border-light: #E2E8F0;
      --white:        #FFFFFF;
    }

    .landing-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-slate);
      color: var(--text-dark);
      font-family: var(--font-sans);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ==========================================================================
       1. Main Sticky Navigation Header (Starts directly at top of viewport)
       ========================================================================== */
    .main-navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: var(--white);
      border-bottom: 1px solid var(--border-light);
      transition: height 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
      height: 68px;
      display: flex;
      align-items: center;

      &.scrolled {
        height: 60px;
        background-color: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px -2px rgba(11, 31, 58, 0.08);
        border-bottom-color: #CBD5E1;
      }
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      cursor: pointer;
      user-select: none;
    }

    .brand-emblem {
      width: 38px;
      height: 38px;
      background: #0B1F3A;
      color: #F59E0B;
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;

      .material-icons-outlined {
        font-size: 20px;
      }
    }

    .brand:hover .brand-emblem {
      transform: scale(1.04);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-navy);
      letter-spacing: -0.03em;
      line-height: 1.15;
    }

    .brand-subtitle {
      font-size: 0.625rem;
      font-family: var(--font-mono);
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }

    /* Desktop Navigation Links */
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nav-link {
      padding: 8px 12px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      text-decoration: none;
      position: relative;
      transition: color 0.15s ease;
      border-radius: 6px;

      span {
        position: relative;
        z-index: 1;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 12px;
        right: 12px;
        height: 2px;
        background-color: var(--accent-blue);
        border-radius: 2px;
        transform: scaleX(0);
        transition: transform 0.2s ease;
      }

      &:hover {
        color: var(--primary-navy);
        background-color: #F1F5F9;
      }

      &.active {
        color: var(--accent-blue);
        font-weight: 700;

        &::after {
          transform: scaleX(1);
        }
      }
    }

    /* Header Action Buttons */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-nav {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.8125rem;
      font-weight: 700;
      transition: all 0.18s ease-in-out;
      cursor: pointer;
      line-height: 1.2;

      .btn-icon {
        font-size: 18px;
        transition: transform 0.15s ease;
      }

      &:hover .btn-icon {
        transform: translateY(-1px);
      }
    }

    /* Secondary CTA: Verify Document */
    .btn-verify {
      background-color: var(--white);
      color: var(--primary-navy);
      border: 1.5px solid #CBD5E1;

      .btn-icon {
        color: var(--verif-green);
      }

      &:hover {
        border-color: var(--accent-blue);
        color: var(--accent-blue);
        background-color: #F8FAFC;
        box-shadow: 0 2px 6px rgba(47, 107, 255, 0.12);
        transform: translateY(-1px);
      }
    }

    /* Primary CTA: Official Sign In */
    .btn-portal {
      background-color: var(--primary-navy);
      color: var(--white);
      border: 1.5px solid var(--primary-navy);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      white-space: nowrap;

      .btn-icon {
        font-size: 17px;
        color: #93C5FD;
        transition: color 0.18s ease;
      }

      &:hover {
        background-color: var(--royal-blue);
        border-color: var(--royal-blue);
        box-shadow: 0 4px 12px rgba(11, 31, 58, 0.18);
        transform: translateY(-1px);

        .btn-icon {
          color: var(--white);
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(11, 31, 58, 0.12);
      }
    }

    /* Hamburger Menu Button */
    .hamburger-btn {
      display: none;
      background: none;
      border: none;
      color: var(--primary-navy);
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;

      .material-icons-outlined {
        font-size: 26px;
      }

      &:hover {
        background-color: #F1F5F9;
      }
    }

    /* Mobile Drawer */
    .mobile-drawer {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--white);
      border-bottom: 2px solid var(--border-light);
      box-shadow: 0 10px 25px rgba(11, 31, 58, 0.12);
      padding: 18px 24px;
      flex-direction: column;
      gap: 16px;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mobile-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #334155;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.15s ease;

      .material-icons-outlined {
        font-size: 20px;
        color: #64748B;
      }

      &:hover {
        background-color: #F1F5F9;
        color: var(--primary-navy);
      }

      &.active {
        background-color: #EFF6FF;
        color: var(--accent-blue);
        font-weight: 700;

        .material-icons-outlined {
          color: var(--accent-blue);
        }
      }
    }

    .mobile-drawer-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 12px;
      border-top: 1px solid var(--border-light);
    }

    .btn-mobile {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: none;
    }

    .btn-mobile-verify {
      background-color: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      color: var(--primary-navy);
    }

    .btn-mobile-portal {
      background-color: var(--primary-navy);
      color: var(--white);
    }

    /* ==========================================================================
       Sections Styling & Smooth Scroll Margins
       ========================================================================== */
    section {
      scroll-margin-top: 80px;
    }

    /* 2. Hero Section */
    .hero-section {
      padding: 48px 0 64px;
      background: linear-gradient(180deg, var(--white) 0%, #F1F5F9 100%);
      border-bottom: 1px solid var(--border-light);
    }

    .hero-container {
      display: flex;
      flex-direction: column;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 40px;
      align-items: center;
      margin-bottom: 48px;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #EFF6FF;
      color: var(--royal-blue);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 700;
      margin-bottom: 20px;
      border: 1px solid #BFDBFE;

      .badge-icon {
        font-size: 16px;
        color: var(--accent-blue);
      }
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--primary-navy);
      margin-bottom: 16px;
      line-height: 1.18;
      letter-spacing: -0.03em;
    }

    .hero-subtitle {
      font-size: 1.05rem;
      color: #475569;
      margin-bottom: 28px;
      line-height: 1.6;
    }

    .hero-cta-group {
      display: flex;
      gap: 16px;
      margin-bottom: 28px;
    }

    .hero-cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background-color: var(--primary-navy);
      color: var(--white);
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(11, 31, 58, 0.2);
      transition: all 0.18s ease;

      &:hover {
        background-color: var(--royal-blue);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(11, 31, 58, 0.25);
      }
    }

    .hero-cta-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background-color: var(--white);
      color: var(--primary-navy);
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.18s ease;

      &:hover {
        border-color: var(--accent-blue);
        color: var(--accent-blue);
        background-color: #F8FAFC;
        transform: translateY(-2px);
      }
    }

    .hero-trust-row {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;

      .trust-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #475569;

        .material-icons-outlined {
          font-size: 16px;
        }

        .text-green { color: var(--verif-green); }
        .text-blue  { color: var(--accent-blue); }
        .text-gold  { color: var(--gold-accent); }
      }
    }

    /* Right Column: Evidence Vault Card Graphic */
    .hero-visual-col {
      display: flex;
      justify-content: center;
    }

    .evidence-vault-card {
      background: var(--white);
      border: 1.5px solid #CBD5E1;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 12px 32px -4px rgba(11, 31, 58, 0.1), 0 4px 12px rgba(0, 0, 0, 0.04);
      width: 100%;
      max-width: 440px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 36px -4px rgba(11, 31, 58, 0.14);
      }
    }

    .ev-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-light);
    }

    .ev-docket-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .ev-docket-num {
        font-family: var(--font-mono);
        font-size: 0.6875rem;
        font-weight: 800;
        color: var(--primary-navy);
        letter-spacing: 0.04em;
      }

      .ev-seal-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.625rem;
        font-weight: 800;
        color: #15803D;
        background-color: #DCFCE7;
        padding: 1px 7px;
        border-radius: 9999px;
        width: fit-content;

        .pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #16A34A;
        }
      }
    }

    .ev-verif-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: #EFF6FF;
      border: 1px solid #BFDBFE;
      color: var(--accent-blue);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.6875rem;
      font-weight: 700;

      .material-icons-outlined {
        font-size: 14px;
        color: var(--verif-green);
      }
    }

    .ev-doc-particulars {
      display: flex;
      align-items: center;
      gap: 12px;
      background-color: #F8FAFC;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 14px;

      .doc-icon-wrap {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background-color: #EFF6FF;
        color: var(--accent-blue);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .material-icons-outlined { font-size: 20px; }
      }

      .doc-text-wrap {
        overflow: hidden;

        .doc-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--primary-navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-meta {
          font-size: 0.6875rem;
          color: #64748B;
        }
      }
    }

    .ev-crypto-box {
      background-color: #0F172A;
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 14px;

      .crypto-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.6875rem;

        .crypto-label {
          color: #94A3B8;
          font-weight: 600;
        }

        .crypto-val {
          color: #F1F5F9;
        }

        .text-blue  { color: #93C5FD; }
        .text-gold  { color: #FCD34D; }
        .text-green { color: #86EFAC; }
      }
    }

    .ev-chain-footer {
      border-top: 1px dashed var(--border-light);
      padding-top: 10px;

      .custody-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        color: #475569;
        font-weight: 600;

        .material-icons-outlined {
          font-size: 16px;
          color: var(--gold-accent);
        }
      }
    }

    /* Stats Ribbon */
    .stats-ribbon {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      width: 100%;
      text-align: left;
    }

    .ribbon-card {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .card-icon {
        font-size: 2rem;
        color: var(--accent-blue);
        margin-bottom: 12px;
      }

      h4 {
        margin-bottom: 6px;
        font-size: 1rem;
        font-weight: 700;
        color: var(--primary-navy);
      }

      p {
        font-size: 0.8125rem;
        color: #475569;
        line-height: 1.5;
      }
    }

    /* Section Eyebrow & Headers */
    .section-eyebrow {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--accent-blue);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 6px;
    }

    .section-header {
      margin-bottom: 44px;

      h2 {
        font-size: 1.875rem;
        font-weight: 800;
        color: var(--primary-navy);
        margin-bottom: 10px;
      }

      p {
        max-width: 640px;
        margin: 0 auto;
        color: #475569;
        font-size: 0.9375rem;
      }
    }

    .text-center { text-align: center; }

    /* 3. Workflow Section */
    .workflow-section {
      padding: 72px 0;
      background-color: var(--bg-slate);
    }

    .flow-steps {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }

    .step-card {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      padding: 22px 18px;

      .step-num {
        font-family: var(--font-mono);
        font-size: 1.5rem;
        font-weight: 800;
        color: #CBD5E1;
        margin-bottom: 8px;
      }

      h3 {
        font-size: 0.9375rem;
        font-weight: 700;
        color: var(--primary-navy);
        margin-bottom: 8px;
      }

      p {
        font-size: 0.75rem;
        color: #475569;
        line-height: 1.5;
      }
    }

    /* 4. Security Section */
    .security-section {
      padding: 72px 0;
      background-color: var(--white);
      border-top: 1px solid var(--border-light);
      border-bottom: 1px solid var(--border-light);
    }

    .security-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .sec-card {
      background: #F8FAFC;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 28px;
      transition: all 0.2s ease;

      &:hover {
        border-color: #BFDBFE;
        box-shadow: 0 4px 16px rgba(47, 107, 255, 0.08);
      }

      .sec-icon-wrap {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: #EFF6FF;
        color: var(--accent-blue);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;

        .material-icons-outlined { font-size: 24px; }
      }

      h3 {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--primary-navy);
        margin-bottom: 8px;
      }

      p {
        font-size: 0.875rem;
        color: #475569;
        line-height: 1.6;
      }
    }

    /* 5. Features Section */
    .features-section {
      padding: 72px 0;
      background-color: var(--bg-slate);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .feat-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      padding: 24px;

      .feat-icon {
        font-size: 28px;
        color: var(--royal-blue);
        flex-shrink: 0;
      }

      h4 {
        font-size: 1rem;
        font-weight: 700;
        color: var(--primary-navy);
        margin-bottom: 4px;
      }

      p {
        font-size: 0.8125rem;
        color: #475569;
        line-height: 1.5;
      }
    }

    /* 6. Verification Preview Section */
    .verification-preview-section {
      padding: 72px 0;
      background-color: var(--white);
      border-top: 1px solid var(--border-light);
      border-bottom: 1px solid var(--border-light);
    }

    .verif-box {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 40px;
      align-items: center;
      background: #F8FAFC;
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 40px;
    }

    .verif-info {
      h2 {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--primary-navy);
        margin: 6px 0 12px;
      }

      p {
        color: #475569;
        font-size: 0.9375rem;
        line-height: 1.6;
        margin-bottom: 20px;
      }
    }

    .verif-features {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 28px;

      .vf-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #334155;
      }

      .text-success { color: var(--verif-green); font-size: 20px; }
    }

    .btn-launch-verif {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background-color: var(--primary-navy);
      color: var(--white);
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.18s ease;

      &:hover {
        background-color: var(--royal-blue);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(11, 31, 58, 0.2);
      }
    }

    .visual-card {
      background: var(--white);
      border: 1px solid #CBD5E1;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);

      .vc-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 14px;
        border-bottom: 1px solid var(--border-light);
        margin-bottom: 14px;
        color: var(--verif-green);
        font-size: 0.9375rem;
      }

      .vc-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 0.8125rem;
        border-bottom: 1px dashed var(--border-light);

        span { color: #64748B; }
        code { font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary-navy); font-weight: 600; }
      }

      .badge-match {
        font-size: 0.6875rem;
        font-family: var(--font-mono);
        font-weight: 800;
        background-color: #DCFCE7;
        color: #15803D;
        padding: 2px 8px;
        border-radius: 4px;
      }

      .text-blue { color: var(--accent-blue); font-weight: 700; }
    }

    /* 7. About Section */
    .about-section {
      padding: 72px 0;
      background-color: var(--bg-slate);
    }

    .about-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .about-card {
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 28px;

      h3 {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--primary-navy);
        margin-bottom: 10px;
      }

      p {
        font-size: 0.875rem;
        color: #475569;
        line-height: 1.6;
      }
    }

    /* Footer */
    .landing-footer {
      margin-top: auto;
      background: var(--primary-navy);
      color: #94A3B8;
      padding: 36px 0;
      font-size: 0.8125rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer-left {
      max-width: 600px;

      .footer-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--white);
        font-size: 1.125rem;
        font-weight: 700;
        margin-bottom: 6px;

        .material-icons-outlined { color: #F59E0B; }
      }

      p {
        line-height: 1.5;
        font-size: 0.8125rem;
      }
    }

    .footer-links {
      display: flex;
      gap: 20px;

      a {
        color: #CBD5E1;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.15s ease;

        &:hover {
          color: var(--white);
          text-decoration: underline;
        }
      }
    }

    /* ==========================================================================
       Responsive Breakpoints
       ========================================================================== */
    @media (max-width: 1024px) {
      .desktop-nav { display: none; }
      .header-actions { display: none; }
      .hamburger-btn { display: flex; }
      .mobile-drawer { display: flex; }
      .hero-grid { grid-template-columns: 1fr; gap: 32px; }
      .hero-content { align-items: center; text-align: center; }
      .hero-trust-row { justify-content: center; }
      .verif-box { grid-template-columns: 1fr; }
      .about-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 900px) {
      .stats-ribbon { grid-template-columns: repeat(2, 1fr); }
      .flow-steps { grid-template-columns: 1fr; }
      .security-grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .hero-title { font-size: 2rem; }
    }

    @media (max-width: 640px) {
      .hero-cta-group { flex-direction: column; width: 100%; }
      .hero-cta-primary, .hero-cta-secondary { width: 100%; justify-content: center; }
      .stats-ribbon { grid-template-columns: 1fr; }
      .footer-content { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  isScrolled = signal<boolean>(false);
  activeSection = signal<string>('home');
  mobileMenuOpen = signal<boolean>(false);

  private sectionIds = ['home', 'how-it-works', 'security', 'features', 'verification', 'about'];

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
    
    // Sticky header shadow trigger (after 20px)
    this.isScrolled.set(scrollPos > 20);

    // Active navigation scroll-spy detection
    const headerOffset = 100;
    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop - headerOffset;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          this.activeSection.set(id);
          break;
        }
      }
    }
  }

  ngOnInit(): void {
    this.onWindowScroll();
  }

  ngOnDestroy(): void {}

  scrollToSection(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.activeSection.set(id);
    this.mobileMenuOpen.set(false);

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const headerOffset = 70;
      const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
