package com.evault.blockchain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockchainRecordRepository extends JpaRepository<BlockchainRecord, Long> {
    Optional<BlockchainRecord> findByDocumentId(Long documentId);
    Optional<BlockchainRecord> findByTransactionHash(String transactionHash);
    Optional<BlockchainRecord> findByAnchoredHash(String anchoredHash);
    boolean existsByAnchoredHash(String anchoredHash);
}
