package com.evault.document.dto;

import java.time.LocalDateTime;

public class BlockchainProofResponse {

    private String transactionHash;
    private Long blockNumber;
    private String contractAddress;
    private String anchoredHash;
    private String ipfsCid;
    private String registrarAddress;
    private Long blockTimestamp;
    private Long gasUsed;
    private String status;
    private LocalDateTime createdAt;

    public BlockchainProofResponse() {
    }

    public BlockchainProofResponse(String transactionHash, Long blockNumber, String contractAddress,
                                   String anchoredHash, String ipfsCid, String registrarAddress,
                                   Long blockTimestamp, Long gasUsed, String status, LocalDateTime createdAt) {
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.contractAddress = contractAddress;
        this.anchoredHash = anchoredHash;
        this.ipfsCid = ipfsCid;
        this.registrarAddress = registrarAddress;
        this.blockTimestamp = blockTimestamp;
        this.gasUsed = gasUsed;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
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

    public String getAnchoredHash() {
        return anchoredHash;
    }

    public void setAnchoredHash(String anchoredHash) {
        this.anchoredHash = anchoredHash;
    }

    public String getIpfsCid() {
        return ipfsCid;
    }

    public void setIpfsCid(String ipfsCid) {
        this.ipfsCid = ipfsCid;
    }

    public String getRegistrarAddress() {
        return registrarAddress;
    }

    public void setRegistrarAddress(String registrarAddress) {
        this.registrarAddress = registrarAddress;
    }

    public Long getBlockTimestamp() {
        return blockTimestamp;
    }

    public void setBlockTimestamp(Long blockTimestamp) {
        this.blockTimestamp = blockTimestamp;
    }

    public Long getGasUsed() {
        return gasUsed;
    }

    public void setGasUsed(Long gasUsed) {
        this.gasUsed = gasUsed;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class Builder {
        private String transactionHash;
        private Long blockNumber;
        private String contractAddress;
        private String anchoredHash;
        private String ipfsCid;
        private String registrarAddress;
        private Long blockTimestamp;
        private Long gasUsed;
        private String status;
        private LocalDateTime createdAt;

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

        public Builder anchoredHash(String anchoredHash) {
            this.anchoredHash = anchoredHash;
            return this;
        }

        public Builder ipfsCid(String ipfsCid) {
            this.ipfsCid = ipfsCid;
            return this;
        }

        public Builder registrarAddress(String registrarAddress) {
            this.registrarAddress = registrarAddress;
            return this;
        }

        public Builder blockTimestamp(Long blockTimestamp) {
            this.blockTimestamp = blockTimestamp;
            return this;
        }

        public Builder gasUsed(Long gasUsed) {
            this.gasUsed = gasUsed;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public BlockchainProofResponse build() {
            return new BlockchainProofResponse(transactionHash, blockNumber, contractAddress, anchoredHash, ipfsCid, registrarAddress, blockTimestamp, gasUsed, status, createdAt);
        }
    }
}
