// Incident Resolution Service - Handles complete workflow for resolving incidents
import AuthService from '../utils/auth';
import PointsService from './pointsService';
import { useToast } from '../components/common/Toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class IncidentResolutionService {
  constructor() {
    this.resolutionRewards = {
      'full': 15,      // Points for reporting full bin (resolved)
      'damaged': 20,   // Points for reporting damaged bin (resolved)
      'hazardous': 25, // Points for reporting hazardous waste (resolved)
      'emergency': 30  // Points for emergency incidents (resolved)
    };
    
    this.bonusMultipliers = {
      'urgent': 1.5,      // 50% bonus for urgent incidents
      'verified': 1.25,   // 25% bonus for verified with photo
      'accurate': 1.2     // 20% bonus for accurate location
    };
  }

  // Resolve incident and credit points (Admin function)
  async resolveIncident(incidentId, resolutionData = {}) {
    try {
      if (!AuthService.isAdmin()) {
        throw new Error('Only administrators can resolve incidents');
      }

      // Step 1: Get incident details
      const incident = await this.getIncidentDetails(incidentId);
      if (!incident) {
        throw new Error('Incident not found');
      }

      if (incident.status === 'Resolved') {
        throw new Error('Incident is already resolved');
      }

      // Step 2: Update incident status
      const resolvedIncident = await this.updateIncidentStatus(incidentId, {
        status: 'Resolved',
        resolvedBy: AuthService.getCurrentUser().id,
        resolvedAt: new Date().toISOString(),
        resolutionNotes: resolutionData.notes || '',
        resolutionType: resolutionData.type || 'completed',
        verificationPhoto: resolutionData.verificationPhoto || null
      });

      // Step 3: Calculate and award points
      const pointsAwarded = await this.awardResolutionPoints(incident, resolutionData);

      // Step 4: Create audit trail
      await this.createAuditTrail(incident, resolvedIncident, pointsAwarded);

      // Step 5: Notify user
      await this.notifyUserOfResolution(incident, pointsAwarded);

      // Step 6: Update municipal dashboard stats
      await this.updateDashboardStats(incident);

      return {
        success: true,
        incident: resolvedIncident,
        pointsAwarded,
        message: `Incident ${incidentId} resolved successfully. User awarded ${pointsAwarded} points.`
      };

    } catch (error) {
      console.error('Error resolving incident:', error);
      throw error;
    }
  }

  // Get detailed incident information
  async getIncidentDetails(incidentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incident details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching incident details:', error);
      throw error;
    }
  }

  // Update incident status in backend
  async updateIncidentStatus(incidentId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}`, {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update incident status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating incident status:', error);
      throw error;
    }
  }

  // Calculate and award points for resolved incident
  async awardResolutionPoints(incident, resolutionData) {
    try {
      // Base points for incident type
      let basePoints = this.resolutionRewards[incident.type] || 15;
      
      // Calculate bonus multipliers
      let totalMultiplier = 1.0;
      
      // Urgent bonus
      if (incident.priority === 'urgent' || incident.status === 'Escalated') {
        totalMultiplier *= this.bonusMultipliers.urgent;
      }
      
      // Photo verification bonus
      if (incident.photo) {
        totalMultiplier *= this.bonusMultipliers.verified;
      }
      
      // Location accuracy bonus (if GPS coordinates provided)
      if (incident.coordinates) {
        totalMultiplier *= this.bonusMultipliers.accurate;
      }
      
      // Quick resolution bonus (resolved within 24 hours)
      const reportTime = new Date(incident.timestamp);
      const resolveTime = new Date();
      const hoursToResolve = (resolveTime - reportTime) / (1000 * 60 * 60);
      
      if (hoursToResolve <= 24) {
        totalMultiplier *= 1.1; // 10% bonus for quick resolution
      }

      // Calculate final points
      const finalPoints = Math.round(basePoints * totalMultiplier);

      // Award points through secure service
      const pointsResult = await PointsService.earnPoints({
        id: 'incident-resolution',
        points: finalPoints,
        data: {
          incidentId: incident.id,
          incidentType: incident.type,
          basePoints,
          multiplier: totalMultiplier,
          bonusReasons: this.getBonusReasons(incident, hoursToResolve)
        }
      });

      return finalPoints;
    } catch (error) {
      console.error('Error awarding resolution points:', error);
      throw error;
    }
  }

  // Get bonus reasons for transparency
  getBonusReasons(incident, hoursToResolve) {
    const reasons = [];
    
    if (incident.priority === 'urgent' || incident.status === 'Escalated') {
      reasons.push('Urgent incident (+50%)');
    }
    
    if (incident.photo) {
      reasons.push('Photo verification (+25%)');
    }
    
    if (incident.coordinates) {
      reasons.push('GPS location provided (+20%)');
    }
    
    if (hoursToResolve <= 24) {
      reasons.push('Quick resolution (+10%)');
    }
    
    return reasons;
  }

  // Create audit trail for incident resolution
  async createAuditTrail(originalIncident, resolvedIncident, pointsAwarded) {
    try {
      const auditData = {
        action: 'INCIDENT_RESOLVED',
        incidentId: originalIncident.id,
        adminId: AuthService.getCurrentUser().id,
        userId: originalIncident.reportedBy,
        timestamp: new Date().toISOString(),
        changes: {
          status: {
            from: originalIncident.status,
            to: 'Resolved'
          },
          pointsAwarded,
          resolutionTime: resolvedIncident.resolvedAt
        },
        metadata: {
          incidentType: originalIncident.type,
          location: originalIncident.location,
          resolutionNotes: resolvedIncident.resolutionNotes
        }
      };

      const response = await fetch(`${API_BASE_URL}/audit/log`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(auditData),
      });

      if (!response.ok) {
        console.warn('Failed to create audit trail');
      }
    } catch (error) {
      console.error('Error creating audit trail:', error);
    }
  }

  // Notify user of incident resolution
  async notifyUserOfResolution(incident, pointsAwarded) {
    try {
      const notificationData = {
        userId: incident.reportedBy,
        type: 'INCIDENT_RESOLVED',
        title: 'Incident Resolved - Points Awarded!',
        message: `Your report (${incident.id}) has been resolved. You've earned ${pointsAwarded} points for helping keep our community clean!`,
        data: {
          incidentId: incident.id,
          pointsAwarded,
          incidentType: incident.type,
          location: incident.location
        },
        priority: 'normal',
        channels: ['in-app', 'email', 'push']
      };

      const response = await fetch(`${API_BASE_URL}/notifications/send`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        console.warn('Failed to send user notification');
      }
    } catch (error) {
      console.error('Error sending user notification:', error);
    }
  }

  // Update municipal dashboard statistics
  async updateDashboardStats(incident) {
    try {
      const statsUpdate = {
        incidentResolved: 1,
        incidentType: incident.type,
        location: incident.location,
        resolutionTime: new Date().toISOString(),
        reportTime: incident.timestamp
      };

      const response = await fetch(`${API_BASE_URL}/dashboard/stats/update`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(statsUpdate),
      });

      if (!response.ok) {
        console.warn('Failed to update dashboard stats');
      }
    } catch (error) {
      console.error('Error updating dashboard stats:', error);
    }
  }

  // Bulk resolve multiple incidents
  async bulkResolveIncidents(incidentIds, resolutionData = {}) {
    try {
      if (!AuthService.isAdmin()) {
        throw new Error('Only administrators can bulk resolve incidents');
      }

      const results = [];
      const errors = [];

      for (const incidentId of incidentIds) {
        try {
          const result = await this.resolveIncident(incidentId, resolutionData);
          results.push(result);
        } catch (error) {
          errors.push({ incidentId, error: error.message });
        }
      }

      return {
        success: results.length > 0,
        resolved: results.length,
        failed: errors.length,
        results,
        errors
      };
    } catch (error) {
      console.error('Error in bulk resolution:', error);
      throw error;
    }
  }

  // Get resolution history for reporting
  async getResolutionHistory(filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        status: 'Resolved'
      });

      const response = await fetch(`${API_BASE_URL}/incidents/history?${queryParams}`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resolution history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching resolution history:', error);
      throw error;
    }
  }

  // Generate resolution performance report
  async generatePerformanceReport(dateRange = {}) {
    try {
      const { startDate, endDate } = dateRange;
      const queryParams = new URLSearchParams();
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/reports/resolution-performance?${queryParams}`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to generate performance report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw error;
    }
  }
}

export default new IncidentResolutionService(); 