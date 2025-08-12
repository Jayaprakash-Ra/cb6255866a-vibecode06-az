package com.smartbin.config;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureStorageConfig {

    @Value("${spring.cloud.azure.storage.blob.account-name}")
    private String accountName;

    @Value("${spring.cloud.azure.storage.blob.account-key}")
    private String accountKey;

    @Value("${spring.cloud.azure.storage.blob.endpoint:}")
    private String endpoint;

    @Bean
    public BlobServiceClient blobServiceClient() {
        String connectionString = String.format(
            "DefaultEndpointsProtocol=https;AccountName=%s;AccountKey=%s;EndpointSuffix=core.windows.net",
            accountName, accountKey
        );
        
        if (!endpoint.isEmpty()) {
            connectionString = String.format(
                "DefaultEndpointsProtocol=https;AccountName=%s;AccountKey=%s;BlobEndpoint=%s",
                accountName, accountKey, endpoint
            );
        }

        return new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
    }
} 