import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- DITAMBAHKAN
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BookMarked, 
  Wallet, 
  LogOut 
} from 'lucide-react'; // <-- DITAMBAHKAN
import AdminService from '../../core/services/AdminService';

export default function ManageFines() {
  const navigate = useNavigate(); // <-- DITAMBAHKAN
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/fines`);
      setFines(res.data);
    } catch (err) {
      console.error("Gagal menarik data denda:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  const handleLunasPayment = async (fineId, totalDenda, namaSiswa) => {
    const confirmPayment = window.confirm(`Apakah benar siswa bernama ${namaSiswa} sudah membayar tunai senilai Rp ${totalDenda.toLocaleString('id-ID')}?`);
    if (!confirmPayment) return;

    try {
      await AdminService.payDenda(fineId, totalDenda);
      alert('Pembayaran Berhasil! Status denda di aplikasi siswa langsung terhapus.');
      fetchFines(); // Reload tabel keuangan denda
    } catch (err) {
      alert('Gagal memproses pelunasan denda.');
    }
  };

  return (
    // Menggunakan layout flex agar sidebar berada di sebelah kiri dan konten di kanan
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Kas & Pembayaran Denda</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Otorisasi pembayaran denda keterlambatan pengembalian buku fisik siswa.</p>
        </div>

        {/* TABEL KEUANGAN DENDA */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-24 text-center text-xs font-semibold text-slate-400 animate-pulse">Sinkronisasi mutasi kas denda...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-[#f1f5f9] font-bold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="p-4">NAMA SISWA</th>
                    <th className="p-4">BUKU YANG KEMBALI</th>
                    <th className="p-4 text-center">KETERLAMBATAN</th>
                    <th className="p-4">NOMINAL DENDA</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-center">TINDAKAN LOKET</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {fines.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">Bersih! Tidak ada denda aktif saat ini.</td>
                    </tr>
                  ) : (
                    fines.map((fine) => (
                      <tr key={fine.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{fine.namaSiswa}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{fine.nisn}</p>
                        </td>
                        <td className="p-4 text-slate-600 truncate max-w-xs">{fine.judulBuku}</td>
                        <td className="p-4 text-center font-bold text-rose-500">{fine.hariTerlambat} Hari</td>
                        <td className="p-4 font-black text-slate-900">Rp {fine.totalDenda.toLocaleString('id-ID')}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            fine.status === 'Lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {fine.status === 'Lunas' ? 'LUNAS 🎉' : 'BELUM LUNAS'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {fine.status === 'Belum Lunas' ? (
                            <button 
                              onClick={() => handleLunasPayment(fine.id, fine.totalDenda, fine.namaSiswa)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg border-none cursor-pointer transition shadow-sm"
                            >
                              Tandai Lunas 💵
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Selesai pada {fine.tanggalBayar}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}