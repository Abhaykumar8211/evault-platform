package com.evault.evidence.dto;

import com.evault.auth.dto.UserProfileResponse;
import com.evault.document.dto.DocumentResponse;

import java.time.LocalDateTime;
import java.util.List;

public class EvidenceResponse {

    private Long id;
    private Long caseId;
    private String caseNumber;
    private String evidenceNumber;
    private String evidenceType;
    private String description;
    private String storageLocation;
    private String custodyStatus;
    private UserProfileResponse collectedBy;
    private LocalDateTime collectedAt;
    private DocumentResponse attachedDocument;
    private List<ChainOfCustodyResponse> custodyHistory;
    private LocalDateTime createdAt;

    public EvidenceResponse() {
    }

    public EvidenceResponse(Long id, Long caseId, String caseNumber, String evidenceNumber,
                            String evidenceType, String description, String storageLocation,
                            String custodyStatus, UserProfileResponse collectedBy,
                            LocalDateTime collectedAt, DocumentResponse attachedDocument,
                            List<ChainOfCustodyResponse> custodyHistory, LocalDateTime createdAt) {
        this.id = id;
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.evidenceNumber = evidenceNumber;
        this.evidenceType = evidenceType;
        this.description = description;
        this.storageLocation = storageLocation;
        this.custodyStatus = custodyStatus;
        this.collectedBy = collectedBy;
        this.collectedAt = collectedAt;
        this.attachedDocument = attachedDocument;
        this.custodyHistory = custodyHistory;
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

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
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

    public UserProfileResponse getCollectedBy() {
        return collectedBy;
    }

    public void setCollectedBy(UserProfileResponse collectedBy) {
        this.collectedBy = collectedBy;
    }

    public LocalDateTime getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(LocalDateTime collectedAt) {
        this.collectedAt = collectedAt;
    }

    public DocumentResponse getAttachedDocument() {
        return attachedDocument;
    }

    public void setAttachedDocument(DocumentResponse attachedDocument) {
        this.attachedDocument = attachedDocument;
    }

    public List<ChainOfCustodyResponse> getCustodyHistory() {
        return custodyHistory;
    }

    public void setCustodyHistory(List<ChainOfCustodyResponse> custodyHistory) {
        this.custodyHistory = custodyHistory;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class Builder {
        private Long id;
        private Long caseId;
        private String caseNumber;
        private String evidenceNumber;
        private String evidenceType;
        private String description;
        private String storageLocation;
        private String custodyStatus;
        private UserProfileResponse collectedBy;
        private LocalDateTime collectedAt;
        private DocumentResponse attachedDocument;
        private List<ChainOfCustodyResponse> custodyHistory;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder caseId(Long caseId) {
            this.caseId = caseId;
            return this;
        }

        public Builder caseNumber(String caseNumber) {
            this.caseNumber = caseNumber;
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

        public Builder collectedBy(UserProfileResponse collectedBy) {
            this.collectedBy = collectedBy;
            return this;
        }

        public Builder collectedAt(LocalDateTime collectedAt) {
            this.collectedAt = collectedAt;
            return this;
        }

        public Builder attachedDocument(DocumentResponse attachedDocument) {
            this.attachedDocument = attachedDocument;
            return this;
        }

        public Builder custodyHistory(List<ChainOfCustodyResponse> custodyHistory) {
            this.custodyHistory = custodyHistory;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public EvidenceResponse build() {
            return new EvidenceResponse(id, caseId, caseNumber, evidenceNumber, evidenceType, description, storageLocation, custodyStatus, collectedBy, collectedAt, attachedDocument, custodyHistory, createdAt);
        }
    }
}
