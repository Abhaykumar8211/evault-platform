package com.evault.document;

public enum DocumentType {
    FIR("First Information Report (FIR)"),
    CHARGE_SHEET("Police Charge Sheet"),
    COURT_ORDER("Judicial Court Order"),
    TRANSCRIPT("Court Hearing Transcript"),
    WITNESS_STATEMENT("Sworn Witness Deposition"),
    MEDICAL_REPORT("Medico-Legal / Autopsy Report"),
    FORENSIC_REPORT("Forensic Science Laboratory Report"),
    EVIDENCE_PHOTO("Crime Scene Photographic Evidence"),
    DIGITAL_EVIDENCE("Digital Extraction / Call Detail Records"),
    LEGAL_NOTICE("Statutory Legal Notice"),
    SUPPORTING_DOCUMENT("Supporting Case Document"),
    OTHER("Miscellaneous Legal Record");

    private final String displayName;

    DocumentType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
