// src/views/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (nisn.length < 5) {
      return;
    }

    setLoading(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">

      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <span className="text-4xl">📚</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">Perpustakaan Siswa</h2>
          <p className="text-sm text-slate-500 mt-1">Akses Buku Fisik & E-Book Terintegrasi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">NISN Siswa</label>
              <span className="text-[10px] font-semibold text-slate-400">{nisn.length}/5 Digit</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition tracking-widest font-mono"
              placeholder="12345"
              value={nisn}
              onChange={handleNisnChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm leading-5 text-slate-500 hover:text-indigo-600 transition"
              >
                {showPassword ? (
                  <span>🙈 <span className="text-[10px] font-bold">Sembunyikan</span></span>
                ) : (
                  <span>👁️ <span className="text-[10px] font-bold">Lihat</span></span>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200 disabled:opacity-50">
            {loading ? 'Memvalidasi Akun...' : 'Masuk ke Aplikasi'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Belum mengaktivasi akun? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Aktivasi Akun Baru</Link>
        </p>
      </div>
    </div>
  );
}
