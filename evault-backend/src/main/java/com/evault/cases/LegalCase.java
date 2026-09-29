package com.evault.cases;

import com.evault.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "cases", indexes = {
    @Index(name = "idx_case_number", columnList = "caseNumber"),
    @Index(name = "idx_case_fir_number", columnList = "firNumber"),
    @Index(name = "idx_case_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
public class LegalCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String caseNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String firNumber;

    @Column(nullable = false, length = 150)
    private String courtName;

    @Column(nullable = false, length = 150)
    private String policeStation;

    @Column(nullable = false, length = 100)
    private String caseType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CasePriority priority = CasePriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CaseStatus status = CaseStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prosecutor_id")
    private User prosecutor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "judge_id")
    private User judge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public LegalCase() {
    }

    public LegalCase(Long id, String caseNumber, String title, String firNumber, String courtName,
                     String policeStation, String caseType, String description, CasePriority priority,
                     CaseStatus status, User assignedOfficer, User prosecutor, User judge,
                     User createdBy, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.caseNumber = caseNumber;
        this.title = title;
        this.firNumber = firNumber;
        this.courtName = courtName;
        this.policeStation = policeStation;
        this.caseType = caseType;
        this.description = description;
        this.priority = priority != null ? priority : CasePriority.MEDIUM;
        this.status = status != null ? status : CaseStatus.OPEN;
        this.assignedOfficer = assignedOfficer;
        this.prosecutor = prosecutor;
        this.judge = judge;
        this.createdBy = createdBy;
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

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public User getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(User assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
    }

    public User getProsecutor() {
        return prosecutor;
    }

    public void setProsecutor(User prosecutor) {
        this.prosecutor = prosecutor;
    }

    public User getJudge() {
        return judge;
    }

    public void setJudge(User judge) {
        this.judge = judge;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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
        private CasePriority priority = CasePriority.MEDIUM;
        private CaseStatus status = CaseStatus.OPEN;
        private User assignedOfficer;
        private User prosecutor;
        private User judge;
        private User createdBy;
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

        public Builder status(CaseStatus status) {
            this.status = status;
            return this;
        }

        public Builder assignedOfficer(User assignedOfficer) {
            this.assignedOfficer = assignedOfficer;
            return this;
        }

        public Builder prosecutor(User prosecutor) {
            this.prosecutor = prosecutor;
            return this;
        }

        public Builder judge(User judge) {
            this.judge = judge;
            return this;
        }

        public Builder createdBy(User createdBy) {
            this.createdBy = createdBy;
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

        public LegalCase build() {
            return new LegalCase(id, caseNumber, title, firNumber, courtName, policeStation, caseType, description, priority, status, assignedOfficer, prosecutor, judge, createdBy, createdAt, updatedAt);
        }
    }
}
