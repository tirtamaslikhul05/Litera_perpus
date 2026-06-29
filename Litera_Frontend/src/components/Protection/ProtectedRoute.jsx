import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('litera_token');
  const tokenExpiry = localStorage.getItem('litera_token_expiry');
  const userRole = localStorage.getItem('litera_role'); // Menyimpan 'Admin' atau 'Siswa'
  const now = new Date().getTime();

  // 1. Validasi keberadaan token dan cek apakah token expired
  if (!token || !tokenExpiry || now > parseInt(tokenExpiry)) {
    // Sesi habis atau tidak valid, bersihkan sisa penyimpanan lokal
    localStorage.removeItem('litera_token');
    localStorage.removeItem('litera_token_expiry');
    localStorage.removeItem('litera_role');
    return <Navigate to="/login" replace />;
  }
  return children;
}