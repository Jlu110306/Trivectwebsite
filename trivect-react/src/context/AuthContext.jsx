import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from './api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'trivect_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setUser(null); setLoading(false); return; }
    const { ok, data } = await api('/profile');
    if (ok) setUser(data.user);
    else { localStorage.removeItem(TOKEN_KEY); setUser(null); }
    setLoading(false);
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    const { ok, data } = await api('/login', 'POST', { email, password });
    if (ok) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
    }
    return { ok, error: data?.error };
  };

  const register = async (name, email, password) => {
    const { ok, data } = await api('/register', 'POST', { name, email, password });
    if (ok) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
    }
    return { ok, error: data?.error };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateProfile = async (body) => {
    const { ok, data } = await api('/profile', 'PUT', body);
    if (ok) setUser(data.user);
    return { ok, error: data?.error };
  };

  const uploadAvatar = async (imageDataUrl) => {
    const { ok, data } = await api('/avatar', 'POST', { image: imageDataUrl });
    if (ok && data?.user) setUser(data.user);
    return { ok, data, error: data?.error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
