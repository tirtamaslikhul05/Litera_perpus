// src/views/Admin/AddBookForm.jsx
import React, { useState } from "react";
import AdminService from '../../core/services/AdminService';

export default function AddBookForm({ onSaveSuccess }) {
  const [entryMode, setEntryMode] = useState("auto"); // 'auto' | 'manual'
  const [jenisBuku, setJenisBuku] = useState("E-Book");

  const [formData, setFormData] = useState({
    nama_buku: "",
    isbn: "",
    kategori: "",
    penulis: "",
    penerbit: "",
    tahun_terbit: "",
    jumlah_buku: 1,
  });

  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      nama_buku: "",
      isbn: "",
      kategori: "",
      penulis: "",
      penerbit: "",
      tahun_terbit: "",
      jumlah_buku: 1,
    });
    setCoverFile(null);
    setPdfFile(null);
    setJenisBuku("E-Book");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.nama_buku || !formData.penulis) {
      setError("Judul dan penulis wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      // Data text — kirim SEMUA field formData
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Kirim pdf sebagai boolean flag
      data.set('pdf', jenisBuku === 'E-Book' ? '1' : '0');

      // Files (hanya di mode auto)
      if (coverFile) data.append("cover", coverFile);
      if (pdfFile) data.append("pdf_file", pdfFile);

      await AdminService.createBook(data);

      alert("✅ Buku berhasil ditambahkan ke katalog!");
      resetForm();
      onSaveSuccess?.();
    } catch (err) {
      setError(err.message || "Gagal menyimpan buku.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Tambah Buku Baru</h3>
      </div>

      {/* ===== ENTRY MODE TOGGLE ===== */}
      <div className="bg-gray-100 rounded-lg p-1 flex mb-6">
        <button
          type="button"
          onClick={() => setEntryMode("auto")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            entryMode === "auto"
              ? "bg-white text-[#0c3966] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Lengkap + File
        </button>
        <button
          type="button"
          onClick={() => setEntryMode("manual")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            entryMode === "manual"
              ? "bg-white text-[#0c3966] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Manual (Isi Cepat)
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-red-600 bg-red-50 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Jenis Buku — only in auto mode */}
        {entryMode === "auto" && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Jenis Buku
            </label>
            <div className="flex gap-2">
              {["E-Book", "Buku Fisik"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJenisBuku(type)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium border transition ${
                    jenisBuku === type
                      ? "bg-[#0c3966] text-white"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== COMMON FIELDS (both modes) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Judul Buku <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nama_buku}
              onChange={updateField("nama_buku")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#0c3966]"
              placeholder="Judul buku"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={updateField("isbn")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#0c3966]"
              placeholder="978-xxx-xxxx-x"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Penulis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.penulis}
              onChange={updateField("penulis")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#0c3966]"
              placeholder="Nama penulis"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Penerbit
            </label>
            <input
              type="text"
              value={formData.penerbit}
              onChange={updateField("penerbit")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#0c3966]"
              placeholder="Nama penerbit"
            />
          </div>
        </div>

        {/* Kategori + Tahun Terbit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Kategori
            </label>
            <input
              type="text"
              value={formData.kategori}
              onChange={updateField("kategori")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#0c3966]"
              placeholder="Fiksi, Non-Fiksi, Pendidikan, dll."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Tahun Terbit
            </label>
            <input
              type="number"
              min="1000"
              max="2099"
              value={formData.tahun_terbit}
              onChange={updateField("tahun_terbit")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#0c3966]"
              placeholder="2026"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Stok / Jumlah Eksemplar
          </label>
          <input
            type="number"
            min="1"
            value={formData.jumlah_buku}
            onChange={updateField("jumlah_buku")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#0c3966] max-w-[200px]"
          />
        </div>

        {/* ===== FILE UPLOADS (auto mode only) ===== */}
        {entryMode === "auto" && (
          <div className="space-y-4 border-t pt-4">
            <p className="text-sm font-semibold text-slate-600">Upload File (Opsional)</p>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Cover Buku
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700"
              />
            </div>

            {jenisBuku === "E-Book" && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  File PDF E-Book
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700"
                />
              </div>
            )}
          </div>
        )}

        {/* Manual Mode Hint */}
        {entryMode === "manual" && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            Mode manual — cukup isi data teks. File cover dan PDF bisa ditambahkan nanti melalui edit buku.
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Simpan Buku ke Katalog"}
          </button>
        </div>
      </form>
    </div>
  );
}
