package com.evault.document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<LegalDocument, Long> {

    List<LegalDocument> findByLegalCaseIdOrderByCreatedAtDesc(Long caseId);

    Page<LegalDocument> findByLegalCaseIdOrderByCreatedAtDesc(Long caseId, Pageable pageable);

    Optional<LegalDocument> findBySha256Hash(String sha256Hash);

    Optional<LegalDocument> findByIpfsCid(String ipfsCid);

    boolean existsBySha256Hash(String sha256Hash);

    long countByLegalCaseId(Long caseId);

    long countByStatus(DocumentStatus status);

    @Query("SELECT d FROM LegalDocument d WHERE " +
           "(:documentType IS NULL OR d.documentType = :documentType) AND " +
           "(:status IS NULL OR d.status = :status) AND " +
           "(:query IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.fileName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.sha256Hash) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.ipfsCid) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY d.createdAt DESC")
    Page<LegalDocument> searchDocuments(
            @Param("documentType") DocumentType documentType,
            @Param("status") DocumentStatus status,
            @Param("query") String query,
            Pageable pageable);

    List<LegalDocument> findTop5ByOrderByCreatedAtDesc();
}
