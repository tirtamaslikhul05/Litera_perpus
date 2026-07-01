import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BookMarked, 
  Wallet, 
  LogOut, 
  Star,
  ShieldCheck
} from 'lucide-react';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('Tahun 2026');
  const [adminName, setAdminName] = useState('Admin Utama');

  useEffect(() => {
    const storedName = localStorage.getItem('litera_admin_name');
    if (storedName) setAdminName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // Statistik disesuaikan khusus untuk Manajemen Sistem Admin
  const stats = [
    { id: 1, title: 'ANGGOTA AKTIF', count: '320', badge: '+12%', badgeColor: 'bg-blue-50 text-blue-600', icon: Users, iconColor: 'text-blue-600 bg-blue-50' },
    { id: 2, title: 'TOTAL KOLEKSI BUKU', count: '1.240', badge: '+5%', badgeColor: 'bg-orange-50 text-orange-600', icon: BookOpen, iconColor: 'text-blue-600 bg-blue-50' },
    { id: 3, title: 'SEDANG DIPINJAM', count: '45', badge: '-2%', badgeColor: 'bg-red-50 text-red-400', icon: BookMarked, iconColor: 'text-orange-600 bg-orange-50' },
    { id: 4, title: 'TOTAL DENDA MASUK', count: 'Rp 250.000', badge: 'Aktif', badgeColor: 'bg-blue-50 text-blue-600', icon: Wallet, iconColor: 'text-red-500 bg-red-50' },
  ];

  // Log sirkulasi perpustakaan internal
  const activities = [
    { id: 1, nama: 'Ahmad Fauzan', inisial: 'AF', aktivitas: 'Peminjaman', buku: 'Algoritma & Struktur Data', tanggal: 'Hari ini, 09:15', status: 'Diproses' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
      
      {/* ================= SIDEBAR UTAMA ================= */}
      <aside className="w-64 bg-[#02244d] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Header Sidebar - Sesuai dengan mockup */}
          <div className="p-6 border-b border-white/5">
            <h1 className="text-lg font-black tracking-wider leading-none text-white">LITERA PERPUSTAKAAN</h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest mt-1 block">Admin Suite</span>
          </div>

          {/* Navigasi Menu Admin Internal dengan Rute Aktif */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left"
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

      {/* ================= KONTEN UTAMA KANAN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR ATAS (SEDERHANA: HANYA INFO PROFIL SESUAI GAMBAR) */}
        <header className="h-16 flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 leading-none">{adminName}</p>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">System Administrator</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#02244d]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* AREA PANEL UTAMA */}
        <main className="flex-1 px-8 pb-8 overflow-y-auto space-y-6">
          
          {/* BANNER WELCOME HERO */}
          <div 
            className="w-full bg-[#02244d] rounded-2xl p-8 relative overflow-hidden text-white bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(to right, #02244d 40%, rgba(2, 36, 77, 0.6)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000')` }}
          >
            <div className="max-w-2xl space-y-2 relative z-10">
              <h2 className="text-2xl font-black tracking-tight">Selamat Datang di Litera Perpustakaan</h2>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Kelola koleksi literatur, pantau keanggotaan sistem, dan fasilitasi proses belajar-mengajar dengan sistem administrasi yang terintegrasi dan efisien.
              </p>
            </div>
          </div>

          {/* GRID LAYOUT: STATISTIK DI KIRI, BUKU POPULER DI KANAN (DITARIK KE ATAS) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            
            {/* SUB GRID KIRI: 4 KARTU STATISTIK (MENGAMBIL MAKSIMAL 3 KOLOM) */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-start">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.iconColor}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider block">{item.title}</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">{item.count}</h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUB GRID KANAN: REKOMENDASI BUKU POPULER (PAS DI SEBELAH KANAN STATISTIK) */}
            <div className="bg-[#02244d] text-white rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[140px]">
              <div>
                <h4 className="text-xs font-bold tracking-tight">Buku Populer Pekan Ini</h4>
                <p className="text-[10px] text-slate-300 font-medium leading-normal mt-0.5">Paling banyak dicari dalam sirkulasi digital.</p>
                
                <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex gap-3 mt-3 items-center backdrop-blur-sm z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300" 
                    alt="Book Cover" 
                    className="w-10 h-14 object-cover rounded-lg shadow-md shrink-0"
                  />
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-bold leading-tight">Lentera Pengetahuan</h5>
                    <p className="text-[9px] text-slate-400 font-medium">Oleh Prof. R. Ahmadi</p>
                    <div className="flex items-center gap-1 pt-0.5">
                      <div className="flex text-amber-400">
                        {[...Array(4)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />)}
                        <Star className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                      <span className="text-[9px] font-bold text-white">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* TABEL DATA AKTIVITAS TERBARU (LEBAR PENUH DI BAGIAN BAWAH) */}
          <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="p-4 flex justify-between items-center bg-white border-b border-slate-50">
              <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">Aktivitas Terbaru</h4>
              <button className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f1f5f9] text-slate-500 font-bold border-b border-slate-100">
                    <th className="py-2.5 px-5">NAMA ANGGOTA</th>
                    <th className="py-2.5 px-5">AKTIVITAS</th>
                    <th className="py-2.5 px-5">BUKU</th>
                    <th className="py-2.5 px-5">TANGGAL</th>
                    <th className="py-2.5 px-5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2563eb] font-bold text-[10px] flex items-center justify-center border border-blue-100">
                          {act.inisial}
                        </div>
                        <span className="text-slate-800 font-bold">{act.nama}</span>
                      </td>
                      <td className="py-3 px-5 text-slate-400">{act.aktivitas}</td>
                      <td className="py-3 px-5 text-slate-800 font-semibold">{act.buku}</td>
                      <td className="py-3 px-5 text-slate-400">{act.tanggal}</td>
                      <td className="py-3 px-5 text-center">
                        <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}