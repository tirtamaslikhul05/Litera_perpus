// src/views/Admin/LoginAdmin.jsx
// Redirected to unified login page (login.jsx) with role=admin parameter
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login?role=admin', { replace: true });
  }, [navigate]);

  return null;
}
