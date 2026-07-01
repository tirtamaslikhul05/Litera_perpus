import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BookMarked, 
  Wallet, 
  LogOut,
  Plus,
  ArrowLeft
} from 'lucide-react';
import AdminService from '../../core/services/AdminService';
import AddBookForm from './AddBookForm';

export default function ManageBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' untuk katalog, 'add' untuk tambah form
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAllBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Gagal memuat katalog buku:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
      
      {/* ================= SIDEBAR UTAMA (Sama Persis dengan Dashboard Admin) ================= */}
      <aside className="w-64 bg-[#02244d] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Header Sidebar */}
          <div className="p-6 border-b border-white/5">
            <h1 className="text-lg font-black tracking-wider leading-none text-white">LITERA PERPUSTAKAAN</h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest mt-1 block">Admin Suite</span>
          </div>

          {/* Navigasi Menu Admin Internal */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>
            <button 
              onClick={() => navigate('/admin/books')} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left"
            >
              <BookOpen className="w-4 h-4" />
              <span>Pengelolaan Buku</span>
            </button>
            <button 
              onClick={() => navigate('/admin/students')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <Users className="w-4 h-4" />
              <span>Data Anggota</span>
            </button>
            <button 
              onClick={() => navigate('/admin/returns')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <BookMarked className="w-4 h-4" />
              <span>Sirkulasi Pengembalian</span>
            </button>
            <button 
              onClick={() => navigate('/admin/fines')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <Wallet className="w-4 h-4" />
              <span>Pembayaran Denda</span>
            </button>
          </nav>
        </div>

        {/* Tombol Logout Sesi Admin */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Sesi</span>
          </button>
        </div>
      </aside>

      {/* ================= KONTEN HALAMAN UTAMA (KANAN) ================= */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        {/* HEADER BAR & BANNER ATAS */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pengelolaan Koleksi Buku</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Tambah e-book, perbarui stok buku fisik, dan atur kategori literatur sekolah.</p>
          </div>
          
          {viewMode === 'list' ? (
            <button 
              onClick={() => setViewMode('add')}
              className="bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Buku Baru</span>
            </button>
          ) : (
            <button 
              onClick={() => setViewMode('list')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-2 shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar</span>
            </button>
          )}
        </div>

        {/* CONDITIONAL RENDERING: LIST VS FORM TAMBAH */}
        {viewMode === 'add' ? (
          <AddBookForm onSaveSuccess={() => { setViewMode('list'); fetchBooks(); }} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
            {loading ? (
              <div className="p-24 text-center text-xs font-semibold text-slate-400 tracking-wide animate-pulse">
                Sinkronisasi katalog database buku...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
                {books.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs col-span-3 py-24">
                    Belum ada koleksi buku yang terdaftar di dalam sistem Litera.
                  </div>
                ) : (
                  books.map((book) => (
                    <div key={book.id} className="border border-slate-100 rounded-2xl p-4 flex gap-4 bg-[#f8fafc]/50 hover:bg-white hover:shadow-md transition-all duration-200">
                      
                      {/* Cover Buku Thumbnail */}
                      <div className="w-20 aspect-[3/4] bg-slate-200 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                        <img 
                          src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=150'} 
                          alt={book.judulBuku} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Detail Data Buku */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                            book.jenisBuku === 'E-Book' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {book.jenisBuku}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1">{book.judulBuku}</h4>
                          <p className="text-[11px] text-slate-400 truncate">Oleh {book.penulis}</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-2">
                          <div>
                            <p className="text-[10px] text-slate-400 font-medium">Stok / Status</p>
                            <p className="text-xs font-bold text-slate-700 mt-0.5">
                              {book.jenisBuku === 'E-Book' ? '∞ (Digital)' : `${book.stok} Ekspl`}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            book.stok > 0 || book.jenisBuku === 'E-Book' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            {book.stok > 0 || book.jenisBuku === 'E-Book' ? 'TERSEDIA' : 'HABIS'}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}