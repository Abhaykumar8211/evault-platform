package com.evault.audit;

import com.evault.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AuditLog recordEvent(
            AuditEventType eventType,
            User actor,
            String entityType,
            Long entityId,
            String details,
            String ipAddress,
            String userAgent,
            String status) {

        AuditLog auditLog = AuditLog.builder()
                .eventType(eventType)
                .actor(actor)
                .actorEmail(actor != null ? actor.getEmail() : "SYSTEM")
                .actorRole(actor != null && actor.getRole() != null ? actor.getRole().name() : "SYSTEM")
                .entityType(entityType)
                .entityId(entityId)
                .actionDetails(details)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .userAgent(userAgent != null ? userAgent : "Internal")
                .status(status != null ? status : "SUCCESS")
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("[AUDIT] {} - Actor: {}, Entity: {}:{}, Status: {}", 
                eventType, auditLog.getActorEmail(), entityType, entityId, status);
        return saved;
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop20ByOrderByCreatedAtDesc();
    }
}
