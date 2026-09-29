package com.evault.document.dto;

import com.evault.auth.dto.UserProfileResponse;

import java.time.LocalDateTime;

public class DocumentVersionResponse {

    private Long id;
    private Long documentId;
    private Integer versionNumber;
    private String fileName;
    private Long fileSize;
    private String sha256Hash;
    private String ipfsCid;
    private String transactionHash;
    private String changeSummary;
    private UserProfileResponse uploadedBy;
    private LocalDateTime createdAt;

    public DocumentVersionResponse() {
    }

    public DocumentVersionResponse(Long id, Long documentId, Integer versionNumber, String fileName,
                                   Long fileSize, String sha256Hash, String ipfsCid,
                                   String transactionHash, String changeSummary,
                                   UserProfileResponse uploadedBy, LocalDateTime createdAt) {
        this.id = id;
        this.documentId = documentId;
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

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
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

    public UserProfileResponse getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(UserProfileResponse uploadedBy) {
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
        private Long documentId;
        private Integer versionNumber;
        private String fileName;
        private Long fileSize;
        private String sha256Hash;
        private String ipfsCid;
        private String transactionHash;
        private String changeSummary;
        private UserProfileResponse uploadedBy;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder documentId(Long documentId) {
            this.documentId = documentId;
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

        public Builder uploadedBy(UserProfileResponse uploadedBy) {
            this.uploadedBy = uploadedBy;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DocumentVersionResponse build() {
            return new DocumentVersionResponse(id, documentId, versionNumber, fileName, fileSize, sha256Hash, ipfsCid, transactionHash, changeSummary, uploadedBy, createdAt);
        }
    }
}
