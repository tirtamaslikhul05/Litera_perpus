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
import AddStudentModal from './AddStudentModal';

export default function ManageStudents() {
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data siswa
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await AdminService.getAllStudents();
      // Sesuaikan dengan struktur response API (bisa response.data atau langsung array)
      setStudents(Array.isArray(response?.data) ? response.data : response || []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data siswa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleStatus = async (studentId, currentStatus) => {
    const action = currentStatus === 'Aktif' ? 'menonaktifkan' : 'mengaktifkan';
    if (!window.confirm(`Yakin ingin ${action} akses siswa ini?`)) return;

    try {
      await AdminService.toggleStudentStatus(studentId);
      
      // Optimistic update
      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, status: currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif' } 
          : student
      ));
    } catch (err) {
      alert('Gagal mengubah status siswa.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // Filter siswa
  const filteredStudents = students.filter(student => {
    const nama = (student.namaLengkap || '').toLowerCase();
    const nisn = (student.nisn || '').toString();
    return nama.includes(searchTerm.toLowerCase()) || nisn.includes(searchTerm);
  });

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
            <button onClick={() => navigate('/admin/students')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left">
              <Users className="w-4 h-4" />
              <span>Data Anggota</span>
            </button>
            <button onClick={() => navigate('/admin/returns')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
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

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kelola Data Siswa</h2>
            <p className="text-sm text-slate-500">Manajemen akun dan status keanggotaan siswa</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
          >
            ➕ Tambah Siswa Baru
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm max-w-md">
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Cari nama atau NISN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 pl-11 pr-4 py-3 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-200"
            />
          </div>
        </div>

        {/* Tabel Siswa */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-slate-400">Memuat data siswa...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f1f5f9] text-xs font-bold text-slate-500 border-b">
                  <tr>
                    <th className="p-5">NAMA LENGKAP</th>
                    <th className="p-5">NISN</th>
                    <th className="p-5">EMAIL</th>
                    <th className="p-5">BERGABUNG</th>
                    <th className="p-5">STATUS</th>
                    <th className="p-5 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">Tidak ada data siswa ditemukan.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                            {(student.namaLengkap || '??').substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold">{student.namaLengkap}</span>
                        </td>
                        <td className="p-5 font-mono text-slate-600">{student.nisn}</td>
                        <td className="p-5 text-slate-500">{student.email}</td>
                        <td className="p-5 text-slate-400 text-sm">{student.tanggalBergabung}</td>
                        <td className="p-5">
                          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            student.status === 'Aktif' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <button 
                            onClick={() => handleToggleStatus(student.id, student.status)}
                            className={`text-xs font-bold px-4 py-2 rounded-lg border transition ${
                              student.status === 'Aktif' 
                                ? 'border-rose-200 text-rose-600 hover:bg-rose-50' 
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {student.status === 'Aktif' ? 'Bekukan' : 'Aktifkan'}
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

      {/* Modal Tambah Siswa */}
      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchStudents} 
      />
    </div>
  );
}