// src/views/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, User, IdCard, Mail, Lock, RefreshCw, ArrowRight } from 'lucide-react';
import AuthService from '../../core/services/AuthService';

export default function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    if (nisn.length < 5) {
=======
    setError('');
    setSuccess('');

    // Validasi
    if (formData.nisn.length !== 10) {
      setError('NISN harus tepat 10 digit angka!');
>>>>>>> 5b4662b762cc0176306312ec90d560589a8450d9
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    try {
      setIsLoading(true);

      // Data yang dikirim sesuai dokumentasi backend
      const registerData = {
        school_name: "SMA Nusantara", // bisa diubah nanti
        admin_name: formData.name,   // untuk register awal
        email: formData.email,
        password: formData.password
      };

      await AuthService.registerSchool(registerData);
      
      setSuccess('Registrasi berhasil! Silakan login dengan akun Anda.');
      
      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Gagal melakukan registrasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7fa] px-4 font-sans text-[#1e293b] relative overflow-y-auto py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(244, 247, 250, 0.92), rgba(244, 247, 250, 0.92)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex flex-col items-center mb-6 text-center z-10">
        <div className="w-12 h-12 bg-[#0c3966] rounded-xl flex items-center justify-center shadow-md mb-2">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">Sistem Perpustakaan Digital</p>
      </div>

      <div className="w-full max-w-[460px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 z-10">
        <h2 className="text-lg font-bold text-gray-800 text-left">Registrasi Akun Baru</h2>
        <p className="text-xs text-gray-500 font-medium mt-1 mb-6 leading-relaxed">
          Daftarkan sekolah dan akun admin pertama Anda.
        </p>

        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-xs font-medium text-green-600 bg-green-50 border border-green-100 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
<<<<<<< HEAD
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Nama Lengkap</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nama lengkap sesuai rapor" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-600">NISN</label>
              <span className="text-[10px] font-bold text-slate-400">{nisn.length}/5</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Masukkan 5 digit NISN"
              value={nisn}
              onChange={handleNisnChange} // 🔥
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Buat Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // 🔥
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
=======
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Nama Lengkap</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Ahmad Fauzan"
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                required
              />
>>>>>>> 5b4662b762cc0176306312ec90d560589a8450d9
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">NISN (10 Digit)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <IdCard className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="nisn"
                maxLength={10}
                value={formData.nisn}
                onChange={handleChange}
                placeholder="Masukkan 10 digit NISN"
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@sekolah.sch.id"
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Konfirmasi Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <RefreshCw className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-75 mt-4"
          >
            {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-medium text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#0c3966] font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
