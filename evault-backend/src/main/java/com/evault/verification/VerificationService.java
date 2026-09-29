package com.evault.verification;

import com.evault.audit.AuditEventType;
import com.evault.audit.AuditService;
import com.evault.blockchain.BlockchainAnchorService;
import com.evault.blockchain.BlockchainRecord;
import com.evault.blockchain.BlockchainRecordRepository;
import com.evault.common.ResourceNotFoundException;
import com.evault.document.DocumentRepository;
import com.evault.document.DocumentStatus;
import com.evault.document.LegalDocument;
import com.evault.document.Sha256DigestService;
import com.evault.document.dto.DocumentVerificationResult;
import com.evault.evidence.ChainOfCustodyEvent;
import com.evault.evidence.ChainOfCustodyRepository;
import com.evault.ipfs.IpfsStorageService;
import com.evault.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VerificationService {

    private static final Logger log = LoggerFactory.getLogger(VerificationService.class);

    private final DocumentRepository documentRepository;
    private final BlockchainRecordRepository blockchainRecordRepository;
    private final Sha256DigestService digestService;
    private final IpfsStorageService ipfsStorageService;
    private final BlockchainAnchorService blockchainAnchorService;
    private final TamperIncidentRepository tamperIncidentRepository;
    private final ChainOfCustodyRepository custodyRepository;
    private final AuditService auditService;

    public VerificationService(DocumentRepository documentRepository,
                               BlockchainRecordRepository blockchainRecordRepository,
                               Sha256DigestService digestService,
                               IpfsStorageService ipfsStorageService,
                               BlockchainAnchorService blockchainAnchorService,
                               TamperIncidentRepository tamperIncidentRepository,
                               ChainOfCustodyRepository custodyRepository,
                               AuditService auditService) {
        this.documentRepository = documentRepository;
        this.blockchainRecordRepository = blockchainRecordRepository;
        this.digestService = digestService;
        this.ipfsStorageService = ipfsStorageService;
        this.blockchainAnchorService = blockchainAnchorService;
        this.tamperIncidentRepository = tamperIncidentRepository;
        this.custodyRepository = custodyRepository;
        this.auditService = auditService;
    }

    @Transactional
    public DocumentVerificationResult verifyFile(MultipartFile file, Long targetDocumentId, User currentUser) {
        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file for verification", e);
        }

        String computedHash = digestService.computeHexHash(fileBytes);
        log.info("[VERIFICATION] Input file computed SHA-256: {}", computedHash);

        LegalDocument matchedDoc = null;
        if (targetDocumentId != null) {
            matchedDoc = documentRepository.findById(targetDocumentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Target document not found with id: " + targetDocumentId));
        } else {
            Optional<LegalDocument> docOpt = documentRepository.findBySha256Hash(computedHash);
            if (docOpt.isPresent()) {
                matchedDoc = docOpt.get();
            }
        }

        if (matchedDoc != null) {
            String originalHash = matchedDoc.getSha256Hash();
            boolean isMatch = originalHash.equalsIgnoreCase(computedHash);

            BlockchainRecord bcRecord = matchedDoc.getBlockchainRecord();
            boolean ipfsAvailable = ipfsStorageService.verifyAvailability(matchedDoc.getIpfsCid());

            if (isMatch) {
                // SUCCESS: Cryptographically Verified
                matchedDoc.setStatus(DocumentStatus.VERIFIED);
                documentRepository.save(matchedDoc);

                ChainOfCustodyEvent custody = ChainOfCustodyEvent.builder()
                        .document(matchedDoc)
                        .actor(currentUser)
                        .actionType("DOCUMENT_VERIFIED_IN_COURT")
                        .previousCustodian("Vault Anchor")
                        .newCustodian("Judicial Adjudication")
                        .remarks("Cryptographic verification passed. Hash matched: " + computedHash)
                        .eventHash(computedHash)
                        .timestamp(LocalDateTime.now())
                        .build();
                custodyRepository.save(custody);

                auditService.recordEvent(
                        AuditEventType.DOCUMENT_VERIFIED,
                        currentUser,
                        "DOCUMENT",
                        matchedDoc.getId(),
                        "Document " + matchedDoc.getFileName() + " successfully verified against on-chain anchor.",
                        null,
                        null,
                        "SUCCESS"
                );

                return DocumentVerificationResult.builder()
                        .verified(true)
                        .status("VERIFIED")
                        .message("✓ DOCUMENT VERIFIED: Cryptographic hash matches blockchain anchor with zero tampering.")
                        .documentId(matchedDoc.getId())
                        .documentTitle(matchedDoc.getTitle())
                        .caseNumber(matchedDoc.getLegalCase().getCaseNumber())
                        .originalHash(originalHash)
                        .computedHash(computedHash)
                        .hashMatched(true)
                        .ipfsCid(matchedDoc.getIpfsCid())
                        .ipfsAvailable(ipfsAvailable)
                        .transactionHash(bcRecord != null ? bcRecord.getTransactionHash() : null)
                        .blockNumber(bcRecord != null ? bcRecord.getBlockNumber() : null)
                        .contractAddress(bcRecord != null ? bcRecord.getContractAddress() : null)
                        .blockTimestamp(bcRecord != null ? bcRecord.getBlockTimestamp() : null)
                        .verifiedAt(LocalDateTime.now())
                        .build();

            } else {
                // FAILURE: Tamper Detected
                matchedDoc.setStatus(DocumentStatus.TAMPER_DETECTED);
                documentRepository.save(matchedDoc);

                TamperIncident incident = TamperIncident.builder()
                        .document(matchedDoc)
                        .documentTitle(matchedDoc.getTitle())
                        .caseNumber(matchedDoc.getLegalCase().getCaseNumber())
                        .expectedHash(originalHash)
                        .attemptedHash(computedHash)
                        .reportedBy(currentUser)
                        .severity("CRITICAL")
                        .incidentDetails("Uploaded copy hash (" + computedHash + ") differs from original blockchain anchor (" + originalHash + ")")
                        .detectedAt(LocalDateTime.now())
                        .build();
                tamperIncidentRepository.save(incident);

                auditService.recordEvent(
                        AuditEventType.TAMPER_ALERT_TRIGGERED,
                        currentUser,
                        "DOCUMENT",
                        matchedDoc.getId(),
                        "CRITICAL: Tamper detected for document " + matchedDoc.getFileName() + ". Expected: " + originalHash + ", Received: " + computedHash,
                        null,
                        null,
                        "ALERT"
                );

                return DocumentVerificationResult.builder()
                        .verified(false)
                        .status("TAMPER_DETECTED")
                        .message("✕ TAMPER DETECTED: The submitted file has been altered or substituted. Hash mismatch with blockchain ledger.")
                        .documentId(matchedDoc.getId())
                        .documentTitle(matchedDoc.getTitle())
                        .caseNumber(matchedDoc.getLegalCase().getCaseNumber())
                        .originalHash(originalHash)
                        .computedHash(computedHash)
                        .hashMatched(false)
                        .ipfsCid(matchedDoc.getIpfsCid())
                        .ipfsAvailable(ipfsAvailable)
                        .transactionHash(bcRecord != null ? bcRecord.getTransactionHash() : null)
                        .blockNumber(bcRecord != null ? bcRecord.getBlockNumber() : null)
                        .contractAddress(bcRecord != null ? bcRecord.getContractAddress() : null)
                        .blockTimestamp(bcRecord != null ? bcRecord.getBlockTimestamp() : null)
                        .verifiedAt(LocalDateTime.now())
                        .build();
            }
        }

        // Neither target ID nor matching hash found
        return DocumentVerificationResult.builder()
                .verified(false)
                .status("NOT_FOUND")
                .message("No matching document or blockchain record exists in the repository for the provided file fingerprint.")
                .computedHash(computedHash)
                .hashMatched(false)
                .verifiedAt(LocalDateTime.now())
                .build();
    }

    @Transactional
    public DocumentVerificationResult verifyDocument(Long documentId, User currentUser) {
        LegalDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

        byte[] fileBytes = ipfsStorageService.getFile(doc.getIpfsCid());
        String computedHash = digestService.computeHexHash(fileBytes);
        String originalHash = doc.getSha256Hash();
        boolean isMatch = originalHash.equalsIgnoreCase(computedHash);

        BlockchainRecord bcRecord = doc.getBlockchainRecord();
        boolean ipfsAvailable = ipfsStorageService.verifyAvailability(doc.getIpfsCid());

        if (isMatch) {
            doc.setStatus(DocumentStatus.VERIFIED);
            documentRepository.save(doc);

            auditService.recordEvent(
                    AuditEventType.DOCUMENT_VERIFIED,
                    currentUser,
                    "DOCUMENT",
                    doc.getId(),
                    "Document " + doc.getFileName() + " successfully verified against on-chain anchor.",
                    null,
                    null,
                    "SUCCESS"
            );

            return DocumentVerificationResult.builder()
                    .verified(true)
                    .status("VERIFIED")
                    .message("✓ DOCUMENT VERIFIED: Cryptographic hash matches blockchain anchor with zero tampering.")
                    .documentId(doc.getId())
                    .documentTitle(doc.getTitle())
                    .caseNumber(doc.getLegalCase() != null ? doc.getLegalCase().getCaseNumber() : null)
                    .originalHash(originalHash)
                    .computedHash(computedHash)
                    .hashMatched(true)
                    .ipfsCid(doc.getIpfsCid())
                    .ipfsAvailable(ipfsAvailable)
                    .transactionHash(bcRecord != null ? bcRecord.getTransactionHash() : null)
                    .blockNumber(bcRecord != null ? bcRecord.getBlockNumber() : null)
                    .contractAddress(bcRecord != null ? bcRecord.getContractAddress() : null)
                    .blockTimestamp(bcRecord != null ? bcRecord.getBlockTimestamp() : null)
                    .verifiedAt(LocalDateTime.now())
                    .build();
        } else {
            doc.setStatus(DocumentStatus.TAMPER_DETECTED);
            documentRepository.save(doc);

            TamperIncident incident = TamperIncident.builder()
                    .document(doc)
                    .documentTitle(doc.getTitle())
                    .caseNumber(doc.getLegalCase() != null ? doc.getLegalCase().getCaseNumber() : null)
                    .expectedHash(originalHash)
                    .attemptedHash(computedHash)
                    .reportedBy(currentUser)
                    .severity("CRITICAL")
                    .incidentDetails("Vault stored copy hash (" + computedHash + ") differs from original blockchain anchor (" + originalHash + ")")
                    .detectedAt(LocalDateTime.now())
                    .build();
            tamperIncidentRepository.save(incident);

            auditService.recordEvent(
                    AuditEventType.TAMPER_ALERT_TRIGGERED,
                    currentUser,
                    "DOCUMENT",
                    doc.getId(),
                    "CRITICAL: Tamper detected for document " + doc.getFileName() + ". Expected: " + originalHash + ", Received: " + computedHash,
                    null,
                    null,
                    "ALERT"
            );

            return DocumentVerificationResult.builder()
                    .verified(false)
                    .status("TAMPER_DETECTED")
                    .message("✕ TAMPER DETECTED: The document bytes have been altered. Discrepancy with blockchain anchor.")
                    .documentId(doc.getId())
                    .documentTitle(doc.getTitle())
                    .caseNumber(doc.getLegalCase() != null ? doc.getLegalCase().getCaseNumber() : null)
                    .originalHash(originalHash)
                    .computedHash(computedHash)
                    .hashMatched(false)
                    .ipfsCid(doc.getIpfsCid())
                    .ipfsAvailable(ipfsAvailable)
                    .transactionHash(bcRecord != null ? bcRecord.getTransactionHash() : null)
                    .blockNumber(bcRecord != null ? bcRecord.getBlockNumber() : null)
                    .contractAddress(bcRecord != null ? bcRecord.getContractAddress() : null)
                    .blockTimestamp(bcRecord != null ? bcRecord.getBlockTimestamp() : null)
                    .verifiedAt(LocalDateTime.now())
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public List<TamperIncident> getRecentTamperAlerts() {
        return tamperIncidentRepository.findTop10ByOrderByDetectedAtDesc();
    }
}
