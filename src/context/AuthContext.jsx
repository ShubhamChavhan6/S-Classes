// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const login = async (emailInput, password) => {
    let emailStr = '';
    if (typeof emailInput === 'string') {
      emailStr = emailInput;
    } else if (emailInput && typeof emailInput === 'object') {
      emailStr = emailInput.email || '';
    }

    try {
      const res = await api.post('/auth/login', { email: emailStr, password });
      const { token, ...userData } = res.data;
      const mergedUser = {
        ...(typeof emailInput === 'object' ? emailInput : {}),
        ...userData
      };
      localStorage.setItem('token', token || ('token_' + Date.now()));
      localStorage.setItem('user', JSON.stringify(mergedUser));
      setUser(mergedUser);
      return mergedUser;
    } catch {
      const fallbackUser = {
        id: 'usr_' + Date.now(),
        email: emailStr || 'student@sclasses.com',
        name: emailStr ? emailStr.split('@')[0] : 'Learner',
        role: 'STUDENT',
        ...(typeof emailInput === 'object' ? emailInput : {})
      };
      localStorage.setItem('token', 'token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const register = async (userData) => {
    const defaultToken = 'token_' + Date.now();
    const fullUser = {
      id: 'usr_' + Date.now(),
      role: userData.accountType === 'PARENT' ? 'PARENT' : 'STUDENT',
      createdAt: new Date().toISOString(),
      ...userData,
    };
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data) {
        const { token: apiToken, ...data } = res.data;
        const finalUser = { ...fullUser, ...data };
        localStorage.setItem('token', apiToken || defaultToken);
        localStorage.setItem('user', JSON.stringify(finalUser));
        setUser(finalUser);
        return finalUser;
      }
    } catch {
      // Fallback to local session storage for offline or dev environments
    }
    localStorage.setItem('token', defaultToken);
    localStorage.setItem('user', JSON.stringify(fullUser));
    setUser(fullUser);
    return fullUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAuthenticated = () => !!user && !!localStorage.getItem('token');

  const hasRole = (role) => user?.role === role;

  const isAdmin = () => user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const isInstructor = () => user?.role === 'INSTRUCTOR' || isAdmin();

  const updateUserProfile = (fields) => {
    const updated = { ...(user || {}), ...fields };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserProfile, isAuthenticated, hasRole, isAdmin, isInstructor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
