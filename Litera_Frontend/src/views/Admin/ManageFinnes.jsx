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
} from "lucide-react";
import AdminService from '../../core/services/AdminService';
import AuthService from '../../core/services/AuthService';

export default function ManageFines() {
  const navigate = useNavigate();

  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await AdminService.getAllLoans({ status: "returned" }); // atau endpoint fines jika ada
      setFines(response.data || response || []);
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
        `Tandai denda siswa ${namaSiswa} (Rp ${jumlahDenda.toLocaleString("id-ID")}) sebagai LUNAS?`,
      )
    )
      return;

    try {
      await AdminService.payDenda(fineId, jumlahDenda);
      alert("✅ Pembayaran denda berhasil dicatat!");
      fetchFines(); // Refresh
    } catch (err) {
      alert("Gagal memproses pelunasan.");
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

        {loading ? (
          <div className="text-center py-20">Memuat data denda...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : fines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
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
                  <th className="p-5 text-right">Denda</th>
                  <th className="p-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fines.map((fine, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="p-5">
                      <div className="font-medium">{fine.student?.name}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {fine.student?.nisn}
                      </div>
                    </td>
                    <td className="p-5">{fine.book?.nama_buku}</td>
                    <td className="p-5 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        {fine.hari_terlambat} hari
                      </span>
                    </td>
                    <td className="p-5 text-right font-bold">
                      Rp {fine.jumlah_denda?.toLocaleString("id-ID")}
                    </td>
                    <td className="p-5 text-center">
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
