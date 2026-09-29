package com.evault.evidence;

import com.evault.auth.UserDetailsImpl;
import com.evault.common.ApiResponse;
import com.evault.common.ResourceNotFoundException;
import com.evault.evidence.dto.ChainOfCustodyResponse;
import com.evault.evidence.dto.EvidenceCreateRequest;
import com.evault.evidence.dto.EvidenceResponse;
import com.evault.evidence.dto.EvidenceTransferRequest;
import com.evault.user.User;
import com.evault.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class EvidenceController {

    private final EvidenceService evidenceService;
    private final UserRepository userRepository;

    public EvidenceController(EvidenceService evidenceService, UserRepository userRepository) {
        this.evidenceService = evidenceService;
        this.userRepository = userRepository;
    }

    @PostMapping("/cases/{caseId}/evidence")
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'COURT_STAFF', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EvidenceResponse>> createEvidence(
            @PathVariable Long caseId,
            @Valid @RequestBody EvidenceCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        request.setCaseId(caseId);
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        EvidenceResponse response = evidenceService.createEvidence(request, currentUser);
        return new ResponseEntity<>(ApiResponse.success(response, "Evidence successfully logged into vault custody"), HttpStatus.CREATED);
    }

    @GetMapping("/evidence/{id}")
    public ResponseEntity<ApiResponse<EvidenceResponse>> getEvidenceById(@PathVariable Long id) {
        EvidenceResponse response = evidenceService.getEvidenceById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Evidence retrieved successfully"));
    }

    @GetMapping("/cases/{caseId}/evidence")
    public ResponseEntity<ApiResponse<List<EvidenceResponse>>> getEvidenceByCase(@PathVariable Long caseId) {
        List<EvidenceResponse> response = evidenceService.getEvidenceByCase(caseId);
        return ResponseEntity.ok(ApiResponse.success(response, "Case evidence retrieved successfully"));
    }

    @PostMapping("/evidence/{id}/transfer")
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'COURT_STAFF', 'PROSECUTOR', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EvidenceResponse>> transferCustody(
            @PathVariable Long id,
            @Valid @RequestBody EvidenceTransferRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        EvidenceResponse response = evidenceService.transferCustody(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "Chain of custody updated successfully"));
    }

    @GetMapping("/evidence/{id}/custody")
    public ResponseEntity<ApiResponse<List<ChainOfCustodyResponse>>> getCustodyTimeline(@PathVariable Long id) {
        List<ChainOfCustodyResponse> custodyTimeline = evidenceService.getCustodyTimeline(id);
        return ResponseEntity.ok(ApiResponse.success(custodyTimeline, "Evidence chain of custody timeline retrieved"));
    }

    @GetMapping("/evidence")
    public ResponseEntity<ApiResponse<List<EvidenceResponse>>> getAllEvidence() {
        List<EvidenceResponse> response = evidenceService.getAllEvidence();
        return ResponseEntity.ok(ApiResponse.success(response, "All evidence retrieved successfully"));
    }
}
