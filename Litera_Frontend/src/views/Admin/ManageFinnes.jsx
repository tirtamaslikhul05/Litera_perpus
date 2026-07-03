// src/views/Admin/ManageFines.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BookMarked,
  Wallet,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminService from '../../core/services/AdminService';
import AuthService from '../../core/services/AuthService';

export default function ManageFines() {
  const navigate = useNavigate();

  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchFines = async (query = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await AdminService.getAllFines({ search: query });
      // response.data = array of fines (FineResource), response.meta = pagination
      setFines(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data denda.");
      setFines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handleMarkAsPaid = async (fineId, namaSiswa, jumlahDenda) => {
    if (
      !window.confirm(
        `Tandai denda siswa ${namaSiswa} (Rp ${Number(jumlahDenda).toLocaleString("id-ID")}) sebagai LUNAS?`,
      )
    )
      return;

    try {
      await AdminService.payDenda(fineId);
      alert("✅ Pembayaran denda berhasil dicatat!");
      fetchFines(search); // Refresh
    } catch (err) {
      alert("Gagal memproses pelunasan.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFines(search);
  };

  const handleLogout = () => {
    if (window.confirm("Keluar dari sesi admin?")) {
      AuthService.logout();
      navigate("/login");
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
            <button
              onClick={() => navigate("/admin/returns")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <BookMarked className="w-4 h-4" />
              Pengembalian
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left">
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
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Pembayaran Denda
          </h2>
          <p className="text-sm text-slate-500">Kelola tunggakan denda siswa</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari siswa atau judul buku..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#0c3966] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#092a4d] transition"
          >
            Cari
          </button>
        </form>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Memuat data denda...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : fines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
            <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Tidak ada denda aktif saat ini.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 font-semibold border-b">
                  <th className="p-5 text-left">Siswa</th>
                  <th className="p-5 text-left">Buku</th>
                  <th className="p-5 text-center">Keterlambatan</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-right">Denda</th>
                  <th className="p-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50">
                    <td className="p-5">
                      <div className="font-medium text-sm">
                        {fine.student?.name || "N/A"}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {fine.student?.nisn}
                      </div>
                    </td>
                    <td className="p-5 text-sm">
                      {fine.loan?.book?.nama_buku || "N/A"}
                    </td>
                    <td className="p-5 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        {fine.hari_terlambat} hari
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      {fine.status_denda === "paid" ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle className="w-3 h-3" />
                          Lunas
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                          <XCircle className="w-3 h-3" />
                          Belum Dibayar
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right font-bold text-sm">
                      Rp {Number(fine.jumlah_denda).toLocaleString("id-ID")}
                    </td>
                    <td className="p-5 text-center">
                      {fine.status_denda === "pending" ? (
                        <button
                          onClick={() =>
                            handleMarkAsPaid(
                              fine.id,
                              fine.student?.name,
                              fine.jumlah_denda,
                            )
                          }
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2 rounded-lg font-bold transition"
                        >
                          Tandai Lunas
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
