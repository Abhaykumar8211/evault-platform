package com.evault.evidence.dto;

import jakarta.validation.constraints.NotBlank;

public class EvidenceTransferRequest {

    @NotBlank(message = "New custodian name or department is required")
    private String newCustodian;

    @NotBlank(message = "Action type is required")
    private String actionType; // e.g. "TRANSFERRED_TO_FORENSIC_LAB", "SUBMITTED_TO_COURT_REGISTRY", "RELEASED_TO_COUNSEL"

    private String newStorageLocation;

    private String remarks;

    public EvidenceTransferRequest() {
    }

    public EvidenceTransferRequest(String newCustodian, String actionType, String newStorageLocation, String remarks) {
        this.newCustodian = newCustodian;
        this.actionType = actionType;
        this.newStorageLocation = newStorageLocation;
        this.remarks = remarks;
    }

    public String getNewCustodian() {
        return newCustodian;
    }

    public void setNewCustodian(String newCustodian) {
        this.newCustodian = newCustodian;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getNewStorageLocation() {
        return newStorageLocation;
    }

    public void setNewStorageLocation(String newStorageLocation) {
        this.newStorageLocation = newStorageLocation;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
