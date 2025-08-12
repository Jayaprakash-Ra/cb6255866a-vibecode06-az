package com.smartbin.service;

import com.smartbin.model.Report;
import com.smartbin.model.User;
import com.smartbin.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private AzureStorageService azureStorageService;

    @Autowired
    private PointsService pointsService;

    public Report createReport(Report report, User reporter, MultipartFile image) throws IOException {
        report.setReporter(reporter);
        report.setSubmittedAt(LocalDateTime.now());
        report.setStatus(Report.ReportStatus.PENDING);

        // Upload image to Azure Storage if provided
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = azureStorageService.uploadFile(image, "report-images");
                report.setImageUrl(imageUrl);
                logger.info("Uploaded report image: {}", imageUrl);
            } catch (IOException e) {
                logger.error("Failed to upload report image", e);
                throw new IOException("Failed to upload image: " + e.getMessage());
            }
        }

        Report savedReport = reportRepository.save(report);
        logger.info("Created new report with ID: {}", savedReport.getId());
        
        return savedReport;
    }

    public Page<Report> getAllReports(Pageable pageable) {
        return reportRepository.findAllByOrderBySubmittedAtDesc(pageable);
    }

    public List<Report> getReportsByStatus(Report.ReportStatus status) {
        return reportRepository.findByStatusOrderBySubmittedAtDesc(status);
    }

    public List<Report> getReportsByUser(User user) {
        return reportRepository.findByReporterOrderBySubmittedAtDesc(user);
    }

    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }

    public Report updateReportStatus(Long reportId, Report.ReportStatus newStatus, User resolvedBy) {
        Optional<Report> reportOpt = reportRepository.findById(reportId);
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found with ID: " + reportId);
        }

        Report report = reportOpt.get();
        Report.ReportStatus oldStatus = report.getStatus();
        report.setStatus(newStatus);

        if (newStatus == Report.ReportStatus.RESOLVED && oldStatus != Report.ReportStatus.RESOLVED) {
            report.setResolvedAt(LocalDateTime.now());
            report.setResolvedBy(resolvedBy);
            
            // Award points to reporter
            int pointsAwarded = calculatePointsForReport(report);
            if (pointsAwarded > 0) {
                pointsService.awardPoints(report.getReporter(), pointsAwarded, 
                    "Report resolved: " + report.getLocation());
                report.setPointsAwarded(pointsAwarded);
            }
        }

        Report updatedReport = reportRepository.save(report);
        logger.info("Updated report {} status from {} to {}", reportId, oldStatus, newStatus);
        
        return updatedReport;
    }

    public void deleteReport(Long reportId) {
        Optional<Report> reportOpt = reportRepository.findById(reportId);
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found with ID: " + reportId);
        }

        Report report = reportOpt.get();
        
        // Delete associated image from Azure Storage
        if (report.getImageUrl() != null && !report.getImageUrl().isEmpty()) {
            try {
                azureStorageService.deleteFile(report.getImageUrl());
                logger.info("Deleted image file for report: {}", reportId);
            } catch (Exception e) {
                logger.error("Failed to delete image file for report: {}", reportId, e);
            }
        }

        reportRepository.delete(report);
        logger.info("Deleted report with ID: {}", reportId);
    }

    public List<Report> getRecentReports(int limit) {
        return reportRepository.findTopNByOrderBySubmittedAtDesc(limit);
    }

    public long getTotalReportsCount() {
        return reportRepository.count();
    }

    public long getResolvedReportsCount() {
        return reportRepository.countByStatus(Report.ReportStatus.RESOLVED);
    }

    public long getPendingReportsCount() {
        return reportRepository.countByStatus(Report.ReportStatus.PENDING);
    }

    private int calculatePointsForReport(Report report) {
        int basePoints = 10;
        
        // Bonus points based on urgency level
        switch (report.getUrgency()) {
            case HIGH:
                return basePoints + 15;
            case CRITICAL:
                return basePoints + 25;
            case MEDIUM:
                return basePoints + 5;
            case LOW:
            default:
                return basePoints;
        }
    }
} 