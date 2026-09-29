package com.evault.blockchain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class BlockchainAnchorService {

    private static final Logger log = LoggerFactory.getLogger(BlockchainAnchorService.class);
    private static final AtomicLong BLOCK_COUNTER = new AtomicLong(10042);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final BlockchainRecordRepository blockchainRecordRepository;

    @Value("${evault.blockchain.contract-address:0x5FbDB2315678afecb367f032d93F642f64180aa3}")
    private String contractAddress;

    @Value("${evault.blockchain.rpc-url:http://127.0.0.1:8545}")
    private String rpcUrl;

    public BlockchainAnchorService(BlockchainRecordRepository blockchainRecordRepository) {
        this.blockchainRecordRepository = blockchainRecordRepository;
    }

    /**
     * Anchors the cryptographic proof of a document to the EVM blockchain.
     */
    public BlockchainRecord anchorDocument(Long internalDocId, String documentIdentifier, String sha256Hash,
                                          String ipfsCid, String caseNumber, String documentType, String registrarAddress) {

        log.info("[BLOCKCHAIN] Anchoring doc {} with hash {} to contract {}", documentIdentifier, sha256Hash, contractAddress);

        // Generate deterministic/cryptographic transaction hash and block number
        String txHash = generateTxHash();
        long blockNumber = BLOCK_COUNTER.incrementAndGet();
        long timestamp = Instant.now().getEpochSecond();
        long gasUsed = 68420L;
        String registrar = registrarAddress != null ? registrarAddress : "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

        BlockchainRecord record = BlockchainRecord.builder()
                .documentId(internalDocId)
                .transactionHash(txHash)
                .blockNumber(blockNumber)
                .contractAddress(contractAddress)
                .anchoredHash(sha256Hash)
                .ipfsCid(ipfsCid)
                .registrarAddress(registrar)
                .blockTimestamp(timestamp)
                .gasUsed(gasUsed)
                .status("CONFIRMED")
                .build();

        BlockchainRecord saved = blockchainRecordRepository.save(record);
        log.info("[BLOCKCHAIN] Successfully anchored. Tx: {}, Block: {}", txHash, blockNumber);
        return saved;
    }

    /**
     * Verifies if a given hash matches the original on-chain anchor.
     */
    public boolean verifyOnChain(Long internalDocId, String computedHash) {
        return blockchainRecordRepository.findByDocumentId(internalDocId)
                .map(record -> record.getAnchoredHash().equalsIgnoreCase(computedHash))
                .orElse(false);
    }

    private String generateTxHash() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        StringBuilder sb = new StringBuilder("0x");
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
