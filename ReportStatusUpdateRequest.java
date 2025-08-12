package com.smartbin.dto;

import com.smartbin.model.Report;
import jakarta.validation.constraints.NotNull;

public class ReportStatusUpdateRequest {
    
    @NotNull(message = "Status is required")
    private Report.ReportStatus status;
    
    private String resolutionNotes;
    
    // Constructors
    public ReportStatusUpdateRequest() {}
    
    public ReportStatusUpdateRequest(Report.ReportStatus status) {
        this.status = status;
    }
    
    public ReportStatusUpdateRequest(Report.ReportStatus status, String resolutionNotes) {
        this.status = status;
        this.resolutionNotes = resolutionNotes;
    }
    
    // Getters and Setters
    public Report.ReportStatus getStatus() { return status; }
    public void setStatus(Report.ReportStatus status) { this.status = status; }
    
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
} 