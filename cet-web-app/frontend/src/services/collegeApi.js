// src/services/collegeApi.js
import axios from 'axios';

// Use Vite's import.meta.env for environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // Increased to 2 minutes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, {
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
    });
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request Timeout:', {
        url: error.config?.url,
        timeout: error.config?.timeout,
        message: 'Server took too long to respond. Check if backend is running and optimized.'
      });
    } else if (error.response) {
      console.error('❌ API Error Response:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ No Response from Server:', {
        url: error.config?.url,
        message: error.message,
        hint: 'Backend server might not be running'
      });
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const collegeApi = {
  // Health check - Use this to test if backend is running
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      console.log('💚 Backend is healthy:', response.data);
      return response.data;
    } catch (error) {
      console.error('💔 Backend health check failed:', error.message);
      throw error;
    }
  },

  // Get all colleges (WITHOUT branch/category filtering)
  getAllColleges: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.type) params.append('type', filters.type);
      // Removed year filter as per requirements
      
      const response = await api.get(`/colleges?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }
  },

  // Search colleges by name
  searchColleges: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams({ q: query });
      if (filters.city) params.append('city', filters.city);
      if (filters.type) params.append('type', filters.type);
      
      const response = await api.get(`/colleges/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching colleges:', error);
      throw error;
    }
  },

  // Get specific college by code
  getCollegeByCode: async (collegeCode) => {
    try {
      const response = await api.get(`/colleges/${collegeCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching college ${collegeCode}:`, error);
      throw error;
    }
  },

  // Get college cutoffs
  getCollegeCutoffs: async (collegeCode, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.category) params.append('category', filters.category);
      if (filters.year) params.append('year', filters.year);
      
      const response = await api.get(`/colleges/${collegeCode}/cutoffs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cutoffs:', error);
      throw error;
    }
  },

  // Compare colleges for specific branch and category
  compareColleges: async (collegeCodes, branch, category) => {
    try {
      console.log('📊 Comparing colleges:', { collegeCodes, branch, category });
      
      const response = await api.post('/colleges/compare', {
        college_codes: collegeCodes,
        branch: branch,
        category: category,
      });
      
      console.log('📊 Comparison result:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error comparing colleges:', error);
      throw error;
    }
  },

  // Get recommendations based on rank
  getRecommendations: async (rank, category, preferences = {}) => {
    try {
      const response = await api.post('/colleges/recommendations', {
        rank,
        category,
        city: preferences.city,
        branch: preferences.branch,
        college_type: preferences.college_type,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  // Get all cities
  getCities: async () => {
    try {
      const response = await api.get('/colleges/cities');
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Get branches for selected colleges
  getBranches: async (collegeCodes = []) => {
    try {
      const params = new URLSearchParams();
      if (collegeCodes.length > 0) {
        params.append('college_codes', collegeCodes.join(','));
      }
      
      const response = await api.get(`/colleges/branches?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  // Get categories for selected colleges and branch
  getCategories: async (collegeCodes = [], branch = null) => {
    try {
      const params = new URLSearchParams();
      if (collegeCodes.length > 0) {
        params.append('college_codes', collegeCodes.join(','));
      }
      if (branch) {
        params.append('branch', branch);
      }
      
      const response = await api.get(`/colleges/categories?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get normalized college types
  getCollegeTypes: async () => {
    try {
      const response = await api.get('/colleges/types');
      return response.data;
    } catch (error) {
      console.error('Error fetching college types:', error);
      throw error;
    }
  },

  // Get cutoff trends
  getCutoffTrends: async (collegeCode, branch, category) => {
    try {
      const params = new URLSearchParams({ branch, category });
      const response = await api.get(`/colleges/${collegeCode}/trends?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  },

  // Get college statistics
  getCollegeStats: async (collegeCode) => {
    try {
      const response = await api.get(`/colleges/${collegeCode}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching college stats:', error);
      throw error;
    }
  },

  // Get trend analysis
  getTrendAnalysis: async (collegeCode, branch, category) => {
    try {
      const params = new URLSearchParams({ branch, category });
      const response = await api.get(`/colleges/${collegeCode}/trend-analysis?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
      throw error;
    }
  },

  // Get category info
  getCategoryInfo: async (categoryCode) => {
    try {
      const response = await api.get(`/categories/${categoryCode}/info`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category info:', error);
      throw error;
    }
  },
};

export default collegeApi;