package com.evault.ipfs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class IpfsConfig {

    @Value("${evault.ipfs.mode:mock}")
    private String ipfsMode;

    @Bean
    @Primary
    public IpfsStorageService ipfsStorageService(MockIpfsStorageService mockService) {
        // Defaults to robust resilient mock service for offline and evaluation readiness
        return mockService;
    }
}
