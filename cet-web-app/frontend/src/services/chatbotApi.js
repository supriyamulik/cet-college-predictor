// D:\CET_Prediction\cet-web-app\frontend\src\services\chatbotApi.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CHATBOT_API_URL = `${API_BASE_URL}/chatbot`;

/**
 * Get authorization token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

/**
 * Create headers for API requests
 */
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || `${response.status} ${response.statusText}: ${JSON.stringify(data)}`);
  }

  return data;
};

/**
 * Check chatbot service health
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/health`, {
      method: 'GET',
      headers: createHeaders(false),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

/**
 * Get initial greeting message
 * @returns {Promise<Object>} Greeting message
 */
export const getGreeting = async () => {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/greeting`, {
      method: 'GET',
      headers: createHeaders(false),
    });

    const data = await handleResponse(response);
    
    // ✅ FIX: Handle both 'greeting' and 'message' fields
    return {
      ...data,
      message: data.greeting || data.message
    };
  } catch (error) {
    console.error('Failed to get greeting:', error);
    throw error;
  }
};

/**
 * Get quick reply suggestions
 * @returns {Promise<Object>} Quick reply options
 */
export const getQuickReplies = async () => {
  try {
    const response = await fetch(`${CHATBOT_API_URL}/quick-replies`, {
      method: 'GET',
      headers: createHeaders(false),
    });

    const data = await handleResponse(response);
    
    // ✅ FIX: Normalize the response format
    return {
      ...data,
      replies: data.quickReplies || data.replies || []
    };
  } catch (error) {
    console.error('Failed to get quick replies:', error);
    throw error;
  }
};

/**
 * Send a chat message and get AI response
 * @param {string} message - User's message
 * @param {Array} history - Conversation history
 * @returns {Promise<Object>} AI response
 */
export const sendMessage = async (message, history = []) => {
  try {
    // ✅ FIX: Generate session ID if not exists
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', sessionId);
    }

    const response = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({
        message: message.trim(),
        history: history,
        sessionId: sessionId
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to send message:', error);
    
    // Return user-friendly error
    if (error.message.includes('Rate limit')) {
      throw new Error('Too many messages. Please wait a moment before sending another message.');
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    } else if (error.message.includes('503') || error.message.includes('unavailable')) {
      throw new Error('Chatbot service is unavailable. Please check if GEMINI_API_KEY is configured.');
    } else {
      throw new Error('Failed to get response. Please try again.');
    }
  }
};

/**
 * Clear conversation
 * @returns {Promise<Object>} Success response
 */
export const clearConversation = async () => {
  try {
    // ✅ FIX: Get session ID and send in body
    let sessionId = localStorage.getItem('chatSessionId');
    
    const response = await fetch(`${CHATBOT_API_URL}/clear`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ 
        sessionId: sessionId || 'default' 
      }), // ✅ FIX: Send JSON body
    });

    const data = await handleResponse(response);
    
    // Clear session ID
    localStorage.removeItem('chatSessionId');
    
    return data;
  } catch (error) {
    console.error('Failed to clear conversation:', error);
    // Even if API call fails, we can still clear locally
    localStorage.removeItem('chatSessionId');
    return { success: true, message: 'Conversation cleared locally' };
  }
};

/**
 * Utility function to format conversation history for API
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Array} Formatted history for API
 */
export const formatHistoryForAPI = (messages) => {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};

/**
 * Validate message before sending
 * @param {string} message - Message to validate
 * @returns {Object} Validation result { isValid: boolean, error: string }
 */
export const validateMessage = (message) => {
  if (!message || !message.trim()) {
    return {
      isValid: false,
      error: 'Message cannot be empty'
    };
  }

  if (message.length > 1000) {
    return {
      isValid: false,
      error: 'Message is too long. Please keep it under 1000 characters.'
    };
  }

  // Check for potential spam patterns
  const spamPatterns = ['http://', 'https://', 'www.'];
  if (spamPatterns.some(pattern => message.toLowerCase().includes(pattern))) {
    return {
      isValid: false,
      error: 'Please do not include URLs in your message'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Export all API functions as default object
 */
const chatbotApi = {
  checkHealth,
  getGreeting,
  getQuickReplies,
  sendMessage,
  clearConversation,
  formatHistoryForAPI,
  validateMessage,
};

export default chatbotApi;