package com.evault.dashboard.dto;

import java.util.List;
import java.util.Map;

public class DashboardChartsResponse {

    private Map<String, Long> casesByStatus;
    private Map<String, Long> documentsByType;
    private Map<String, Long> verificationStatusDistribution;
    private List<String> monthlyLabels;
    private List<Long> monthlyCases;
    private List<Long> monthlyDocuments;

    public DashboardChartsResponse() {
    }

    public DashboardChartsResponse(Map<String, Long> casesByStatus, Map<String, Long> documentsByType,
                                   Map<String, Long> verificationStatusDistribution, List<String> monthlyLabels,
                                   List<Long> monthlyCases, List<Long> monthlyDocuments) {
        this.casesByStatus = casesByStatus;
        this.documentsByType = documentsByType;
        this.verificationStatusDistribution = verificationStatusDistribution;
        this.monthlyLabels = monthlyLabels;
        this.monthlyCases = monthlyCases;
        this.monthlyDocuments = monthlyDocuments;
    }

    public Map<String, Long> getCasesByStatus() {
        return casesByStatus;
    }

    public void setCasesByStatus(Map<String, Long> casesByStatus) {
        this.casesByStatus = casesByStatus;
    }

    public Map<String, Long> getDocumentsByType() {
        return documentsByType;
    }

    public void setDocumentsByType(Map<String, Long> documentsByType) {
        this.documentsByType = documentsByType;
    }

    public Map<String, Long> getVerificationStatusDistribution() {
        return verificationStatusDistribution;
    }

    public void setVerificationStatusDistribution(Map<String, Long> verificationStatusDistribution) {
        this.verificationStatusDistribution = verificationStatusDistribution;
    }

    public List<String> getMonthlyLabels() {
        return monthlyLabels;
    }

    public void setMonthlyLabels(List<String> monthlyLabels) {
        this.monthlyLabels = monthlyLabels;
    }

    public List<Long> getMonthlyCases() {
        return monthlyCases;
    }

    public void setMonthlyCases(List<Long> monthlyCases) {
        this.monthlyCases = monthlyCases;
    }

    public List<Long> getMonthlyDocuments() {
        return monthlyDocuments;
    }

    public void setMonthlyDocuments(List<Long> monthlyDocuments) {
        this.monthlyDocuments = monthlyDocuments;
    }
}
