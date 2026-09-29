// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DocumentRegistry
 * @dev Anchors legal document and court evidence cryptographic proofs for eVault.
 * Optimized for gas efficiency using bytes32 digests for SHA-256 fingerprints.
 */
contract DocumentRegistry {
    address public owner;
    mapping(address => bool) public authorizedRegistrars;

    struct DocumentRecord {
        bytes32 documentHash;      // SHA-256 fingerprint in bytes32
        string ipfsCid;            // IPFS Content Identifier
        uint256 timestamp;         // Unix timestamp of registration
        address registrar;         // Wallet address of the submitting registrar
        string caseNumber;         // Legal Case Number reference
        string documentType;       // FIR, COURT_ORDER, CHARGE_SHEET, etc.
        bool isRevoked;            // Flag if legally superseded or struck off
    }

    // Mapping from documentId (string) to DocumentRecord
    mapping(string => DocumentRecord) private documents;
    
    // Reverse mapping from documentHash (bytes32) to documentId
    mapping(bytes32 => string) private hashToDocumentId;

    event DocumentRegistered(
        string indexed documentId,
        bytes32 indexed documentHash,
        string ipfsCid,
        address indexed registrar,
        uint256 timestamp,
        string caseNumber
    );

    event DocumentRevoked(
        string indexed documentId,
        string reason,
        address indexed revoker,
        uint256 timestamp
    );

    event DocumentVerified(
        string indexed documentId,
        bytes32 indexed computedHash,
        bool isMatch,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute");
        _;
    }

    modifier onlyRegistrar() {
        require(authorizedRegistrars[msg.sender] || msg.sender == owner, "Caller not authorized registrar");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedRegistrars[msg.sender] = true;
    }

    function addRegistrar(address _registrar) external onlyOwner {
        authorizedRegistrars[_registrar] = true;
    }

    function removeRegistrar(address _registrar) external onlyOwner {
        authorizedRegistrars[_registrar] = false;
    }

    /**
     * @notice Registers a new legal document proof on-chain
     * @param _documentId Unique application document identifier
     * @param _documentHash SHA-256 32-byte digest of the file
     * @param _ipfsCid The IPFS Content Identifier where the file content is stored
     * @param _caseNumber Legal Case Number reference
     * @param _documentType Document category (FIR, EVIDENCE, etc.)
     */
    function registerDocument(
        string calldata _documentId,
        bytes32 _documentHash,
        string calldata _ipfsCid,
        string calldata _caseNumber,
        string calldata _documentType
    ) external onlyRegistrar returns (bool) {
        require(documents[_documentId].timestamp == 0, "Document ID already registered");
        require(_documentHash != bytes32(0), "Invalid document hash");

        documents[_documentId] = DocumentRecord({
            documentHash: _documentHash,
            ipfsCid: _ipfsCid,
            timestamp: block.timestamp,
            registrar: msg.sender,
            caseNumber: _caseNumber,
            documentType: _documentType,
            isRevoked: false
        });

        hashToDocumentId[_documentHash] = _documentId;

        emit DocumentRegistered(
            _documentId,
            _documentHash,
            _ipfsCid,
            msg.sender,
            block.timestamp,
            _caseNumber
        );

        return true;
    }

    /**
     * @notice Verifies whether a given SHA-256 matches the on-chain anchor
     */
    function verifyDocument(
        string calldata _documentId,
        bytes32 _computedHash
    ) external view returns (
        bool isValid,
        bytes32 originalHash,
        string memory ipfsCid,
        uint256 registeredTimestamp,
        address registrar,
        bool isRevoked
    ) {
        DocumentRecord memory doc = documents[_documentId];
        require(doc.timestamp != 0, "Document record not found");

        bool matchResult = (doc.documentHash == _computedHash) && (!doc.isRevoked);
        return (
            matchResult,
            doc.documentHash,
            doc.ipfsCid,
            doc.timestamp,
            doc.registrar,
            doc.isRevoked
        );
    }

    /**
     * @notice Retrieves record directly by document ID
     */
    function getDocumentRecord(string calldata _documentId)
        external
        view
        returns (DocumentRecord memory)
    {
        require(documents[_documentId].timestamp != 0, "Document record not found");
        return documents[_documentId];
    }

    /**
     * @notice Checks if a document hash exists on-chain and returns documentId
     */
    function lookupByHash(bytes32 _documentHash) external view returns (string memory) {
        return hashToDocumentId[_documentHash];
    }
}
