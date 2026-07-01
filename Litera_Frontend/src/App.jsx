import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen Proteksi / Guard Sesi
import ProtectedRoute from './components/Protection/ProtectedRoute';

// Import Seluruh Halaman Views (Sesuai Struktur Folder Modul)
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import Overview from './views/Dashboard/Overview';
import Search from './views/Catalog/Search';
import Bookshelf from './views/Catalog/Bookshelf';
import BookDetail from './views/Catalog/BookDetail';
import BookReader from './views/Catalog/BookReader';
import FinesStatus from './views/Fines/FineStatus';
import ReturnStatus from './views/Fines/ReturnStatus';
import UserProfile from './views/Profile/UserProfile';

// Admin Views
import LoginAdmin from './views/Admin/LoginAdmin';
import RegisterAdmin from './views/Admin/RegisterAdmin';
import DashboardAdmin from './views/Admin/DashboardAdmin';
import ManageBooks from './views/Admin/ManageBooks';
import ManageStudents from './views/Admin/ManageStudents';
import BookReturns from './views/Admin/BookReturns';
import ManageFines from './views/Admin/ManageFines';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/register" element={<RegisterAdmin />} />

        {/* ================= PROTECTED ROUTES (SISWA) ================= */}
        {/* Beranda Utama Aplikasi */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <Overview />
            </ProtectedRoute>
          } 
        />

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

        {/* Manajemen Akun & Kartu Anggota Digital */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <UserProfile />
            </ProtectedRoute>
          } 
        />

        {/* ================= PROTECTED ROUTES (ADMIN) ================= */}
        {/* 1. Modul Kelola & Tambah Siswa */}
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ManageStudents />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* 2. Modul Pengelolaan Buku */}
        <Route 
          path="/admin/books" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ManageBooks />
            </ProtectedRoute>
          } 
        />

        {/* 3. Modul Pengembalian Buku & Sistem Denda */}
        <Route 
          path="/admin/returns" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <BookReturns />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/fines" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ManageFines />
            </ProtectedRoute>
          } 
        />

        {/* ================= FALLBACK REDIRECTS ================= */}
        {/* Menggunakan fungsi logika penentu peran agar tidak salah lempar halaman */}
        <Route path="/" element={<RedirectBasedOnRole />} />
        <Route path="*" element={<RedirectBasedOnRole />} />
      </Routes>
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

  return userRole === 'Admin' 
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="" replace />;
}