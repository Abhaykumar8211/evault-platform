package com.evault.dashboard.dto;

import com.evault.cases.dto.CaseResponse;
import com.evault.document.dto.DocumentResponse;
import com.evault.verification.TamperIncident;

import java.util.List;

public class DashboardStatsResponse {

    private long totalActiveCases;
    private long totalDocuments;
    private long totalEvidenceItems;
    private long verifiedDocuments;
    private long pendingVerification;
    private long tamperAlertsCount;
    private long totalUsers;
    private List<CaseResponse> recentCases;
    private List<DocumentResponse> recentDocuments;
    private List<TamperIncident> recentTamperAlerts;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalActiveCases, long totalDocuments, long totalEvidenceItems,
                                  long verifiedDocuments, long pendingVerification, long tamperAlertsCount,
                                  long totalUsers, List<CaseResponse> recentCases,
                                  List<DocumentResponse> recentDocuments, List<TamperIncident> recentTamperAlerts) {
        this.totalActiveCases = totalActiveCases;
        this.totalDocuments = totalDocuments;
        this.totalEvidenceItems = totalEvidenceItems;
        this.verifiedDocuments = verifiedDocuments;
        this.pendingVerification = pendingVerification;
        this.tamperAlertsCount = tamperAlertsCount;
        this.totalUsers = totalUsers;
        this.recentCases = recentCases;
        this.recentDocuments = recentDocuments;
        this.recentTamperAlerts = recentTamperAlerts;
    }

    public static Builder builder() {
        return new Builder();
    }

    public long getTotalActiveCases() {
        return totalActiveCases;
    }

    public void setTotalActiveCases(long totalActiveCases) {
        this.totalActiveCases = totalActiveCases;
    }

    public long getTotalDocuments() {
        return totalDocuments;
    }

    public void setTotalDocuments(long totalDocuments) {
        this.totalDocuments = totalDocuments;
    }

    public long getTotalEvidenceItems() {
        return totalEvidenceItems;
    }

    public void setTotalEvidenceItems(long totalEvidenceItems) {
        this.totalEvidenceItems = totalEvidenceItems;
    }

    public long getVerifiedDocuments() {
        return verifiedDocuments;
    }

    public void setVerifiedDocuments(long verifiedDocuments) {
        this.verifiedDocuments = verifiedDocuments;
    }

    public long getPendingVerification() {
        return pendingVerification;
    }

    public void setPendingVerification(long pendingVerification) {
        this.pendingVerification = pendingVerification;
    }

    public long getTamperAlertsCount() {
        return tamperAlertsCount;
    }

    public void setTamperAlertsCount(long tamperAlertsCount) {
        this.tamperAlertsCount = tamperAlertsCount;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public List<CaseResponse> getRecentCases() {
        return recentCases;
    }

    public void setRecentCases(List<CaseResponse> recentCases) {
        this.recentCases = recentCases;
    }

    public List<DocumentResponse> getRecentDocuments() {
        return recentDocuments;
    }

    public void setRecentDocuments(List<DocumentResponse> recentDocuments) {
        this.recentDocuments = recentDocuments;
    }

    public List<TamperIncident> getRecentTamperAlerts() {
        return recentTamperAlerts;
    }

    public void setRecentTamperAlerts(List<TamperIncident> recentTamperAlerts) {
        this.recentTamperAlerts = recentTamperAlerts;
    }

    public static class Builder {
        private long totalActiveCases;
        private long totalDocuments;
        private long totalEvidenceItems;
        private long verifiedDocuments;
        private long pendingVerification;
        private long tamperAlertsCount;
        private long totalUsers;
        private List<CaseResponse> recentCases;
        private List<DocumentResponse> recentDocuments;
        private List<TamperIncident> recentTamperAlerts;

        public Builder totalActiveCases(long totalActiveCases) {
            this.totalActiveCases = totalActiveCases;
            return this;
        }

        public Builder totalDocuments(long totalDocuments) {
            this.totalDocuments = totalDocuments;
            return this;
        }

        public Builder totalEvidenceItems(long totalEvidenceItems) {
            this.totalEvidenceItems = totalEvidenceItems;
            return this;
        }

        public Builder verifiedDocuments(long verifiedDocuments) {
            this.verifiedDocuments = verifiedDocuments;
            return this;
        }

        public Builder pendingVerification(long pendingVerification) {
            this.pendingVerification = pendingVerification;
            return this;
        }

        public Builder tamperAlertsCount(long tamperAlertsCount) {
            this.tamperAlertsCount = tamperAlertsCount;
            return this;
        }

        public Builder totalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public Builder recentCases(List<CaseResponse> recentCases) {
            this.recentCases = recentCases;
            return this;
        }

        public Builder recentDocuments(List<DocumentResponse> recentDocuments) {
            this.recentDocuments = recentDocuments;
            return this;
        }

        public Builder recentTamperAlerts(List<TamperIncident> recentTamperAlerts) {
            this.recentTamperAlerts = recentTamperAlerts;
            return this;
        }

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalActiveCases, totalDocuments, totalEvidenceItems, verifiedDocuments, pendingVerification, tamperAlertsCount, totalUsers, recentCases, recentDocuments, recentTamperAlerts);
        }
    }
}
