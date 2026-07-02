// src/views/Admin/DashboardAdmin.jsx
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
import AdminService from "../../services/AdminService";
import AuthService from "../../services/AuthService";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("Admin Perpustakaan");
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getDashboardStats();

      setStats([
        {
          title: "TOTAL ANGGOTA",
          count: "320",
          change: "+12%",
          color: "text-blue-600",
        },
        {
          title: "TOTAL BUKU",
          count: "1.240",
          change: "+5%",
          color: "text-emerald-600",
        },
        {
          title: "SEDANG DIPINJAM",
          count: "45",
          change: "-2%",
          color: "text-amber-600",
        },
        {
          title: "TOTAL DENDA",
          count: "Rp 250.000",
          change: "Hari ini",
          color: "text-red-600",
        },
      ]);
    } catch (err) {
      console.error(err);
      // Fallback data
      setStats([
        {
          title: "TOTAL ANGGOTA",
          count: "320",
          change: "+12%",
          color: "text-blue-600",
        },
        {
          title: "TOTAL BUKU",
          count: "1.240",
          change: "+5%",
          color: "text-emerald-600",
        },
        {
          title: "SEDANG DIPINJAM",
          count: "45",
          change: "-2%",
          color: "text-amber-600",
        },
        {
          title: "TOTAL DENDA",
          count: "Rp 250.000",
          change: "Hari ini",
          color: "text-red-600",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Keluar dari sesi admin?")) {
      AuthService.logout();
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#02244d] text-white flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-white/5">
            <h1 className="text-xl font-black tracking-wider">LITERA</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>

          <nav className="p-4 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white text-xs font-bold">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </div>

            <button
              onClick={() => navigate("/admin/books")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Kelola Buku
            </button>

            <button
              onClick={() => navigate("/admin/students")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <Users className="w-4 h-4" />
              Kelola Siswa
            </button>

            <button
              onClick={() => navigate("/admin/returns")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <BookMarked className="w-4 h-4" />
              Pengembalian
            </button>

            <button
              onClick={() => navigate("/admin/fines")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <Wallet className="w-4 h-4" />
              Denda
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="h-16 border-b bg-white flex items-center px-8">
          <h2 className="font-semibold text-slate-700">Dashboard Admin</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-medium">{adminName}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <p className="text-xs text-slate-400 font-semibold">
                  {stat.title}
                </p>
                <p className="text-3xl font-black text-slate-800 mt-2">
                  {stat.count}
                </p>
                <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
