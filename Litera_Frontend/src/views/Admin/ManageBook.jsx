// src/views/Admin/ManageBooks.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BookMarked,
  Wallet,
  LogOut,
  Plus,
  ArrowLeft,
} from "lucide-react";
import AdminService from '../../core/services/AdminService';
import AuthService from '../../core/services/AuthService';
import AddBookForm from './AddBookForm';

export default function ManageBooks() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'add'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await AdminService.getAllBooks({});
      setBooks(response.data || response || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat daftar buku.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Pengelolaan Buku
            </h2>
            <p className="text-sm text-slate-500">
              Kelola koleksi buku perpustakaan
            </p>
          </div>

          {viewMode === "list" ? (
            <button
              onClick={() => setViewMode("add")}
              className="bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Tambah Buku Baru
            </button>
          ) : (
            <button
              onClick={() => setViewMode("list")}
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          )}
        </div>

        {viewMode === "add" ? (
          <AddBookForm onSaveSuccess={() => { setViewMode("list"); fetchBooks(); }} />
        ) : loading ? (
          <div className="text-center py-20">Memuat daftar buku...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition"
              >
                <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden mb-4">
                  <img
                    src={book.cover}
                    alt={book.nama_buku}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">
                  {book.nama_buku}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{book.isbn}</p>
                <p className="text-xs mt-3 text-emerald-600 font-medium">
                  Tersedia: {book.jumlah_tersedia}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
