package com.evault.access;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SecureShareLinkRepository extends JpaRepository<SecureShareLink, Long> {
    Optional<SecureShareLink> findByToken(String token);
    List<SecureShareLink> findByDocumentIdOrderByCreatedAtDesc(Long documentId);
}
