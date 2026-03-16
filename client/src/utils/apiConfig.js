const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

export const API_ENDPOINTS = {
  AUTH: {
    ME: `${API_URL}/api/auth/me`,
    LOGIN: `${API_URL}/api/auth/login`,
    SIGNUP: `${API_URL}/api/auth/signup`,
  },
  CONTACT: `${API_URL}/api/contact`,
  ADMIN: {
    STATS: `${API_URL}/api/admin/stats`,
  }
};

export default API_URL;
