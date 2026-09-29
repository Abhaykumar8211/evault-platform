package com.evault.verification;

import com.evault.document.LegalDocument;
import com.evault.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "tamper_incidents", indexes = {
    @Index(name = "idx_tamper_detected_at", columnList = "detectedAt")
})
@EntityListeners(AuditingEntityListener.class)
public class TamperIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private LegalDocument document;

    @Column(nullable = false, length = 100)
    private String documentTitle;

    @Column(length = 60)
    private String caseNumber;

    @Column(nullable = false, length = 64)
    private String expectedHash;

    @Column(nullable = false, length = 64)
    private String attemptedHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_user_id")
    private User reportedBy;

    @Column(length = 30)
    private String severity = "CRITICAL";

    @Column(columnDefinition = "TEXT")
    private String incidentDetails;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime detectedAt;

    public TamperIncident() {
    }

    public TamperIncident(Long id, LegalDocument document, String documentTitle, String caseNumber,
                          String expectedHash, String attemptedHash, User reportedBy,
                          String severity, String incidentDetails, LocalDateTime detectedAt) {
        this.id = id;
        this.document = document;
        this.documentTitle = documentTitle;
        this.caseNumber = caseNumber;
        this.expectedHash = expectedHash;
        this.attemptedHash = attemptedHash;
        this.reportedBy = reportedBy;
        this.severity = severity != null ? severity : "CRITICAL";
        this.incidentDetails = incidentDetails;
        this.detectedAt = detectedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LegalDocument getDocument() {
        return document;
    }

    public void setDocument(LegalDocument document) {
        this.document = document;
    }

    public String getDocumentTitle() {
        return documentTitle;
    }

    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getExpectedHash() {
        return expectedHash;
    }

    public void setExpectedHash(String expectedHash) {
        this.expectedHash = expectedHash;
    }

    public String getAttemptedHash() {
        return attemptedHash;
    }

    public void setAttemptedHash(String attemptedHash) {
        this.attemptedHash = attemptedHash;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getIncidentDetails() {
        return incidentDetails;
    }

    public void setIncidentDetails(String incidentDetails) {
        this.incidentDetails = incidentDetails;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    public static class Builder {
        private Long id;
        private LegalDocument document;
        private String documentTitle;
        private String caseNumber;
        private String expectedHash;
        private String attemptedHash;
        private User reportedBy;
        private String severity = "CRITICAL";
        private String incidentDetails;
        private LocalDateTime detectedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder document(LegalDocument document) {
            this.document = document;
            return this;
        }

        public Builder documentTitle(String documentTitle) {
            this.documentTitle = documentTitle;
            return this;
        }

        public Builder caseNumber(String caseNumber) {
            this.caseNumber = caseNumber;
            return this;
        }

        public Builder expectedHash(String expectedHash) {
            this.expectedHash = expectedHash;
            return this;
        }

        public Builder attemptedHash(String attemptedHash) {
            this.attemptedHash = attemptedHash;
            return this;
        }

        public Builder reportedBy(User reportedBy) {
            this.reportedBy = reportedBy;
            return this;
        }

        public Builder severity(String severity) {
            this.severity = severity;
            return this;
        }

        public Builder incidentDetails(String incidentDetails) {
            this.incidentDetails = incidentDetails;
            return this;
        }

        public Builder detectedAt(LocalDateTime detectedAt) {
            this.detectedAt = detectedAt;
            return this;
        }

        public TamperIncident build() {
            return new TamperIncident(id, document, documentTitle, caseNumber, expectedHash, attemptedHash, reportedBy, severity, incidentDetails, detectedAt);
        }
    }
}
