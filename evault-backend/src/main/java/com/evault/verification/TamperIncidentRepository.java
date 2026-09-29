package com.evault.verification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TamperIncidentRepository extends JpaRepository<TamperIncident, Long> {
    Page<TamperIncident> findAllByOrderByDetectedAtDesc(Pageable pageable);
    List<TamperIncident> findTop10ByOrderByDetectedAtDesc();
}
