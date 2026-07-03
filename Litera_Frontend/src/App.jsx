import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen Proteksi / Guard Sesi
import ProtectedRoute from './components/Protection/ProtectedRoute';

// Import Seluruh Halaman Views (Sesuai Struktur Folder Modul)
import Login from './views/Auth/login';
import Register from './views/Auth/register';
import Overview from './views/Dashboard/Overview';
import Search from './views/Catalog/Search';
import BookShelf from './views/Catalog/BookShelf';
import BookDetail from './views/Catalog/BookDetail';
import BookReader from './views/Catalog/BookReader';
import FinesStatus from './views/Fines/FineStatus';
import ReturnStatus from './views/Fines/ReturnStatus';
import UserProfile from './views/Profile/UserProfile';

// Admin Views
import LoginAdmin from './views/Admin/LoginAdmin';
import RegisterAdmin from './views/Admin/RegisterAdmin';
import DashboardAdmin from './views/Admin/DashboardAdmin';
import ManageBook from './views/Admin/ManageBook';
import ManageStudent from './views/Admin/ManageStudent';
import BookReturns from './views/Admin/BookReturns';
import ManageFinnes from './views/Admin/ManageFinnes';
import ManageLoans from './views/Admin/ManageLoans';

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
            <ProtectedRoute allowedRoles={['siswa']}>
              <Overview />
            </ProtectedRoute>
          }
        />

        {/* Eksplorasi & Sirkulasi Buku */}
        <Route
          path="/catalog/search"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog/book/:bookId"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <BookDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog/reader/:bookId"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <BookReader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookshelf"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <BookShelf />
            </ProtectedRoute>
          }
        />

        {/* Status Administrasi Finansial & Denda */}
        <Route
          path="/fines/fines-status"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <FinesStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fines/return-status"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <ReturnStatus />
            </ProtectedRoute>
          }
        />

        {/* Manajemen Akun & Kartu Anggota Digital */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= PROTECTED ROUTES (ADMIN) ================= */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        {/* Modul Pengelolaan Buku */}
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageBook />
            </ProtectedRoute>
          }
        />

        {/* Modul Pengembalian Buku & Sistem Denda */}
        <Route
          path="/admin/returns"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BookReturns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/loans"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageLoans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/fines"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageFinnes />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK REDIRECTS ================= */}
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

  return userRole === 'admin'
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/dashboard" replace />;
}
