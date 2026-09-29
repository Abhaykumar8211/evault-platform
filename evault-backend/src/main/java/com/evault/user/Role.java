package com.evault.user;

public enum Role {
    SUPER_ADMIN("Super Administrator"),
    INVESTIGATING_OFFICER("Investigating Officer"),
    PROSECUTOR("Public Prosecutor"),
    JUDGE("Presiding Judge"),
    LAWYER("Legal Advocate / Defense"),
    COURT_STAFF("Court Registry Staff"),
    VIEWER("Authorized Observer / Viewer");

    private final String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
