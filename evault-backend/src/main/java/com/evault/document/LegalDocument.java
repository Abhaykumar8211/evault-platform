package com.evault.document;

import com.evault.blockchain.BlockchainRecord;
import com.evault.cases.LegalCase;
import com.evault.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents", indexes = {
    @Index(name = "idx_doc_sha256", columnList = "sha256Hash"),
    @Index(name = "idx_doc_ipfs_cid", columnList = "ipfsCid"),
    @Index(name = "idx_doc_case_id", columnList = "case_id"),
    @Index(name = "idx_doc_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
public class LegalDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private LegalCase legalCase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private DocumentType documentType;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 100)
    private String mimeType;

    @Column(nullable = false, length = 64)
    private String sha256Hash;

    @Column(nullable = false, length = 100)
    private String ipfsCid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_user_id")
    private User uploadedBy;

    @Column(nullable = false)
    private Integer version = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private DocumentStatus status = DocumentStatus.ANCHORED;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blockchain_record_id")
    private BlockchainRecord blockchainRecord;

    @Column(nullable = false)
    private boolean archived = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public LegalDocument() {
    }

    public LegalDocument(Long id, LegalCase legalCase, DocumentType documentType, String title,
                         String description, String fileName, Long fileSize, String mimeType,
                         String sha256Hash, String ipfsCid, User uploadedBy, Integer version,
                         DocumentStatus status, BlockchainRecord blockchainRecord,
                         boolean archived, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.legalCase = legalCase;
        this.documentType = documentType;
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.sha256Hash = sha256Hash;
        this.ipfsCid = ipfsCid;
        this.uploadedBy = uploadedBy;
        this.version = version != null ? version : 1;
        this.status = status != null ? status : DocumentStatus.ANCHORED;
        this.blockchainRecord = blockchainRecord;
        this.archived = archived;
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

    public LegalCase getLegalCase() {
        return legalCase;
    }

    public void setLegalCase(LegalCase legalCase) {
        this.legalCase = legalCase;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
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

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
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

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public BlockchainRecord getBlockchainRecord() {
        return blockchainRecord;
    }

    public void setBlockchainRecord(BlockchainRecord blockchainRecord) {
        this.blockchainRecord = blockchainRecord;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
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
        private LegalCase legalCase;
        private DocumentType documentType;
        private String title;
        private String description;
        private String fileName;
        private Long fileSize;
        private String mimeType;
        private String sha256Hash;
        private String ipfsCid;
        private User uploadedBy;
        private Integer version = 1;
        private DocumentStatus status = DocumentStatus.ANCHORED;
        private BlockchainRecord blockchainRecord;
        private boolean archived = false;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder legalCase(LegalCase legalCase) {
            this.legalCase = legalCase;
            return this;
        }

        public Builder documentType(DocumentType documentType) {
            this.documentType = documentType;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
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

        public Builder mimeType(String mimeType) {
            this.mimeType = mimeType;
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

        public Builder uploadedBy(User uploadedBy) {
            this.uploadedBy = uploadedBy;
            return this;
        }

        public Builder version(Integer version) {
            this.version = version;
            return this;
        }

        public Builder status(DocumentStatus status) {
            this.status = status;
            return this;
        }

        public Builder blockchainRecord(BlockchainRecord blockchainRecord) {
            this.blockchainRecord = blockchainRecord;
            return this;
        }

        public Builder archived(boolean archived) {
            this.archived = archived;
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

        public LegalDocument build() {
            return new LegalDocument(id, legalCase, documentType, title, description, fileName, fileSize, mimeType, sha256Hash, ipfsCid, uploadedBy, version, status, blockchainRecord, archived, createdAt, updatedAt);
        }
    }
}
