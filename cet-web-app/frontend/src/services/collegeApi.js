// D:\CET_Prediction\cet-web-app\frontend\src\services\collegeApi.js

import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// College Comparison API functions
export const collegeApi = {
  /**
   * Get all colleges with optional filters
   * @param {Object} filters - Filter options (city, type, branch, category, year)
   * @returns {Promise<Array>} Array of college objects
   */
  getAllColleges: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      const response = await api.get(`/colleges?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }
  },

  /**
   * Search colleges by name with optional filters
   * @param {string} query - Search query string
   * @param {Object} filters - Additional filter options
   * @returns {Promise<Array>} Array of matching colleges
   */
  searchColleges: async (query, filters = {}) => {
    try {
      const params = {
        q: query,
        ...filters
      };
      const response = await api.get('/colleges/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching colleges:', error);
      throw error;
    }
  },

  /**
   * Get specific college details by college code
   * @param {string|number} collegeCode - College code
   * @returns {Promise<Object>} College details
   */
  getCollegeById: async (collegeCode) => {
    try {
      const response = await api.get(`/colleges/${collegeCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching college by ID:', error);
      throw error;
    }
  },

  /**
   * Get cutoff data for a specific college
   * @param {string|number} collegeCode - College code
   * @param {Object} filters - Filter options (branch, category, year)
   * @returns {Promise<Array>} Array of cutoff records
   */
  getCollegeCutoffs: async (collegeCode, filters = {}) => {
    try {
      const response = await api.get(`/colleges/${collegeCode}/cutoffs`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching college cutoffs:', error);
      throw error;
    }
  },

  /**
   * Compare multiple colleges for a specific branch and category
   * @param {Array<string|number>} collegeCodes - Array of college codes
   * @param {string} branch - Branch name
   * @param {string} category - Category code
   * @returns {Promise<Object>} Comparison data grouped by college code
   */
  compareColleges: async (collegeCodes, branch, category) => {
    try {
      const response = await api.post('/colleges/compare', {
        college_codes: collegeCodes,
        branch,
        category
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing colleges:', error);
      throw error;
    }
  },

  /**
   * Get college recommendations based on user rank
   * @param {number} rank - User's rank
   * @param {string} category - Category code
   * @param {Object} preferences - User preferences (city, branch, college_type)
   * @returns {Promise<Array>} Array of recommended colleges
   */
  getRecommendations: async (rank, category, preferences = {}) => {
    try {
      const response = await api.post('/colleges/recommendations', {
        rank,
        category,
        ...preferences
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  /**
   * Get all unique cities from the database
   * @returns {Promise<Array<string>>} Array of city names
   */
  getCities: async () => {
    try {
      const response = await api.get('/colleges/cities');
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  /**
   * Get all unique branches from the database
   * @returns {Promise<Array<string>>} Array of branch names
   */
  getBranches: async () => {
    try {
      const response = await api.get('/colleges/branches');
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  /**
   * Get all unique categories from the database
   * @returns {Promise<Array<string>>} Array of category codes
   */
  getCategories: async () => {
    try {
      const response = await api.get('/colleges/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get cutoff trends for a college over years
   * @param {string|number} collegeCode - College code
   * @param {string} branch - Branch name
   * @param {string} category - Category code
   * @returns {Promise<Array>} Array of trend data by year
   */
  getCutoffTrends: async (collegeCode, branch, category) => {
    try {
      const response = await api.get(`/colleges/${collegeCode}/trends`, {
        params: { branch, category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cutoff trends:', error);
      throw error;
    }
  },

  /**
   * Get statistics for a specific college
   * @param {string|number} collegeCode - College code
   * @returns {Promise<Object>} College statistics
   */
  getCollegeStats: async (collegeCode) => {
    try {
      const response = await api.get(`/colleges/${collegeCode}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching college stats:', error);
      throw error;
    }
  }
};

// Export the axios instance as well for custom requests if needed
export default collegeApi;

// Export API base URL for reference
export { API_BASE_URL };