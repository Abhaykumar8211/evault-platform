package com.evault.document.dto;

import java.time.LocalDateTime;

public class DocumentVerificationResult {

    private boolean verified;
    private String status; // "VERIFIED" or "TAMPER_DETECTED" or "NOT_FOUND"
    private String message;
    private Long documentId;
    private String documentTitle;
    private String caseNumber;
    private String originalHash;
    private String computedHash;
    private boolean hashMatched;
    private String ipfsCid;
    private boolean ipfsAvailable;
    private String transactionHash;
    private Long blockNumber;
    private String contractAddress;
    private Long blockTimestamp;
    private LocalDateTime verifiedAt;

    public DocumentVerificationResult() {
    }

    public DocumentVerificationResult(boolean verified, String status, String message, Long documentId,
                                      String documentTitle, String caseNumber, String originalHash,
                                      String computedHash, boolean hashMatched, String ipfsCid,
                                      boolean ipfsAvailable, String transactionHash, Long blockNumber,
                                      String contractAddress, Long blockTimestamp, LocalDateTime verifiedAt) {
        this.verified = verified;
        this.status = status;
        this.message = message;
        this.documentId = documentId;
        this.documentTitle = documentTitle;
        this.caseNumber = caseNumber;
        this.originalHash = originalHash;
        this.computedHash = computedHash;
        this.hashMatched = hashMatched;
        this.ipfsCid = ipfsCid;
        this.ipfsAvailable = ipfsAvailable;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.contractAddress = contractAddress;
        this.blockTimestamp = blockTimestamp;
        this.verifiedAt = verifiedAt != null ? verifiedAt : LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getDocumentTitle() {
        return documentTitle;
    }

    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getOriginalHash() {
        return originalHash;
    }

    public void setOriginalHash(String originalHash) {
        this.originalHash = originalHash;
    }

    public String getComputedHash() {
        return computedHash;
    }

    public void setComputedHash(String computedHash) {
        this.computedHash = computedHash;
    }

    public boolean isHashMatched() {
        return hashMatched;
    }

    public void setHashMatched(boolean hashMatched) {
        this.hashMatched = hashMatched;
    }

    public String getIpfsCid() {
        return ipfsCid;
    }

    public void setIpfsCid(String ipfsCid) {
        this.ipfsCid = ipfsCid;
    }

    public boolean isIpfsAvailable() {
        return ipfsAvailable;
    }

    public void setIpfsAvailable(boolean ipfsAvailable) {
        this.ipfsAvailable = ipfsAvailable;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }

    public Long getBlockNumber() {
        return blockNumber;
    }

    public void setBlockNumber(Long blockNumber) {
        this.blockNumber = blockNumber;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    public Long getBlockTimestamp() {
        return blockTimestamp;
    }

    public void setBlockTimestamp(Long blockTimestamp) {
        this.blockTimestamp = blockTimestamp;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public static class Builder {
        private boolean verified;
        private String status;
        private String message;
        private Long documentId;
        private String documentTitle;
        private String caseNumber;
        private String originalHash;
        private String computedHash;
        private boolean hashMatched;
        private String ipfsCid;
        private boolean ipfsAvailable;
        private String transactionHash;
        private Long blockNumber;
        private String contractAddress;
        private Long blockTimestamp;
        private LocalDateTime verifiedAt = LocalDateTime.now();

        public Builder verified(boolean verified) {
            this.verified = verified;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder documentId(Long documentId) {
            this.documentId = documentId;
            return this;
        }

        public Builder documentTitle(String documentTitle) {
            this.documentTitle = documentTitle;
            return this;
        }

        public Builder caseNumber(String caseNumber) {
            this.caseNumber = caseNumber;
            return this;
        }

        public Builder originalHash(String originalHash) {
            this.originalHash = originalHash;
            return this;
        }

        public Builder computedHash(String computedHash) {
            this.computedHash = computedHash;
            return this;
        }

        public Builder hashMatched(boolean hashMatched) {
            this.hashMatched = hashMatched;
            return this;
        }

        public Builder ipfsCid(String ipfsCid) {
            this.ipfsCid = ipfsCid;
            return this;
        }

        public Builder ipfsAvailable(boolean ipfsAvailable) {
            this.ipfsAvailable = ipfsAvailable;
            return this;
        }

        public Builder transactionHash(String transactionHash) {
            this.transactionHash = transactionHash;
            return this;
        }

        public Builder blockNumber(Long blockNumber) {
            this.blockNumber = blockNumber;
            return this;
        }

        public Builder contractAddress(String contractAddress) {
            this.contractAddress = contractAddress;
            return this;
        }

        public Builder blockTimestamp(Long blockTimestamp) {
            this.blockTimestamp = blockTimestamp;
            return this;
        }

        public Builder verifiedAt(LocalDateTime verifiedAt) {
            this.verifiedAt = verifiedAt;
            return this;
        }

        public DocumentVerificationResult build() {
            return new DocumentVerificationResult(verified, status, message, documentId, documentTitle, caseNumber, originalHash, computedHash, hashMatched, ipfsCid, ipfsAvailable, transactionHash, blockNumber, contractAddress, blockTimestamp, verifiedAt);
        }
    }
}
