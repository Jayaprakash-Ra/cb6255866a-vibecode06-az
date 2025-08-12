package com.smartbin.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobHttpHeaders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class AzureStorageService {

    private static final Logger logger = LoggerFactory.getLogger(AzureStorageService.class);

    @Autowired
    private BlobServiceClient blobServiceClient;

    @Value("${spring.cloud.azure.storage.blob.container-name}")
    private String containerName;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : "";
        String fileName = folder + "/" + UUID.randomUUID().toString() + fileExtension;

        try {
            // Get container client
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            
            // Create container if it doesn't exist
            if (!containerClient.exists()) {
                containerClient.create();
                logger.info("Created container: {}", containerName);
            }

            // Get blob client
            BlobClient blobClient = containerClient.getBlobClient(fileName);

            // Set content type
            BlobHttpHeaders headers = new BlobHttpHeaders().setContentType(file.getContentType());

            // Upload file
            blobClient.upload(file.getInputStream(), file.getSize(), true);
            blobClient.setHttpHeaders(headers);

            String fileUrl = blobClient.getBlobUrl();
            logger.info("Successfully uploaded file: {}", fileUrl);
            
            return fileUrl;

        } catch (Exception e) {
            logger.error("Error uploading file to Azure Storage", e);
            throw new IOException("Failed to upload file to Azure Storage: " + e.getMessage(), e);
        }
    }

    public boolean deleteFile(String fileUrl) {
        try {
            // Extract blob name from URL
            String blobName = extractBlobNameFromUrl(fileUrl);
            if (blobName == null) {
                logger.warn("Could not extract blob name from URL: {}", fileUrl);
                return false;
            }

            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            BlobClient blobClient = containerClient.getBlobClient(blobName);

            boolean deleted = blobClient.deleteIfExists();
            if (deleted) {
                logger.info("Successfully deleted file: {}", fileUrl);
            } else {
                logger.warn("File not found for deletion: {}", fileUrl);
            }

            return deleted;

        } catch (Exception e) {
            logger.error("Error deleting file from Azure Storage", e);
            return false;
        }
    }

    public boolean fileExists(String fileUrl) {
        try {
            String blobName = extractBlobNameFromUrl(fileUrl);
            if (blobName == null) {
                return false;
            }

            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            BlobClient blobClient = containerClient.getBlobClient(blobName);

            return blobClient.exists();

        } catch (Exception e) {
            logger.error("Error checking file existence in Azure Storage", e);
            return false;
        }
    }

    private String extractBlobNameFromUrl(String fileUrl) {
        try {
            // Extract blob name from Azure Storage URL
            // Format: https://account.blob.core.windows.net/container/blobname
            String[] parts = fileUrl.split("/");
            if (parts.length >= 4) {
                // Join everything after the container name
                StringBuilder blobName = new StringBuilder();
                for (int i = 4; i < parts.length; i++) {
                    if (i > 4) blobName.append("/");
                    blobName.append(parts[i]);
                }
                return blobName.toString();
            }
        } catch (Exception e) {
            logger.error("Error extracting blob name from URL: {}", fileUrl, e);
        }
        return null;
    }
} 