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
          
        {/* ================= FALLBACK REDIRECTS ================= */}
        {/* Menggunakan fungsi logika penentu peran agar tidak salah lempar halaman */}
        <Route path="/" element={<RedirectBasedOnRole />} />
        <Route path="*" element={<RedirectBasedOnRole />} />

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
        <Route 
          path="/catalog/reader/:bookId" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <BookReader />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/bookshelf" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <Bookshelf />
            </ProtectedRoute>
          } 
        />

        {/* Status Administrasi Finansial & Denda */}
        <Route 
          path="/fines/fines-status" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <FinesStatus />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fines/return-status" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <ReturnStatus />
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