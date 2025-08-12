// Audit Service - Comprehensive logging and tracking for incident resolution
import AuthService from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AuditService {
  constructor() {
    this.auditActions = {
      INCIDENT_CREATED: 'Incident created',
      INCIDENT_UPDATED: 'Incident updated',
      INCIDENT_ESCALATED: 'Incident escalated',
      INCIDENT_RESOLVED: 'Incident resolved',
      POINTS_AWARDED: 'Points awarded',
      POINTS_REDEEMED: 'Points redeemed',
      USER_LOGIN: 'User logged in',
      ADMIN_ACTION: 'Admin action performed',
      BULK_OPERATION: 'Bulk operation performed'
    };
  }

  // Log incident resolution with full audit trail
  async logIncidentResolution(incidentData, resolutionData, pointsAwarded) {
    try {
      const auditEntry = {
        action: this.auditActions.INCIDENT_RESOLVED,
        actionType: 'INCIDENT_RESOLVED',
        timestamp: new Date().toISOString(),
        performedBy: {
          id: AuthService.getCurrentUser()?.id,
          email: AuthService.getCurrentUser()?.email,
          role: AuthService.getCurrentUser()?.role,
          name: AuthService.getCurrentUser()?.name
        },
        targetEntity: {
          type: 'INCIDENT',
          id: incidentData.id,
          previousState: {
            status: incidentData.status,
            assignedTo: incidentData.assignedTo || null,
            priority: incidentData.priority,
            lastUpdated: incidentData.lastUpdated
          },
          newState: {
            status: 'Resolved',
            resolvedBy: AuthService.getCurrentUser()?.id,
            resolvedAt: new Date().toISOString(),
            resolutionType: resolutionData.type,
            resolutionNotes: resolutionData.notes
          }
        },
        affectedUser: {
          id: incidentData.reportedBy,
          pointsAwarded: pointsAwarded,
          previousPoints: incidentData.reporterCurrentPoints || 0,
          newPoints: (incidentData.reporterCurrentPoints || 0) + pointsAwarded
        },
        metadata: {
          incidentType: incidentData.type,
          location: incidentData.location,
          coordinates: incidentData.coordinates,
          hasPhoto: !!incidentData.photo,
          description: incidentData.description,
          resolutionTimeHours: this.calculateResolutionTime(incidentData.timestamp),
          environment: process.env.NODE_ENV,
          userAgent: navigator.userAgent,
          ipAddress: 'client-side', // Would be captured server-side
          sessionId: this.getSessionId()
        },
        compliance: {
          dataRetentionDays: 2555, // 7 years for compliance
          encryptionStandard: 'AES-256',
          gdprCompliant: true,
          auditCompliant: true
        }
      };

      // Store audit entry
      await this.storeAuditEntry(auditEntry);

      // Log to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Audit Log:', auditEntry);
      }

      return auditEntry;
    } catch (error) {
      console.error('Error logging incident resolution:', error);
      // Audit logging failures should not break the main flow
    }
  }

  // Log points awarded
  async logPointsAwarded(userId, action, pointsAwarded, metadata = {}) {
    try {
      const auditEntry = {
        action: this.auditActions.POINTS_AWARDED,
        actionType: 'POINTS_AWARDED',
        timestamp: new Date().toISOString(),
        performedBy: {
          id: AuthService.getCurrentUser()?.id || 'SYSTEM',
          role: AuthService.getCurrentUser()?.role || 'SYSTEM'
        },
        targetEntity: {
          type: 'USER_POINTS',
          userId: userId,
          action: action,
          pointsAwarded: pointsAwarded,
          previousBalance: metadata.previousBalance || 0,
          newBalance: (metadata.previousBalance || 0) + pointsAwarded
        },
        metadata: {
          ...metadata,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString()
        }
      };

      await this.storeAuditEntry(auditEntry);
      return auditEntry;
    } catch (error) {
      console.error('Error logging points award:', error);
    }
  }

  // Log admin actions
  async logAdminAction(action, targetData, changes = {}) {
    try {
      const auditEntry = {
        action: this.auditActions.ADMIN_ACTION,
        actionType: action,
        timestamp: new Date().toISOString(),
        performedBy: {
          id: AuthService.getCurrentUser()?.id,
          email: AuthService.getCurrentUser()?.email,
          role: AuthService.getCurrentUser()?.role,
          name: AuthService.getCurrentUser()?.name
        },
        targetEntity: targetData,
        changes: changes,
        metadata: {
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId(),
          environment: process.env.NODE_ENV
        },
        compliance: {
          requiresApproval: this.requiresApproval(action),
          sensitivityLevel: this.getSensitivityLevel(action),
          retentionPeriod: this.getRetentionPeriod(action)
        }
      };

      await this.storeAuditEntry(auditEntry);
      return auditEntry;
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }

  // Store audit entry (backend or local storage for demo)
  async storeAuditEntry(auditEntry) {
    try {
      // In production, this would go to a secure audit database
      const response = await fetch(`${API_BASE_URL}/audit/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.token}`
        },
        body: JSON.stringify(auditEntry)
      });

      if (!response.ok) {
        throw new Error('Failed to store audit entry in backend');
      }

      // Also store locally for demo purposes
      await this.storeLocalAuditEntry(auditEntry);
      
      return await response.json();
    } catch (error) {
      console.warn('Backend audit storage failed, using local storage:', error);
      // Fallback to local storage
      await this.storeLocalAuditEntry(auditEntry);
    }
  }

  // Store audit entry locally (fallback)
  async storeLocalAuditEntry(auditEntry) {
    try {
      const existingAudits = JSON.parse(
        localStorage.getItem('auditTrail') || '[]'
      );
      
      existingAudits.unshift(auditEntry);
      
      // Keep only last 1000 entries to prevent storage overflow
      if (existingAudits.length > 1000) {
        existingAudits.splice(1000);
      }
      
      localStorage.setItem('auditTrail', JSON.stringify(existingAudits));
    } catch (error) {
      console.error('Error storing local audit entry:', error);
    }
  }

  // Retrieve audit trail
  async getAuditTrail(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/audit/trail?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${AuthService.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit trail from backend');
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend audit retrieval failed, using local storage:', error);
      return this.getLocalAuditTrail(filters);
    }
  }

  // Get local audit trail (fallback)
  getLocalAuditTrail(filters = {}) {
    try {
      let audits = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      
      // Apply filters
      if (filters.action) {
        audits = audits.filter(audit => audit.actionType === filters.action);
      }
      
      if (filters.userId) {
        audits = audits.filter(audit => 
          audit.performedBy?.id === filters.userId ||
          audit.affectedUser?.id === filters.userId ||
          audit.targetEntity?.userId === filters.userId
        );
      }
      
      if (filters.startDate) {
        audits = audits.filter(audit => 
          new Date(audit.timestamp) >= new Date(filters.startDate)
        );
      }
      
      if (filters.endDate) {
        audits = audits.filter(audit => 
          new Date(audit.timestamp) <= new Date(filters.endDate)
        );
      }
      
      return {
        audits: audits,
        total: audits.length,
        filtered: true
      };
    } catch (error) {
      console.error('Error retrieving local audit trail:', error);
      return { audits: [], total: 0, filtered: false };
    }
  }

  // Generate audit report
  async generateAuditReport(startDate, endDate, format = 'json') {
    try {
      const response = await fetch(`${API_BASE_URL}/audit/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.token}`
        },
        body: JSON.stringify({
          startDate,
          endDate,
          format,
          generatedBy: AuthService.getCurrentUser()?.id,
          generatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audit report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating audit report:', error);
      // Generate local report as fallback
      return this.generateLocalAuditReport(startDate, endDate);
    }
  }

  // Generate local audit report
  generateLocalAuditReport(startDate, endDate) {
    try {
      const auditData = this.getLocalAuditTrail({
        startDate,
        endDate
      });

      const report = {
        generatedAt: new Date().toISOString(),
        generatedBy: AuthService.getCurrentUser()?.id,
        period: {
          startDate,
          endDate
        },
        summary: {
          totalActions: auditData.audits.length,
          incidentsResolved: auditData.audits.filter(a => a.actionType === 'INCIDENT_RESOLVED').length,
          pointsAwarded: auditData.audits
            .filter(a => a.actionType === 'POINTS_AWARDED')
            .reduce((sum, a) => sum + (a.targetEntity?.pointsAwarded || 0), 0),
          adminActions: auditData.audits.filter(a => a.actionType === 'ADMIN_ACTION').length,
          uniqueUsers: [...new Set(auditData.audits.map(a => a.performedBy?.id))].length
        },
        activities: auditData.audits.map(audit => ({
          timestamp: audit.timestamp,
          action: audit.action,
          performedBy: audit.performedBy?.email || audit.performedBy?.id,
          target: audit.targetEntity?.id || audit.targetEntity?.type,
          pointsAwarded: audit.affectedUser?.pointsAwarded || 0
        }))
      };

      return report;
    } catch (error) {
      console.error('Error generating local audit report:', error);
      return null;
    }
  }

  // Helper methods
  calculateResolutionTime(reportTimestamp) {
    const reportTime = new Date(reportTimestamp);
    const resolveTime = new Date();
    return Math.round((resolveTime - reportTime) / (1000 * 60 * 60)); // Hours
  }

  getSessionId() {
    return sessionStorage.getItem('sessionId') || 
           localStorage.getItem('sessionId') || 
           'anonymous-session';
  }

  requiresApproval(action) {
    const approvalRequired = [
      'BULK_DELETE',
      'DATA_EXPORT',
      'USER_ROLE_CHANGE',
      'SYSTEM_CONFIG_CHANGE'
    ];
    return approvalRequired.includes(action);
  }

  getSensitivityLevel(action) {
    const highSensitivity = ['USER_DATA_ACCESS', 'FINANCIAL_TRANSACTION'];
    const mediumSensitivity = ['INCIDENT_RESOLVED', 'POINTS_AWARDED'];
    
    if (highSensitivity.includes(action)) return 'HIGH';
    if (mediumSensitivity.includes(action)) return 'MEDIUM';
    return 'LOW';
  }

  getRetentionPeriod(action) {
    const financialActions = ['POINTS_AWARDED', 'POINTS_REDEEMED'];
    const complianceActions = ['INCIDENT_RESOLVED', 'USER_DATA_ACCESS'];
    
    if (financialActions.includes(action)) return 2555; // 7 years
    if (complianceActions.includes(action)) return 1095; // 3 years
    return 365; // 1 year default
  }

  // Search audit logs
  async searchAuditLogs(searchQuery, filters = {}) {
    try {
      const allAudits = await this.getAuditTrail(filters);
      
      if (!searchQuery) return allAudits;
      
      const searchLower = searchQuery.toLowerCase();
      const filteredAudits = allAudits.audits.filter(audit => 
        JSON.stringify(audit).toLowerCase().includes(searchLower)
      );
      
      return {
        ...allAudits,
        audits: filteredAudits,
        searchQuery,
        searchResults: filteredAudits.length
      };
    } catch (error) {
      console.error('Error searching audit logs:', error);
      return { audits: [], total: 0, error: error.message };
    }
  }

  // Export audit data
  async exportAuditData(startDate, endDate, format = 'csv') {
    try {
      const auditData = await this.getAuditTrail({
        startDate,
        endDate
      });

      if (format === 'csv') {
        return this.convertToCSV(auditData.audits);
      } else if (format === 'json') {
        return JSON.stringify(auditData, null, 2);
      }
      
      return auditData;
    } catch (error) {
      console.error('Error exporting audit data:', error);
      throw error;
    }
  }

  // Convert audit data to CSV
  convertToCSV(audits) {
    if (!audits.length) return '';
    
    const headers = [
      'Timestamp',
      'Action',
      'Performed By',
      'Target Type',
      'Target ID',
      'Points Awarded',
      'Resolution Time (Hours)',
      'Environment'
    ];
    
    const rows = audits.map(audit => [
      audit.timestamp,
      audit.action,
      audit.performedBy?.email || audit.performedBy?.id,
      audit.targetEntity?.type || '',
      audit.targetEntity?.id || '',
      audit.affectedUser?.pointsAwarded || '',
      audit.metadata?.resolutionTimeHours || '',
      audit.metadata?.environment || ''
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}

export default new AuditService(); 