// src/views/Admin/AddStudentModal.jsx
import React, { useState } from "react";
import AdminService from "../../services/AdminService";

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    nisn: "",
    kelas: "",
    jurusan: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.nisn.length !== 10) {
      setError("NISN harus tepat 10 digit angka.");
      return;
    }

    try {
      setSubmitting(true);

      await AdminService.createStudent({
        name: formData.name,
        nisn: formData.nisn,
        kelas: formData.kelas,
        jurusan: formData.jurusan,
      });

      alert("✅ Siswa berhasil didaftarkan!");

      // Reset form
      setFormData({ name: "", nisn: "", kelas: "", jurusan: "" });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menambahkan siswa.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md p-6 space-y-5 text-slate-800">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-bold text-slate-900">
            Tambah Siswa Baru
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
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
            <label className="text-xs font-semibold text-slate-600">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={updateField("name")}
              placeholder="Nama lengkap siswa"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              NISN (10 Digit)
            </label>
            <input
              type="text"
              required
              maxLength={10}
              value={formData.nisn}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nisn: e.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder="0081234567"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#0c3966]"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Kelas
              </label>
              <input
                type="text"
                required
                value={formData.kelas}
                onChange={updateField("kelas")}
                placeholder="XII IPA 1"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Jurusan
              </label>
              <input
                type="text"
                required
                value={formData.jurusan}
                onChange={updateField("jurusan")}
                placeholder="IPA / IPS"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0c3966]"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-[#0c3966] hover:bg-[#092a4d] text-white rounded-xl text-sm font-bold transition disabled:opacity-60"
            >
              {submitting ? "Menyimpan..." : "Tambahkan Siswa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
