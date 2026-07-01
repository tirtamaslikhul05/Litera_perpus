import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Ditambahkan
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BookMarked, 
  Wallet, 
  LogOut 
} from 'lucide-react'; // <-- Ditambahkan
import AdminService from '../../core/services/AdminService';
import AddStudentModal from './AddStudentModal';

export default function ManageStudents() {
  const navigate = useNavigate(); // <-- Ditambahkan
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data siswa saat komponen pertama kali dibuka
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAllStudents();
      setStudents(res.data);
    } catch (err) {
      console.error("Gagal mengambil data siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // Handler untuk mengubah status aktif/nonaktif siswa
  const handleToggleStatus = async (studentId, currentStatus) => {
    const confirmChange = window.confirm(
      `Apakah Anda yakin ingin ${currentStatus === 'Aktif' ? 'menonaktifkan' : 'mengaktifkan'} siswa ini?`
    );
    if (!confirmChange) return;

    try {
      await AdminService.toggleStudentStatus(studentId);
      // Refresh data lokal setelah berhasil update di server
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, status: student.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } 
          : student
      ));
    } catch (err) {
      alert("Gagal mengubah status akses siswa.");
    }
  };

  // Filter data berdasarkan input pencarian (Nama atau NISN)
  const filteredStudents = students.filter(student => {
    const nama = student.namaLengkap ? student.namaLengkap.toLowerCase() : '';
    const nisn = student.nisn ? student.nisn : '';
    return nama.includes(searchTerm.toLowerCase()) || nisn.includes(searchTerm);
  });

  return (
    // Pembungkus utama menggunakan 'flex' agar sidebar berada di kiri dan konten di kanan
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
      
      {/* ================= SIDEBAR UTAMA ================= */}
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left"
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

      {/* ================= KONTEN HALAMAN UTAMA (KANAN) ================= */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        {/* HEADER UTAMA */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Kelola Data Siswa</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manajemen hak akses, verifikasi, dan status keanggotaan siswa.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-2 shadow-sm transition"
          >
            <span>➕</span> Tambah Siswa Baru
          </button>
        </div>

        {/* BILAH PENCARIAN */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center max-w-md relative">
          <span className="absolute left-6 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama atau NISN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 pl-10 pr-4 py-2 border border-transparent rounded-xl text-xs focus:outline-none focus:bg-white focus:border-slate-200 font-medium"
          />
        </div>

        {/* TABEL DATA SISWA */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-24 text-center text-xs font-semibold text-slate-400 animate-pulse">Memuat data siswa...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-[#f1f5f9] font-bold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="p-4">NAMA LENGKAP</th>
                    <th className="p-4">NISN</th>
                    <th className="p-4">ALAMAT EMAIL</th>
                    <th className="p-4">TANGGAL BERGABUNG</th>
                    <th className="p-4">STATUS AKSES</th>
                    <th className="p-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">Tidak ada data siswa ditemukan.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[10px] border border-blue-100">
                            {student.namaLengkap ? student.namaLengkap.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
                          </div>
                          <span className="font-bold text-slate-800">{student.namaLengkap}</span>
                        </td>
                        <td className="p-4 text-slate-600 font-mono">{student.nisn}</td>
                        <td className="p-4 text-slate-500">{student.email}</td>
                        <td className="p-4 text-slate-400">{student.tanggalBergabung}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleToggleStatus(student.id, student.status)}
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                              student.status === 'Aktif' 
                                ? 'bg-white border-rose-200 text-rose-500 hover:bg-rose-50' 
                                : 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {student.status === 'Aktif' ? 'Bekukan Akses' : 'Aktifkan Akses'}
                          </button>
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

      {/* MODAL POPUP TAMBAH SISWA */}
      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchStudents} 
      />

    </div>
  );
}