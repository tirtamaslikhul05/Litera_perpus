import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen Proteksi / Guard Sesi
import ProtectedRoute from './components/Protection/ProtectedRoute';

// Import Seluruh Halaman Views (Sesuai Struktur Folder Modul)
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/*dashboard route*/}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['Siswa']}>
            <Dashboard />
          </ProtectedRoute>} />
      </Routes>

      {/* Eksplorasi & Sirkulasi Buku */}
        <Route 
          path="/catalog/search" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <Search />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/catalog/book/:bookId" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <BookDetail />
            </ProtectedRoute>
          } 
        />
    </Router>
  );
}

// Fungsi internal penentu arah halaman berdasarkan role token aktif
function RedirectBasedOnRole() {
  const token = localStorage.getItem('litera_token');
  const userRole = localStorage.getItem('litera_role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

}