import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_ENDPOINTS } from '../utils/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(API_ENDPOINTS.AUTH.ME, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    // Special check for Admin credentials
    if (email === 'admin@dsavisualizer.com' && password === 'admin123') {
      const adminUser = {
        email,
        name: 'Admin User',
        role: 'admin',
        id: 'admin-001'
      };
      localStorage.setItem('token', 'mock-admin-token');
      setUser(adminUser);
      return { success: true };
    }

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser({ ...data.user, role: data.user.role || 'user' });
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Could not connect to server. Is it running?' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Could not connect to server. Is it running?' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
