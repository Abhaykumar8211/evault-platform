package com.evault.access.dto;

import java.time.LocalDateTime;

public class ShareResponse {

    private Long id;
    private Long documentId;
    private String documentTitle;
    private String shareUrl;
    private String token;
    private String recipientEmail;
    private String accessLevel;
    private int maxUses;
    private int currentUses;
    private LocalDateTime expiresAt;
    private boolean revoked;
    private boolean active;
    private LocalDateTime createdAt;

    public ShareResponse() {
    }

    public ShareResponse(Long id, Long documentId, String documentTitle, String shareUrl,
                         String token, String recipientEmail, String accessLevel, int maxUses,
                         int currentUses, LocalDateTime expiresAt, boolean revoked,
                         boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.documentId = documentId;
        this.documentTitle = documentTitle;
        this.shareUrl = shareUrl;
        this.token = token;
        this.recipientEmail = recipientEmail;
        this.accessLevel = accessLevel;
        this.maxUses = maxUses;
        this.currentUses = currentUses;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
        this.active = active;
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

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getDocumentTitle() {
        return documentTitle;
    }

    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public String getShareUrl() {
        return shareUrl;
    }

    public void setShareUrl(String shareUrl) {
        this.shareUrl = shareUrl;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class Builder {
        private Long id;
        private Long documentId;
        private String documentTitle;
        private String shareUrl;
        private String token;
        private String recipientEmail;
        private String accessLevel;
        private int maxUses;
        private int currentUses;
        private LocalDateTime expiresAt;
        private boolean revoked;
        private boolean active;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder documentId(Long documentId) {
            this.documentId = documentId;
            return this;
        }

        public Builder documentTitle(String documentTitle) {
            this.documentTitle = documentTitle;
            return this;
        }

        public Builder shareUrl(String shareUrl) {
            this.shareUrl = shareUrl;
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

        public Builder active(boolean active) {
            this.active = active;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ShareResponse build() {
            return new ShareResponse(id, documentId, documentTitle, shareUrl, token, recipientEmail, accessLevel, maxUses, currentUses, expiresAt, revoked, active, createdAt);
        }
    }
}
