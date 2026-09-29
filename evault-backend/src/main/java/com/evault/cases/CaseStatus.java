package com.evault.cases;

public enum CaseStatus {
    OPEN("Open"),
    UNDER_INVESTIGATION("Under Investigation"),
    UNDER_REVIEW("Under Review"),
    IN_COURT("In Court"),
    CLOSED("Closed"),
    ARCHIVED("Archived");

    private final String displayName;

    CaseStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
