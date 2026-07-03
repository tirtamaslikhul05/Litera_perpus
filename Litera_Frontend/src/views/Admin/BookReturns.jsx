// src/views/Admin/BookReturns.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BookMarked,
  Wallet,
  LogOut,
} from "lucide-react";
import AdminService from '../../core/services/AdminService';
import AuthService from '../../core/services/AuthService';

export default function BookReturns() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeLoan, setActiveLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError("");
      setActiveLoan(null);

      const response = await AdminService.getAllLoans({ search: searchQuery });
      const loans = response.data || response;

      if (loans && loans.length > 0) {
        setActiveLoan(loans[0]); // Ambil yang pertama
      } else {
        setError("Peminjaman tidak ditemukan.");
      }
    } catch (err) {
      setError("Gagal mencari data peminjaman.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReturn = async () => {
    if (!activeLoan?.id) return;

    if (
      !window.confirm(
        `Konfirmasi pengembalian buku "${activeLoan.book?.nama_buku}"?`,
      )
    )
      return;

    try {
      await AdminService.confirmReturn(activeLoan.id);

      alert("✅ Pengembalian buku berhasil dikonfirmasi!");
      setActiveLoan(null);
      setSearchQuery("");
    } catch (err) {
      alert("Gagal mengonfirmasi pengembalian.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Keluar dari sesi admin?")) {
      AuthService.logout();
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#02244d] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="p-6 border-b border-white/5">
            <h1 className="text-lg font-black tracking-wider">LITERA</h1>
            <span className="text-xs text-slate-400">Admin Panel</span>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => navigate("/admin/books")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <BookOpen className="w-4 h-4" />
              Kelola Buku
            </button>
            <button
              onClick={() => navigate("/admin/students")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <Users className="w-4 h-4" />
              Kelola Siswa
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left">
              <BookMarked className="w-4 h-4" />
              Pengembalian
            </button>
            <button
              onClick={() => navigate("/admin/fines")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <Wallet className="w-4 h-4" />
              Denda
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-white/5 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Sirkulasi Pengembalian
          </h2>
          <p className="text-sm text-slate-500">
            Konfirmasi pengembalian buku siswa
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm max-w-xl flex gap-3"
        >
          <input
            type="text"
            placeholder="Cari NISN atau nama siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0c3966] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#092a4d] disabled:opacity-60"
          >
            {loading ? "Mencari..." : "Cari"}
          </button>
        </form>

        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Detail Pinjaman */}
        {activeLoan && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl">
            <h3 className="font-bold mb-4">Detail Peminjaman</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Siswa</p>
                <p className="font-medium">
                  {activeLoan.student?.name || activeLoan.student_name}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Buku</p>
                <p className="font-medium">
                  {activeLoan.book?.nama_buku || activeLoan.book_name}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Tanggal Pinjam</p>
                <p>{activeLoan.tanggal_pinjam}</p>
              </div>
            </div>

            <button
              onClick={handleConfirmReturn}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition"
            >
              Konfirmasi Pengembalian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
