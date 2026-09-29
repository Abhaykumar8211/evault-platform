package com.evault.evidence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByLegalCaseIdOrderByCreatedAtDesc(Long caseId);
    Page<Evidence> findByLegalCaseIdOrderByCreatedAtDesc(Long caseId, Pageable pageable);
    Optional<Evidence> findByEvidenceNumber(String evidenceNumber);
    long countByLegalCaseId(Long caseId);
}
