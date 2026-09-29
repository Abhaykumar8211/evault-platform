import { expect } from "chai";
import { ethers } from "hardhat";

describe("DocumentRegistry Contract", function () {
  let registry: any;
  let owner: any;
  let registrar: any;
  let unauthorized: any;

  // Sample SHA-256 test hash for "FIR_001.pdf"
  const sampleDocId = "DOC-2026-0001";
  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("FIR_DEL_2026_001_ORIGINAL_CONTENT"));
  const tamperedHash = ethers.keccak256(ethers.toUtf8Bytes("FIR_DEL_2026_001_TAMPERED_CONTENT"));
  const sampleIpfsCid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
  const sampleCaseNo = "CASE-2026-001";
  const sampleDocType = "FIR";

  beforeEach(async function () {
    [owner, registrar, unauthorized] = await ethers.getSigners();
    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    registry = await DocumentRegistry.deploy();
    await registry.waitForDeployment();

    // Authorize registrar
    await registry.addRegistrar(registrar.address);
  });

  it("should deploy with owner as registrar", async function () {
    expect(await registry.owner()).to.equal(owner.address);
    expect(await registry.authorizedRegistrars(owner.address)).to.be.true;
    expect(await registry.authorizedRegistrars(registrar.address)).to.be.true;
  });

  it("should allow authorized registrar to register document", async function () {
    const tx = await registry.connect(registrar).registerDocument(
      sampleDocId,
      sampleHash,
      sampleIpfsCid,
      sampleCaseNo,
      sampleDocType
    );
    await tx.wait();

    const record = await registry.getDocumentRecord(sampleDocId);
    expect(record.documentHash).to.equal(sampleHash);
    expect(record.ipfsCid).to.equal(sampleIpfsCid);
    expect(record.registrar).to.equal(registrar.address);
    expect(record.caseNumber).to.equal(sampleCaseNo);
    expect(record.isRevoked).to.be.false;
  });

  it("should verify successfully when hash matches", async function () {
    await registry.connect(registrar).registerDocument(
      sampleDocId,
      sampleHash,
      sampleIpfsCid,
      sampleCaseNo,
      sampleDocType
    );

    const result = await registry.verifyDocument(sampleDocId, sampleHash);
    expect(result.isValid).to.be.true;
    expect(result.originalHash).to.equal(sampleHash);
    expect(result.ipfsCid).to.equal(sampleIpfsCid);
  });

  it("should return isValid = false when hash is tampered", async function () {
    await registry.connect(registrar).registerDocument(
      sampleDocId,
      sampleHash,
      sampleIpfsCid,
      sampleCaseNo,
      sampleDocType
    );

    const result = await registry.verifyDocument(sampleDocId, tamperedHash);
    expect(result.isValid).to.be.false;
    expect(result.originalHash).to.equal(sampleHash); // original remains intact
  });

  it("should reject registration from unauthorized caller", async function () {
    await expect(
      registry.connect(unauthorized).registerDocument(
        sampleDocId,
        sampleHash,
        sampleIpfsCid,
        sampleCaseNo,
        sampleDocType
      )
    ).to.be.revertedWith("Caller not authorized registrar");
  });
});
