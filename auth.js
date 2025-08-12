// Authentication utility for secure user management
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = this.token ? this.decodeToken(this.token) : null;
  }

  // Secure login with backend validation
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const { token, user } = await response.json();
      
      localStorage.setItem('authToken', token);
      this.token = token;
      this.user = user;
      
      return user;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  // Secure logout
  logout() {
    localStorage.removeItem('authToken');
    this.token = null;
    this.user = null;
  }

  // Validate token and decode user info
  decodeToken(token) {
    try {
      const decoded = jwtDecode(token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }
      
      return decoded;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.token && this.user && this.user.exp * 1000 > Date.now();
  }

  // Check if user has admin role
  isAdmin() {
    return this.isAuthenticated() && this.user.role === 'admin';
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }
}

export default new AuthService(); 