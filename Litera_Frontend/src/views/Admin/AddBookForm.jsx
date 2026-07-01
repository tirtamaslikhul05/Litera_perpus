import React, { useState } from 'react';
import AdminService from '../../core/services/AdminService';

export default function AddBookForm({ onSaveSuccess }) {
  const [jenisBuku, setJenisBuku] = useState('E-Book'); // Default seperti UI kamu
  const [formData, setFormData] = useState({
    kodeBuku: '', kategori: '', judulBuku: '', isbn: '', penulis: '', penerbit: '', tahunTerbit: '', stok: 0, linkEbook: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('jenisBuku', jenisBuku);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (coverFile) data.append('cover', coverFile);
    if (jenisBuku === 'E-Book' && pdfFile) data.append('pdfFile', pdfFile);

    try {
      await AdminService.addBook(data);
      alert('Koleksi baru berhasil disimpan dan langsung disinkronkan ke katalog siswa!');
      onSaveSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan buku baru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-3xl mx-auto font-sans">
      <div className="border-l-4 border-blue-600 pl-2 mb-6">
        <h3 className="text-sm font-bold text-slate-900">Form Input Koleksi Baru</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* PILIHAN JENIS BUKU (Sesuai Toggle Button di UI kamu) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Jenis Buku</label>
          <div className="flex gap-2">
            {['E-Book', 'Buku Fisik'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setJenisBuku(option)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  jenisBuku === option 
                    ? 'bg-[#0c3966] text-white border-[#0c3966]' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {option === 'E-Book' ? '📖 E-Book (Digital)' : '📚 Buku Fisik'}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 1: KODE BUKU & KATEGORI */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kode Buku</label>
            <input type="text" required placeholder="Contoh: LTR-001" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium" onChange={e => setFormData({...formData, kodeBuku: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kategori</label>
            <select required className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium bg-white" onChange={e => setFormData({...formData, kategori: e.target.value})}>
              <option value="">Pilih Kategori</option>
              <option value="Sains">Sains & Teknologi</option>
              <option value="Sastra">Sastra & Novel</option>
              <option value="Sejarah">Sejarah & Budaya</option>
              <option value="Ensiklopedia">Ensiklopedia</option>
            </select>
          </div>
        </div>

        {/* ROW 2: JUDUL BUKU & ISBN */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Judul Buku</label>
            <input type="text" required placeholder="Masukkan judul lengkap" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium" onChange={e => setFormData({...formData, judulBuku: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">ISBN</label>
            <input type="text" placeholder="978-x-xxx-xxxx-x" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-mono" onChange={e => setFormData({...formData, isbn: e.target.value})} />
          </div>
        </div>

        {/* ROW 3: PENULIS, PENERBIT, TAHUN */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Penulis</label>
            <input type="text" required placeholder="Nama penulis" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium" onChange={e => setFormData({...formData, penulis: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Penerbit</label>
            <input type="text" placeholder="Nama penerbit" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium" onChange={e => setFormData({...formData, penerbit: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Tahun Terbit</label>
            <input type="number" placeholder="2026" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-medium" onChange={e => setFormData({...formData, tahunTerbit: e.target.value})} />
          </div>
        </div>

        {/* DYNAMIC FIELD: DEPENDS ON JENIS BUKU */}
        {jenisBuku === 'Buku Fisik' ? (
          <div className="space-y-1.5 bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-fade-in">
            <label className="text-xs font-bold text-slate-700">Jumlah Stok Buku Fisik</label>
            <input type="number" min={1} required placeholder="Contoh: 10" className="w-32 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 font-bold" onChange={e => setFormData({...formData, stok: parseInt(e.target.value)})} />
            <p className="text-[10px] text-slate-400 mt-1">Jumlah buku riil yang bisa diletakkan di rak pinjam fisik.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100 animate-fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">File E-Book (PDF)</label>
              <input type="file" accept=".pdf" className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer" onChange={e => setPdfFile(e.target.files[0])} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Atau Tautan Alternatif (URL)</label>
              <input type="url" placeholder="https://drive.google.com/..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600 font-medium" onChange={e => setFormData({...formData, linkEbook: e.target.value})} />
            </div>
          </div>
        )}

        {/* UPLOAD COVER BUKU */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Cover Sampul Buku (PNG/JPG)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition relative">
            <input type="file" accept="image/*" required className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={e => setCoverFile(e.target.files[0])} />
            <span className="text-xs text-slate-400 font-medium block">
              {coverFile ? `📂 file terpilih: ${coverFile.name}` : 'Tarik cover ke sini atau klik untuk mencari file'}
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON ACTIONS */}
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-[#0c3966] hover:bg-[#092a4d] text-white font-bold text-xs px-6 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Mengunggah Data...' : '🔒 Simpan & Rilis Katalog'}
          </button>
        </div>

      </form>
    </div>
  );
}