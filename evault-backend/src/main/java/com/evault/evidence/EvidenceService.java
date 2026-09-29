package com.evault.evidence;

import com.evault.audit.AuditEventType;
import com.evault.audit.AuditService;
import com.evault.auth.AuthService;
import com.evault.cases.LegalCase;
import com.evault.cases.CaseRepository;
import com.evault.common.ResourceNotFoundException;
import com.evault.document.DocumentRepository;
import com.evault.document.DocumentService;
import com.evault.document.LegalDocument;
import com.evault.evidence.dto.ChainOfCustodyResponse;
import com.evault.evidence.dto.EvidenceCreateRequest;
import com.evault.evidence.dto.EvidenceResponse;
import com.evault.evidence.dto.EvidenceTransferRequest;
import com.evault.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final ChainOfCustodyRepository custodyRepository;
    private final CaseRepository caseRepository;
    private final DocumentRepository documentRepository;
    private final DocumentService documentService;
    private final AuditService auditService;
    private final AuthService authService;

    private static final AtomicLong EVIDENCE_SEQ = new AtomicLong(500);

    public EvidenceService(EvidenceRepository evidenceRepository,
                           ChainOfCustodyRepository custodyRepository,
                           CaseRepository caseRepository,
                           DocumentRepository documentRepository,
                           DocumentService documentService,
                           AuditService auditService,
                           AuthService authService) {
        this.evidenceRepository = evidenceRepository;
        this.custodyRepository = custodyRepository;
        this.caseRepository = caseRepository;
        this.documentRepository = documentRepository;
        this.documentService = documentService;
        this.auditService = auditService;
        this.authService = authService;
    }

    @Transactional
    public EvidenceResponse createEvidence(EvidenceCreateRequest request, User currentUser) {
        LegalCase legalCase = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + request.getCaseId()));

        LegalDocument document = null;
        if (request.getDocumentId() != null) {
            document = documentRepository.findById(request.getDocumentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + request.getDocumentId()));
        }

        String evidenceNumber = generateEvidenceNumber();

        Evidence evidence = Evidence.builder()
                .legalCase(legalCase)
                .document(document)
                .evidenceNumber(evidenceNumber)
                .evidenceType(request.getEvidenceType().trim())
                .description(request.getDescription().trim())
                .storageLocation(request.getStorageLocation() != null ? request.getStorageLocation() : "Central Forensic Malkhana")
                .custodyStatus("SECURED_IN_CUSTODY")
                .collectedBy(currentUser)
                .collectedAt(LocalDateTime.now())
                .build();

        Evidence saved = evidenceRepository.save(evidence);

        // Record Initial Chain of Custody Event
        ChainOfCustodyEvent initialCustody = ChainOfCustodyEvent.builder()
                .evidence(saved)
                .document(document)
                .actor(currentUser)
                .actionType("EVIDENCE_SEIZED_AND_LOGGED")
                .previousCustodian("Crime Scene / Investigating Source")
                .newCustodian(currentUser.getFullName() + " (" + currentUser.getBadgeNumber() + ")")
                .remarks("Evidence formally entered into vault. Type: " + saved.getEvidenceType())
                .eventHash(document != null ? document.getSha256Hash() : null)
                .timestamp(LocalDateTime.now())
                .build();
        custodyRepository.save(initialCustody);

        auditService.recordEvent(
                AuditEventType.EVIDENCE_ADDED,
                currentUser,
                "EVIDENCE",
                saved.getId(),
                "Evidence " + saved.getEvidenceNumber() + " added to case " + legalCase.getCaseNumber(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public EvidenceResponse transferCustody(Long evidenceId, EvidenceTransferRequest request, User currentUser) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with id: " + evidenceId));

        String prevCustodian = evidence.getCustodyStatus();
        if (request.getNewStorageLocation() != null) {
            evidence.setStorageLocation(request.getNewStorageLocation());
        }
        evidence.setCustodyStatus(request.getActionType());

        Evidence updated = evidenceRepository.save(evidence);

        ChainOfCustodyEvent custodyEvent = ChainOfCustodyEvent.builder()
                .evidence(updated)
                .document(updated.getDocument())
                .actor(currentUser)
                .actionType(request.getActionType())
                .previousCustodian(prevCustodian)
                .newCustodian(request.getNewCustodian())
                .remarks(request.getRemarks())
                .eventHash(updated.getDocument() != null ? updated.getDocument().getSha256Hash() : null)
                .timestamp(LocalDateTime.now())
                .build();
        custodyRepository.save(custodyEvent);

        auditService.recordEvent(
                AuditEventType.EVIDENCE_CUSTODY_TRANSFERRED,
                currentUser,
                "EVIDENCE",
                updated.getId(),
                "Evidence " + updated.getEvidenceNumber() + " transferred to: " + request.getNewCustodian(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public EvidenceResponse getEvidenceById(Long id) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found with id: " + id));
        return mapToResponse(evidence);
    }

    @Transactional(readOnly = true)
    public List<EvidenceResponse> getEvidenceByCase(Long caseId) {
        return evidenceRepository.findByLegalCaseIdOrderByCreatedAtDesc(caseId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChainOfCustodyResponse> getCustodyTimeline(Long evidenceId) {
        return custodyRepository.findByEvidenceIdOrderByTimestampAsc(evidenceId).stream()
                .map(this::mapCustodyEvent)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvidenceResponse> getAllEvidence() {
        return evidenceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EvidenceResponse mapToResponse(Evidence e) {
        List<ChainOfCustodyResponse> custodyHistory = custodyRepository.findByEvidenceIdOrderByTimestampAsc(e.getId())
                .stream().map(this::mapCustodyEvent).collect(Collectors.toList());

        return EvidenceResponse.builder()
                .id(e.getId())
                .caseId(e.getLegalCase().getId())
                .caseNumber(e.getLegalCase().getCaseNumber())
                .evidenceNumber(e.getEvidenceNumber())
                .evidenceType(e.getEvidenceType())
                .description(e.getDescription())
                .storageLocation(e.getStorageLocation())
                .custodyStatus(e.getCustodyStatus())
                .collectedBy(e.getCollectedBy() != null ? authService.mapToProfileResponse(e.getCollectedBy()) : null)
                .collectedAt(e.getCollectedAt())
                .attachedDocument(e.getDocument() != null ? documentService.mapToResponse(e.getDocument()) : null)
                .custodyHistory(custodyHistory)
                .createdAt(e.getCreatedAt())
                .build();
    }

    private ChainOfCustodyResponse mapCustodyEvent(ChainOfCustodyEvent event) {
        return ChainOfCustodyResponse.builder()
                .id(event.getId())
                .evidenceId(event.getEvidence() != null ? event.getEvidence().getId() : null)
                .documentId(event.getDocument() != null ? event.getDocument().getId() : null)
                .actorName(event.getActor() != null ? event.getActor().getFullName() : "Judicial Custodian")
                .actorRole(event.getActor() != null && event.getActor().getRole() != null ? event.getActor().getRole().name() : "OFFICER")
                .actionType(event.getActionType())
                .previousCustodian(event.getPreviousCustodian())
                .newCustodian(event.getNewCustodian())
                .remarks(event.getRemarks())
                .eventHash(event.getEventHash())
                .timestamp(event.getTimestamp())
                .build();
    }

    private synchronized String generateEvidenceNumber() {
        int year = LocalDateTime.now().getYear();
        long seq = EVIDENCE_SEQ.incrementAndGet();
        return String.format("EVID-%d-%04d", year, seq);
    }
}
