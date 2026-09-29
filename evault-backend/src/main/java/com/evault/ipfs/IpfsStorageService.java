package com.evault.ipfs;

import java.io.InputStream;
import java.util.Map;

/**
 * Replaceable abstraction interface for IPFS storage operations.
 */
public interface IpfsStorageService {

    /**
     * Uploads raw document bytes to IPFS and returns content identifier.
     */
    IpfsUploadResult uploadFile(byte[] fileData, String fileName, String contentType);

    /**
     * Retrieves document content stream from IPFS using CID.
     */
    byte[] getFile(String cid);

    /**
     * Retrieves file metadata from IPFS.
     */
    Map<String, Object> getMetadata(String cid);

    /**
     * Checks if a CID is pinned and accessible.
     */
    boolean verifyAvailability(String cid);

    /**
     * Resolves gateway URL for a CID.
     */
    String resolveGatewayUrl(String cid);
}
