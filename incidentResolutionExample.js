// Example usage of the Incident Resolution System
// This demonstrates the complete workflow from incident reporting to resolution and point crediting

import IncidentResolutionService from '../services/incidentResolutionService';
import PointsService from '../services/pointsService';
import AuditService from '../services/auditService';
import { useToast } from '../components/common/Toast';

// Example incident resolution workflow
export const demonstrateIncidentResolution = async () => {
  const toast = useToast();

  try {
    // Step 1: Sample incident data (would come from reports)
    const sampleIncident = {
      id: 'RPT-1699123456-ABC123',
      type: 'damaged',
      description: 'Garbage bin is damaged and needs replacement',
      location: 'Main Street & 5th Avenue',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      photo: 'base64-encoded-image-data',
      status: 'Escalated',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      reportedBy: 'user123',
      reporterCurrentPoints: 150,
      priority: 'urgent'
    };

    console.log('🎯 Starting incident resolution process...');
    console.log('📋 Incident Details:', sampleIncident);

    // Step 2: Admin resolves the incident
    const resolutionData = {
      type: 'completed',
      notes: 'Bin has been replaced with a new one. Cleanup crew dispatched to area.',
      verificationPhoto: null
    };

    console.log('🔧 Resolving incident with data:', resolutionData);

    // Step 3: Execute resolution workflow
    const resolutionResult = await IncidentResolutionService.resolveIncident(
      sampleIncident.id,
      resolutionData
    );

    console.log('✅ Resolution completed:', resolutionResult);

    // Step 4: Demonstrate points calculation
    console.log('\n💰 Points Breakdown:');
    console.log(`- Base points for ${sampleIncident.type}: 20`);
    console.log(`- Urgent bonus (+50%): ${20 * 0.5}`);
    console.log(`- Photo verification bonus (+25%): ${20 * 0.25}`);
    console.log(`- GPS location bonus (+20%): ${20 * 0.2}`);
    console.log(`- Quick resolution bonus (+10%): ${20 * 0.1}`);
    console.log(`- Total points awarded: ${resolutionResult.pointsAwarded}`);

    // Step 5: Show notification that would be sent to user
    const notificationExample = {
      userId: sampleIncident.reportedBy,
      type: 'INCIDENT_RESOLVED',
      title: 'Incident Resolved - Points Awarded!',
      message: `Your report (${sampleIncident.id}) has been resolved. You've earned ${resolutionResult.pointsAwarded} points for helping keep our community clean!`,
      data: {
        incidentId: sampleIncident.id,
        pointsAwarded: resolutionResult.pointsAwarded,
        incidentType: sampleIncident.type,
        location: sampleIncident.location
      }
    };

    console.log('\n🔔 User notification:', notificationExample);

    // Step 6: Demonstrate audit trail
    const auditEntry = await AuditService.logIncidentResolution(
      sampleIncident,
      resolutionData,
      resolutionResult.pointsAwarded
    );

    console.log('\n📋 Audit trail entry created:', auditEntry);

    return {
      success: true,
      incident: resolutionResult.incident,
      pointsAwarded: resolutionResult.pointsAwarded,
      notification: notificationExample,
      auditTrail: auditEntry
    };

  } catch (error) {
    console.error('❌ Error in incident resolution:', error);
    toast.error(`Resolution failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Example of bulk incident resolution
export const demonstrateBulkResolution = async () => {
  try {
    console.log('🔄 Starting bulk incident resolution...');

    const incidentIds = [
      'RPT-1699123456-ABC123',
      'RPT-1699123456-DEF456',
      'RPT-1699123456-GHI789'
    ];

    const bulkResolutionData = {
      type: 'completed',
      notes: 'Bulk resolution: All reported bins have been serviced during scheduled maintenance.'
    };

    const bulkResult = await IncidentResolutionService.bulkResolveIncidents(
      incidentIds,
      bulkResolutionData
    );

    console.log('✅ Bulk resolution completed:', bulkResult);

    return bulkResult;
  } catch (error) {
    console.error('❌ Error in bulk resolution:', error);
    return { success: false, error: error.message };
  }
};

// Example of points validation
export const demonstratePointsValidation = async () => {
  try {
    console.log('🔍 Demonstrating points validation...');

    // Example: Validate QR code scan action
    const isValidQRScan = await PointsService.validateAction('scan-recycle', {
      qrCode: 'QR123456789',
      location: 'Central Park',
      timestamp: new Date().toISOString()
    });

    console.log('QR Scan validation result:', isValidQRScan);

    // Example: Get current user points
    const currentPoints = await PointsService.getCurrentPoints();
    console.log('Current user points:', currentPoints);

    // Example: Get points history
    const pointsHistory = await PointsService.getPointsHistory();
    console.log('Points history:', pointsHistory);

    return {
      isValidQRScan,
      currentPoints,
      pointsHistory
    };
  } catch (error) {
    console.error('❌ Error in points validation:', error);
    return { success: false, error: error.message };
  }
};

// Example of audit report generation
export const demonstrateAuditReporting = async () => {
  try {
    console.log('📊 Generating audit report...');

    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago
    const endDate = new Date().toISOString();

    const auditReport = await AuditService.generateAuditReport(startDate, endDate);
    console.log('📋 Audit report generated:', auditReport);

    // Export audit data as CSV
    const csvData = await AuditService.exportAuditData(startDate, endDate, 'csv');
    console.log('📄 CSV export sample:', csvData.substring(0, 200) + '...');

    return {
      report: auditReport,
      csvData: csvData
    };
  } catch (error) {
    console.error('❌ Error generating audit report:', error);
    return { success: false, error: error.message };
  }
};

// Complete workflow demonstration
export const runCompleteWorkflowDemo = async () => {
  console.log('🚀 Starting complete incident resolution workflow demonstration...\n');

  try {
    // Step 1: Single incident resolution
    console.log('='.repeat(50));
    console.log('STEP 1: Single Incident Resolution');
    console.log('='.repeat(50));
    const singleResolution = await demonstrateIncidentResolution();
    console.log('Single resolution result:', singleResolution.success ? '✅ SUCCESS' : '❌ FAILED');

    // Step 2: Bulk incident resolution
    console.log('\n' + '='.repeat(50));
    console.log('STEP 2: Bulk Incident Resolution');
    console.log('='.repeat(50));
    const bulkResolution = await demonstrateBulkResolution();
    console.log('Bulk resolution result:', bulkResolution.success ? '✅ SUCCESS' : '❌ FAILED');

    // Step 3: Points validation
    console.log('\n' + '='.repeat(50));
    console.log('STEP 3: Points Validation');
    console.log('='.repeat(50));
    const pointsValidation = await demonstratePointsValidation();
    console.log('Points validation result:', pointsValidation.success !== false ? '✅ SUCCESS' : '❌ FAILED');

    // Step 4: Audit reporting
    console.log('\n' + '='.repeat(50));
    console.log('STEP 4: Audit Reporting');
    console.log('='.repeat(50));
    const auditReporting = await demonstrateAuditReporting();
    console.log('Audit reporting result:', auditReporting.success !== false ? '✅ SUCCESS' : '❌ FAILED');

    console.log('\n🎉 Complete workflow demonstration finished!');
    
    return {
      singleResolution,
      bulkResolution,
      pointsValidation,
      auditReporting,
      overallSuccess: true
    };

  } catch (error) {
    console.error('❌ Workflow demonstration failed:', error);
    return {
      overallSuccess: false,
      error: error.message
    };
  }
};

// React hook for easy component integration
export const useIncidentResolution = () => {
  const toast = useToast();

  const resolveIncident = async (incidentId, resolutionData) => {
    try {
      const result = await IncidentResolutionService.resolveIncident(incidentId, resolutionData);
      
      toast.success(
        `Incident resolved! User awarded ${result.pointsAwarded} points.`,
        7000
      );

      return result;
    } catch (error) {
      toast.error(`Failed to resolve incident: ${error.message}`);
      throw error;
    }
  };

  const bulkResolveIncidents = async (incidentIds, resolutionData) => {
    try {
      const result = await IncidentResolutionService.bulkResolveIncidents(incidentIds, resolutionData);
      
      toast.success(
        `Bulk resolution completed! ${result.resolved} incidents resolved.`,
        7000
      );

      if (result.failed > 0) {
        toast.warning(`${result.failed} incidents failed to resolve. Check console for details.`);
      }

      return result;
    } catch (error) {
      toast.error(`Bulk resolution failed: ${error.message}`);
      throw error;
    }
  };

  const generatePerformanceReport = async (dateRange) => {
    try {
      const report = await IncidentResolutionService.generatePerformanceReport(dateRange);
      toast.success('Performance report generated successfully!');
      return report;
    } catch (error) {
      toast.error(`Failed to generate report: ${error.message}`);
      throw error;
    }
  };

  return {
    resolveIncident,
    bulkResolveIncidents,
    generatePerformanceReport
  };
};

// Export all examples
export default {
  demonstrateIncidentResolution,
  demonstrateBulkResolution,
  demonstratePointsValidation,
  demonstrateAuditReporting,
  runCompleteWorkflowDemo,
  useIncidentResolution
}; 