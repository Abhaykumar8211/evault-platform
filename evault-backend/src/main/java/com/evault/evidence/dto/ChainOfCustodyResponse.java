package com.evault.evidence.dto;

import java.time.LocalDateTime;

public class ChainOfCustodyResponse {

    private Long id;
    private Long evidenceId;
    private Long documentId;
    private String actorName;
    private String actorRole;
    private String actionType;
    private String previousCustodian;
    private String newCustodian;
    private String remarks;
    private String eventHash;
    private LocalDateTime timestamp;

    public ChainOfCustodyResponse() {
    }

    public ChainOfCustodyResponse(Long id, Long evidenceId, Long documentId, String actorName,
                                  String actorRole, String actionType, String previousCustodian,
                                  String newCustodian, String remarks, String eventHash,
                                  LocalDateTime timestamp) {
        this.id = id;
        this.evidenceId = evidenceId;
        this.documentId = documentId;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.actionType = actionType;
        this.previousCustodian = previousCustodian;
        this.newCustodian = newCustodian;
        this.remarks = remarks;
        this.eventHash = eventHash;
        this.timestamp = timestamp;
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

    public Long getEvidenceId() {
        return evidenceId;
    }

    public void setEvidenceId(Long evidenceId) {
        this.evidenceId = evidenceId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getPreviousCustodian() {
        return previousCustodian;
    }

    public void setPreviousCustodian(String previousCustodian) {
        this.previousCustodian = previousCustodian;
    }

    public String getNewCustodian() {
        return newCustodian;
    }

    public void setNewCustodian(String newCustodian) {
        this.newCustodian = newCustodian;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getEventHash() {
        return eventHash;
    }

    public void setEventHash(String eventHash) {
        this.eventHash = eventHash;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public static class Builder {
        private Long id;
        private Long evidenceId;
        private Long documentId;
        private String actorName;
        private String actorRole;
        private String actionType;
        private String previousCustodian;
        private String newCustodian;
        private String remarks;
        private String eventHash;
        private LocalDateTime timestamp;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder evidenceId(Long evidenceId) {
            this.evidenceId = evidenceId;
            return this;
        }

        public Builder documentId(Long documentId) {
            this.documentId = documentId;
            return this;
        }

        public Builder actorName(String actorName) {
            this.actorName = actorName;
            return this;
        }

        public Builder actorRole(String actorRole) {
            this.actorRole = actorRole;
            return this;
        }

        public Builder actionType(String actionType) {
            this.actionType = actionType;
            return this;
        }

        public Builder previousCustodian(String previousCustodian) {
            this.previousCustodian = previousCustodian;
            return this;
        }

        public Builder newCustodian(String newCustodian) {
            this.newCustodian = newCustodian;
            return this;
        }

        public Builder remarks(String remarks) {
            this.remarks = remarks;
            return this;
        }

        public Builder eventHash(String eventHash) {
            this.eventHash = eventHash;
            return this;
        }

        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ChainOfCustodyResponse build() {
            return new ChainOfCustodyResponse(id, evidenceId, documentId, actorName, actorRole, actionType, previousCustodian, newCustodian, remarks, eventHash, timestamp);
        }
    }
}
