package com.evault.cases;

import com.evault.auth.UserDetailsImpl;
import com.evault.cases.dto.CaseCreateRequest;
import com.evault.cases.dto.CaseResponse;
import com.evault.cases.dto.CaseTimelineItem;
import com.evault.cases.dto.CaseUpdateRequest;
import com.evault.common.ApiResponse;
import com.evault.common.ResourceNotFoundException;
import com.evault.user.User;
import com.evault.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cases")
public class CaseController {

    private final CaseService caseService;
    private final UserRepository userRepository;

    public CaseController(CaseService caseService, UserRepository userRepository) {
        this.caseService = caseService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'COURT_STAFF', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CaseResponse>> createCase(
            @Valid @RequestBody CaseCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user record not found"));
        CaseResponse response = caseService.createCase(request, currentUser);
        return new ResponseEntity<>(ApiResponse.success(response, "Legal case registered successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CaseResponse>>> getCases(
            @RequestParam(required = false) CaseStatus status,
            @RequestParam(required = false) CasePriority priority,
            @RequestParam(required = false) String query,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<CaseResponse> cases = caseService.getCases(status, priority, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(cases, "Cases retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CaseResponse>> getCaseById(@PathVariable Long id) {
        CaseResponse response = caseService.getCaseById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Case retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'COURT_STAFF', 'JUDGE', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<CaseResponse>> updateCase(
            @PathVariable Long id,
            @RequestBody CaseUpdateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user record not found"));
        CaseResponse response = caseService.updateCase(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "Case updated successfully"));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<ApiResponse<List<CaseTimelineItem>>> getCaseTimeline(@PathVariable Long id) {
        List<CaseTimelineItem> timeline = caseService.getCaseTimeline(id);
        return ResponseEntity.ok(ApiResponse.success(timeline, "Case timeline retrieved successfully"));
    }
}
