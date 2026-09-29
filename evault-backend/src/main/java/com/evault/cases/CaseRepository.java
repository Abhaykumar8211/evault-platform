package com.evault.cases;

import com.evault.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<LegalCase, Long> {

    Optional<LegalCase> findByCaseNumber(String caseNumber);

    boolean existsByCaseNumber(String caseNumber);

    Page<LegalCase> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<LegalCase> findByStatusOrderByCreatedAtDesc(CaseStatus status, Pageable pageable);

    @Query("SELECT c FROM LegalCase c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:query IS NULL OR LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.firNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.policeStation) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.courtName) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY c.createdAt DESC")
    Page<LegalCase> searchCases(
            @Param("status") CaseStatus status,
            @Param("priority") CasePriority priority,
            @Param("query") String query,
            Pageable pageable);

    List<LegalCase> findByAssignedOfficerOrProsecutorOrJudge(User officer, User prosecutor, User judge);

    long countByStatus(CaseStatus status);

    List<LegalCase> findTop5ByOrderByCreatedAtDesc();
}
