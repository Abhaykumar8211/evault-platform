package com.evault.blockchain;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_records", indexes = {
    @Index(name = "idx_bc_tx_hash", columnList = "transactionHash"),
    @Index(name = "idx_bc_anchored_hash", columnList = "anchoredHash"),
    @Index(name = "idx_bc_document_id", columnList = "documentId")
})
@EntityListeners(AuditingEntityListener.class)
public class BlockchainRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long documentId;

    @Column(nullable = false, unique = true, length = 100)
    private String transactionHash;

    private Long blockNumber;

    @Column(length = 66)
    private String contractAddress;

    @Column(nullable = false, length = 66)
    private String anchoredHash;

    @Column(nullable = false, length = 100)
    private String ipfsCid;

    @Column(length = 66)
    private String registrarAddress;

    private Long blockTimestamp;

    private Long gasUsed;

    @Column(length = 30)
    private String status = "CONFIRMED";

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public BlockchainRecord() {
    }

    public BlockchainRecord(Long id, Long documentId, String transactionHash, Long blockNumber,
                            String contractAddress, String anchoredHash, String ipfsCid,
                            String registrarAddress, Long blockTimestamp, Long gasUsed,
                            String status, LocalDateTime createdAt) {
        this.id = id;
        this.documentId = documentId;
        this.transactionHash = transactionHash;
        this.blockNumber = blockNumber;
        this.contractAddress = contractAddress;
        this.anchoredHash = anchoredHash;
        this.ipfsCid = ipfsCid;
        this.registrarAddress = registrarAddress;
        this.blockTimestamp = blockTimestamp;
        this.gasUsed = gasUsed;
        this.status = status != null ? status : "CONFIRMED";
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
        private Long id;
        private Long documentId;
        private String transactionHash;
        private Long blockNumber;
        private String contractAddress;
        private String anchoredHash;
        private String ipfsCid;
        private String registrarAddress;
        private Long blockTimestamp;
        private Long gasUsed;
        private String status = "CONFIRMED";
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder documentId(Long documentId) {
            this.documentId = documentId;
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

        public BlockchainRecord build() {
            return new BlockchainRecord(id, documentId, transactionHash, blockNumber, contractAddress, anchoredHash, ipfsCid, registrarAddress, blockTimestamp, gasUsed, status, createdAt);
        }
    }
}
