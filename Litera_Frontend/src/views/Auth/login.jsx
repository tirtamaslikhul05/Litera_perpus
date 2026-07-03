// src/views/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { BookOpen, LogIn, Lock, Eye, EyeOff, IdCard, Mail } from 'lucide-react';
import AuthService from '../../core/services/AuthService';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading: authLoading } = useAuth();

  // If URL has ?role=admin, pre-select admin tab (from /admin/login redirect)
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'siswa';
  const [role, setRole] = useState(initialRole); // 'siswa' | 'admin'

  // Siswa-specific fields
  const [nisn, setNisn] = useState('');

  // Admin-specific fields
  const [email, setEmail] = useState('');

  // Common fields
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // === Validation based on role ===
    if (role === 'siswa') {
      if (!nisn) {
        setError('NISN tidak boleh kosong!');
        return;
      }
      if (!/^\d{10}$/.test(nisn)) {
        setError('NISN harus tepat 10 digit angka!');
        return;
      }
    } else {
      // Admin mode
      if (!email) {
        setError('Email admin tidak boleh kosong!');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Masukkan format email yang valid!');
        return;
      }
    }

    if (!password) {
      setError('Password tidak boleh kosong!');
      return;
    }

    const loginId = role === 'siswa' ? nisn : email;

    try {
      setIsLoading(true);

      await AuthService.login(loginId, password);

      const userRole = AuthService.getRole();

      // Redirect berdasarkan role yang didapat dari token
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7fa] px-4 font-sans text-[#1e293b]">
      {/* Branding */}
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 bg-[#0c3966] rounded-xl flex items-center justify-center shadow-md mb-2">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">Sistem Perpustakaan Digital</p>
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6 text-left">Masuk ke Litera</h2>

        {/* ===== ROLE TOGGLE / SLIDER ===== */}
        <div className="bg-gray-100 rounded-lg p-1 flex mb-6">
          <button
            type="button"
            onClick={() => setRole('siswa')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${role === 'siswa'
                ? 'bg-white text-[#0c3966] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Siswa
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${role === 'admin'
                ? 'bg-white text-[#0c3966] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Admin
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* ===== ROLE-SPECIFIC INPUTS ===== */}
          {role === 'siswa' ? (
            /* ——— SISWA: NISN Field ——— */
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">NISN</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <IdCard className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  maxLength={10}
                  value={nisn}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNisn(cleaned);
                  }}
                  placeholder="Masukkan 10 digit NISN"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966] focus:ring-1 focus:ring-[#0c3966]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          ) : (
            /* ——— ADMIN: Email Field ——— */
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Email Admin</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sekolah.sch.id"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966] focus:ring-1 focus:ring-[#0c3966]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* ===== PASSWORD FIELD (shared) ===== */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 block">Password</label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966] focus:ring-1 focus:ring-[#0c3966]"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ===== SUBMIT BUTTON ===== */}
          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memproses...
              </span>
            ) : (
              <>
                {role === 'admin' ? 'Masuk sebagai Admin' : 'Masuk'}
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* ===== REGISTER LINK ===== */}
        <div className="mt-8 text-center text-xs font-medium text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#0c3966] font-bold hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
