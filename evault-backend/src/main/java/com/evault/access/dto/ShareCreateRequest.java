package com.evault.access.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ShareCreateRequest {

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Recipient must be a valid email address")
    private String recipientEmail;

    private String accessLevel = "VIEW_ONLY"; // VIEW_ONLY, DOWNLOAD

    private int validityHours = 24;

    private int maxUses = 10;

    public ShareCreateRequest() {
    }

    public ShareCreateRequest(String recipientEmail, String accessLevel, int validityHours, int maxUses) {
        this.recipientEmail = recipientEmail;
        this.accessLevel = accessLevel != null ? accessLevel : "VIEW_ONLY";
        this.validityHours = validityHours > 0 ? validityHours : 24;
        this.maxUses = maxUses > 0 ? maxUses : 10;
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

    public int getValidityHours() {
        return validityHours;
    }

    public void setValidityHours(int validityHours) {
        this.validityHours = validityHours;
    }

    public int getMaxUses() {
        return maxUses;
    }

    public void setMaxUses(int maxUses) {
        this.maxUses = maxUses;
    }
}
