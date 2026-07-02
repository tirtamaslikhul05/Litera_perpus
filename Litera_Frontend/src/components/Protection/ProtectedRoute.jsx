// src/components/Protection/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/login');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('litera_token');
      const role = localStorage.getItem('litera_role');

      if (!token) {
        setRedirectPath('/login');
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        // Optional: Validasi ke server
        // const roleRes = await AuthService.getCurrentRole(); 

        if (allowedRoles && !allowedRoles.includes(role)) {
          // Redirect sesuai role
          setRedirectPath(role === 'Admin' ? '/admin/dashboard' : '/dashboard');
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.clear();
        setRedirectPath('/login');
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}