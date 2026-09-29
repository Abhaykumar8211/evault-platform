package com.evault.cases.dto;

import com.evault.auth.dto.UserProfileResponse;
import com.evault.cases.CasePriority;
import com.evault.cases.CaseStatus;

import java.time.LocalDateTime;

public class CaseResponse {

    private Long id;
    private String caseNumber;
    private String title;
    private String firNumber;
    private String courtName;
    private String policeStation;
    private String caseType;
    private String description;
    private CasePriority priority;
    private String priorityDisplayName;
    private CaseStatus status;
    private String statusDisplayName;
    private UserProfileResponse assignedOfficer;
    private UserProfileResponse prosecutor;
    private UserProfileResponse judge;
    private UserProfileResponse createdBy;
    private int documentCount;
    private int evidenceCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CaseResponse() {
    }

    public CaseResponse(Long id, String caseNumber, String title, String firNumber, String courtName,
                        String policeStation, String caseType, String description, CasePriority priority,
                        String priorityDisplayName, CaseStatus status, String statusDisplayName,
                        UserProfileResponse assignedOfficer, UserProfileResponse prosecutor,
                        UserProfileResponse judge, UserProfileResponse createdBy,
                        int documentCount, int evidenceCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.caseNumber = caseNumber;
        this.title = title;
        this.firNumber = firNumber;
        this.courtName = courtName;
        this.policeStation = policeStation;
        this.caseType = caseType;
        this.description = description;
        this.priority = priority;
        this.priorityDisplayName = priorityDisplayName;
        this.status = status;
        this.statusDisplayName = statusDisplayName;
        this.assignedOfficer = assignedOfficer;
        this.prosecutor = prosecutor;
        this.judge = judge;
        this.createdBy = createdBy;
        this.documentCount = documentCount;
        this.evidenceCount = evidenceCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFirNumber() {
        return firNumber;
    }

    public void setFirNumber(String firNumber) {
        this.firNumber = firNumber;
    }

    public String getCourtName() {
        return courtName;
    }

    public void setCourtName(String courtName) {
        this.courtName = courtName;
    }

    public String getPoliceStation() {
        return policeStation;
    }

    public void setPoliceStation(String policeStation) {
        this.policeStation = policeStation;
    }

    public String getCaseType() {
        return caseType;
    }

    public void setCaseType(String caseType) {
        this.caseType = caseType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CasePriority getPriority() {
        return priority;
    }

    public void setPriority(CasePriority priority) {
        this.priority = priority;
    }

    public String getPriorityDisplayName() {
        return priorityDisplayName;
    }

    public void setPriorityDisplayName(String priorityDisplayName) {
        this.priorityDisplayName = priorityDisplayName;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public String getStatusDisplayName() {
        return statusDisplayName;
    }

    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
    }

    public UserProfileResponse getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(UserProfileResponse assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public UserProfileResponse getProsecutor() {
        return prosecutor;
    }

    public void setProsecutor(UserProfileResponse prosecutor) {
        this.prosecutor = prosecutor;
    }

    public UserProfileResponse getJudge() {
        return judge;
    }

    public void setJudge(UserProfileResponse judge) {
        this.judge = judge;
    }

    public UserProfileResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserProfileResponse createdBy) {
        this.createdBy = createdBy;
    }

    public int getDocumentCount() {
        return documentCount;
    }

    public void setDocumentCount(int documentCount) {
        this.documentCount = documentCount;
    }

    public int getEvidenceCount() {
        return evidenceCount;
    }

    public void setEvidenceCount(int evidenceCount) {
        this.evidenceCount = evidenceCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static class Builder {
        private Long id;
        private String caseNumber;
        private String title;
        private String firNumber;
        private String courtName;
        private String policeStation;
        private String caseType;
        private String description;
        private CasePriority priority;
        private String priorityDisplayName;
        private CaseStatus status;
        private String statusDisplayName;
        private UserProfileResponse assignedOfficer;
        private UserProfileResponse prosecutor;
        private UserProfileResponse judge;
        private UserProfileResponse createdBy;
        private int documentCount;
        private int evidenceCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder caseNumber(String caseNumber) {
            this.caseNumber = caseNumber;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder firNumber(String firNumber) {
            this.firNumber = firNumber;
            return this;
        }

        public Builder courtName(String courtName) {
            this.courtName = courtName;
            return this;
        }

        public Builder policeStation(String policeStation) {
            this.policeStation = policeStation;
            return this;
        }

        public Builder caseType(String caseType) {
            this.caseType = caseType;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder priority(CasePriority priority) {
            this.priority = priority;
            return this;
        }

        public Builder priorityDisplayName(String priorityDisplayName) {
            this.priorityDisplayName = priorityDisplayName;
            return this;
        }

        public Builder status(CaseStatus status) {
            this.status = status;
            return this;
        }

        public Builder statusDisplayName(String statusDisplayName) {
            this.statusDisplayName = statusDisplayName;
            return this;
        }

        public Builder assignedOfficer(UserProfileResponse assignedOfficer) {
            this.assignedOfficer = assignedOfficer;
            return this;
        }

        public Builder prosecutor(UserProfileResponse prosecutor) {
            this.prosecutor = prosecutor;
            return this;
        }

        public Builder judge(UserProfileResponse judge) {
            this.judge = judge;
            return this;
        }

        public Builder createdBy(UserProfileResponse createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public Builder documentCount(int documentCount) {
            this.documentCount = documentCount;
            return this;
        }

        public Builder evidenceCount(int evidenceCount) {
            this.evidenceCount = evidenceCount;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public CaseResponse build() {
            return new CaseResponse(id, caseNumber, title, firNumber, courtName, policeStation, caseType, description, priority, priorityDisplayName, status, statusDisplayName, assignedOfficer, prosecutor, judge, createdBy, documentCount, evidenceCount, createdAt, updatedAt);
        }
    }
}
