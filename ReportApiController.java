package com.smartbin.controller.api;

import com.smartbin.dto.ReportCreateRequest;
import com.smartbin.dto.ReportResponse;
import com.smartbin.dto.ReportStatusUpdateRequest;
import com.smartbin.model.Report;
import com.smartbin.model.User;
import com.smartbin.service.ReportService;
import com.smartbin.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportApiController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createReport(
            @Valid @ModelAttribute ReportCreateRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Principal principal) {
        try {
            // Get current user (if authenticated)
            User reporter = null;
            if (principal != null) {
                Optional<User> userOpt = userService.findByUsername(principal.getName());
                if (userOpt.isPresent()) {
                    reporter = userOpt.get();
                }
            }

            // Create report object
            Report report = new Report();
            report.setLocation(request.getLocation());
            report.setWasteType(request.getWasteType());
            report.setUrgency(request.getUrgency());
            report.setDescription(request.getDescription());
            report.setLatitude(request.getLatitude());
            report.setLongitude(request.getLongitude());

            // Create report
            Report savedReport = reportService.createReport(report, reporter, image);
            
            return ResponseEntity.ok(new ReportResponse(savedReport));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create report: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<ReportResponse>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportService.getAllReports(pageable);
        Page<ReportResponse> response = reports.map(ReportResponse::new);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        Optional<Report> reportOpt = reportService.getReportById(id);
        
        if (reportOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(new ReportResponse(reportOpt.get()));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReportResponse>> getReportsByStatus(@PathVariable String status) {
        try {
            Report.ReportStatus reportStatus = Report.ReportStatus.valueOf(status.toUpperCase());
            List<Report> reports = reportService.getReportsByStatus(reportStatus);
            List<ReportResponse> response = reports.stream()
                    .map(ReportResponse::new)
                    .toList();
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<ReportResponse>> getMyReports(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = userService.findByUsername(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Report> reports = reportService.getReportsByUser(userOpt.get());
        List<ReportResponse> response = reports.stream()
                .map(ReportResponse::new)
                .toList();
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReportStatusUpdateRequest request,
            Principal principal) {
        
        try {
            Optional<User> adminOpt = userService.findByUsername(principal.getName());
            if (adminOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Report updatedReport = reportService.updateReportStatus(id, request.getStatus(), adminOpt.get());
            return ResponseEntity.ok(new ReportResponse(updatedReport));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 