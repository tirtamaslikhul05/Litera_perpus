import { useState, useEffect, useCallback } from 'react';

export default function useFetch(serviceMethod, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    serviceMethod()
      .then((response) => {
        if (isMounted) setData(response);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Gagal memuat data dari API.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  return { data, loading, error, refresh: executeFetch, setData };
}