// src/views/Admin/RegisterAdmin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  User,
  Mail,
  Lock,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import AuthService from '../../core/services/AuthService';

export default function RegisterAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    try {
      setIsLoading(true);

      // Menggunakan endpoint register sesuai dokumentasi backend
      const registerData = {
        school_name: "SMA Nusantara", // default atau bisa diubah
        admin_name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await AuthService.registerSchool(registerData);

      setSuccess("Registrasi Admin berhasil! Silakan login.");

      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Gagal mendaftarkan admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7fa] px-4 font-sans text-[#1e293b] py-12">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 bg-[#0c3966] rounded-xl flex items-center justify-center shadow-md mb-2">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#0c3966] tracking-wide">
          Litera
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Sistem Manajemen Admin
        </p>
      </div>

      <div className="w-full max-w-[460px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-[#0c3966]" />
          <h2 className="text-lg font-bold text-gray-800">
            Registrasi Admin Baru
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">
          Buat akun administrator baru.
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Nama Lengkap
            </label>
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
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Email Resmi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@sekolah.sch.id"
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Konfirmasi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <RefreshCw className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0c3966]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Mendaftarkan..." : "Daftar Sebagai Admin"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-medium text-gray-500">
          Sudah punya akun?{" "}
          <Link
            to="/admin/login"
            className="text-[#0c3966] font-bold hover:underline"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
