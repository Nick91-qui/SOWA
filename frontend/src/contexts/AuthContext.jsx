import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    if (token) {
      // Optionally, validate token with backend here
      // For now, assume token is valid and decode user info if needed
      // Or fetch user info from a protected endpoint
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const register = async (nome, email, senha, tipo) => {
    const response = await axios.post(`${API_URL}/auth/register`, { nome, email, senha, tipo });
    const { access_token } = response.data;
    setToken(access_token);
    localStorage.setItem('token', access_token);
    // In a real app, you'd decode the token or fetch user data
    // For simplicity, we'll just set a dummy user object for now
    setUser({ nome, email, tipo });
    localStorage.setItem('user', JSON.stringify({ nome, email, tipo }));
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/token`, 
      new URLSearchParams({
        username: email,
        password: password
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    const { access_token } = response.data;
    setToken(access_token);
    localStorage.setItem('token', access_token);
    // Fetch user details after successful login
    const userResponse = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    setUser(userResponse.data);
    localStorage.setItem('user', JSON.stringify(userResponse.data));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);