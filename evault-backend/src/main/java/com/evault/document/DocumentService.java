package com.evault.document;

import com.evault.audit.AuditEventType;
import com.evault.audit.AuditService;
import com.evault.auth.AuthService;
import com.evault.blockchain.BlockchainAnchorService;
import com.evault.blockchain.BlockchainRecord;
import com.evault.cases.LegalCase;
import com.evault.cases.CaseRepository;
import com.evault.common.BadRequestException;
import com.evault.common.ResourceNotFoundException;
import com.evault.document.dto.BlockchainProofResponse;
import com.evault.document.dto.DocumentResponse;
import com.evault.document.dto.DocumentVersionResponse;
import com.evault.evidence.ChainOfCustodyEvent;
import com.evault.evidence.ChainOfCustodyRepository;
import com.evault.ipfs.IpfsStorageService;
import com.evault.ipfs.IpfsUploadResult;
import com.evault.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository versionRepository;
    private final CaseRepository caseRepository;
    private final Sha256DigestService digestService;
    private final IpfsStorageService ipfsStorageService;
    private final BlockchainAnchorService blockchainAnchorService;
    private final ChainOfCustodyRepository custodyRepository;
    private final AuditService auditService;
    private final AuthService authService;

    public DocumentService(DocumentRepository documentRepository,
                           DocumentVersionRepository versionRepository,
                           CaseRepository caseRepository,
                           Sha256DigestService digestService,
                           IpfsStorageService ipfsStorageService,
                           BlockchainAnchorService blockchainAnchorService,
                           ChainOfCustodyRepository custodyRepository,
                           AuditService auditService,
                           AuthService authService) {
        this.documentRepository = documentRepository;
        this.versionRepository = versionRepository;
        this.caseRepository = caseRepository;
        this.digestService = digestService;
        this.ipfsStorageService = ipfsStorageService;
        this.blockchainAnchorService = blockchainAnchorService;
        this.custodyRepository = custodyRepository;
        this.auditService = auditService;
        this.authService = authService;
    }

    /**
     * Executes the complete cryptographic upload and blockchain anchoring pipeline.
     */
    @Transactional
    public DocumentResponse uploadDocument(Long caseId, DocumentType documentType, String title,
                                           String description, MultipartFile file, User currentUser) {

        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        LegalCase legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + caseId));

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file bytes", e);
        }

        // 1. Calculate SHA-256 cryptographic digest
        String sha256Hash = digestService.computeHexHash(fileBytes);
        log.info("[DOCUMENT] Computed SHA-256 hash: {}", sha256Hash);

        // 2. Offload document payload to decentralized IPFS storage
        String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
        String contentType = file.getContentType() != null ? file.getContentType() : "application/pdf";
        IpfsUploadResult ipfsResult = ipfsStorageService.uploadFile(fileBytes, originalFileName, contentType);
        String ipfsCid = ipfsResult.getCid();
        log.info("[DOCUMENT] Uploaded to IPFS -> CID: {}", ipfsCid);

        // 3. Save initial Document entity in MySQL
        LegalDocument document = LegalDocument.builder()
                .legalCase(legalCase)
                .documentType(documentType)
                .title(title != null && !title.isBlank() ? title.trim() : originalFileName)
                .description(description)
                .fileName(originalFileName)
                .fileSize(file.getSize())
                .mimeType(contentType)
                .sha256Hash(sha256Hash)
                .ipfsCid(ipfsCid)
                .uploadedBy(currentUser)
                .version(1)
                .status(DocumentStatus.ANCHORED)
                .build();

        LegalDocument savedDoc = documentRepository.save(document);

        // 4. Anchor document hash + CID on the EVM Blockchain
        String docIdentifier = "DOC-" + legalCase.getCaseNumber() + "-" + savedDoc.getId();
        BlockchainRecord blockchainRecord = blockchainAnchorService.anchorDocument(
                savedDoc.getId(),
                docIdentifier,
                sha256Hash,
                ipfsCid,
                legalCase.getCaseNumber(),
                documentType.name(),
                null
        );

        savedDoc.setBlockchainRecord(blockchainRecord);
        savedDoc = documentRepository.save(savedDoc);

        // 5. Save initial version record
        DocumentVersion version = DocumentVersion.builder()
                .document(savedDoc)
                .versionNumber(1)
                .fileName(originalFileName)
                .fileSize(file.getSize())
                .sha256Hash(sha256Hash)
                .ipfsCid(ipfsCid)
                .transactionHash(blockchainRecord.getTransactionHash())
                .changeSummary("Initial upload and cryptographic anchor on blockchain")
                .uploadedBy(currentUser)
                .build();
        versionRepository.save(version);

        // 6. Record Chain of Custody Event
        ChainOfCustodyEvent custodyEvent = ChainOfCustodyEvent.builder()
                .document(savedDoc)
                .actor(currentUser)
                .actionType("DOCUMENT_UPLOADED_AND_ANCHORED")
                .previousCustodian("Local Device")
                .newCustodian("eVault Cryptographic Repository")
                .remarks("SHA-256: " + sha256Hash + " anchored in Block #" + blockchainRecord.getBlockNumber())
                .eventHash(sha256Hash)
                .timestamp(LocalDateTime.now())
                .build();
        custodyRepository.save(custodyEvent);

        // 7. Log immutable audit trail event
        auditService.recordEvent(
                AuditEventType.DOCUMENT_UPLOADED,
                currentUser,
                "DOCUMENT",
                savedDoc.getId(),
                "Document " + savedDoc.getFileName() + " uploaded for Case " + legalCase.getCaseNumber() +
                        ". Anchored at Tx: " + blockchainRecord.getTransactionHash(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(savedDoc);
    }

    @Transactional
    public DocumentResponse uploadNewVersion(Long documentId, MultipartFile file, String changeSummary, User currentUser) {
        LegalDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file bytes", e);
        }

        String sha256Hash = digestService.computeHexHash(fileBytes);
        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : document.getFileName();
        String contentType = file.getContentType() != null ? file.getContentType() : document.getMimeType();

        IpfsUploadResult ipfsResult = ipfsStorageService.uploadFile(fileBytes, fileName, contentType);
        String ipfsCid = ipfsResult.getCid();

        int nextVersion = document.getVersion() + 1;
        document.setVersion(nextVersion);
        document.setSha256Hash(sha256Hash);
        document.setIpfsCid(ipfsCid);
        document.setFileName(fileName);
        document.setFileSize(file.getSize());
        document.setMimeType(contentType);
        document.setStatus(DocumentStatus.ANCHORED);

        String docIdentifier = "DOC-" + document.getLegalCase().getCaseNumber() + "-" + document.getId() + "-v" + nextVersion;
        BlockchainRecord blockchainRecord = blockchainAnchorService.anchorDocument(
                document.getId(),
                docIdentifier,
                sha256Hash,
                ipfsCid,
                document.getLegalCase().getCaseNumber(),
                document.getDocumentType().name(),
                null
        );

        document.setBlockchainRecord(blockchainRecord);
        LegalDocument updated = documentRepository.save(document);

        DocumentVersion version = DocumentVersion.builder()
                .document(updated)
                .versionNumber(nextVersion)
                .fileName(fileName)
                .fileSize(file.getSize())
                .sha256Hash(sha256Hash)
                .ipfsCid(ipfsCid)
                .transactionHash(blockchainRecord.getTransactionHash())
                .changeSummary(changeSummary != null ? changeSummary : "Version " + nextVersion + " uploaded")
                .uploadedBy(currentUser)
                .build();
        versionRepository.save(version);

        auditService.recordEvent(
                AuditEventType.DOCUMENT_VERSIONED,
                currentUser,
                "DOCUMENT",
                updated.getId(),
                "New version " + nextVersion + " uploaded for document: " + updated.getFileName(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public DocumentResponse getDocumentById(Long id, User currentUser) {
        LegalDocument document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        auditService.recordEvent(
                AuditEventType.DOCUMENT_VIEWED,
                currentUser,
                "DOCUMENT",
                document.getId(),
                "Document metadata viewed by " + currentUser.getEmail(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(document);
    }

    @Transactional(readOnly = true)
    public byte[] downloadDocumentBytes(Long id, User currentUser) {
        LegalDocument document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        byte[] data = ipfsStorageService.getFile(document.getIpfsCid());
        if (data == null) {
            throw new ResourceNotFoundException("Document content unavailable on IPFS gateway for CID: " + document.getIpfsCid());
        }

        auditService.recordEvent(
                AuditEventType.DOCUMENT_DOWNLOADED,
                currentUser,
                "DOCUMENT",
                document.getId(),
                "Document downloaded: " + document.getFileName() + " (" + data.length + " bytes)",
                null,
                null,
                "SUCCESS"
        );

        return data;
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByCase(Long caseId) {
        return documentRepository.findByLegalCaseIdOrderByCreatedAtDesc(caseId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<DocumentResponse> searchDocuments(DocumentType type, DocumentStatus status, String query, Pageable pageable) {
        return documentRepository.searchDocuments(type, status, query, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<DocumentVersionResponse> getDocumentVersions(Long documentId) {
        return versionRepository.findByDocumentIdOrderByVersionNumberDesc(documentId).stream()
                .map(v -> DocumentVersionResponse.builder()
                        .id(v.getId())
                        .documentId(v.getDocument().getId())
                        .versionNumber(v.getVersionNumber())
                        .fileName(v.getFileName())
                        .fileSize(v.getFileSize())
                        .sha256Hash(v.getSha256Hash())
                        .ipfsCid(v.getIpfsCid())
                        .transactionHash(v.getTransactionHash())
                        .changeSummary(v.getChangeSummary())
                        .uploadedBy(v.getUploadedBy() != null ? authService.mapToProfileResponse(v.getUploadedBy()) : null)
                        .createdAt(v.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public DocumentResponse mapToResponse(LegalDocument doc) {
        BlockchainProofResponse proof = null;
        if (doc.getBlockchainRecord() != null) {
            BlockchainRecord r = doc.getBlockchainRecord();
            proof = BlockchainProofResponse.builder()
                    .transactionHash(r.getTransactionHash())
                    .blockNumber(r.getBlockNumber())
                    .contractAddress(r.getContractAddress())
                    .anchoredHash(r.getAnchoredHash())
                    .ipfsCid(r.getIpfsCid())
                    .registrarAddress(r.getRegistrarAddress())
                    .blockTimestamp(r.getBlockTimestamp())
                    .gasUsed(r.getGasUsed())
                    .status(r.getStatus())
                    .createdAt(r.getCreatedAt())
                    .build();
        }

        return DocumentResponse.builder()
                .id(doc.getId())
                .caseId(doc.getLegalCase().getId())
                .caseNumber(doc.getLegalCase().getCaseNumber())
                .documentType(doc.getDocumentType())
                .documentTypeDisplayName(doc.getDocumentType().getDisplayName())
                .title(doc.getTitle())
                .description(doc.getDescription())
                .fileName(doc.getFileName())
                .fileSize(doc.getFileSize())
                .mimeType(doc.getMimeType())
                .sha256Hash(doc.getSha256Hash())
                .ipfsCid(doc.getIpfsCid())
                .ipfsGatewayUrl(ipfsStorageService.resolveGatewayUrl(doc.getIpfsCid()))
                .uploadedBy(doc.getUploadedBy() != null ? authService.mapToProfileResponse(doc.getUploadedBy()) : null)
                .version(doc.getVersion())
                .status(doc.getStatus())
                .statusDisplayName(doc.getStatus().getDisplayName())
                .blockchainProof(proof)
                .isVerified(doc.getStatus() == DocumentStatus.VERIFIED || doc.getStatus() == DocumentStatus.ANCHORED)
                .createdAt(doc.getCreatedAt())
                .updatedAt(doc.getUpdatedAt())
                .build();
    }
}
