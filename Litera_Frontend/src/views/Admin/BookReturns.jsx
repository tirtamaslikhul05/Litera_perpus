import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BookMarked, 
  Wallet, 
  LogOut 
} from 'lucide-react';
import AdminService from '../../core/services/AdminService';

export default function BookReturns() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLoan, setActiveLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchLoan = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError('');
      setActiveLoan(null);

      // Gunakan AdminService (full API)
      const response = await AdminService.searchLoan?.(searchQuery) || 
                       // Fallback jika method belum ada di service
                       await AdminService.getActiveLoans?.();

      // Sesuaikan dengan struktur response backend Anda
      const foundLoan = Array.isArray(response) 
        ? response.find(l => 
            l.nisn?.includes(searchQuery) || 
            l.kodeBuku?.includes(searchQuery) ||
            l.judulBuku?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : response;

      if (foundLoan) {
        setActiveLoan(foundLoan);
      } else {
        setError('Peminjaman tidak ditemukan atau sudah dikembalikan.');
      }
    } catch (err) {
      setError('Gagal mencari data peminjaman. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessReturn = async () => {
    if (!activeLoan) return;

    const confirmReturn = window.confirm(
      `Proses pengembalian buku "${activeLoan.judulBuku || activeLoan.title}" oleh ${activeLoan.namaSiswa || activeLoan.name}?`
    );

    if (!confirmReturn) return;

    try {
      const result = await AdminService.processReturn(activeLoan.id || activeLoan.loanId);

      if (result?.hasFine || result?.data?.hasFine) {
        const fineInfo = result.data || result;
        alert(`Buku berhasil dikembalikan.\n\nPERINGATAN: Terlambat ${fineInfo.daysLate || 0} hari.\nDenda: Rp ${(fineInfo.fineAmount || 0).toLocaleString('id-ID')}`);
      } else {
        alert('✅ Buku berhasil dikembalikan tepat waktu! Stok telah diperbarui.');
      }

      // Reset setelah berhasil
      setActiveLoan(null);
      setSearchQuery('');
    } catch (err) {
      alert('Gagal memproses pengembalian buku.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
      
      {/* Sidebar */}
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
            <button onClick={() => navigate('/admin/books')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
              <BookOpen className="w-4 h-4" />
              <span>Pengelolaan Buku</span>
            </button>
            <button onClick={() => navigate('/admin/students')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
              <Users className="w-4 h-4" />
              <span>Data Anggota</span>
            </button>
            <button onClick={() => navigate('/admin/returns')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left">
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

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sirkulasi Pengembalian Buku</h2>
          <p className="text-sm text-slate-500 mt-1">Proses pengembalian buku fisik oleh siswa</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchLoan} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm max-w-xl flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Masukkan NISN atau Kode Buku..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 pl-11 pr-4 py-3 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-200"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !searchQuery.trim()}
            className="bg-[#0c3966] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#092a4d] transition disabled:opacity-60"
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-2xl text-sm max-w-xl">
            {error}
          </div>
        )}

        {/* Loan Detail */}
        {activeLoan && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-xl">
            <div className="border-l-4 border-emerald-600 pl-3 mb-4">
              <h3 className="font-bold text-slate-900">Detail Peminjaman</h3>
            </div>

            <div className="grid grid-cols-2 gap-y-4 text-sm bg-slate-50 p-5 rounded-xl">
              <div>
                <p className="text-xs text-slate-500">Nama Siswa</p>
                <p className="font-semibold">{activeLoan.namaSiswa || activeLoan.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">NISN</p>
                <p className="font-mono">{activeLoan.nisn}</p>
              </div>
              <div className="col-span-2 pt-2 border-t">
                <p className="text-xs text-slate-500">Judul Buku</p>
                <p className="font-semibold text-slate-800">{activeLoan.judulBuku || activeLoan.title}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Tanggal Pinjam</p>
                <p>{activeLoan.tanggalPinjam}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Batas Kembali</p>
                <p className="text-rose-600 font-medium">{activeLoan.tanggalTenggat}</p>
              </div>
            </div>

            <button 
              onClick={handleProcessReturn}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              ↩️ Proses Pengembalian Buku
            </button>
          </div>
        )}
      </div>
    </div>
  );
}