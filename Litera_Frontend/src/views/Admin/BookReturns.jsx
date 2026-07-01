import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- DITAMBAHKAN
import axios from 'axios'; // <-- DITAMBAHKAN
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BookMarked, 
  Wallet, 
  LogOut 
} from 'lucide-react'; // <-- DITAMBAHKAN
import AdminService from '../../core/services/AdminService';

export default function BookReturns() {
  const navigate = useNavigate(); // <-- DITAMBAHKAN
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLoan, setActiveLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cari data peminjaman aktif yang belum dikembalikan oleh siswa
  const handleSearchLoan = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/loans/search?q=${searchQuery}`);
      setActiveLoan(res.data);
    } catch (err) {
      setError('Data peminjaman aktif tidak ditemukan atau sudah dikembalikan.');
      setActiveLoan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // Proses eksekusi pengembalian buku fisik
  const handleProcessReturn = async () => {
    if (!activeLoan) return;

    const confirmReturn = window.confirm(`Proses pengembalian buku "${activeLoan.judulBuku}" oleh ${activeLoan.namaSiswa}?`);
    if (!confirmReturn) return;

    try {
      const res = await AdminService.processReturn(activeLoan.id);
      
      if (res.data.hasFine) {
        alert(`Buku berhasil dikembalikan. PERINGATAN: Siswa terlambat ${res.data.daysLate} hari dan dikenakan denda sebesar Rp ${res.data.fineAmount.toLocaleString('id-ID')}`);
      } else {
        alert('Buku berhasil dikembalikan tepat waktu! Stok fisik otomatis bertambah.');
      }
      
      setActiveLoan(null);
      setSearchQuery('');
    } catch (err) {
      alert('Gagal memproses pengembalian buku.');
    }
  };

  return (
    // Menggunakan layout flex agar komponen tersusun dengan rapi ke samping
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
      
      {/* SIDEBAR */}
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <BookOpen className="w-4 h-4" />
              <span>Pengelolaan Buku</span>
            </button>
            <button 
              onClick={() => navigate('/admin/students')} // Disamakan tujuannya ke /admin/students
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <Users className="w-4 h-4" />
              <span>Data Anggota</span>
            </button>
            <button 
              onClick={() => navigate('/admin/returns')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left"
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

      {/* KONTEN UTAMA */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sirkulasi Pengembalian Buku</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Scan kode buku atau masukkan NISN siswa untuk memproses pengembalian buku fisik.</p>
        </div>

        {/* SEARCH BOX */}
        <form onSubmit={handleSearchLoan} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm max-w-xl flex gap-3">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Masukkan NISN Siswa atau Kode Buku Fisik..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 pl-10 pr-4 py-2.5 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-slate-200 font-medium"
            />
          </div>
          <button type="submit" className="bg-[#0c3966] text-white text-xs font-bold px-5 py-2.5 rounded-xl border-none cursor-pointer hover:bg-[#092a4d] transition-colors">
            {loading ? 'Mencari...' : 'Periksa'}
          </button>
        </form>

        {error && <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 max-w-xl font-medium">{error}</div>}

        {/* DETAIL VIEW PEMINJAMAN YANG DITEMUKAN */}
        {activeLoan && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-xl space-y-4">
            <div className="border-l-4 border-blue-600 pl-2">
              <h3 className="text-sm font-bold text-slate-900">Detail Transaksi Peminjaman</h3>
            </div>

            <div className="grid grid-cols-2 gap-y-3 bg-slate-50 p-4 rounded-xl text-xs font-medium">
              <div>
                <p className="text-slate-400 font-semibold text-[10px] uppercase">Nama Lengkap Siswa</p>
                <p className="text-slate-800 font-bold mt-0.5">{activeLoan.namaSiswa}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold text-[10px] uppercase">NISN</p>
                <p className="text-slate-600 font-mono mt-0.5">{activeLoan.nisn}</p>
              </div>
              <div className="col-span-2 border-t border-slate-200/60 pt-2 mt-1">
                <p className="text-slate-400 font-semibold text-[10px] uppercase">Judul Buku Fisik</p>
                <p className="text-slate-800 font-bold text-sm mt-0.5">{activeLoan.judulBuku} <span className="text-slate-400 text-xs font-mono">({activeLoan.kodeBuku})</span></p>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <p className="text-slate-400 font-semibold text-[10px] uppercase">Tanggal Pinjam</p>
                <p className="text-slate-700 mt-0.5">{activeLoan.tanggalPinjam}</p>
              </div>
              <div className="border-t border-slate-200/60 pt-2">
                <p className="text-slate-400 font-semibold text-[10px] uppercase">Batas Pengembalian</p>
                <p className="text-rose-600 font-bold mt-0.5">{activeLoan.tanggalTenggat}</p>
              </div>
            </div>

            <button 
              onClick={handleProcessReturn}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>↩️</span> Verifikasi & Selesaikan Pengembalian
            </button>
          </div>
        )}
      </div>

    </div>
  );
}