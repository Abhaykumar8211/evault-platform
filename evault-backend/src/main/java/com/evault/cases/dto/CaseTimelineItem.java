package com.evault.cases.dto;

import java.time.LocalDateTime;

public class CaseTimelineItem {

    private String title;
    private String description;
    private String eventType;
    private String actorName;
    private String actorRole;
    private LocalDateTime timestamp;
    private String referenceId;
    private String status;

    public CaseTimelineItem() {
    }

    public CaseTimelineItem(String title, String description, String eventType, String actorName,
                            String actorRole, LocalDateTime timestamp, String referenceId, String status) {
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.timestamp = timestamp;
        this.referenceId = referenceId;
        this.status = status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static class Builder {
        private String title;
        private String description;
        private String eventType;
        private String actorName;
        private String actorRole;
        private LocalDateTime timestamp;
        private String referenceId;
        private String status;

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder eventType(String eventType) {
            this.eventType = eventType;
            return this;
        }

        public Builder actorName(String actorName) {
            this.actorName = actorName;
            return this;
        }

        public Builder actorRole(String actorRole) {
            this.actorRole = actorRole;
            return this;
        }

        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder referenceId(String referenceId) {
            this.referenceId = referenceId;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public CaseTimelineItem build() {
            return new CaseTimelineItem(title, description, eventType, actorName, actorRole, timestamp, referenceId, status);
        }
    }
}
