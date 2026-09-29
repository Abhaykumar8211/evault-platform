package com.evault.cases;

import com.evault.audit.AuditEventType;
import com.evault.audit.AuditService;
import com.evault.auth.AuthService;
import com.evault.cases.dto.CaseCreateRequest;
import com.evault.cases.dto.CaseResponse;
import com.evault.cases.dto.CaseTimelineItem;
import com.evault.cases.dto.CaseUpdateRequest;
import com.evault.common.BadRequestException;
import com.evault.common.ResourceNotFoundException;
import com.evault.user.Role;
import com.evault.user.User;
import com.evault.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final AuthService authService;

    private static final AtomicLong CASE_SEQUENCE = new AtomicLong(100);

    public CaseService(CaseRepository caseRepository,
                       UserRepository userRepository,
                       AuditService auditService,
                       AuthService authService) {
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.authService = authService;
    }

    @Transactional
    public CaseResponse createCase(CaseCreateRequest request, User currentUser) {
        String caseNumber = generateCaseNumber();

        User officer = null;
        if (request.getAssignedOfficerId() != null) {
            officer = userRepository.findById(request.getAssignedOfficerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned officer not found"));
        } else if (currentUser.getRole() == Role.INVESTIGATING_OFFICER) {
            officer = currentUser;
        }

        User prosecutor = null;
        if (request.getProsecutorId() != null) {
            prosecutor = userRepository.findById(request.getProsecutorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prosecutor not found"));
        }

        User judge = null;
        if (request.getJudgeId() != null) {
            judge = userRepository.findById(request.getJudgeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Judge not found"));
        }

        LegalCase legalCase = LegalCase.builder()
                .caseNumber(caseNumber)
                .title(request.getTitle().trim())
                .firNumber(request.getFirNumber().trim())
                .courtName(request.getCourtName().trim())
                .policeStation(request.getPoliceStation().trim())
                .caseType(request.getCaseType().trim())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : CasePriority.MEDIUM)
                .status(CaseStatus.OPEN)
                .assignedOfficer(officer)
                .prosecutor(prosecutor)
                .judge(judge)
                .createdBy(currentUser)
                .build();

        LegalCase saved = caseRepository.save(legalCase);

        auditService.recordEvent(
                AuditEventType.CASE_CREATED,
                currentUser,
                "CASE",
                saved.getId(),
                "Case " + saved.getCaseNumber() + " created with FIR: " + saved.getFirNumber(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public CaseResponse getCaseById(Long id) {
        LegalCase legalCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));
        return mapToResponse(legalCase);
    }

    @Transactional(readOnly = true)
    public CaseResponse getCaseByNumber(String caseNumber) {
        LegalCase legalCase = caseRepository.findByCaseNumber(caseNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with number: " + caseNumber));
        return mapToResponse(legalCase);
    }

    @Transactional(readOnly = true)
    public Page<CaseResponse> getCases(CaseStatus status, CasePriority priority, String query, Pageable pageable) {
        Page<LegalCase> cases = caseRepository.searchCases(status, priority, query, pageable);
        return cases.map(this::mapToResponse);
    }

    @Transactional
    public CaseResponse updateCase(Long id, CaseUpdateRequest request, User currentUser) {
        LegalCase legalCase = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            legalCase.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            legalCase.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            legalCase.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            legalCase.setStatus(request.getStatus());
        }
        if (request.getAssignedOfficerId() != null) {
            User officer = userRepository.findById(request.getAssignedOfficerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));
            legalCase.setAssignedOfficer(officer);
        }
        if (request.getProsecutorId() != null) {
            User prosecutor = userRepository.findById(request.getProsecutorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prosecutor not found"));
            legalCase.setProsecutor(prosecutor);
        }
        if (request.getJudgeId() != null) {
            User judge = userRepository.findById(request.getJudgeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Judge not found"));
            legalCase.setJudge(judge);
        }

        LegalCase updated = caseRepository.save(legalCase);

        auditService.recordEvent(
                AuditEventType.CASE_UPDATED,
                currentUser,
                "CASE",
                updated.getId(),
                "Case " + updated.getCaseNumber() + " updated. Current status: " + updated.getStatus().name(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<CaseTimelineItem> getCaseTimeline(Long caseId) {
        LegalCase legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with id: " + caseId));

        List<CaseTimelineItem> timeline = new ArrayList<>();

        // 1. Inception Event
        timeline.add(CaseTimelineItem.builder()
                .title("Case Inception & FIR Filing")
                .description("Case formally registered under FIR: " + legalCase.getFirNumber() + " at " + legalCase.getPoliceStation())
                .eventType("CASE_CREATED")
                .actorName(legalCase.getCreatedBy() != null ? legalCase.getCreatedBy().getFullName() : "Judicial Officer")
                .actorRole(legalCase.getCreatedBy() != null && legalCase.getCreatedBy().getRole() != null ? legalCase.getCreatedBy().getRole().name() : "INVESTIGATING_OFFICER")
                .timestamp(legalCase.getCreatedAt())
                .referenceId(legalCase.getCaseNumber())
                .status("COMPLETED")
                .build());

        // 2. Officer Assignment
        if (legalCase.getAssignedOfficer() != null) {
            timeline.add(CaseTimelineItem.builder()
                    .title("Investigating Officer Designated")
                    .description("Assigned to " + legalCase.getAssignedOfficer().getFullName() + " (" + legalCase.getAssignedOfficer().getBadgeNumber() + ")")
                    .eventType("OFFICER_ASSIGNED")
                    .actorName(legalCase.getAssignedOfficer().getFullName())
                    .actorRole(legalCase.getAssignedOfficer().getRole().name())
                    .timestamp(legalCase.getCreatedAt().plusMinutes(15))
                    .referenceId(legalCase.getAssignedOfficer().getBadgeNumber())
                    .status("ACTIVE")
                    .build());
        }

        // 3. Prosecutor Assignment
        if (legalCase.getProsecutor() != null) {
            timeline.add(CaseTimelineItem.builder()
                    .title("Public Prosecution Notified")
                    .description("Designated Public Prosecutor: " + legalCase.getProsecutor().getFullName())
                    .eventType("PROSECUTOR_ASSIGNED")
                    .actorName(legalCase.getProsecutor().getFullName())
                    .actorRole(legalCase.getProsecutor().getRole().name())
                    .timestamp(legalCase.getCreatedAt().plusHours(1))
                    .referenceId(legalCase.getProsecutor().getBadgeNumber())
                    .status("ACTIVE")
                    .build());
        }

        // 4. Judge Allocation
        if (legalCase.getJudge() != null) {
            timeline.add(CaseTimelineItem.builder()
                    .title("Assigned to Judicial Bench")
                    .description("Bench assigned under " + legalCase.getJudge().getFullName() + " at " + legalCase.getCourtName())
                    .eventType("JUDICIAL_ALLOCATION")
                    .actorName(legalCase.getJudge().getFullName())
                    .actorRole(legalCase.getJudge().getRole().name())
                    .timestamp(legalCase.getCreatedAt().plusHours(2))
                    .referenceId(legalCase.getJudge().getBadgeNumber())
                    .status("ACTIVE")
                    .build());
        }

        return timeline;
    }

    public CaseResponse mapToResponse(LegalCase legalCase) {
        return CaseResponse.builder()
                .id(legalCase.getId())
                .caseNumber(legalCase.getCaseNumber())
                .title(legalCase.getTitle())
                .firNumber(legalCase.getFirNumber())
                .courtName(legalCase.getCourtName())
                .policeStation(legalCase.getPoliceStation())
                .caseType(legalCase.getCaseType())
                .description(legalCase.getDescription())
                .priority(legalCase.getPriority())
                .priorityDisplayName(legalCase.getPriority().getDisplayName())
                .status(legalCase.getStatus())
                .statusDisplayName(legalCase.getStatus().getDisplayName())
                .assignedOfficer(legalCase.getAssignedOfficer() != null ? authService.mapToProfileResponse(legalCase.getAssignedOfficer()) : null)
                .prosecutor(legalCase.getProsecutor() != null ? authService.mapToProfileResponse(legalCase.getProsecutor()) : null)
                .judge(legalCase.getJudge() != null ? authService.mapToProfileResponse(legalCase.getJudge()) : null)
                .createdBy(legalCase.getCreatedBy() != null ? authService.mapToProfileResponse(legalCase.getCreatedBy()) : null)
                .documentCount(0)
                .evidenceCount(0)
                .createdAt(legalCase.getCreatedAt())
                .updatedAt(legalCase.getUpdatedAt())
                .build();
    }

    private synchronized String generateCaseNumber() {
        int year = LocalDateTime.now().getYear();
        long seq = CASE_SEQUENCE.incrementAndGet();
        return String.format("CASE-%d-%04d", year, seq);
    }
}
