package com.evault.access;

import com.evault.access.dto.ShareCreateRequest;
import com.evault.access.dto.ShareResponse;
import com.evault.auth.UserDetailsImpl;
import com.evault.common.ApiResponse;
import com.evault.common.ResourceNotFoundException;
import com.evault.document.dto.DocumentResponse;
import com.evault.user.User;
import com.evault.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ShareController {

    private final ShareService shareService;
    private final UserRepository userRepository;

    public ShareController(ShareService shareService, UserRepository userRepository) {
        this.shareService = shareService;
        this.userRepository = userRepository;
    }

    @PostMapping("/documents/{documentId}/share")
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'PROSECUTOR', 'JUDGE', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ShareResponse>> createShareLink(
            @PathVariable Long documentId,
            @Valid @RequestBody ShareCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        ShareResponse response = shareService.createShareLink(documentId, request, currentUser);
        return new ResponseEntity<>(ApiResponse.success(response, "Secure access link generated successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/share/{token}")
    public ResponseEntity<ApiResponse<DocumentResponse>> accessSharedDocument(
            @PathVariable String token,
            HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        DocumentResponse response = shareService.accessSharedDocument(token, clientIp, userAgent);
        return ResponseEntity.ok(ApiResponse.success(response, "Authorized document access granted"));
    }

    @PostMapping("/share/{token}/revoke")
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'PROSECUTOR', 'JUDGE', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ShareResponse>> revokeShareLink(
            @PathVariable String token,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        ShareResponse response = shareService.revokeShareLink(token, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "Secure share link revoked"));
    }

    @GetMapping("/documents/{documentId}/shares")
    public ResponseEntity<ApiResponse<List<ShareResponse>>> getDocumentShareLinks(@PathVariable Long documentId) {
        List<ShareResponse> links = shareService.getDocumentShareLinks(documentId);
        return ResponseEntity.ok(ApiResponse.success(links, "Active share links retrieved"));
    }
}
