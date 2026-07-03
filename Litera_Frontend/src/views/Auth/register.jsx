// src/views/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [nama, setNama] = useState('');
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNisnChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 5) {
      setNisn(val);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (nisn.length < 5) {
      return;
    }

    setLoading(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">

      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Registrasi Akun Siswa</h2>
          <p className="text-xs text-slate-500 mt-1">Gunakan NISN resmi dari pihak sekolah</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md transition disabled:opacity-50">
            {loading ? 'Mengecek Database...' : 'Daftar Akun'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-5">
          Sudah punya akun? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Kembali ke Login</Link>
        </p>
      </div>
    </div>
  );
}
