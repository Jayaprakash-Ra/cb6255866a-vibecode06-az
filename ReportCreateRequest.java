package com.smartbin.dto;

import com.smartbin.model.Report;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReportCreateRequest {
    
    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;
    
    @NotNull(message = "Waste type is required")
    private Report.WasteType wasteType;
    
    @NotNull(message = "Urgency level is required")
    private Report.UrgencyLevel urgency;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private Double latitude;
    private Double longitude;
    
    // Constructors
    public ReportCreateRequest() {}
    
    public ReportCreateRequest(String location, Report.WasteType wasteType, Report.UrgencyLevel urgency) {
        this.location = location;
        this.wasteType = wasteType;
        this.urgency = urgency;
    }
    
    // Getters and Setters
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Report.WasteType getWasteType() { return wasteType; }
    public void setWasteType(Report.WasteType wasteType) { this.wasteType = wasteType; }
    
    public Report.UrgencyLevel getUrgency() { return urgency; }
    public void setUrgency(Report.UrgencyLevel urgency) { this.urgency = urgency; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
} 