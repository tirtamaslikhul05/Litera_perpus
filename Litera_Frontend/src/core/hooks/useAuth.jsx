import { useState, useCallback } from 'react';
import AuthService from '../core/services/AuthService';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (nisn, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.login(nisn, password);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, nisn, password) => {
    setLoading(true);
    setError(null);
    try {
      return await AuthService.register(name, nisn, password);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
  }, []);

  return { login, register, logout, loading, error };
}