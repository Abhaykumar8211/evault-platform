package com.evault.access;

import com.evault.document.LegalDocument;
import com.evault.user.User;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "secure_share_links", indexes = {
    @Index(name = "idx_share_token", columnList = "token"),
    @Index(name = "idx_share_doc_id", columnList = "document_id")
})
@EntityListeners(AuditingEntityListener.class)
public class SecureShareLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private LegalDocument document;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @Column(nullable = false, length = 150)
    private String recipientEmail;

    @Column(nullable = false, length = 30)
    private String accessLevel = "VIEW_ONLY"; // VIEW_ONLY, DOWNLOAD

    private int maxUses = 10;

    private int currentUses = 0;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean revoked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SecureShareLink() {
    }

    public SecureShareLink(Long id, LegalDocument document, String token, String recipientEmail,
                           String accessLevel, int maxUses, int currentUses, LocalDateTime expiresAt,
                           boolean revoked, User createdBy, LocalDateTime createdAt) {
        this.id = id;
        this.document = document;
        this.token = token;
        this.recipientEmail = recipientEmail;
        this.accessLevel = accessLevel != null ? accessLevel : "VIEW_ONLY";
        this.maxUses = maxUses;
        this.currentUses = currentUses;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LegalDocument getDocument() {
        return document;
    }

    public void setDocument(LegalDocument document) {
        this.document = document;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public int getMaxUses() {
        return maxUses;
    }

    public void setMaxUses(int maxUses) {
        this.maxUses = maxUses;
    }

    public int getCurrentUses() {
        return currentUses;
    }

    public void setCurrentUses(int currentUses) {
        this.currentUses = currentUses;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public void setRevoked(boolean revoked) {
        this.revoked = revoked;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isValid() {
        return !revoked && !isExpired() && (maxUses <= 0 || currentUses < maxUses);
    }

    public static class Builder {
        private Long id;
        private LegalDocument document;
        private String token;
        private String recipientEmail;
        private String accessLevel = "VIEW_ONLY";
        private int maxUses = 10;
        private int currentUses = 0;
        private LocalDateTime expiresAt;
        private boolean revoked = false;
        private User createdBy;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder document(LegalDocument document) {
            this.document = document;
            return this;
        }

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder recipientEmail(String recipientEmail) {
            this.recipientEmail = recipientEmail;
            return this;
        }

        public Builder accessLevel(String accessLevel) {
            this.accessLevel = accessLevel;
            return this;
        }

        public Builder maxUses(int maxUses) {
            this.maxUses = maxUses;
            return this;
        }

        public Builder currentUses(int currentUses) {
            this.currentUses = currentUses;
            return this;
        }

        public Builder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public Builder revoked(boolean revoked) {
            this.revoked = revoked;
            return this;
        }

        public Builder createdBy(User createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public SecureShareLink build() {
            return new SecureShareLink(id, document, token, recipientEmail, accessLevel, maxUses, currentUses, expiresAt, revoked, createdBy, createdAt);
        }
    }
}
