package com.evault.audit;

import com.evault.common.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'JUDGE')")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        Page<AuditLog> logs = auditService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(logs, "Immutable audit trail logs retrieved"));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'JUDGE', 'INVESTIGATING_OFFICER', 'PROSECUTOR')")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getRecentAuditLogs() {
        List<AuditLog> recentLogs = auditService.getRecentAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(recentLogs, "Recent audit events retrieved"));
    }
}
