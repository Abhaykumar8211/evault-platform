package com.evault.access;

import com.evault.access.dto.ShareCreateRequest;
import com.evault.access.dto.ShareResponse;
import com.evault.audit.AuditEventType;
import com.evault.audit.AuditService;
import com.evault.common.BadRequestException;
import com.evault.common.ResourceNotFoundException;
import com.evault.document.DocumentRepository;
import com.evault.document.DocumentService;
import com.evault.document.LegalDocument;
import com.evault.document.dto.DocumentResponse;
import com.evault.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShareService {

    private final SecureShareLinkRepository shareLinkRepository;
    private final DocumentRepository documentRepository;
    private final DocumentService documentService;
    private final AuditService auditService;
    private static final SecureRandom RANDOM = new SecureRandom();

    public ShareService(SecureShareLinkRepository shareLinkRepository,
                        DocumentRepository documentRepository,
                        DocumentService documentService,
                        AuditService auditService) {
        this.shareLinkRepository = shareLinkRepository;
        this.documentRepository = documentRepository;
        this.documentService = documentService;
        this.auditService = auditService;
    }

    @Transactional
    public ShareResponse createShareLink(Long documentId, ShareCreateRequest request, User currentUser) {
        LegalDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        String token = generateSecureToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(request.getValidityHours());

        SecureShareLink shareLink = SecureShareLink.builder()
                .document(document)
                .token(token)
                .recipientEmail(request.getRecipientEmail().trim().toLowerCase())
                .accessLevel(request.getAccessLevel() != null ? request.getAccessLevel() : "VIEW_ONLY")
                .maxUses(request.getMaxUses())
                .currentUses(0)
                .expiresAt(expiresAt)
                .revoked(false)
                .createdBy(currentUser)
                .build();

        SecureShareLink saved = shareLinkRepository.save(shareLink);

        auditService.recordEvent(
                AuditEventType.DOCUMENT_SHARED,
                currentUser,
                "DOCUMENT",
                document.getId(),
                "Secure link created for recipient: " + saved.getRecipientEmail() + ", Access: " + saved.getAccessLevel(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public DocumentResponse accessSharedDocument(String token, String clientIp, String userAgent) {
        SecureShareLink link = shareLinkRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or non-existent secure link"));

        if (!link.isValid()) {
            throw new BadRequestException("This secure link has expired, reached its access limit, or has been revoked");
        }

        link.setCurrentUses(link.getCurrentUses() + 1);
        shareLinkRepository.save(link);

        auditService.recordEvent(
                AuditEventType.DOCUMENT_VIEWED,
                null,
                "DOCUMENT",
                link.getDocument().getId(),
                "Document viewed via secure link token by recipient: " + link.getRecipientEmail() + " (Use " + link.getCurrentUses() + "/" + link.getMaxUses() + ")",
                clientIp,
                userAgent,
                "SUCCESS"
        );

        return documentService.mapToResponse(link.getDocument());
    }

    @Transactional
    public ShareResponse revokeShareLink(String token, User currentUser) {
        SecureShareLink link = shareLinkRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Share link not found"));

        link.setRevoked(true);
        SecureShareLink updated = shareLinkRepository.save(link);

        auditService.recordEvent(
                AuditEventType.ACCESS_REVOKED,
                currentUser,
                "DOCUMENT",
                link.getDocument().getId(),
                "Secure share link revoked for recipient: " + link.getRecipientEmail(),
                null,
                null,
                "SUCCESS"
        );

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<ShareResponse> getDocumentShareLinks(Long documentId) {
        return shareLinkRepository.findByDocumentIdOrderByCreatedAtDesc(documentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ShareResponse mapToResponse(SecureShareLink link) {
        String shareUrl = "/verify/shared/" + link.getToken();

        return ShareResponse.builder()
                .id(link.getId())
                .documentId(link.getDocument().getId())
                .documentTitle(link.getDocument().getTitle())
                .shareUrl(shareUrl)
                .token(link.getToken())
                .recipientEmail(link.getRecipientEmail())
                .accessLevel(link.getAccessLevel())
                .maxUses(link.getMaxUses())
                .currentUses(link.getCurrentUses())
                .expiresAt(link.getExpiresAt())
                .revoked(link.isRevoked())
                .active(link.isValid())
                .createdAt(link.getCreatedAt())
                .build();
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
