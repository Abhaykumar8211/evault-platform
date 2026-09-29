package com.evault.data;

import com.evault.audit.AuditEventType;
import com.evault.audit.AuditService;
import com.evault.blockchain.BlockchainAnchorService;
import com.evault.blockchain.BlockchainRecord;
import com.evault.cases.CasePriority;
import com.evault.cases.CaseRepository;
import com.evault.cases.CaseStatus;
import com.evault.cases.LegalCase;
import com.evault.document.*;
import com.evault.evidence.ChainOfCustodyEvent;
import com.evault.evidence.ChainOfCustodyRepository;
import com.evault.evidence.Evidence;
import com.evault.evidence.EvidenceRepository;
import com.evault.ipfs.IpfsStorageService;
import com.evault.ipfs.IpfsUploadResult;
import com.evault.user.Role;
import com.evault.user.User;
import com.evault.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository versionRepository;
    private final EvidenceRepository evidenceRepository;
    private final ChainOfCustodyRepository custodyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final Sha256DigestService digestService;
    private final IpfsStorageService ipfsStorageService;
    private final BlockchainAnchorService blockchainAnchorService;

    public DataSeeder(UserRepository userRepository,
                      CaseRepository caseRepository,
                      DocumentRepository documentRepository,
                      DocumentVersionRepository versionRepository,
                      EvidenceRepository evidenceRepository,
                      ChainOfCustodyRepository custodyRepository,
                      PasswordEncoder passwordEncoder,
                      AuditService auditService,
                      Sha256DigestService digestService,
                      IpfsStorageService ipfsStorageService,
                      BlockchainAnchorService blockchainAnchorService) {
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.documentRepository = documentRepository;
        this.versionRepository = versionRepository;
        this.evidenceRepository = evidenceRepository;
        this.custodyRepository = custodyRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
        this.digestService = digestService;
        this.ipfsStorageService = ipfsStorageService;
        this.blockchainAnchorService = blockchainAnchorService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding demo users, cases, evidence, and anchored documents for SIH evaluation...");
            seedAll();
        } else {
            log.info("Database already seeded with {} users and {} cases.", userRepository.count(), caseRepository.count());
        }
    }

    private void seedAll() {
        String defaultPasswordHash = passwordEncoder.encode("Password@123");

        // 1. Seed Demo Users
        User admin = User.builder()
                .email("admin@evault.demo")
                .passwordHash(defaultPasswordHash)
                .fullName("Dr. Amitabh Sen (Administrator)")
                .role(Role.SUPER_ADMIN)
                .badgeNumber("ADM-DEL-001")
                .department("Judicial e-Governance & Systems Directorate")
                .phone("+91-9876543210")
                .active(true)
                .build();

        User officer = User.builder()
                .email("officer@evault.demo")
                .passwordHash(defaultPasswordHash)
                .fullName("Insp. Rajesh V. Sharma")
                .role(Role.INVESTIGATING_OFFICER)
                .badgeNumber("IO-POL-4092")
                .department("Crime Branch, Cyber & Forensic Cell")
                .phone("+91-9876543211")
                .active(true)
                .build();

        User prosecutor = User.builder()
                .email("prosecutor@evault.demo")
                .passwordHash(defaultPasswordHash)
                .fullName("Adv. Sunita Rao (Public Prosecutor)")
                .role(Role.PROSECUTOR)
                .badgeNumber("PP-DEL-1184")
                .department("Directorate of Public Prosecution")
                .phone("+91-9876543212")
                .active(true)
                .build();

        User judge = User.builder()
                .email("judge@evault.demo")
                .passwordHash(defaultPasswordHash)
                .fullName("Hon'ble Justice K. S. Verma")
                .role(Role.JUDGE)
                .badgeNumber("JUD-DEL-0042")
                .department("Special Sessions Court No. 4")
                .phone("+91-9876543213")
                .active(true)
                .build();

        User lawyer = User.builder()
                .email("lawyer@evault.demo")
                .passwordHash(defaultPasswordHash)
                .fullName("Adv. Vikramaditya Sen (Defense Council)")
                .role(Role.LAWYER)
                .badgeNumber("BAR-DEL-8821")
                .department("High Court Bar Association")
                .phone("+91-9876543214")
                .active(true)
                .build();

        User courtStaff = User.builder()
                .email("courtstaff@evault.demo")
                .passwordHash(defaultPasswordHash)
                .fullName("Pooja Deshmukh (Registry Officer)")
                .role(Role.COURT_STAFF)
                .badgeNumber("REG-DEL-5510")
                .department("Central Filing & Evidence Registry")
                .phone("+91-9876543215")
                .active(true)
                .build();

        User viewer = User.builder()
                .email("viewer@evault.demo")
                .passwordHash(defaultPasswordHash)
                .fullName("Aarav Mehta (Judicial Observer)")
                .role(Role.VIEWER)
                .badgeNumber("OBS-2026-09")
                .department("Judicial Transparency & Audit Cell")
                .phone("+91-9876543216")
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, officer, prosecutor, judge, lawyer, courtStaff, viewer));

        // 2. Seed Primary Demo Case: CASE-2026-0001
        LegalCase case1 = LegalCase.builder()
                .caseNumber("CASE-2026-0001")
                .title("State of NCT Delhi vs. Cyber Forgery Syndicate")
                .firNumber("FIR-DEL-409/2026")
                .courtName("Delhi Sessions Court No. 4")
                .policeStation("Special Cyber Crime Unit, Mandir Marg")
                .caseType("Cyber Forgery, Financial Embezzlement & Evidence Tampering")
                .description("Investigation into fraudulent manipulation of digital public records and unauthorized server access under IT Act 2000.")
                .priority(CasePriority.HIGH)
                .status(CaseStatus.IN_COURT)
                .assignedOfficer(officer)
                .prosecutor(prosecutor)
                .judge(judge)
                .createdBy(officer)
                .build();

        LegalCase case2 = LegalCase.builder()
                .caseNumber("CASE-2026-0002")
                .title("Union of India vs. Apex Pharma Cartel")
                .firNumber("FIR-MUM-1102/2026")
                .courtName("Special CBI & PMLA Court, Mumbai")
                .policeStation("Economic Offences Wing, Nariman Point")
                .caseType("Counterfeit Drugs, Section 420 IPC & Money Laundering")
                .description("Probing illicit distribution of counterfeit clinical batches and fraudulent certificate anchoring.")
                .priority(CasePriority.URGENT)
                .status(CaseStatus.UNDER_INVESTIGATION)
                .assignedOfficer(officer)
                .prosecutor(prosecutor)
                .judge(judge)
                .createdBy(officer)
                .build();

        caseRepository.saveAll(List.of(case1, case2));

        // 3. Seed Realistic Demo Documents with genuine SHA-256 and IPFS CIDs
        byte[] firContent = ("DELHI POLICE FIRST INFORMATION REPORT (FIR)\n" +
                "FIR Number: FIR-DEL-409/2026\n" +
                "Date & Time of Occurrence: 12/03/2026 14:30 IST\n" +
                "Police Station: Special Cyber Crime Unit, Mandir Marg\n" +
                "Complainant: Directorate of Digital Land Records\n" +
                "Accused: Unidentified IP Range 194.26.29.0/24 (Alias: ForgeryNode)\n" +
                "Offence Under Sections: 420, 468, 471 IPC r/w 66C, 66D IT Act 2000\n" +
                "Substance of Information: Malicious injection of forged land deeds into registration server.")
                .getBytes(StandardCharsets.UTF_8);

        seedDocument(case1, DocumentType.FIR, "FIR_001.pdf",
                "Official First Information Report registered by Special Cyber Cell",
                firContent, officer);

        byte[] forensicContent = ("CENTRAL FORENSIC SCIENCE LABORATORY (CFSL) EXAMINATION REPORT\n" +
                "Report Reference: CFSL-DL-CYBER-2026-8812\n" +
                "Subject: Bit-stream image analysis of Seized Western Digital HDD (S/N: WD-CYB-8831)\n" +
                "Forensic Examiner: Senior Scientific Officer (Digital Evidence)\n" +
                "Findings: Extracted 14 deleted PDF files with forged digital signatures matching hash SHA-256.\n" +
                "Integrity Confirmation: Physical write-blocker utilized during extraction.")
                .getBytes(StandardCharsets.UTF_8);

        LegalDocument forensicDoc = seedDocument(case1, DocumentType.FORENSIC_REPORT, "Forensic_Report_001.pdf",
                "CFSL Cyber Forensic Analysis Report of Seized Hard Disk",
                forensicContent, officer);

        byte[] courtOrderContent = ("IN THE COURT OF HON'BLE JUSTICE K. S. VERMA, SESSIONS JUDGE\n" +
                "Case No: CASE-2026-0001 (FIR No. 409/2026)\n" +
                "ORDER ON ADMISSION OF DIGITAL EVIDENCE\n" +
                "The Court having reviewed the cryptographic anchor of Forensic Report CFSL-8812\n" +
                "finds the evidence tamper-free and orders production of physical exhibits.\n" +
                "Next Date of Hearing: 15/10/2026.")
                .getBytes(StandardCharsets.UTF_8);

        seedDocument(case1, DocumentType.COURT_ORDER, "Court_Order_001.pdf",
                "Sessions Court Judicial Order admitting digital exhibits",
                courtOrderContent, judge);

        // 4. Seed Physical Evidence with Chain of Custody
        Evidence hddEvidence = Evidence.builder()
                .legalCase(case1)
                .document(forensicDoc)
                .evidenceNumber("EVID-2026-0001")
                .evidenceType("SEIZED_DIGITAL_STORAGE_DEVICE")
                .description("Western Digital 2TB Internal SATA HDD (Model: WD20EZAZ, S/N: WD-CYB-8831) seized during raid")
                .storageLocation("Central Malkhana Secured Locker #42-B")
                .custodyStatus("SECURED_IN_CUSTODY")
                .collectedBy(officer)
                .collectedAt(LocalDateTime.now().minusDays(5))
                .build();

        Evidence savedHdd = evidenceRepository.save(hddEvidence);

        // Create realistic Chain of Custody History
        List<ChainOfCustodyEvent> custodyEvents = List.of(
                ChainOfCustodyEvent.builder()
                        .evidence(savedHdd)
                        .document(forensicDoc)
                        .actor(officer)
                        .actionType("EVIDENCE_SEIZED_AT_CRIME_SCENE")
                        .previousCustodian("Accused Premises (Server Room, Nehru Place)")
                        .newCustodian("Insp. Rajesh Sharma (Cyber Cell)")
                        .remarks("Recovered running server rack, seized in tamper-evident static bag #DEL-9912")
                        .eventHash(forensicDoc.getSha256Hash())
                        .timestamp(LocalDateTime.now().minusDays(5))
                        .build(),

                ChainOfCustodyEvent.builder()
                        .evidence(savedHdd)
                        .document(forensicDoc)
                        .actor(officer)
                        .actionType("TRANSFERRED_TO_FORENSIC_LAB")
                        .previousCustodian("Insp. Rajesh Sharma (Cyber Cell)")
                        .newCustodian("Director, Central Forensic Science Laboratory (CFSL)")
                        .remarks("Handed over for bit-stream forensic extraction under seal")
                        .eventHash(forensicDoc.getSha256Hash())
                        .timestamp(LocalDateTime.now().minusDays(3))
                        .build(),

                ChainOfCustodyEvent.builder()
                        .evidence(savedHdd)
                        .document(forensicDoc)
                        .actor(prosecutor)
                        .actionType("REVIEWED_BY_PROSECUTOR")
                        .previousCustodian("CFSL Laboratory Vault")
                        .newCustodian("Adv. Sunita Rao (Public Prosecutor)")
                        .remarks("Forensic report and digital image verified and admitted into prosecution brief")
                        .eventHash(forensicDoc.getSha256Hash())
                        .timestamp(LocalDateTime.now().minusDays(1))
                        .build(),

                ChainOfCustodyEvent.builder()
                        .evidence(savedHdd)
                        .document(forensicDoc)
                        .actor(judge)
                        .actionType("SUBMITTED_AND_VERIFIED_IN_COURT")
                        .previousCustodian("Adv. Sunita Rao (Public Prosecutor)")
                        .newCustodian("Hon'ble Court Evidence Locker #4")
                        .remarks("Verified against on-chain smart contract anchor. Integrity certified intact.")
                        .eventHash(forensicDoc.getSha256Hash())
                        .timestamp(LocalDateTime.now().minusHours(4))
                        .build()
        );

        custodyRepository.saveAll(custodyEvents);

        auditService.recordEvent(
                AuditEventType.SYSTEM_CONFIG_UPDATED,
                admin,
                "SYSTEM",
                0L,
                "Demo environment bootstrap completed: 7 users, 2 cases, 3 anchored documents, and 1 evidence chain of custody.",
                "127.0.0.1",
                "Seeder",
                "SUCCESS"
        );

        log.info("eVault Demo dataset successfully seeded!");
    }

    private LegalDocument seedDocument(LegalCase legalCase, DocumentType type, String fileName,
                                       String description, byte[] content, User uploadedBy) {

        String sha256 = digestService.computeHexHash(content);
        IpfsUploadResult ipfs = ipfsStorageService.uploadFile(content, fileName, "application/pdf");

        LegalDocument doc = LegalDocument.builder()
                .legalCase(legalCase)
                .documentType(type)
                .title(fileName.replace(".pdf", "").replace("_", " "))
                .description(description)
                .fileName(fileName)
                .fileSize((long) content.length)
                .mimeType("application/pdf")
                .sha256Hash(sha256)
                .ipfsCid(ipfs.getCid())
                .uploadedBy(uploadedBy)
                .version(1)
                .status(DocumentStatus.VERIFIED)
                .build();

        LegalDocument saved = documentRepository.save(doc);

        String docIdentifier = "DOC-" + legalCase.getCaseNumber() + "-" + saved.getId();
        BlockchainRecord bcRecord = blockchainAnchorService.anchorDocument(
                saved.getId(),
                docIdentifier,
                sha256,
                ipfs.getCid(),
                legalCase.getCaseNumber(),
                type.name(),
                "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        );

        saved.setBlockchainRecord(bcRecord);
        saved = documentRepository.save(saved);

        DocumentVersion version = DocumentVersion.builder()
                .document(saved)
                .versionNumber(1)
                .fileName(fileName)
                .fileSize((long) content.length)
                .sha256Hash(sha256)
                .ipfsCid(ipfs.getCid())
                .transactionHash(bcRecord.getTransactionHash())
                .changeSummary("Initial filing and cryptographic anchor")
                .uploadedBy(uploadedBy)
                .build();
        versionRepository.save(version);

        return saved;
    }
}
