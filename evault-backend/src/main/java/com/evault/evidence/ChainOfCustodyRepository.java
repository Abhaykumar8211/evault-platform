package com.evault.evidence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChainOfCustodyRepository extends JpaRepository<ChainOfCustodyEvent, Long> {
    List<ChainOfCustodyEvent> findByEvidenceIdOrderByTimestampAsc(Long evidenceId);
    List<ChainOfCustodyEvent> findByDocumentIdOrderByTimestampAsc(Long documentId);
}
