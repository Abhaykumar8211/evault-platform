package com.evault.evidence;

import com.evault.cases.LegalCase;
import com.evault.document.LegalDocument;
import com.evault.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "evidence", indexes = {
    @Index(name = "idx_evidence_number", columnList = "evidenceNumber"),
    @Index(name = "idx_evidence_case", columnList = "case_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private LegalCase legalCase;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private LegalDocument document;

    @Column(nullable = false, unique = true, length = 60)
    private String evidenceNumber;

    @Column(nullable = false, length = 100)
    private String evidenceType; // e.g. "DIGITAL_STORAGE", "CRIME_SCENE_WEAPON", "TOXICOLOGY_VIAL", "AUDIO_RECORDING"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 150)
    private String storageLocation; // e.g. "Malkhana Locker #42B", "Digital Evidence Server A"

    @Column(length = 60)
    private String custodyStatus = "SECURED_IN_CUSTODY";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collected_by_user_id")
    private User collectedBy;

    private LocalDateTime collectedAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Evidence() {
    }

    public Evidence(Long id, LegalCase legalCase, LegalDocument document, String evidenceNumber,
                    String evidenceType, String description, String storageLocation,
                    String custodyStatus, User collectedBy, LocalDateTime collectedAt, LocalDateTime createdAt) {
        this.id = id;
        this.legalCase = legalCase;
        this.document = document;
        this.evidenceNumber = evidenceNumber;
        this.evidenceType = evidenceType;
        this.description = description;
        this.storageLocation = storageLocation;
        this.custodyStatus = custodyStatus != null ? custodyStatus : "SECURED_IN_CUSTODY";
        this.collectedBy = collectedBy;
        this.collectedAt = collectedAt;
        this.createdAt = createdAt;
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

    public LegalCase getLegalCase() {
        return legalCase;
    }

    public void setLegalCase(LegalCase legalCase) {
        this.legalCase = legalCase;
    }

    public LegalDocument getDocument() {
        return document;
    }

    public void setDocument(LegalDocument document) {
        this.document = document;
    }

    public String getEvidenceNumber() {
        return evidenceNumber;
    }

    public void setEvidenceNumber(String evidenceNumber) {
        this.evidenceNumber = evidenceNumber;
    }

    public String getEvidenceType() {
        return evidenceType;
    }

    public void setEvidenceType(String evidenceType) {
        this.evidenceType = evidenceType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    public String getCustodyStatus() {
        return custodyStatus;
    }

    public void setCustodyStatus(String custodyStatus) {
        this.custodyStatus = custodyStatus;
    }

    public User getCollectedBy() {
        return collectedBy;
    }

    public void setCollectedBy(User collectedBy) {
        this.collectedBy = collectedBy;
    }

    public LocalDateTime getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(LocalDateTime collectedAt) {
        this.collectedAt = collectedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class Builder {
        private Long id;
        private LegalCase legalCase;
        private LegalDocument document;
        private String evidenceNumber;
        private String evidenceType;
        private String description;
        private String storageLocation;
        private String custodyStatus = "SECURED_IN_CUSTODY";
        private User collectedBy;
        private LocalDateTime collectedAt;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder legalCase(LegalCase legalCase) {
            this.legalCase = legalCase;
            return this;
        }

        public Builder document(LegalDocument document) {
            this.document = document;
            return this;
        }

        public Builder evidenceNumber(String evidenceNumber) {
            this.evidenceNumber = evidenceNumber;
            return this;
        }

        public Builder evidenceType(String evidenceType) {
            this.evidenceType = evidenceType;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder storageLocation(String storageLocation) {
            this.storageLocation = storageLocation;
            return this;
        }

        public Builder custodyStatus(String custodyStatus) {
            this.custodyStatus = custodyStatus;
            return this;
        }

        public Builder collectedBy(User collectedBy) {
            this.collectedBy = collectedBy;
            return this;
        }

        public Builder collectedAt(LocalDateTime collectedAt) {
            this.collectedAt = collectedAt;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Evidence build() {
            return new Evidence(id, legalCase, document, evidenceNumber, evidenceType, description, storageLocation, custodyStatus, collectedBy, collectedAt, createdAt);
        }
    }
}
