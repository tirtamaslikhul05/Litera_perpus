// src/views/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogIn, Lock, Eye, EyeOff, IdCard, ShieldCheck } from 'lucide-react';
import AuthService from '../core/services/AuthService';
import useAuth from '../../hooks/useAuth';   // optional, jika pakai custom hook

export default function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth(); // atau langsung pakai AuthService

  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (nisn.length !== 10) {
      setError('NISN harus tepat 10 digit angka!');
      return;
    }

    try {
      setIsLoading(true);
      
      await AuthService.login(nisn, password);   // pakai service baru
      
      const role = AuthService.getRole();
      
      // Redirect berdasarkan role
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'NISN atau password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7fa] px-4 font-sans text-[#1e293b]">
      
      <div className="absolute top-4 right-4 group">
        <Link to="/admin/login" className="flex items-center justify-center w-10 h-10 bg-white hover:bg-[#0c3966] text-gray-500 hover:text-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300">
          <ShieldCheck className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 bg-[#0c3966] rounded-xl flex items-center justify-center shadow-md mb-2">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">Sistem Perpustakaan Digital</p>
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6 text-left">Masuk ke Litera</h2>

        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
                onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                placeholder="Masukkan 10 digit NISN"
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966] focus:ring-1 focus:ring-[#0c3966]"
                required
              />
            </div>
          </div>

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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

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