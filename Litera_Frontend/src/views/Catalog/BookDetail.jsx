// src/views/Catalog/BookDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import BottomNav from '../../components/Navigation/BottomNav';

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [formatBuku, setFormatBuku] = useState('fisik');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch detail buku
  const { data: bookResponse, loading } = useFetch(
    () => BookService.getBookDetail(bookId), 
    [bookId]
  );

  // useFetch now returns full {status, data, meta} — extract the book object
  const book = bookResponse?.data || bookResponse;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePinjam = async () => {
    if (!book) return;
    
    setSubmitting(true);
    try {
      const result = await BookService.borrowBook(book.id);
      
      showToast('Peminjaman berhasil diajukan! Menunggu persetujuan admin.', 'success');
      
      setTimeout(() => {
        navigate('/bookshelf');
      }, 1500);
    } catch (err) {
      showToast(err.message || 'Gagal mengajukan peminjaman.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReadDigital = async () => {
    try {
      const pdfUrl = await BookService.getReadUrl(book.id);
      window.open(pdfUrl, '_blank');
    } catch (err) {
      showToast('Anda belum meminjam buku ini atau buku belum tersedia secara digital.', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat detail buku...</div>;
  }

  if (!book) {
    return <div className="p-8 text-center">Buku tidak ditemukan.</div>;
  }

  const isAvailable = book.jumlah_tersedia > 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#0c3966] text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b">
        <button 
          onClick={() => navigate(-1)} 
          className="text-[#0c3966] font-bold flex items-center gap-1"
        >
          ← Kembali
        </button>
        <span className="font-semibold text-[#0c3966]">Detail Buku</span>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Cover & Info */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden shadow-md">
            <img 
              src={book.cover} 
              alt={book.nama_buku} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 ${
                isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {isAvailable ? `Tersedia (${book.jumlah_tersedia})` : 'Stok Habis'}
              </span>
              <h1 className="text-2xl font-bold text-[#0c3966] leading-tight">{book.nama_buku}</h1>
              <p className="text-slate-500 mt-1">ISBN: {book.isbn}</p>
            </div>

            <div className="pt-4 border-t">
              <button 
                onClick={handleReadDigital}
                disabled={!book.pdf}
                className="w-full bg-[#0c3966] disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                📖 Baca Versi Digital
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t space-y-3">
          {isAvailable && (
            <button 
              onClick={handlePinjam} 
              disabled={submitting}
              className="w-full bg-[#0c3966] hover:bg-[#092a4d] disabled:bg-gray-400 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              {submitting ? 'Memproses...' : 'AJUKAN PEMINJAMAN'}
            </button>
          )}

          <button 
            onClick={() => navigate('/bookshelf')}
            className="w-full border border-slate-300 py-4 rounded-2xl text-sm font-semibold"
          >
            Lihat Rak Buku Saya
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
