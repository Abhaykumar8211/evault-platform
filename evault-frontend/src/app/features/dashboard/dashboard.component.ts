import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats, DashboardCharts } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],

  template: `
    <div class="dashboard-page">

      <!-- =====================================================
           PAGE HEADER
           ===================================================== -->

      <div class="page-header">

        <div class="page-header-content">

          <h1 class="page-title">
            Judicial Evidence & Case Vault Dashboard
          </h1>

          <p class="page-subtitle">
            Decentralized Cryptographic Ledger Status & Real-Time Case Overview
          </p>

        </div>

        <div class="header-actions">

          <a
            routerLink="/verification"
            class="btn btn-secondary">

            <span class="material-icons-outlined">
              verified
            </span>

            <span>
              Verify Evidence
            </span>

          </a>


          @if (
            authService.isOfficer() ||
            authService.isCourtStaff() ||
            authService.isSuperAdmin()
          ) {

            <a
              routerLink="/cases"
              class="btn btn-primary">

              <span class="material-icons-outlined">
                add
              </span>

              <span>
                Register New Case
              </span>

            </a>

          }

        </div>

      </div>


      <!-- =====================================================
           TAMPER ALERT
           ===================================================== -->

      @if (
        stats?.tamperAlertsCount &&
        stats!.tamperAlertsCount > 0
      ) {

        <div class="alert-banner">

          <span class="material-icons-outlined alert-icon">
            warning
          </span>

          <div class="alert-content">

            <strong>
              CRITICAL SECURITY ALERT: Integrity Tampering Discrepancy Detected!
            </strong>

            <p>
              {{ stats!.tamperAlertsCount }}
              file(s) failed cryptographic consensus against the on-chain smart contract anchor.
            </p>

          </div>

          <a
            routerLink="/verification"
            class="btn btn-danger btn-sm">

            Inspect Alerts

          </a>

        </div>

      }


      <!-- =====================================================
           ACTIVE ROLE PERSONA
           ===================================================== -->

      <div
        class="role-session-banner"
        [ngClass]="getRoleClass()">

        <div class="role-session-left">

          <div class="role-icon-box">

            <span class="material-icons-outlined">
              {{ getRoleIcon() }}
            </span>

          </div>


          <div class="role-info-text">

            <div class="role-badge-row">

              <span class="role-title-badge">
                {{ getRoleTitle() }}
              </span>

              <span class="session-active-pill">
                Session Active
              </span>

            </div>


            <p class="role-scope-desc">
              {{ getRoleScopeDescription() }}
            </p>

          </div>

        </div>


        <div class="role-quick-nav">

          <div class="officer-badge">

            <span class="officer-name">
              {{ authService.userFullName() }}
            </span>

            <span class="officer-dept">
              {{ authService.department() }}
            </span>

          </div>

        </div>

      </div>


      <!-- =====================================================
           KPI CARDS
           ===================================================== -->

      <div class="metrics-grid">

        <!-- Active Cases -->
        <div class="metric-card card">

          <div class="metric-header">

            <span class="metric-title">
              Active Cases
            </span>

            <span class="material-icons-outlined metric-icon primary">
              folder
            </span>

          </div>

          <div class="metric-value">
            {{ stats?.totalActiveCases || 0 }}
          </div>

          <div class="metric-footer">

            <span class="badge badge-info">
              Judicial Registry
            </span>

          </div>

        </div>


        <!-- Anchored Documents -->
        <div class="metric-card card">

          <div class="metric-header">

            <span class="metric-title">
              Anchored Documents
            </span>

            <span class="material-icons-outlined metric-icon info">
              description
            </span>

          </div>

          <div class="metric-value">
            {{ stats?.totalDocuments || 0 }}
          </div>

          <div class="metric-footer">

            <span class="badge badge-neutral">
              IPFS Content-Addressed
            </span>

          </div>

        </div>


        <!-- Cryptographically Verified -->
        <div class="metric-card card">

          <div class="metric-header">

            <span class="metric-title">
              Cryptographically Verified
            </span>

            <span class="material-icons-outlined metric-icon success">
              verified_user
            </span>

          </div>

          <div class="metric-value text-success">
            {{ stats?.verifiedDocuments || 0 }}
          </div>

          <div class="metric-footer">

            <span class="badge badge-success">
              Zero Tampering
            </span>

          </div>

        </div>


        <!-- Physical / Digital Evidence -->
        <div class="metric-card card">

          <div class="metric-header">

            <span class="metric-title">
              Physical/Digital Evidence
            </span>

            <span class="material-icons-outlined metric-icon warning">
              inventory_2
            </span>

          </div>

          <div class="metric-value">
            {{ stats?.totalEvidenceItems || 0 }}
          </div>

          <div class="metric-footer">

            <span class="badge badge-warning">
              Chain of Custody Active
            </span>

          </div>

        </div>

      </div>


      <!-- =====================================================
           CHARTS SECTION
           ===================================================== -->

      <div class="charts-grid">

        <!-- CASE STATUS -->
        <div class="card chart-card">

          <div class="card-header">

            <h3>
              Cases by Adjudication Stage
            </h3>

            <span class="badge badge-neutral">
              Status Breakdown
            </span>

          </div>


          <div class="status-bars">

            <div class="bar-item">

              <div class="bar-labels">

                <span>
                  In Court Hearing
                </span>

                <strong>
                  40%
                </strong>

              </div>

              <div class="progress-track">

                <div
                  class="progress-fill primary"
                  style="width: 40%">
                </div>

              </div>

            </div>


            <div class="bar-item">

              <div class="bar-labels">

                <span>
                  Under Investigation (IO)
                </span>

                <strong>
                  35%
                </strong>

              </div>

              <div class="progress-track">

                <div
                  class="progress-fill warning"
                  style="width: 35%">
                </div>

              </div>

            </div>


            <div class="bar-item">

              <div class="bar-labels">

                <span>
                  Under Prosecution Review
                </span>

                <strong>
                  15%
                </strong>

              </div>

              <div class="progress-track">

                <div
                  class="progress-fill info"
                  style="width: 15%">
                </div>

              </div>

            </div>


            <div class="bar-item">

              <div class="bar-labels">

                <span>
                  Open / FIR Registered
                </span>

                <strong>
                  10%
                </strong>

              </div>

              <div class="progress-track">

                <div
                  class="progress-fill success"
                  style="width: 10%">
                </div>

              </div>

            </div>

          </div>

        </div>


        <!-- STORAGE TELEMETRY -->
        <div class="card chart-card">

          <div class="card-header">

            <h3>
              Decentralized Storage & Ledger Telemetry
            </h3>

            <span class="badge badge-success">
              Live Network
            </span>

          </div>


          <div class="telemetry-list">

            <div class="telemetry-item">

              <div class="telem-left">

                <span class="material-icons-outlined telem-icon">
                  memory
                </span>

                <div>

                  <strong>
                    EVM Smart Contract
                  </strong>

                  <small>
                    DocumentRegistry.sol
                  </small>

                </div>

              </div>

              <span class="badge badge-success">
                Block #10,044
              </span>

            </div>


            <div class="telemetry-item">

              <div class="telem-left">

                <span class="material-icons-outlined telem-icon">
                  cloud_queue
                </span>

                <div>

                  <strong>
                    IPFS Decentralized Cluster
                  </strong>

                  <small>
                    CIDv0 / Multihash Repository
                  </small>

                </div>

              </div>

              <span class="badge badge-info">
                100% Pinned
              </span>

            </div>


            <div class="telemetry-item">

              <div class="telem-left">

                <span class="material-icons-outlined telem-icon">
                  security
                </span>

                <div>

                  <strong>
                    Cryptographic Algorithm
                  </strong>

                  <small>
                    FIPS 180-4 SHA-256 Digest
                  </small>

                </div>

              </div>

              <span class="badge badge-neutral">
                256-Bit
              </span>

            </div>

          </div>

        </div>

      </div>


      <!-- =====================================================
           RECENT CASES
           ===================================================== -->

      <div class="card table-card">

        <div class="card-header">

          <div>

            <h3>
              Active Case Dossiers
            </h3>

            <p>
              Chronological court filings and evidence registries
            </p>

          </div>

          <a
            routerLink="/cases"
            class="btn btn-secondary btn-sm">

            View All Cases

          </a>

        </div>


        <div class="table-container">

          <table class="table">

            <thead>

              <tr>

                <th>
                  Case Number
                </th>

                <th>
                  Title / Description
                </th>

                <th>
                  FIR Reference
                </th>

                <th>
                  Police Station / Court
                </th>

                <th>
                  Assigned Judge
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              @for (
                c of stats?.recentCases;
                track c.id
              ) {

                <tr>

                  <td>

                    <strong class="crypto-hash">
                      {{ c.caseNumber }}
                    </strong>

                  </td>


                  <td>

                    <div class="case-title-cell">

                      <strong>
                        {{ c.title }}
                      </strong>

                      <small>
                        {{ c.caseType }}
                      </small>

                    </div>

                  </td>


                  <td>
                    {{ c.firNumber }}
                  </td>


                  <td>
                    {{ c.courtName }}
                  </td>


                  <td>

                    @if (c.judge) {

                      <span>
                        {{ c.judge.fullName }}
                      </span>

                    } @else {

                      <span class="text-muted">
                        Unassigned
                      </span>

                    }

                  </td>


                  <td>

                    <span class="badge badge-info">
                      {{ c.statusDisplayName }}
                    </span>

                  </td>


                  <td>

                    <a
                      [routerLink]="['/cases', c.id]"
                      class="btn btn-secondary btn-sm">

                      <span>
                        Open Case
                      </span>

                      <span class="material-icons-outlined">
                        arrow_forward
                      </span>

                    </a>

                  </td>

                </tr>

              } @empty {

                <tr>

                  <td
                    colspan="7"
                    class="text-center py-4">

                    No cases registered yet.

                  </td>

                </tr>

              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  `,


  styles: [`

    /* =========================================================
       DASHBOARD BASE
       ========================================================= */

    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 24px;

      width: 100%;
      max-width: 100%;
      min-width: 0;

      padding: 24px;

      box-sizing: border-box;

      overflow-x: hidden;
    }


    /* =========================================================
       PAGE HEADER
       ========================================================= */

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      gap: 20px;

      min-width: 0;
    }


    .page-header-content {
      min-width: 0;
      flex: 1;
    }


    .page-title {
      font-size: 1.5rem;
      font-weight: 800;

      color: #0f172a;

      letter-spacing: -0.02em;

      margin: 0 0 4px 0;

      overflow-wrap: anywhere;
    }


    .page-subtitle {
      font-size: 0.875rem;

      color: #475569;

      font-weight: 500;

      margin: 0;

      line-height: 1.4;

      overflow-wrap: anywhere;
    }


    .header-actions {
      display: flex;

      gap: 12px;

      flex-shrink: 0;
    }


    /* =========================================================
       ALERT
       ========================================================= */

    .alert-banner {
      display: flex;
      align-items: center;

      gap: 16px;

      background: var(--danger-bg);

      border: 1px solid var(--danger-border);

      padding: 14px 20px;

      border-radius: var(--radius-md);

      min-width: 0;

      box-sizing: border-box;
    }


    .alert-icon {
      font-size: 2rem;

      color: var(--danger-accent);

      flex-shrink: 0;
    }


    .alert-content {
      flex: 1;

      min-width: 0;
    }


    .alert-content strong {
      color: var(--danger-text);

      font-size: 0.875rem;

      font-weight: 700;

      display: block;

      overflow-wrap: anywhere;
    }


    .alert-content p {
      color: var(--danger-text);

      font-size: 0.8125rem;

      margin: 2px 0 0;

      line-height: 1.4;
    }


    /* =========================================================
       KPI GRID
       ========================================================= */

    .metrics-grid {
      display: grid;

      grid-template-columns: repeat(4, minmax(0, 1fr));

      gap: 20px;

      width: 100%;

      min-width: 0;
    }


    .metric-card {
      background: #ffffff;

      border: 1px solid #e2e8f0;

      border-radius: 12px;

      padding: 20px;

      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.05);

      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;

      min-width: 0;

      box-sizing: border-box;

      overflow: hidden;
    }


    .metric-card:hover {
      transform: translateY(-2px);

      box-shadow:
        0 6px 16px -2px rgba(0, 0, 0, 0.08);
    }


    .metric-header {
      display: flex;

      justify-content: space-between;

      align-items: flex-start;

      gap: 10px;

      margin-bottom: 8px;

      min-width: 0;
    }


    .metric-title {
      font-size: 0.75rem;

      font-weight: 700;

      color: #64748b;

      text-transform: uppercase;

      letter-spacing: 0.05em;

      line-height: 1.4;

      min-width: 0;

      overflow-wrap: anywhere;
    }


    .metric-icon {
      font-size: 1.5rem;

      flex-shrink: 0;
    }


    .metric-icon.primary {
      color: #1e3a8a;
    }


    .metric-icon.info {
      color: #0284c7;
    }


    .metric-icon.success {
      color: #16a34a;
    }


    .metric-icon.warning {
      color: #d97706;
    }


    .metric-value {
      font-size: 2.25rem;

      font-weight: 800;

      color: #0f172a;

      margin-bottom: 12px;

      line-height: 1;
    }


    .metric-value.text-success {
      color: #15803d;
    }


    .metric-footer {
      min-width: 0;
    }


    /* =========================================================
       CHART GRID
       ========================================================= */

    .charts-grid {
      display: grid;

      grid-template-columns:
        minmax(0, 1fr)
        minmax(0, 1fr);

      gap: 20px;

      width: 100%;

      min-width: 0;
    }


    .chart-card {
      background: #ffffff;

      border: 1px solid #e2e8f0;

      border-radius: 12px;

      padding: 24px;

      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.05);

      min-width: 0;

      box-sizing: border-box;

      overflow: hidden;
    }


    .card-header {
      display: flex;

      justify-content: space-between;

      align-items: flex-start;

      gap: 12px;

      margin-bottom: 20px;

      min-width: 0;
    }


    .card-header h3 {
      font-size: 1.05rem;

      font-weight: 700;

      color: #0f172a;

      margin: 0;

      line-height: 1.35;

      min-width: 0;

      overflow-wrap: anywhere;
    }


    /* =========================================================
       STATUS BARS
       ========================================================= */

    .status-bars {
      display: flex;

      flex-direction: column;

      gap: 16px;

      width: 100%;
    }


    .bar-item {
      min-width: 0;
    }


    .bar-labels {
      display: flex;

      justify-content: space-between;

      align-items: center;

      gap: 10px;

      font-size: 0.8125rem;

      color: #334155;

      margin-bottom: 6px;
    }


    .bar-labels span {
      min-width: 0;

      overflow-wrap: anywhere;
    }


    .bar-labels strong {
      color: #0f172a;

      font-weight: 700;

      flex-shrink: 0;
    }


    .progress-track {
      height: 8px;

      background: #f1f5f9;

      border-radius: 9999px;

      overflow: hidden;

      width: 100%;
    }


    .progress-fill {
      height: 100%;

      border-radius: 9999px;
    }


    .progress-fill.primary {
      background: #1e3a8a;
    }


    .progress-fill.warning {
      background: #d97706;
    }


    .progress-fill.info {
      background: #0284c7;
    }


    .progress-fill.success {
      background: #16a34a;
    }


    /* =========================================================
       TELEMETRY
       ========================================================= */

    .telemetry-list {
      display: flex;

      flex-direction: column;

      gap: 14px;

      width: 100%;
    }


    .telemetry-item {
      display: flex;

      justify-content: space-between;

      align-items: center;

      gap: 12px;

      padding: 14px 16px;

      background: #f8fafc;

      border: 1px solid #e2e8f0;

      border-radius: var(--radius-md);

      min-width: 0;

      box-sizing: border-box;
    }


    .telem-left {
      display: flex;

      align-items: center;

      gap: 12px;

      min-width: 0;

      flex: 1;
    }


    .telem-icon {
      color: #1e3a8a;

      font-size: 1.5rem;

      flex-shrink: 0;
    }


    .telem-left > div {
      min-width: 0;
    }


    .telem-left strong {
      display: block;

      font-size: 0.875rem;

      color: #0f172a;

      font-weight: 600;

      overflow-wrap: anywhere;
    }


    .telem-left small {
      color: #64748b;

      font-size: 0.75rem;

      display: block;

      overflow-wrap: anywhere;
    }


    /* =========================================================
       TABLE CARD
       ========================================================= */

    .table-card {
      background: #ffffff;

      border: 1px solid #e2e8f0;

      border-radius: 12px;

      padding: 24px;

      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.05);

      min-width: 0;

      box-sizing: border-box;

      overflow: hidden;
    }


    .table-card .card-header {
      margin-bottom: 16px;
    }


    .table-card .card-header > div {
      min-width: 0;
    }


    .table-card .card-header h3 {
      font-size: 1.125rem;

      font-weight: 700;

      color: #0f172a;

      margin: 0 0 2px;
    }


    .table-card .card-header p {
      font-size: 0.8125rem;

      color: #64748b;

      margin: 0;

      line-height: 1.4;
    }


    .table-container {
      width: 100%;

      max-width: 100%;

      overflow-x: auto;

      -webkit-overflow-scrolling: touch;
    }


    .table {
      width: 100%;

      min-width: 700px;

      border-collapse: collapse;
    }


    .case-title-cell {
      display: flex;

      flex-direction: column;

      min-width: 0;
    }


    .case-title-cell strong {
      color: #0f172a;

      font-size: 0.875rem;

      font-weight: 600;
    }


    .case-title-cell small {
      color: #64748b;

      font-size: 0.75rem;
    }


    /* =========================================================
       ROLE SESSION BANNER
       ========================================================= */

    .role-session-banner {
      background: #ffffff;

      border: 1px solid #e2e8f0;

      border-left: 4px solid #2563eb;

      border-radius: 10px;

      padding: 14px 18px;

      margin-bottom: 0;

      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 16px;

      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.02);

      min-width: 0;

      box-sizing: border-box;
    }


    .role-session-banner.judge {
      border-left-color: #d97706;
    }


    .role-session-banner.judge .role-icon-box {
      background: #fef3c7;

      color: #b45309;
    }


    .role-session-banner.judge .role-title-badge {
      color: #92400e;
    }


    .role-session-banner.officer {
      border-left-color: #0284c7;
    }


    .role-session-banner.officer .role-icon-box {
      background: #e0f2fe;

      color: #0369a1;
    }


    .role-session-banner.officer .role-title-badge {
      color: #075985;
    }


    .role-session-banner.prosecutor {
      border-left-color: #7e22ce;
    }


    .role-session-banner.prosecutor .role-icon-box {
      background: #f3e8ff;

      color: #7e22ce;
    }


    .role-session-banner.prosecutor .role-title-badge {
      color: #6b21a8;
    }


    .role-session-banner.lawyer {
      border-left-color: #ea580c;
    }


    .role-session-banner.lawyer .role-icon-box {
      background: #ffedd5;

      color: #c2410c;
    }


    .role-session-banner.lawyer .role-title-badge {
      color: #9a3412;
    }


    .role-session-banner.admin {
      border-left-color: #dc2626;
    }


    .role-session-banner.admin .role-icon-box {
      background: #fee2e2;

      color: #b91c1c;
    }


    .role-session-banner.admin .role-title-badge {
      color: #991b1b;
    }


    .role-session-left {
      display: flex;

      align-items: center;

      gap: 14px;

      min-width: 0;

      flex: 1;
    }


    .role-icon-box {
      width: 42px;
      height: 42px;

      border-radius: 8px;

      display: flex;

      align-items: center;
      justify-content: center;

      background: #eff6ff;

      color: #2563eb;

      flex-shrink: 0;
    }


    .role-icon-box .material-icons-outlined {
      font-size: 24px;
    }


    .role-info-text {
      display: flex;

      flex-direction: column;

      gap: 2px;

      min-width: 0;
    }


    .role-badge-row {
      display: flex;

      align-items: center;

      flex-wrap: wrap;

      gap: 8px;

      min-width: 0;
    }


    .role-title-badge {
      font-size: 0.9375rem;

      font-weight: 700;

      color: #0f172a;

      line-height: 1.35;

      overflow-wrap: anywhere;
    }


    .session-active-pill {
      font-size: 0.625rem;

      font-weight: 700;

      text-transform: uppercase;

      letter-spacing: 0.05em;

      background: #dcfce7;

      color: #166534;

      padding: 2px 8px;

      border-radius: 12px;

      border: 1px solid #bbf7d0;

      white-space: nowrap;
    }


    .role-scope-desc {
      font-size: 0.8125rem;

      color: #64748b;

      margin: 0;

      line-height: 1.4;

      overflow-wrap: anywhere;
    }


    .role-quick-nav {
      flex-shrink: 0;

      text-align: right;

      min-width: 0;
    }


    .officer-badge {
      display: flex;

      flex-direction: column;

      align-items: flex-end;

      min-width: 0;
    }


    .officer-name {
      font-size: 0.8125rem;

      font-weight: 700;

      color: #0f172a;

      max-width: 230px;

      overflow: hidden;

      text-overflow: ellipsis;

      white-space: nowrap;
    }


    .officer-dept {
      font-size: 0.6875rem;

      color: #64748b;

      max-width: 230px;

      overflow: hidden;

      text-overflow: ellipsis;

      white-space: nowrap;
    }


    /* =========================================================
       DESKTOP / TABLET
       ========================================================= */

    @media (max-width: 1100px) {

      .metrics-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
      }

    }


    @media (max-width: 900px) {

      .dashboard-page {
        padding: 20px;
        gap: 20px;
      }


      .page-header {
        align-items: flex-start;
      }


      .metrics-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
      }


      .charts-grid {
        grid-template-columns: 1fr;
      }

    }


    /* =========================================================
       MOBILE — 768px
       ========================================================= */

    @media (max-width: 768px) {

      /*
       * Main dashboard must never create horizontal overflow.
       */

      .dashboard-page {
        width: 100% !important;

        max-width: 100% !important;

        min-width: 0 !important;

        padding: 16px !important;

        gap: 18px !important;

        box-sizing: border-box;

        overflow-x: hidden !important;
      }


      /* -------------------------------------------------------
         PAGE HEADER
         ------------------------------------------------------- */

      .page-header {
        width: 100%;

        min-width: 0;

        display: flex;

        flex-direction: column;

        align-items: stretch;

        gap: 12px;
      }


      .page-header-content {
        width: 100%;

        min-width: 0;
      }


      .page-title {
        width: 100%;

        font-size: 1.35rem;

        line-height: 1.25;

        margin: 0 0 6px;

        overflow-wrap: anywhere;
      }


      .page-subtitle {
        width: 100%;

        font-size: 0.8rem;

        line-height: 1.45;

        overflow-wrap: anywhere;
      }


      .header-actions {
        width: 100%;

        display: flex;

        flex-direction: column;

        gap: 8px;
      }


      .header-actions .btn {
        width: 100%;

        min-height: 42px;

        justify-content: center;

        box-sizing: border-box;
      }


      /* -------------------------------------------------------
         ALERT
         ------------------------------------------------------- */

      .alert-banner {
        width: 100%;

        flex-direction: column;

        align-items: flex-start;

        gap: 10px;

        padding: 14px;

        box-sizing: border-box;
      }


      .alert-icon {
        font-size: 1.7rem;
      }


      .alert-content {
        width: 100%;
      }


      .alert-banner .btn {
        width: 100%;

        justify-content: center;
      }


      /* -------------------------------------------------------
         ROLE SESSION BANNER
         ------------------------------------------------------- */

      .role-session-banner {
        width: 100% !important;

        min-width: 0 !important;

        display: flex;

        flex-direction: column;

        align-items: stretch;

        justify-content: flex-start;

        gap: 14px;

        padding: 14px !important;

        margin: 0 !important;

        box-sizing: border-box;
      }


      .role-session-left {
        width: 100%;

        min-width: 0;

        align-items: flex-start;

        gap: 10px;
      }


      .role-icon-box {
        width: 42px;
        height: 42px;

        flex-shrink: 0;
      }


      .role-info-text {
        width: 100%;

        min-width: 0;
      }


      .role-badge-row {
        width: 100%;

        align-items: flex-start;

        gap: 6px;
      }


      .role-title-badge {
        font-size: 0.9rem;

        line-height: 1.4;

        flex: 1;

        min-width: 0;
      }


      .session-active-pill {
        flex-shrink: 0;
      }


      .role-scope-desc {
        width: 100%;

        max-width: 100%;

        font-size: 0.78rem;

        line-height: 1.45;
      }


      .role-quick-nav {
        width: 100%;

        text-align: left;
      }


      .officer-badge {
        width: 100%;

        align-items: flex-start;

        text-align: left;
      }


      .officer-name,
      .officer-dept {
        max-width: 100%;

        white-space: normal;

        overflow: visible;

        text-overflow: clip;

        overflow-wrap: anywhere;
      }


      /* -------------------------------------------------------
         KPI CARDS — ONE COLUMN
         ------------------------------------------------------- */

      .metrics-grid {
        width: 100% !important;

        min-width: 0 !important;

        grid-template-columns: 1fr !important;

        gap: 14px !important;
      }


      .metric-card {
        width: 100% !important;

        min-width: 0 !important;

        max-width: 100%;

        padding: 17px !important;

        box-sizing: border-box;

        overflow: hidden;
      }


      .metric-header {
        width: 100%;

        min-width: 0;
      }


      .metric-title {
        font-size: 0.72rem;

        line-height: 1.4;

        overflow-wrap: anywhere;
      }


      .metric-value {
        font-size: 2rem;
      }


      /* -------------------------------------------------------
         CHARTS — ONE COLUMN
         ------------------------------------------------------- */

      .charts-grid {
        width: 100% !important;

        min-width: 0 !important;

        grid-template-columns: 1fr !important;

        gap: 14px !important;
      }


      .chart-card {
        width: 100% !important;

        min-width: 0 !important;

        max-width: 100%;

        padding: 17px !important;

        box-sizing: border-box;

        overflow: hidden;
      }


      .chart-card .card-header {
        width: 100%;

        min-width: 0;

        flex-wrap: wrap;

        gap: 8px;

        margin-bottom: 16px;
      }


      .chart-card .card-header h3 {
        font-size: 0.98rem;

        flex: 1;

        min-width: 0;
      }


      /* -------------------------------------------------------
         STATUS BARS
         ------------------------------------------------------- */

      .status-bars {
        width: 100%;

        min-width: 0;
      }


      .bar-labels {
        font-size: 0.76rem;

        gap: 8px;
      }


      /* -------------------------------------------------------
         TELEMETRY
         ------------------------------------------------------- */

      .telemetry-list {
        width: 100%;

        min-width: 0;
      }


      .telemetry-item {
        width: 100%;

        min-width: 0;

        padding: 12px;

        align-items: flex-start;

        flex-wrap: wrap;

        box-sizing: border-box;
      }


      .telem-left {
        min-width: 0;

        flex: 1 1 180px;
      }


      .telem-left strong {
        font-size: 0.8rem;
      }


      .telem-left small {
        font-size: 0.7rem;
      }


      .telemetry-item > .badge {
        flex-shrink: 0;
      }


      /* -------------------------------------------------------
         TABLE
         ------------------------------------------------------- */

      .table-card {
        width: 100% !important;

        min-width: 0 !important;

        max-width: 100%;

        padding: 17px !important;

        box-sizing: border-box;

        overflow: hidden;
      }


      .table-card .card-header {
        width: 100%;

        flex-direction: column;

        align-items: flex-start;

        gap: 10px;
      }


      .table-card .card-header > div {
        width: 100%;

        min-width: 0;
      }


      .table-card .card-header .btn {
        width: 100%;

        justify-content: center;
      }


      .table-container {
        width: 100%;

        max-width: 100%;

        overflow-x: auto;

        overflow-y: hidden;

        -webkit-overflow-scrolling: touch;
      }


      .table {
        min-width: 700px;
      }

    }


    /* =========================================================
       SMALL MOBILE — 480px
       ========================================================= */

    @media (max-width: 480px) {

      .dashboard-page {
        padding: 14px !important;

        gap: 16px !important;
      }


      .page-title {
        font-size: 1.22rem;

        line-height: 1.28;
      }


      .page-subtitle {
        font-size: 0.76rem;

        line-height: 1.45;
      }


      .role-session-banner {
        padding: 13px !important;
      }


      .role-session-left {
        gap: 9px;
      }


      .role-icon-box {
        width: 40px;
        height: 40px;
      }


      .role-icon-box .material-icons-outlined {
        font-size: 21px;
      }


      .role-title-badge {
        font-size: 0.84rem;
      }


      .session-active-pill {
        font-size: 0.56rem;

        padding: 3px 6px;
      }


      .role-scope-desc {
        font-size: 0.75rem;
      }


      .metric-card {
        padding: 15px !important;
      }


      .metric-value {
        font-size: 1.9rem;
      }


      .chart-card {
        padding: 15px !important;
      }


      .chart-card .card-header h3 {
        font-size: 0.92rem;
      }


      .table-card {
        padding: 15px !important;
      }


      .telemetry-item {
        padding: 11px;
      }

    }


    /* =========================================================
       VERY SMALL MOBILE — 360px
       ========================================================= */

    @media (max-width: 360px) {

      .dashboard-page {
        padding: 10px !important;

        gap: 14px !important;
      }


      .page-title {
        font-size: 1.12rem;
      }


      .page-subtitle {
        font-size: 0.72rem;
      }


      .role-session-banner {
        padding: 11px !important;
      }


      .role-icon-box {
        width: 38px;
        height: 38px;
      }


      .role-title-badge {
        font-size: 0.8rem;
      }


      .metric-card {
        padding: 13px !important;
      }


      .metric-value {
        font-size: 1.8rem;
      }


      .chart-card {
        padding: 13px !important;
      }


      .table-card {
        padding: 13px !important;
      }


      .telemetry-item {
        padding: 10px;
      }

    }

  `]
})


export class DashboardComponent implements OnInit {

  stats: DashboardStats | null = null;

  charts: DashboardCharts | null = null;

  loading = true;


  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService
  ) {}


  ngOnInit(): void {

    this.dashboardService.getStats().subscribe({

      next: (res) => {

        if (res.success) {
          this.stats = res.data;
        }

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });


    this.dashboardService.getCharts().subscribe({

      next: (res) => {

        if (res.success) {
          this.charts = res.data;
        }

      }

    });

  }


  getRoleClass(): string {

    const role = this.authService.userRole();

    switch (role) {

      case 'JUDGE':
        return 'judge';

      case 'INVESTIGATING_OFFICER':
        return 'officer';

      case 'PROSECUTOR':
        return 'prosecutor';

      case 'LAWYER':
        return 'lawyer';

      case 'SUPER_ADMIN':
        return 'admin';

      default:
        return 'default';

    }

  }


  getRoleIcon(): string {

    const role = this.authService.userRole();

    switch (role) {

      case 'JUDGE':
        return 'gavel';

      case 'INVESTIGATING_OFFICER':
        return 'local_police';

      case 'PROSECUTOR':
        return 'balance';

      case 'LAWYER':
        return 'work';

      case 'SUPER_ADMIN':
        return 'admin_panel_settings';

      default:
        return 'person';

    }

  }


  getRoleTitle(): string {

    const role = this.authService.userRole();

    switch (role) {

      case 'JUDGE':
        return 'Judge Dashboard • Judicial Bench Active';

      case 'INVESTIGATING_OFFICER':
        return 'Officer Dashboard • Law Enforcement Active';

      case 'PROSECUTOR':
        return 'Prosecutor Dashboard • State Prosecution Active';

      case 'LAWYER':
        return 'Lawyer Dashboard • Bar Council Active';

      case 'SUPER_ADMIN':
        return 'Administrator Dashboard • Vault Master Active';

      default:
        return 'Authorized Judicial Dashboard';

    }

  }


  getRoleScopeDescription(): string {

    const role = this.authService.userRole();

    switch (role) {

      case 'JUDGE':

        return 'Bench authorization granted: Preside over case hearings, review evidence integrity audits, issue and sign tamper-proof judicial orders.';


      case 'INVESTIGATING_OFFICER':

        return 'Investigative authority active: Register FIRs, upload forensic documents, record physical evidence seizures, and initiate chain of custody.';


      case 'PROSECUTOR':

        return 'Prosecutorial authority active: Scrutinize police charge sheets, inspect digital evidence hashes, and prepare arguments with anchored proofs.';


      case 'LAWYER':

        return 'Defense council view: Access assigned client discovery files, independently verify cryptographic signatures, and track custody handovers.';


      case 'SUPER_ADMIN':

        return 'System administrator privileges: Oversee smart contract anchors, IPFS storage nodes, immutable audit ledger, and user security permissions.';


      default:

        return 'Authorized digital judiciary workspace: Section 65B certified evidence management and blockchain verification.';

    }

  }

}