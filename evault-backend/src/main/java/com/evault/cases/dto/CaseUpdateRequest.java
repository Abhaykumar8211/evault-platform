package com.evault.cases.dto;

import com.evault.cases.CasePriority;
import com.evault.cases.CaseStatus;

public class CaseUpdateRequest {

    private String title;
    private String description;
    private CasePriority priority;
    private CaseStatus status;
    private Long assignedOfficerId;
    private Long prosecutorId;
    private Long judgeId;

    public CaseUpdateRequest() {
    }

    public CaseUpdateRequest(String title, String description, CasePriority priority, CaseStatus status, Long assignedOfficerId, Long prosecutorId, Long judgeId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
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

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
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
