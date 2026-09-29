package com.evault.evidence.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EvidenceCreateRequest {

    @NotNull(message = "Case ID is required")
    private Long caseId;

    private Long documentId;

    @NotBlank(message = "Evidence type is required")
    private String evidenceType;

    @NotBlank(message = "Description is required")
    private String description;

    private String storageLocation;

    public EvidenceCreateRequest() {
    }

    public EvidenceCreateRequest(Long caseId, Long documentId, String evidenceType, String description, String storageLocation) {
        this.caseId = caseId;
        this.documentId = documentId;
        this.evidenceType = evidenceType;
        this.description = description;
        this.storageLocation = storageLocation;
    }

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
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
}
