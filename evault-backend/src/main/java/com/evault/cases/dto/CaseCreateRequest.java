package com.evault.cases.dto;

import com.evault.cases.CasePriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CaseCreateRequest {

    @NotBlank(message = "Case title is required")
    private String title;

    @NotBlank(message = "FIR number is required")
    private String firNumber;

    @NotBlank(message = "Court name is required")
    private String courtName;

    @NotBlank(message = "Police station is required")
    private String policeStation;

    @NotBlank(message = "Case type is required")
    private String caseType;

    private String description;

    @NotNull(message = "Priority is required")
    private CasePriority priority = CasePriority.MEDIUM;

    private Long assignedOfficerId;
    private Long prosecutorId;
    private Long judgeId;

    public CaseCreateRequest() {
    }

    public CaseCreateRequest(String title, String firNumber, String courtName, String policeStation, String caseType, String description, CasePriority priority, Long assignedOfficerId, Long prosecutorId, Long judgeId) {
        this.title = title;
        this.firNumber = firNumber;
        this.courtName = courtName;
        this.policeStation = policeStation;
        this.caseType = caseType;
        this.description = description;
        this.priority = priority;
        this.assignedOfficerId = assignedOfficerId;
        this.prosecutorId = prosecutorId;
        this.judgeId = judgeId;
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

    public Long getAssignedOfficerId() {
        return assignedOfficerId;
    }

    public void setAssignedOfficerId(Long assignedOfficerId) {
        this.assignedOfficerId = assignedOfficerId;
    }

    public Long getProsecutorId() {
        return prosecutorId;
    }

    public void setProsecutorId(Long prosecutorId) {
        this.prosecutorId = prosecutorId;
    }

    public Long getJudgeId() {
        return judgeId;
    }

    public void setJudgeId(Long judgeId) {
        this.judgeId = judgeId;
    }
}
