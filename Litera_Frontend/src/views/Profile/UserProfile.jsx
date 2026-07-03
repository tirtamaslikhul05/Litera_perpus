// src/views/Profile/UserProfile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileService from '../../core/services/ProfileService';
import AuthService from '../../core/services/AuthService';
import useFetch from '../../hooks/useFetch';
import BottomNav from '../../components/Navigation/BottomNav';

export default function UserProfile() {
  const navigate = useNavigate();
  
  // Fetch profil siswa — useFetch now returns full {status, data} so extract .data
  const { data: userResponse, loading } = useFetch(() => ProfileService.getProfile());
  const user = userResponse?.data || userResponse;

  const handleLogout = async () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar?')) return;
    
    await AuthService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-400">
        Memuat profil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28 text-slate-800 font-sans">
      
      {/* Top Navbar */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b">
        <span 
          onClick={() => navigate('/dashboard')} 
          className="text-xl font-bold text-[#0c3966] tracking-wide cursor-pointer"
        >
          Litera
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-6 space-y-6">
        
        {/* Profil Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
              <img 
                src={user?.foto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"} 
                alt="Foto Profil" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-slate-500 text-sm">NISN: {user?.nisn}</p>
            <p className="text-xs bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full inline-block mt-3 font-bold">
              {user?.kelas} • {user?.jurusan}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 rounded-xl py-3">
              <div className="text-xl font-bold text-slate-800">12</div>
              <div className="text-xs text-slate-500">Buku Dibaca</div>
            </div>
            <div className="bg-slate-50 rounded-xl py-3">
              <div className="text-xl font-bold text-slate-800">3</div>
              <div className="text-xs text-slate-500">Sedang Dipinjam</div>
            </div>
            <div className="bg-slate-50 rounded-xl py-3">
              <div className="text-xl font-bold text-slate-800">450</div>
              <div className="text-xs text-slate-500">Poin Literasi</div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-3">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-2xl font-semibold text-sm transition border border-red-100"
          >
            Keluar dari Aplikasi
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
