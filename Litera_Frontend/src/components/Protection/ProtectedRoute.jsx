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

  // 2. Validasi Hak Akses (Role-Based Access Control)
  // Jika rute membutuhkan role spesifik, dan role user saat ini tidak termasuk didalamnya
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Siswa dilarang masuk area Admin, Admin dilarang masuk area Siswa
    const fallbackRedirect = userRole === 'Admin' ? '/admin/books' : '/dashboard';
    return <Navigate to={fallbackRedirect} replace />;
  }

  return children;
}