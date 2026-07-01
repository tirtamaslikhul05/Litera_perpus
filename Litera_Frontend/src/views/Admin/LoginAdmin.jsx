import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react'; // <-- SUDAH DITAMBAHKAN AGAR TIDAK BLANK
import AdminAuthService from '../../core/services/AdminAuthService';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // Default fake account email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      
      // 1. Panggil service login admin (Mendukung bypass Fake Account)
      const res = await AdminAuthService.login(email, password);
      
      // 2. Kalkulasi waktu kedaluwarsa sesi token (misal: sekarang + 7200 detik)
      const token = res.token;
      const expiresInSeconds = res.expiresIn || 7200; 
      const expiryTimestamp = new Date().getTime() + (expiresInSeconds * 1000);

      // 3. Simpan data otentikasi secara aman dan seragam ke Local Storage
      localStorage.setItem('litera_token', token);
      localStorage.setItem('litera_token_expiry', expiryTimestamp.toString());
      localStorage.setItem('litera_role', res.role || 'Admin'); // Menyimpan penanda hak akses 'Admin'

      // 4. Pindahkan rute ke halaman utama panel kerja admin
      navigate('/admin/dashboard'); 
    } catch (err) {
      // Mengambil pesan error dari custom throw Error atau response API backend
      setError(err.message || err.response?.data?.message || 'Email atau Kata Sandi salah.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800 relative">
      
        {/* ================= IKON DI POJOK KANAN ATAS (PORTAL ADMIN) ================= */}
        <div className="absolute top-4 right-4 group">
            <Link
              to="/login"
              className="flex items-center justify-center w-10 h-10 bg-white hover:bg-[#0c3966] text-gray-500 hover:text-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            {/* Tooltip Informasi saat disentuh (Hover) */}
            <span className="absolute right-0 top-12 scale-0 transition-all rounded bg-slate-800 p-2 text-center text-[10px] font-semibold text-white group-hover:scale-100 whitespace-nowrap shadow-md pointer-events-none origin-top-right">
              Portal Siswa
            </span>
        </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        
        {/* Logo Litera */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-[#0c3966] rounded-xl flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Litera Perpustakaan</h1>
          <p className="text-xs text-slate-400 font-medium">Sistem Manajemen Admin</p>
        </div>

        {/* Form Title */}
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-2">
          <h2 className="text-sm font-bold text-slate-800">Login Admin</h2>
        </div>

        {/* Notifikasi Pesan Error */}
        {error && (
          <div className="text-xs text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Alamat Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600 bg-white" 
                placeholder="Masukkan alamat email admin"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600">Kata Sandi</label>
              <Link to="/admin/forgot-password" className="text-[11px] font-bold text-blue-600 hover:underline">Lupa Sandi?</Link>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600 bg-white" 
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer flex items-center"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Opsi Ingat Saya */}
          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
              disabled={isLoading}
            />
            <label htmlFor="remember" className="text-xs text-slate-500 font-medium cursor-pointer select-none">Ingat saya</label>
          </div>

          {/* Tombol Akses Kirim Form */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border-none cursor-pointer shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Memverifikasi...' : 'Login ke Dashboard'}</span>
            {!isLoading && (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            )}
          </button>
        </form>

        {/* Footer Rute Registrasi */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Belum punya akun admin? <Link to="/admin/register" className="text-blue-600 font-bold hover:underline">Registrasi</Link>
          </p>
        </div>

      </div>
    </div>
  );
}