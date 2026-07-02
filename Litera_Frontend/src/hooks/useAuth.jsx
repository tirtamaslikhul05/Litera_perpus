// src/hooks/useAuth.js
import { useState, useCallback } from 'react';
import AuthService from '../core/services/AuthService';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (loginId, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.login(loginId, password);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
  }, []);

  const registerSchool = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      return await AuthService.registerSchool(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    login, 
    logout, 
    registerSchool, 
    loading, 
    error 
  };
}