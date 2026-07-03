// src/views/Fines/ReturnStatus.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import BottomNav from '../../components/Navigation/BottomNav';

export default function ReturnStatus() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  // Fetch hanya pinjaman yang sudah approved (bisa dikembalikan)
  const { data: response, loading, refresh } = useFetch(
    () => BookService.getMyLoans('approved'),
    []
  );

  const pendingReturns = response?.data || [];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReturnBook = async (loan) => {
    if (!loan?.id) return;

    if (!window.confirm(`Kembalikan buku "${loan.book?.nama_buku}"?`)) return;

    try {
      await BookService.returnBook(loan.id);

      showToast('✅ Buku berhasil dikembalikan!', 'success');
      refresh(); // Refresh daftar otomatis
    } catch (err) {
      showToast(err.message || 'Gagal mengembalikan buku.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">

      <nav className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b">
        <span
          onClick={() => navigate('/dashboard')}
          className="text-xl font-bold text-[#0c3966] tracking-wide cursor-pointer"
        >
          Litera
        </span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-6 space-y-6">

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl">📚</div>
          <div>
            <h1 className="text-2xl font-bold">Pengembalian Buku</h1>
            <p className="text-xs text-slate-500">Proses pengembalian buku yang sedang dipinjam</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Memuat daftar pinjaman...</div>
        ) : pendingReturns.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-slate-400">Tidak ada buku yang perlu dikembalikan saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReturns.map((loan) => {
              const book = loan.book || {};
              return (
                <div key={loan.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden border flex-shrink-0">
                    <img
                      src={book.cover}
                      alt={book.nama_buku}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 leading-tight">{book.nama_buku}</h3>
                    <p className="text-xs text-slate-500 mt-1">Pinjam: {loan.tanggal_pinjam}</p>
                    <p className="text-xs text-amber-600">Jatuh tempo: {loan.tanggal_jatuh_tempo}</p>
                  </div>

                  <button
                    onClick={() => handleReturnBook(loan)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl text-sm font-bold transition w-full sm:w-auto"
                  >
                    Kembalikan Buku
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
