package com.smartbin.dto;

import com.smartbin.model.Report;
import java.time.LocalDateTime;

public class ReportResponse {
    
    private Long id;
    private String location;
    private Report.WasteType wasteType;
    private Report.UrgencyLevel urgency;
    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Report.ReportStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime resolvedAt;
    private String reporterUsername;
    private String resolvedByUsername;
    private Integer pointsAwarded;
    
    // Constructors
    public ReportResponse() {}
    
    public ReportResponse(Report report) {
        this.id = report.getId();
        this.location = report.getLocation();
        this.wasteType = report.getWasteType();
        this.urgency = report.getUrgency();
        this.description = report.getDescription();
        this.imageUrl = report.getImageUrl();
        this.latitude = report.getLatitude();
        this.longitude = report.getLongitude();
        this.status = report.getStatus();
        this.submittedAt = report.getSubmittedAt();
        this.resolvedAt = report.getResolvedAt();
        this.reporterUsername = report.getReporter() != null ? report.getReporter().getUsername() : null;
        this.resolvedByUsername = report.getResolvedBy() != null ? report.getResolvedBy().getUsername() : null;
        this.pointsAwarded = report.getPointsAwarded();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Report.WasteType getWasteType() { return wasteType; }
    public void setWasteType(Report.WasteType wasteType) { this.wasteType = wasteType; }
    
    public Report.UrgencyLevel getUrgency() { return urgency; }
    public void setUrgency(Report.UrgencyLevel urgency) { this.urgency = urgency; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public Report.ReportStatus getStatus() { return status; }
    public void setStatus(Report.ReportStatus status) { this.status = status; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public String getReporterUsername() { return reporterUsername; }
    public void setReporterUsername(String reporterUsername) { this.reporterUsername = reporterUsername; }
    
    public String getResolvedByUsername() { return resolvedByUsername; }
    public void setResolvedByUsername(String resolvedByUsername) { this.resolvedByUsername = resolvedByUsername; }
    
    public Integer getPointsAwarded() { return pointsAwarded; }
    public void setPointsAwarded(Integer pointsAwarded) { this.pointsAwarded = pointsAwarded; }
} 