import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import AuthService from '../../core/services/AuthService';

export default function UserProfile() {
  const navigate = useNavigate();
  
  // Fetch profil user dari API
  const { data: user, loading } = useFetch(() => BookService.getUserProfileComplete());

  const handleKeluarSesi = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sesi Litera?')) {
      AuthService.logout();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400 font-medium">
        Sinkronisasi Profil Litera...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28 text-slate-800 font-sans">
      
      {/* ================= TOP NAVBAR ================= */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <span className="text-[#0c3966] font-bold text-sm tracking-wide">Litera</span>
        <div className="flex items-center gap-4">
          <button className="p-1 text-slate-500 hover:text-slate-700 bg-transparent border-none cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>
          <button className="p-0.5 rounded-full border border-slate-200 text-[#0c3966] bg-transparent flex items-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-4 space-y-6">
        
        {/* Profil Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative w-20 h-20 flex-shrink-0">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"} 
                alt="Foto Profil" 
                className="w-full h-full rounded-full object-cover border-2 border-slate-100 shadow-sm" 
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{user?.name || 'Siswa Litera'}</h1>
              <p className="text-xs text-slate-400 font-medium">NISN: {user?.nisn || '-'}</p>
              <div className="inline-flex bg-[#e8f5e9] text-[#2e7d32] px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-[#c8e6c9]">
                🟢 Active Membership
              </div>
            </div>
          </div>

          <button 
            onClick={handleKeluarSesi} 
            className="w-full sm:w-auto bg-[#0c3966] hover:bg-[#092a4d] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-sm border-none cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1e5391] text-white rounded-2xl p-6 text-center shadow-sm">
            <span className="text-4xl">📖</span>
            <p className="text-4xl font-black mt-2">{user?.stats?.booksRead ?? 0}</p>
            <p className="text-xs tracking-widest uppercase mt-1 text-blue-200">Buku Dibaca</p>
          </div>

          <div className="bg-[#fbc02d] text-amber-950 rounded-2xl p-6 text-center shadow-sm">
            <span className="text-4xl">📚</span>
            <p className="text-4xl font-black mt-2">{user?.stats?.borrowedBooks ?? 0}</p>
            <p className="text-xs tracking-widest uppercase mt-1">Pinjaman Aktif</p>
          </div>

          <div className="bg-[#80deea] text-cyan-950 rounded-2xl p-6 text-center shadow-sm">
            <span className="text-4xl">⭐</span>
            <p className="text-4xl font-black mt-2">{user?.stats?.points ?? 0}</p>
            <p className="text-xs tracking-widest uppercase mt-1">Poin Literasi</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-4 flex items-center justify-around z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[10px] font-medium">Beranda</span>
        </button>

        <button onClick={() => navigate('/catalog/search')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span className="text-[10px] font-medium">Cari</span>
        </button>

        <button onClick={() => navigate('/bookshelf')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
          </svg>
          <span className="text-[10px] font-medium">Rak Buku</span>
        </button>

        <button onClick={() => navigate('/fines/fines-status')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
          <span className="text-[10px] font-medium">Denda</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white bg-transparent border-none cursor-pointer">
          <div className="px-5 py-1 bg-[#0c3966] rounded-full text-white shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span className="text-[10px] font-bold text-[#0c3966]">Profil</span>
        </button>
      </div>
    </div>
  );
}