// Secure points management service
import AuthService from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class PointsService {
  // Earn points with backend validation
  async earnPoints(action) {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/points/earn`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({
          actionType: action.id,
          actionData: action.data || {},
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to earn points');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error earning points:', error);
      throw error;
    }
  }

  // Redeem voucher with backend validation
  async redeemVoucher(voucherId) {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/points/redeem`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({
          voucherId,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to redeem voucher');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      throw error;
    }
  }

  // Get user's current points from backend
  async getCurrentPoints() {
    try {
      if (!AuthService.isAuthenticated()) {
        return 0;
      }

      const response = await fetch(`${API_BASE_URL}/points/balance`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch points balance');
      }

      const { points } = await response.json();
      return points;
    } catch (error) {
      console.error('Error fetching points:', error);
      return 0;
    }
  }

  // Get points history
  async getPointsHistory() {
    try {
      if (!AuthService.isAuthenticated()) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/points/history`, {
        headers: AuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch points history');
      }

      const { history } = await response.json();
      return history;
    } catch (error) {
      console.error('Error fetching points history:', error);
      return [];
    }
  }

  // Validate action eligibility (e.g., prevent duplicate QR scans)
  async validateAction(actionType, actionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/points/validate`, {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({
          actionType,
          actionData
        }),
      });

      if (!response.ok) {
        return false;
      }

      const { valid } = await response.json();
      return valid;
    } catch (error) {
      console.error('Error validating action:', error);
      return false;
    }
  }
}

export default new PointsService(); 