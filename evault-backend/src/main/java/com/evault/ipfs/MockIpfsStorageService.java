package com.evault.ipfs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

@Service("mockIpfsStorageService")
public class MockIpfsStorageService implements IpfsStorageService {

    private static final Logger log = LoggerFactory.getLogger(MockIpfsStorageService.class);
    private final Path storageDirectory;

    @Value("${evault.ipfs.gateway-url:https://ipfs.io/ipfs/}")
    private String gatewayBaseUrl;

    public MockIpfsStorageService() {
        this.storageDirectory = Paths.get("./data/ipfs");
        try {
            Files.createDirectories(storageDirectory);
        } catch (IOException e) {
            log.error("Failed to initialize IPFS local storage directory", e);
        }
    }

    @Override
    public IpfsUploadResult uploadFile(byte[] fileData, String fileName, String contentType) {
        String cid = generateDeterministicCid(fileData);
        Path targetPath = storageDirectory.resolve(cid + ".dat");

        try {
            Files.write(targetPath, fileData);
            log.info("[IPFS] Uploaded {} ({} bytes) -> CID: {}", fileName, fileData.length, cid);
        } catch (IOException e) {
            log.error("[IPFS] Failed to persist file with CID: {}", cid, e);
            throw new RuntimeException("Failed to write to IPFS storage", e);
        }

        String gatewayUrl = resolveGatewayUrl(cid);
        return new IpfsUploadResult(cid, fileData.length, gatewayUrl);
    }

    @Override
    public byte[] getFile(String cid) {
        Path targetPath = storageDirectory.resolve(cid + ".dat");
        if (!Files.exists(targetPath)) {
            log.warn("[IPFS] File not found for CID: {}", cid);
            return null;
        }

        try {
            return Files.readAllBytes(targetPath);
        } catch (IOException e) {
            log.error("[IPFS] Error reading CID: {}", cid, e);
            throw new RuntimeException("Error reading from IPFS storage", e);
        }
    }

    @Override
    public Map<String, Object> getMetadata(String cid) {
        Path targetPath = storageDirectory.resolve(cid + ".dat");
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("cid", cid);
        metadata.put("pinned", Files.exists(targetPath));

        if (Files.exists(targetPath)) {
            try {
                metadata.put("size", Files.size(targetPath));
            } catch (IOException ignored) {}
        }
        return metadata;
    }

    @Override
    public boolean verifyAvailability(String cid) {
        Path targetPath = storageDirectory.resolve(cid + ".dat");
        return Files.exists(targetPath);
    }

    @Override
    public String resolveGatewayUrl(String cid) {
        if (!gatewayBaseUrl.endsWith("/")) {
            return gatewayBaseUrl + "/" + cid;
        }
        return gatewayBaseUrl + cid;
    }

    /**
     * Generates a deterministic Qm... base58-styled CID from the file data.
     */
    private String generateDeterministicCid(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);

            // Create IPFS CIDv0 Multihash structure: 0x12 (sha2-256), 0x20 (32 bytes length) + 32-byte digest
            byte[] multihash = new byte[34];
            multihash[0] = 0x12;
            multihash[1] = 0x20;
            System.arraycopy(hash, 0, multihash, 2, 32);

            return "Qm" + encodeBase58(multihash).substring(2);
        } catch (Exception e) {
            return "Qm" + Long.toHexString(System.currentTimeMillis()) + "MockCid" + data.length;
        }
    }

    private String encodeBase58(byte[] input) {
        final String ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        StringBuilder encoded = new StringBuilder();
        for (byte b : input) {
            int val = (b & 0xFF) % ALPHABET.length();
            encoded.append(ALPHABET.charAt(val));
        }
        while (encoded.length() < 46) {
            encoded.append("x");
        }
        return encoded.substring(0, 44);
    }
}
