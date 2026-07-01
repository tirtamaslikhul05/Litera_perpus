import React, { useState } from 'react';
import AdminService from '../../core/services/AdminService';

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nisn: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nisn.length !== 10) {
      return setError('NISN wajib diisi tepat 10 digit angka.');
    }

    try {
      setError('');
      setSubmitting(true);
      
      // Kirim data siswa baru ke API Backend terintegrasi
      await AdminService.addStudent(formData);
      
      alert('Akun siswa berhasil didaftarkan ke sistem Litera!');
      setFormData({ namaLengkap: '', nisn: '', email: '', password: '' });
      onSuccess(); // Memicu refresh tabel di halaman utama
      onClose();   // Tutup modal
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan data siswa baru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 font-sans">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md p-6 space-y-5 animate-fade-in text-slate-800">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-2">
            <h3 className="text-sm font-bold text-slate-900">Tambah Akun Siswa</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 text-lg bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Form Isi Data */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Nama Lengkap Siswa</label>
            <input 
              type="text"
              required
              placeholder="Masukkan nama lengkap sesuai rapor"
              value={formData.namaLengkap}
              onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* NISN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">NISN (10 Digit)</label>
            <input 
              type="text"
              required
              maxLength={10}
              placeholder="Contoh: 0041234567"
              value={formData.nisn}
              onChange={(e) => setFormData({ ...formData, nisn: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Alamat Email Aktif</label>
            <input 
              type="email"
              required
              placeholder="siswa@litera.sch.id"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Default Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kata Sandi Default</label>
            <input 
              type="password"
              required
              placeholder="Tentukan sandi awal akun siswa"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
            />
            <p className="text-[10px] text-slate-400 font-medium">Siswa disarankan langsung mengganti sandi ini pada login pertama.</p>
          </div>

          {/* Tombol Aksi Pilihan */}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              disabled={submitting}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer transition disabled:opacity-50"
            >
              Batalkan
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="w-1/2 bg-[#0c3966] hover:bg-[#092a4d] text-white py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Siswa'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}