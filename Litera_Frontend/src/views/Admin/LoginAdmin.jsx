// src/views/Admin/LoginAdmin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import AuthService from "../../services/AuthService";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Login menggunakan endpoint yang sama (backend mendukung role admin)
      const result = await AuthService.login(email, password);

      const role = AuthService.getRole();

      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Akun ini bukan akun Admin.");
      }
    } catch (err) {
      setError(err.message || "Email atau password admin salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800 relative">
      <div className="absolute top-4 right-4 group">
        <Link
          to="/login"
          className="flex items-center justify-center w-10 h-10 bg-white hover:bg-[#0c3966] text-gray-500 hover:text-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300"
        >
          <ShieldCheck className="w-5 h-5" />
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-[#0c3966] rounded-xl flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Litera Admin</h1>
          <p className="text-xs text-slate-400">Panel Administrasi</p>
        </div>

        {error && (
          <div className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Email Admin
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
              placeholder="admin@sekolah.sch.id"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white py-3 rounded-xl text-sm font-bold transition disabled:opacity-50"
          >
            {isLoading ? "Memverifikasi..." : "Masuk sebagai Admin"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Kembali ke portal siswa?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Klik di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
