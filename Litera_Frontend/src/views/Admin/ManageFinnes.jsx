import React, { useState, useEffect } from 'react';
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

export default function ManageFines() {
  const navigate = useNavigate();
  
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch daftar denda
  const fetchFines = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Gunakan AdminService (full API)
      const response = await AdminService.getAllFines?.() || 
                      // Jika belum ada method, bisa gunakan getDendaDetail atau sesuaikan nanti
                      await AdminService.getDashboardStats?.(); 
      
      setFines(Array.isArray(response?.fines) ? response.fines : response || []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data denda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const handleLunasPayment = async (fineId, totalDenda, namaSiswa) => {
    if (!window.confirm(`Tandai denda siswa ${namaSiswa} sebesar Rp ${totalDenda.toLocaleString('id-ID')} sebagai LUNAS?`)) {
      return;
    }

    try {
      await AdminService.payDenda(fineId, totalDenda);
      alert('✅ Pembayaran denda berhasil dicatat!');
      fetchFines(); // Refresh tabel
    } catch (err) {
      alert('Gagal memproses pelunasan denda.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
      
      {/* SIDEBAR */}
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
            <button onClick={() => navigate('/admin/returns')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
              <BookMarked className="w-4 h-4" />
              <span>Sirkulasi Pengembalian</span>
            </button>
            <button onClick={() => navigate('/admin/fines')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left">
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

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kas & Pembayaran Denda</h2>
          <p className="text-sm text-slate-500">Kelola tunggakan denda keterlambatan pengembalian buku</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-slate-400">Memuat data denda...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f1f5f9] text-xs font-bold text-slate-500 border-b">
                  <tr>
                    <th className="p-5">NAMA SISWA</th>
                    <th className="p-5">BUKU</th>
                    <th className="p-5 text-center">KETERLAMBATAN</th>
                    <th className="p-5 text-right">NOMINAL DENDA</th>
                    <th className="p-5 text-center">STATUS</th>
                    <th className="p-5 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fines.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">Tidak ada denda aktif saat ini.</td>
                    </tr>
                  ) : (
                    fines.map((fine) => (
                      <tr key={fine.id} className="hover:bg-slate-50">
                        <td className="p-5">
                          <div className="font-semibold">{fine.namaSiswa}</div>
                          <div className="text-xs text-slate-400 font-mono">{fine.nisn}</div>
                        </td>
                        <td className="p-5 text-slate-700">{fine.judulBuku}</td>
                        <td className="p-5 text-center font-medium text-rose-600">{fine.hariTerlambat} hari</td>
                        <td className="p-5 text-right font-bold text-slate-900">
                          Rp {fine.totalDenda?.toLocaleString('id-ID')}
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            fine.status === 'Lunas' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {fine.status || 'Belum Lunas'}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          {fine.status !== 'Lunas' && (
                            <button 
                              onClick={() => handleLunasPayment(fine.id, fine.totalDenda, fine.namaSiswa)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition"
                            >
                              Tandai Lunas
                            </button>
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