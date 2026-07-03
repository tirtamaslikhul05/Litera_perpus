// src/hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react';

export default function useFetch(serviceMethod, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async () => {
    let isMounted = true;
    
    setLoading(true);
    setError(null);

    try {
      const response = await serviceMethod();
      
      // Always return full response object — pages use response?.data consistently
      if (isMounted) setData(response);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Gagal memuat data dari server';
      
      console.error('useFetch error:', errorMessage);
      if (isMounted) setError(errorMessage);
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, dependencies);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  const refresh = useCallback(() => {
    executeFetch();
  }, [executeFetch]);

  return { 
    data, 
    loading, 
    error, 
    refresh, 
    setData 
  };
}