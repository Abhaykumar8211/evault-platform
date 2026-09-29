package com.evault.document.dto;

import com.evault.auth.dto.UserProfileResponse;
import com.evault.document.DocumentStatus;
import com.evault.document.DocumentType;

import java.time.LocalDateTime;

public class DocumentResponse {

    private Long id;
    private Long caseId;
    private String caseNumber;
    private DocumentType documentType;
    private String documentTypeDisplayName;
    private String title;
    private String description;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String sha256Hash;
    private String ipfsCid;
    private String ipfsGatewayUrl;
    private UserProfileResponse uploadedBy;
    private Integer version;
    private DocumentStatus status;
    private String statusDisplayName;
    private BlockchainProofResponse blockchainProof;
    private boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DocumentResponse() {
    }

    public DocumentResponse(Long id, Long caseId, String caseNumber, DocumentType documentType,
                            String documentTypeDisplayName, String title, String description,
                            String fileName, Long fileSize, String mimeType, String sha256Hash,
                            String ipfsCid, String ipfsGatewayUrl, UserProfileResponse uploadedBy,
                            Integer version, DocumentStatus status, String statusDisplayName,
                            BlockchainProofResponse blockchainProof, boolean isVerified,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.caseId = caseId;
        this.caseNumber = caseNumber;
        this.documentType = documentType;
        this.documentTypeDisplayName = documentTypeDisplayName;
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.sha256Hash = sha256Hash;
        this.ipfsCid = ipfsCid;
        this.ipfsGatewayUrl = ipfsGatewayUrl;
        this.uploadedBy = uploadedBy;
        this.version = version;
        this.status = status;
        this.statusDisplayName = statusDisplayName;
        this.blockchainProof = blockchainProof;
        this.isVerified = isVerified;
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

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getDocumentTypeDisplayName() {
        return documentTypeDisplayName;
    }

    public void setDocumentTypeDisplayName(String documentTypeDisplayName) {
        this.documentTypeDisplayName = documentTypeDisplayName;
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

    public String getIpfsGatewayUrl() {
        return ipfsGatewayUrl;
    }

    public void setIpfsGatewayUrl(String ipfsGatewayUrl) {
        this.ipfsGatewayUrl = ipfsGatewayUrl;
    }

    public UserProfileResponse getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(UserProfileResponse uploadedBy) {
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

    public String getStatusDisplayName() {
        return statusDisplayName;
    }

    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
    }

    public BlockchainProofResponse getBlockchainProof() {
        return blockchainProof;
    }

    public void setBlockchainProof(BlockchainProofResponse blockchainProof) {
        this.blockchainProof = blockchainProof;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
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
        private Long caseId;
        private String caseNumber;
        private DocumentType documentType;
        private String documentTypeDisplayName;
        private String title;
        private String description;
        private String fileName;
        private Long fileSize;
        private String mimeType;
        private String sha256Hash;
        private String ipfsCid;
        private String ipfsGatewayUrl;
        private UserProfileResponse uploadedBy;
        private Integer version;
        private DocumentStatus status;
        private String statusDisplayName;
        private BlockchainProofResponse blockchainProof;
        private boolean isVerified;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder caseId(Long caseId) {
            this.caseId = caseId;
            return this;
        }

        public Builder caseNumber(String caseNumber) {
            this.caseNumber = caseNumber;
            return this;
        }

        public Builder documentType(DocumentType documentType) {
            this.documentType = documentType;
            return this;
        }

        public Builder documentTypeDisplayName(String documentTypeDisplayName) {
            this.documentTypeDisplayName = documentTypeDisplayName;
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

        public Builder ipfsGatewayUrl(String ipfsGatewayUrl) {
            this.ipfsGatewayUrl = ipfsGatewayUrl;
            return this;
        }

        public Builder uploadedBy(UserProfileResponse uploadedBy) {
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

        public Builder statusDisplayName(String statusDisplayName) {
            this.statusDisplayName = statusDisplayName;
            return this;
        }

        public Builder blockchainProof(BlockchainProofResponse blockchainProof) {
            this.blockchainProof = blockchainProof;
            return this;
        }

        public Builder isVerified(boolean isVerified) {
            this.isVerified = isVerified;
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

        public DocumentResponse build() {
            return new DocumentResponse(id, caseId, caseNumber, documentType, documentTypeDisplayName, title, description, fileName, fileSize, mimeType, sha256Hash, ipfsCid, ipfsGatewayUrl, uploadedBy, version, status, statusDisplayName, blockchainProof, isVerified, createdAt, updatedAt);
        }
    }
}
