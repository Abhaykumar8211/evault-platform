package com.evault.document;

import com.evault.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "document_versions", indexes = {
    @Index(name = "idx_doc_ver_doc_id", columnList = "document_id"),
    @Index(name = "idx_doc_ver_sha256", columnList = "sha256Hash")
})
@EntityListeners(AuditingEntityListener.class)
public class DocumentVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private LegalDocument document;

    @Column(nullable = false)
    private Integer versionNumber;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 64)
    private String sha256Hash;

    @Column(nullable = false, length = 100)
    private String ipfsCid;

    @Column(length = 100)
    private String transactionHash;

    @Column(columnDefinition = "TEXT")
    private String changeSummary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_user_id")
    private User uploadedBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DocumentVersion() {
    }

    public DocumentVersion(Long id, LegalDocument document, Integer versionNumber, String fileName,
                           Long fileSize, String sha256Hash, String ipfsCid, String transactionHash,
                           String changeSummary, User uploadedBy, LocalDateTime createdAt) {
        this.id = id;
        this.document = document;
        this.versionNumber = versionNumber;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.sha256Hash = sha256Hash;
        this.ipfsCid = ipfsCid;
        this.transactionHash = transactionHash;
        this.changeSummary = changeSummary;
        this.uploadedBy = uploadedBy;
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

    public LegalDocument getDocument() {
        return document;
    }

    public void setDocument(LegalDocument document) {
        this.document = document;
    }

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getSha256Hash() {
        return sha256Hash;
    }

    public void setSha256Hash(String sha256Hash) {
        this.sha256Hash = sha256Hash;
    }

    public String getIpfsCid() {
        return ipfsCid;
    }

    public void setIpfsCid(String ipfsCid) {
        this.ipfsCid = ipfsCid;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public String getChangeSummary() {
        return changeSummary;
    }

    public void setChangeSummary(String changeSummary) {
        this.changeSummary = changeSummary;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class Builder {
        private Long id;
        private LegalDocument document;
        private Integer versionNumber;
        private String fileName;
        private Long fileSize;
        private String sha256Hash;
        private String ipfsCid;
        private String transactionHash;
        private String changeSummary;
        private User uploadedBy;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder document(LegalDocument document) {
            this.document = document;
            return this;
        }

        public Builder versionNumber(Integer versionNumber) {
            this.versionNumber = versionNumber;
            return this;
        }

        public Builder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public Builder fileSize(Long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        public Builder sha256Hash(String sha256Hash) {
            this.sha256Hash = sha256Hash;
            return this;
        }

        public Builder ipfsCid(String ipfsCid) {
            this.ipfsCid = ipfsCid;
            return this;
        }

        public Builder transactionHash(String transactionHash) {
            this.transactionHash = transactionHash;
            return this;
        }

        public Builder changeSummary(String changeSummary) {
            this.changeSummary = changeSummary;
            return this;
        }

        public Builder uploadedBy(User uploadedBy) {
            this.uploadedBy = uploadedBy;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DocumentVersion build() {
            return new DocumentVersion(id, document, versionNumber, fileName, fileSize, sha256Hash, ipfsCid, transactionHash, changeSummary, uploadedBy, createdAt);
        }
    }
}
