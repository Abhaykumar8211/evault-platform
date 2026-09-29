package com.evault.ipfs;

public class IpfsUploadResult {

    private String cid;
    private long size;
    private String gatewayUrl;

    public IpfsUploadResult() {
    }

    public IpfsUploadResult(String cid, long size, String gatewayUrl) {
        this.cid = cid;
        this.size = size;
        this.gatewayUrl = gatewayUrl;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public String getGatewayUrl() {
        return gatewayUrl;
    }

    public void setGatewayUrl(String gatewayUrl) {
        this.gatewayUrl = gatewayUrl;
    }
}
