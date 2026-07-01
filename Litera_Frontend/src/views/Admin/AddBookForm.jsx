import React, { useState } from 'react';
import AdminService from '../../core/services/AdminService';

export default function AddBookForm({ onSaveSuccess }) {
  const [jenisBuku, setJenisBuku] = useState('E-Book');
  const [formData, setFormData] = useState({
    kodeBuku: '',
    kategori: '',
    judulBuku: '',
    isbn: '',
    penulis: '',
    penerbit: '',
    tahunTerbit: '',
    stok: 1,
    linkEbook: ''
  });

  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.judulBuku || !formData.penulis) {
      setError('Judul dan penulis wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append('jenisBuku', jenisBuku);
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      if (coverFile) data.append('cover', coverFile);
      if (jenisBuku === 'E-Book' && pdfFile) data.append('pdfFile', pdfFile);

      await AdminService.addBook(data);

      alert('✅ Koleksi buku berhasil ditambahkan ke katalog!');
      
      // Reset form
      setFormData({
        kodeBuku: '', kategori: '', judulBuku: '', isbn: '', penulis: '',
        penerbit: '', tahunTerbit: '', stok: 1, linkEbook: ''
      });
      setCoverFile(null);
      setPdfFile(null);

      onSaveSuccess?.();
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Gagal menyimpan buku baru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-3xl mx-auto font-sans">
      <div className="border-l-4 border-blue-600 pl-3 mb-6">
        <h3 className="text-lg font-bold text-slate-900">Tambah Koleksi Buku Baru</h3>
        <p className="text-xs text-slate-500">Data akan langsung tersedia di katalog siswa</p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Jenis Buku */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Jenis Buku</label>
          <div className="flex gap-2">
            {['E-Book', 'Buku Fisik'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setJenisBuku(option)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition border ${
                  jenisBuku === option 
                    ? 'bg-[#0c3966] text-white border-[#0c3966]' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kode Buku</label>
            <input 
              type="text" 
              required 
              placeholder="LTR-001" 
              value={formData.kodeBuku}
              onChange={updateField('kodeBuku')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kategori</label>
            <select 
              required 
              value={formData.kategori}
              onChange={updateField('kategori')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966] bg-white"
            >
              <option value="">Pilih Kategori</option>
              <option value="Sains">Sains & Teknologi</option>
              <option value="Sastra">Sastra & Novel</option>
              <option value="Sejarah">Sejarah & Budaya</option>
              <option value="Ensiklopedia">Ensiklopedia</option>
            </select>
          </div>
        </div>

        {/* Judul & ISBN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Judul Buku</label>
            <input 
              type="text" 
              required 
              placeholder="Judul lengkap buku" 
              value={formData.judulBuku}
              onChange={updateField('judulBuku')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">ISBN</label>
            <input 
              type="text" 
              placeholder="978-xxx-xxxx-x" 
              value={formData.isbn}
              onChange={updateField('isbn')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#0c3966]"
            />
          </div>
        </div>

        {/* Penulis, Penerbit, Tah**✅ Berikut versi `AddBookForm.jsx` yang sudah dibersihkan dan dioptimalkan:**

```javascript
import React, { useState } from 'react';
import AdminService from '../../core/services/AdminService';

export default function AddBookForm({ onSaveSuccess }) {
  const [jenisBuku, setJenisBuku] = useState('E-Book');
  const [formData, setFormData] = useState({
    kodeBuku: '',
    kategori: '',
    judulBuku: '',
    isbn: '',
    penulis: '',
    penerbit: '',
    tahunTerbit: '',
    stok: 1,
    linkEbook: ''
  });

  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.judulBuku || !formData.penulis) {
      setError('Judul dan penulis wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append('jenisBuku', jenisBuku);
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      if (coverFile) data.append('cover', coverFile);
      if (jenisBuku === 'E-Book' && pdfFile) data.append('pdfFile', pdfFile);

      await AdminService.addBook(data);

      alert('✅ Koleksi buku berhasil ditambahkan ke katalog!');
      
      // Reset form
      setFormData({
        kodeBuku: '', kategori: '', judulBuku: '', isbn: '', penulis: '',
        penerbit: '', tahunTerbit: '', stok: 1, linkEbook: ''
      });
      setCoverFile(null);
      setPdfFile(null);

      onSaveSuccess?.();
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Gagal menyimpan buku baru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-3xl mx-auto font-sans">
      <div className="border-l-4 border-blue-600 pl-3 mb-6">
        <h3 className="text-lg font-bold text-slate-900">Tambah Koleksi Buku Baru</h3>
        <p className="text-xs text-slate-500">Data akan langsung tersedia di katalog siswa</p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Jenis Buku */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Jenis Buku</label>
          <div className="flex gap-2">
            {['E-Book', 'Buku Fisik'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setJenisBuku(option)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition border ${
                  jenisBuku === option 
                    ? 'bg-[#0c3966] text-white border-[#0c3966]' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kode Buku</label>
            <input 
              type="text" 
              required 
              placeholder="LTR-001" 
              value={formData.kodeBuku}
              onChange={updateField('kodeBuku')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Kategori</label>
            <select 
              required 
              value={formData.kategori}
              onChange={updateField('kategori')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966] bg-white"
            >
              <option value="">Pilih Kategori</option>
              <option value="Sains">Sains & Teknologi</option>
              <option value="Sastra">Sastra & Novel</option>
              <option value="Sejarah">Sejarah & Budaya</option>
              <option value="Ensiklopedia">Ensiklopedia</option>
            </select>
          </div>
        </div>

        {/* Judul & ISBN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Judul Buku</label>
            <input 
              type="text" 
              required 
              placeholder="Judul lengkap buku" 
              value={formData.judulBuku}
              onChange={updateField('judulBuku')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">ISBN</label>
            <input 
              type="text" 
              placeholder="978-xxx-xxxx-x" 
              value={formData.isbn}
              onChange={updateField('isbn')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#0c3966]"
            />
          </div>
        </div>

        {/* Penulis, Penerbit, Tahun */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Penulis</label>
            <input 
              type="text" 
              required 
              placeholder="Nama penulis" 
              value={formData.penulis}
              onChange={updateField('penulis')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Penerbit</label>
            <input 
              type="text" 
              placeholder="Nama penerbit" 
              value={formData.penerbit}
              onChange={updateField('penerbit')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Tahun Terbit</label>
            <input 
              type="number" 
              placeholder="2026" 
              value={formData.tahunTerbit}
              onChange={updateField('tahunTerbit')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
        </div>

        {/* Dynamic Fields */}
        {jenisBuku === 'Buku Fisik' ? (
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
            <label className="text-xs font-semibold text-slate-700 block mb-1">Jumlah Stok Fisik</label>
            <input 
              type="number" 
              min="1" 
              required 
              value={formData.stok}
              onChange={(e) => setFormData(prev => ({ ...prev, stok: parseInt(e.target.value) || 1 }))}
              className="w-32 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50 p-5 rounded-2xl border border-purple-100">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">File E-Book (PDF)</label>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setPdfFile(e.target.files[0])} 
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Link Alternatif (Opsional)</label>
              <input 
                type="url" 
                placeholder="https://..." 
                value={formData.linkEbook}
                onChange={updateField('linkEbook')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>
        )}

        {/* Cover Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Cover Buku (Gambar)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              required 
              className="hidden" 
              id="cover-upload"
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
            <label htmlFor="cover-upload" className="cursor-pointer block">
              {coverFile ? (
                <span className="text-sm text-emerald-600">📁 {coverFile.name}</span>
              ) : (
                <span className="text-xs text-slate-400">Klik atau tarik gambar cover ke sini</span>
              )}
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t flex justify-end">
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-[#0c3966] hover:bg-[#092a4d] text-white font-bold text-sm px-8 py-3 rounded-xl transition disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? 'Mengunggah...' : 'Simpan ke Katalog'}
          </button>
        </div>
      </form>
    </div>
  );
}