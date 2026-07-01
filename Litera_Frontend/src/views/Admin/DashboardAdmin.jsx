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
import AdminService from '../../core/services/AdminService';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  
  const [adminName, setAdminName] = useState('Admin Utama');
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load admin name & dashboard data
  useEffect(() => {
    const storedName = localStorage.getItem('litera_user');
    if (storedName) {
      try {
        const user = JSON.parse(storedName);
        setAdminName(user.name || 'Admin Utama');
      } catch (e) {}
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getDashboardStats();
      
      setStats(data.stats || []);
      setActivities(data.recentActivities || []);
    } catch (err) {
      console.error('Gagal memuat data dashboard:', err);
      // Fallback data jika API belum siap
      setStats([
        { title: 'ANGGOTA AKTIF', count: '320', badge: '+12%', badgeColor: 'bg-blue-50 text-blue-600' },
        { title: 'TOTAL KOLEKSI BUKU', count: '1.240', badge: '+5%', badgeColor: 'bg-orange-50 text-orange-600' },
        { title: 'SEDANG DIPINJAM', count: '45', badge: '-2%', badgeColor: 'bg-red-50 text-red-400' },
        { title: 'TOTAL DENDA MASUK', count: 'Rp 250.000', badge: 'Aktif', badgeColor: 'bg-blue-50 text-blue-600' },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
            <button onClick={() => navigate('/admin/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>
            
            <button onClick={() => navigate('/admin/books')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <BookOpen className="w-4 h-4" />
              <span>Pengelolaan Buku</span>
            </button>
            
            <button onClick={() => navigate('/admin/students')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <Users className="w-4 h-4" />
              <span>Data Anggota</span>
            </button>
            
            <button onClick={() => navigate('/admin/returns')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <BookMarked className="w-4 h-4" />
              <span>Sirkulasi Pengembalian</span>
            </button>
            
            <button onClick={() => navigate('/admin/fines')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <Wallet className="w-4 h-4" />
              <span>Pembayaran Denda</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Sesi</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-16 flex items-center justify-end px-8 shrink-0 border-b">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 leading-none">{adminName}</p>
              <span className="text-[10px] text-slate-400 font-medium">Administrator</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#02244d]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 pb-8 overflow-y-auto space-y-6">
          
          {/* Welcome Banner */}
          <div className="w-full bg-[#02244d] rounded-2xl p-8 relative overflow-hidden text-white" 
               style={{ backgroundImage: `linear-gradient(to right, #02244d 40%, rgba(2,36,77,0.7)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000')` }}>
            <div className="max-w-2xl space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Selamat Datang, {adminName}</h2>
              <p className="text-sm text-slate-300">Kelola perpustakaan dengan lebih efisien dan terintegrasi.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl ${stat.iconColor || 'bg-blue-50'}`}>
                    {/* Icon component bisa ditambahkan jika diperlukan */}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${stat.badgeColor || 'bg-blue-50 text-blue-600'}`}>
                    {stat.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-4">{stat.title}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.count}</p>
              </div>
            ))}
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Aktivitas Terbaru</h3>
              <button className="text-xs text-blue-600 font-bold hover:underline">Lihat Semua</button>
            </div>
            
            <div className="divide-y">
              {activities.length > 0 ? (
                activities.map((act, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {act.inisial || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{act.nama}</p>
                      <p className="text-xs text-slate-500">{act.aktivitas} - {act.buku}</p>
                    </div>
                    <div className="text-xs text-slate-400 text-right">
                      {act.tanggal}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">Belum ada aktivitas terbaru.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}