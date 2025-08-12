package com.smartbin.controller;

import com.smartbin.model.Report;
import com.smartbin.service.ReportService;
import com.smartbin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class DashboardController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String home() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Get dashboard statistics
        long totalReports = reportService.getTotalReportsCount();
        long resolvedReports = reportService.getResolvedReportsCount();
        long pendingReports = reportService.getPendingReportsCount();
        long totalUsers = userService.getTotalUsersCount();

        // Get recent reports
        List<Report> recentReports = reportService.getRecentReports(5);

        // Add data to model
        model.addAttribute("totalReports", totalReports);
        model.addAttribute("resolvedReports", resolvedReports);
        model.addAttribute("pendingReports", pendingReports);
        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("recentReports", recentReports);

        // Calculate resolution rate
        double resolutionRate = totalReports > 0 ? (double) resolvedReports / totalReports * 100 : 0;
        model.addAttribute("resolutionRate", Math.round(resolutionRate));

        return "dashboard";
    }

    @GetMapping("/reports")
    public String reports() {
        return "reports";
    }

    @GetMapping("/schedule")
    public String schedule(Model model) {
        // Add schedule data
        model.addAttribute("pageTitle", "Collection Schedule");
        return "schedule";
    }

    @GetMapping("/education")
    public String education(Model model) {
        // Add education content
        model.addAttribute("pageTitle", "Education Center");
        return "education";
    }

    @GetMapping("/rewards")
    public String rewards(Model model) {
        // Add rewards data
        model.addAttribute("pageTitle", "Rewards Center");
        return "rewards";
    }

    @GetMapping("/admin")
    public String admin(Model model) {
        // Get admin dashboard data
        List<Report> pendingReports = reportService.getReportsByStatus(Report.ReportStatus.PENDING);
        List<Report> inProgressReports = reportService.getReportsByStatus(Report.ReportStatus.IN_PROGRESS);

        model.addAttribute("pendingReports", pendingReports);
        model.addAttribute("inProgressReports", inProgressReports);
        model.addAttribute("pageTitle", "Admin Dashboard");

        return "admin";
    }
} 