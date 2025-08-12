package com.smartbin.repository;

import com.smartbin.model.Report;
import com.smartbin.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    Page<Report> findAllByOrderBySubmittedAtDesc(Pageable pageable);
    
    List<Report> findByStatusOrderBySubmittedAtDesc(Report.ReportStatus status);
    
    List<Report> findByReporterOrderBySubmittedAtDesc(User reporter);
    
    long countByStatus(Report.ReportStatus status);
    
    @Query("SELECT r FROM Report r ORDER BY r.submittedAt DESC LIMIT :limit")
    List<Report> findTopNByOrderBySubmittedAtDesc(@Param("limit") int limit);
    
    List<Report> findByUrgencyOrderBySubmittedAtDesc(Report.UrgencyLevel urgency);
    
    List<Report> findByWasteTypeOrderBySubmittedAtDesc(Report.WasteType wasteType);
    
    @Query("SELECT r FROM Report r WHERE r.status = :status AND r.urgency = :urgency ORDER BY r.submittedAt DESC")
    List<Report> findByStatusAndUrgencyOrderBySubmittedAtDesc(
        @Param("status") Report.ReportStatus status, 
        @Param("urgency") Report.UrgencyLevel urgency
    );
} 