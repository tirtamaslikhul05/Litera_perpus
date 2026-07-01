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
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'add'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await AdminService.getAllBooks();
      // Sesuaikan dengan struktur response API
      setBooks(Array.isArray(response) ? response : response.data || response || []);
    } catch (err) {
      console.error('Gagal memuat daftar buku:', err);
      setError('Gagal memuat data buku. Silakan coba lagi.');
      setBooks([]);
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
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#02244d] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="p-6 border-b border-white/5">
            <h1 className="text-lg font-black tracking-wider">LITERA PERPUSTAKAAN</h1>
            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Admin Suite</span>
          </div>

          <nav className="p-4 space-y-1">
            <button onClick={() => navigate('/admin/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>
            <button onClick={() => navigate('/admin/books')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left">
              <BookOpen className="w-4 h-4" />
              <span>Pengelolaan Buku</span>
            </button>
            <button onClick={() => navigate('/admin/students')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
              <Users className="w-4 h-4" />
              <span>Data Anggota</span>
            </button>
            <button onClick={() => navigate('/admin/returns')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
              <BookMarked className="w-4 h-4" />
              <span>Sirkulasi Pengembalian</span>
            </button>
            <button onClick={() => navigate('/admin/fines')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
              <Wallet className="w-4 h-4" />
              <span>Pembayaran Denda</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left">
            <LogOut className="w-4 h-4" />
            <span>Logout Sesi</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pengelolaan Koleksi Buku</h2>
            <p className="text-sm text-slate-500 mt-1">Kelola e-book, stok buku fisik, dan katalog perpustakaan</p>
          </div>

          {viewMode === 'list' ? (
            <button 
              onClick={() => setViewMode('add')}
              className="bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Buku Baru
            </button>
          ) : (
            <button 
              onClick={() => setViewMode('list')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar
            </button>
          )}
        </div>

        {/* Conditional View */}
        {viewMode === 'add' ? (
          <AddBookForm 
            onSaveSuccess={() => {
              setViewMode('list');
              fetchBooks();
            }} 
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-20 text-center text-slate-400">
                Memuat koleksi buku...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">{error}</div>
            ) : books.length === 0 ? (
              <div className="p-20 text-center text-slate-400 text-sm">
                Belum ada buku yang terdaftar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {books.map((book) => (
                  <div key={book.id || book._id} className="border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-all bg-white">
                    <div className="w-full aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden mb-3">
                      <img 
                        src={book.cover || book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300'} 
                        alt={book.judulBuku || book.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        book.jenisBuku === 'E-Book' || book.format === 'digital' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {book.jenisBuku || book.format || 'Buku'}
                      </div>
                      
                      <h4 className="font-bold text-sm line-clamp-2 leading-tight text-slate-900">
                        {book.judulBuku || book.title}
                      </h4>
                      <p className="text-xs text-slate-500">Oleh {book.penulis || book.author}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t text-xs flex justify-between items-center">
                      <span className="font-medium text-slate-600">
                        {book.jenisBuku === 'E-Book' || book.format === 'digital' 
                          ? '∞ Digital' 
                          : `${book.stok || 0} eks`}
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                        (book.stok > 0 || book.jenisBuku === 'E-Book') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {(book.stok > 0 || book.jenisBuku === 'E-Book') ? 'TERSEDIA' : 'HABIS'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}