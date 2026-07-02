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
    setError('');

    // Validasi sederhana
    if (formData.nisn.length !== 10) {
      setError('NISN harus tepat 10 digit angka.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    try {
      setSubmitting(true);

      await AdminService.addStudent(formData);

      alert('✅ Akun siswa berhasil didaftarkan!');
      
      // Reset form
      setFormData({ namaLengkap: '', nisn: '', email: '', password: '' });
      
      onSuccess?.(); // Refresh tabel di parent
      onClose();
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Gagal menambahkan siswa baru.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 font-sans">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md p-6 space-y-5 text-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tambah Akun Siswa Baru</h3>
            <p className="text-xs text-slate-500">Isi data siswa sesuai dokumen resmi</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Nama Lengkap</label>
            <input 
              type="text"
              required
              placeholder="Nama lengkap siswa"
              value={formData.namaLengkap}
              onChange={updateField('namaLengkap')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">NISN (10 Digit)</label>
            <input 
              type="text"
              required
              maxLength={10}
              placeholder="0041234567"
              value={formData.nisn}
              onChange={(e) => setFormData(prev => ({ ...prev, nisn: e.target.value.replace(/\D/g, '') }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#0c3966]"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Email Aktif</label>
            <input 
              type="email"
              required
              placeholder="siswa@litera.sch.id"
              value={formData.email}
              onChange={updateField('email')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kata Sandi Awal</label>
            <input 
              type="password"
              required
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={updateField('password')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
              disabled={submitting}
            />
            <p className="text-[10px] text-slate-400">Siswa akan diminta mengganti password saat login pertama.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#0c3966] hover:bg-[#092a4d] text-white rounded-xl text-sm font-bold transition disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Siswa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}