package com.evault.document;

import com.evault.auth.UserDetailsImpl;
import com.evault.common.ApiResponse;
import com.evault.common.ResourceNotFoundException;
import com.evault.document.dto.DocumentResponse;
import com.evault.document.dto.DocumentVersionResponse;
import com.evault.user.User;
import com.evault.user.UserRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;

    public DocumentController(DocumentService documentService, UserRepository userRepository) {
        this.documentService = documentService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/cases/{caseId}/documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'PROSECUTOR', 'COURT_STAFF', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @PathVariable Long caseId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") DocumentType documentType,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        DocumentResponse response = documentService.uploadDocument(caseId, documentType, title, description, file, currentUser);
        return new ResponseEntity<>(ApiResponse.success(response, "Document cryptographically anchored to blockchain and uploaded to IPFS"), HttpStatus.CREATED);
    }

    @PostMapping(value = "/documents/{id}/version", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('INVESTIGATING_OFFICER', 'PROSECUTOR', 'COURT_STAFF', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadNewVersion(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "changeSummary", required = false) String changeSummary,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        DocumentResponse response = documentService.uploadNewVersion(id, file, changeSummary, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "New document version anchored on blockchain"));
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocumentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        DocumentResponse response = documentService.getDocumentById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "Document metadata retrieved successfully"));
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadDocument(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        DocumentResponse doc = documentService.getDocumentById(id, currentUser);
        byte[] data = documentService.downloadDocumentBytes(id, currentUser);

        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(doc.getMimeType()))
                .contentLength(data.length)
                .body(resource);
    }

    @GetMapping("/cases/{caseId}/documents")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getDocumentsByCase(@PathVariable Long caseId) {
        List<DocumentResponse> documents = documentService.getDocumentsByCase(caseId);
        return ResponseEntity.ok(ApiResponse.success(documents, "Case documents retrieved successfully"));
    }

    @GetMapping("/documents/{id}/versions")
    public ResponseEntity<ApiResponse<List<DocumentVersionResponse>>> getDocumentVersions(@PathVariable Long id) {
        List<DocumentVersionResponse> versions = documentService.getDocumentVersions(id);
        return ResponseEntity.ok(ApiResponse.success(versions, "Document version history retrieved"));
    }

    @GetMapping("/documents")
    public ResponseEntity<ApiResponse<Page<DocumentResponse>>> searchDocuments(
            @RequestParam(required = false) DocumentType documentType,
            @RequestParam(required = false) DocumentStatus status,
            @RequestParam(required = false) String query,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        Page<DocumentResponse> documents = documentService.searchDocuments(documentType, status, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(documents, "Documents retrieved successfully"));
    }
}
