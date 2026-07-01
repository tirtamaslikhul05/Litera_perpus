import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import Loading from '../../components/Feedback/Loading';

export default function FinesStatus() {
  const navigate = useNavigate();
  
  // Mengambil data lengkap profil keuangan dan status sirkulasi user
  const { data: user, loading } = useFetch(() => BookService.getUserProfileComplete());

  // Simulasi pengecekan apakah ada buku yang statusnya sedang dikembalikan (dari pengembalian_2.jpg)
  // Di dunia nyata, ini bisa diambil dari state API seperti: user?.pendingReturns?.length > 0
  const hasPendingReturns = true; 

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">
      
      {/* ================= TOP NAVBAR ================= */}
      <nav className="bg-[#f8fafc] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <span onClick={()=> navigate('/dashboard')} className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="p-0.5 rounded-full border border-slate-200 text-slate-600 bg-transparent flex items-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-6xl mx-auto px-6 pt-4 space-y-6">
        
        {/* Header Judul Halaman */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#fee2e2] text-rose-600 rounded-xl flex items-center justify-center text-sm shadow-sm flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/xl" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Status Denda</h1>
            <p className="text-xs text-slate-400 font-medium">Informasi keterlambatan pengembalian buku.</p>
          </div>
        </div>

        {/* Layout Grid Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ================= KIRI: TABEL BUKU TERLAMBAT ================= */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {loading ? (
              <Loading type="table" />
            ) : user?.fines?.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 font-bold">
                Hebat! Kamu tidak memiliki tunggakan denda keterlambatan buku.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-white">
                      <th className="py-4 px-6 font-semibold">JUDUL BUKU</th>
                      <th className="py-4 px-4 font-semibold">JATUH TEMPO</th>
                      <th className="py-4 px-4 font-semibold text-center">TERLAMBAT</th>
                      <th className="py-4 px-6 font-semibold text-right">DENDA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                    {user?.fines?.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 transition duration-150">
                        <td className="py-4 px-6 flex items-center gap-4">
                          <img src={item.cover} alt={item.title} className="w-9 h-12 object-cover rounded shadow-sm border border-slate-100 flex-shrink-0" />
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 truncate">{item.title}</h3>
                            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.author}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium">{item.dueDate || '12 Okt 2023'}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-[#fee2e2] text-rose-700 px-3 py-1 rounded-full font-bold text-[10px]">
                            {item.daysOverdue || '5'} Hari
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-800">
                          Rp {(item.fineAmount || 5000).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ================= KANAN: FINANCIAL SIDEBAR PANEL ================= */}
          <div className="space-y-4">
            
            {/* 🌟 INTEGRASI OPSI 2: SHORTCUT BANNER KE PROSES PENGEMBALIAN (pengembalian_2.jpg) */}
            {hasPendingReturns && (
              <div 
                onClick={() => navigate('/fines/return-status')}
                className="bg-gradient-to-r from-[#1e5391] to-[#0c3966] text-white rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:opacity-95 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl animate-pulse">⏳</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-tight">Ada Pengembalian Buku Terdeteksi</p>
                    <p className="text-[10px] text-blue-200/90 truncate font-medium mt-0.5"></p>
                  </div>
                </div>
                <span className="text-blue-300 font-bold text-sm transform group-hover:translate-x-1 transition pl-2">
                  ➔
                </span>
              </div>
            )}

            {/* Box Total Denda Terhutang */}
            <div className="bg-[#0c3966] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[140px]">
              <div className="space-y-1 z-10">
                <p className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">Total Denda Terhutang</p>
                <p className="text-3xl font-black tracking-tight mt-1">
                  Rp {loading ? '0' : (user?.totalFines).toLocaleString('id-ID')}
                </p>
              </div>
              
              <div className="bg-black/15 rounded-xl p-2.5 text-[10px] text-blue-100/80 font-medium flex items-center gap-1.5 z-10 mt-4 border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                <span>Dihitung dari Rp 1.000 x total hari keterlambatan</span>
              </div>
            </div>
            
            {/* Box Instruksi Tata Cara Pembayaran */}
            <div className="bg-[#f1f5f9] border border-slate-200/50 rounded-2xl p-6 text-xs text-slate-500 space-y-3 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm">Instruksi Pembayaran</h3>
              <p className="leading-relaxed font-medium">
                Silakan hubungi petugas perpustakaan di <span className="text-[#0c3966] font-bold">Meja Admin</span> untuk melakukan pelunasan denda.
              </p>
              <p className="leading-relaxed font-medium pt-1">
                Harap membawa kartu anggota atau tunjukkan halaman ini saat proses pembayaran. Akun Anda akan dinonaktifkan sementara untuk peminjaman baru hingga denda lunas.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM MENU NAVIGASI FIXED ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-4 flex items-center justify-around z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        
        <button onClick={() => navigate('/catalog/search')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span className="text-[10px] font-medium">Cari</span>
        </button>

        <button onClick={() => navigate('/bookshelf')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
          <span className="text-[10px] font-medium">Rak Buku</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white bg-transparent border-none cursor-pointer">
          <div className="px-5 py-1 bg-[#0c3966] rounded-full text-white shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <span className="text-[10px] font-bold text-[#0c3966]">Denda</span>
        </button>

        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>

    </div>
  );
}