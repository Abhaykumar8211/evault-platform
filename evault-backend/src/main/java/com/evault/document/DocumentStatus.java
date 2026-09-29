package com.evault.document;

public enum DocumentStatus {
    PENDING_ANCHOR("Pending Blockchain Anchor"),
    ANCHORED("Anchored on Blockchain"),
    VERIFIED("Integrity Verified"),
    TAMPER_DETECTED("Integrity Compromised / Tampered"),
    SUPERSEDED("Superseded by Newer Version"),
    REVOKED("Legally Revoked / Expunged");

    private final String displayName;

    DocumentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
