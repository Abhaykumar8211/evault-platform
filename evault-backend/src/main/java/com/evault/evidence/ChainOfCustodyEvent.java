package com.evault.evidence;

import com.evault.document.LegalDocument;
import com.evault.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "chain_of_custody_events", indexes = {
    @Index(name = "idx_custody_evidence_id", columnList = "evidence_id"),
    @Index(name = "idx_custody_timestamp", columnList = "timestamp")
})
@EntityListeners(AuditingEntityListener.class)
public class ChainOfCustodyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evidence_id")
    private Evidence evidence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private LegalDocument document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_user_id")
    private User actor;

    @Column(nullable = false, length = 80)
    private String actionType; // e.g. "EVIDENCE_SEIZED", "HASH_GENERATED", "IPFS_OFFLOADED", "BLOCKCHAIN_ANCHORED", "TRANSFERRED_TO_LAB", "REVIEWED_BY_PROSECUTOR", "VERIFIED_BY_JUDGE"

    @Column(length = 150)
    private String previousCustodian;

    @Column(length = 150)
    private String newCustodian;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(length = 64)
    private String eventHash;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    public ChainOfCustodyEvent() {
    }

    public ChainOfCustodyEvent(Long id, Evidence evidence, LegalDocument document, User actor,
                               String actionType, String previousCustodian, String newCustodian,
                               String remarks, String eventHash, LocalDateTime timestamp) {
        this.id = id;
        this.evidence = evidence;
        this.document = document;
        this.actor = actor;
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

    public Evidence getEvidence() {
        return evidence;
    }

    public void setEvidence(Evidence evidence) {
        this.evidence = evidence;
    }

    public LegalDocument getDocument() {
        return document;
    }

    public void setDocument(LegalDocument document) {
        this.document = document;
    }

    public User getActor() {
        return actor;
    }

    public void setActor(User actor) {
        this.actor = actor;
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
        private Evidence evidence;
        private LegalDocument document;
        private User actor;
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

        public Builder evidence(Evidence evidence) {
            this.evidence = evidence;
            return this;
        }

        public Builder document(LegalDocument document) {
            this.document = document;
            return this;
        }

        public Builder actor(User actor) {
            this.actor = actor;
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

        public ChainOfCustodyEvent build() {
            return new ChainOfCustodyEvent(id, evidence, document, actor, actionType, previousCustodian, newCustodian, remarks, eventHash, timestamp);
        }
    }
}
