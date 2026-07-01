import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import AdminAuthService from '../../core/services/AdminAuthService';

export default function LoginAdmin() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // AdminAuthService sudah handle token + localStorage secara internal
      await AdminAuthService.login(email, password);
      
      // Jika berhasil, langsung redirect
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Email atau password salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800 relative">
      
      {/* Switch ke Portal Siswa */}
      <div className="absolute top-4 right-4 group">
        <Link
          to="/login"
          className="flex items-center justify-center w-10 h-10 bg-white hover:bg-[#0c3966] text-gray-500 hover:text-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300"
        >
          <ShieldCheck className="w-5 h-5" />
        </Link>
        <span className="absolute right-0 top-12 scale-0 transition-all rounded bg-slate-800 p-2 text-center text-[10px] font-semibold text-white group-hover:scale-100 whitespace-nowrap shadow-md pointer-events-none origin-top-right">
          Portal Siswa
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-[#0c3966] rounded-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Litera Perpustakaan</h1>
          <p className="text-xs text-slate-400 font-medium">Panel Administrasi</p>
        </div>

        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-2">
          <h2 className="text-sm font-bold text-slate-800">Login Admin</h2>
        </div>

        {error && (
          <div className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Alamat Email</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" 
                placeholder="admin@litera.id"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-slate-600">Kata Sandi</label>
              <Link to="/admin/forgot-password" className="text-[11px] text-blue-600 hover:underline">Lupa Sandi?</Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600" 
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              disabled={isLoading}
            />
            <label htmlFor="remember" className="text-xs text-slate-500 cursor-pointer">Ingat saya</label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard Admin'}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Belum punya akun?{' '}
            <Link to="/admin/register" className="text-blue-600 font-bold hover:underline">
              Registrasi Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}