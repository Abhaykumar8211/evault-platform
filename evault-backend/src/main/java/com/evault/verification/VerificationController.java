package com.evault.verification;

import com.evault.auth.UserDetailsImpl;
import com.evault.common.ApiResponse;
import com.evault.document.dto.DocumentVerificationResult;
import com.evault.user.User;
import com.evault.user.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/verify")
public class VerificationController {

    private final VerificationService verificationService;
    private final UserRepository userRepository;

    public VerificationController(VerificationService verificationService, UserRepository userRepository) {
        this.verificationService = verificationService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentVerificationResult>> verifyFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetDocumentId", required = false) Long targetDocumentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = null;
        if (userDetails != null) {
            currentUser = userRepository.findById(userDetails.getId()).orElse(null);
        }

        DocumentVerificationResult result = verificationService.verifyFile(file, targetDocumentId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(result, result.getMessage()));
    }

    @GetMapping("/document/{id}")
    public ResponseEntity<ApiResponse<DocumentVerificationResult>> verifyDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = null;
        if (userDetails != null) {
            currentUser = userRepository.findById(userDetails.getId()).orElse(null);
        }

        DocumentVerificationResult result = verificationService.verifyDocument(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(result, result.getMessage()));
    }

    @GetMapping("/tamper-alerts")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'JUDGE', 'PROSECUTOR', 'INVESTIGATING_OFFICER')")
    public ResponseEntity<ApiResponse<List<TamperIncident>>> getTamperAlerts() {
        List<TamperIncident> alerts = verificationService.getRecentTamperAlerts();
        return ResponseEntity.ok(ApiResponse.success(alerts, "Recent tamper alerts retrieved"));
    }
}
