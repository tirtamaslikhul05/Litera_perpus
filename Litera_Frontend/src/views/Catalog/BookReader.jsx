// src/views/Catalog/BookReader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';

export default function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 jam

  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Fetch Buku
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await BookService.getBookDetail(bookId);
        const bookData = response.data || response;
        setBook(bookData);
        setCurrentPage(1);
      } catch (err) {
        setToast({ type: 'error', message: 'Gagal memuat buku.' });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // Timer 1 Jam
  useEffect(() => {
    if (loading || !book) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSaveAndExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, book]);

  const handleAutoSaveAndExit = async () => {
    setSubmitting(true);
    try {
      // Simpan progres (jika backend support)
      await BookService.returnBook(bookId); // atau endpoint progres jika ada
    } catch (e) {}
    setTimeout(() => navigate('/bookshelf'), 1000);
  };

  const handleBackAndExit = async () => {
    setSubmitting(true);
    try {
      // Simpan progres
      await BookService.returnBook(bookId);
      setToast({ type: 'success', message: 'Progres disimpan.' });
    } catch (err) {}
    setTimeout(() => navigate('/bookshelf'), 800);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat buku...</div>;
  if (!book) return <div className="p-8 text-center">Buku tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-slate-800 text-white text-sm shadow-lg">
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b sticky top-0 z-20">
        <button 
          onClick={handleBackAndExit}
          disabled={submitting}
          className="text-[#0c3966] font-bold"
        >
          ← Kembali
        </button>
        
        <div className="text-center">
          <h1 className="text-sm font-bold text-[#0c3966]">{book.nama_buku}</h1>
          <p className="text-[10px] text-slate-400">Halaman {currentPage}</p>
        </div>

        <div className="text-xs font-mono text-red-600 font-bold">
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Reader Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[70vh] flex flex-col">
          <div className="flex-1 flex items-center justify-center text-center text-slate-600 leading-relaxed text-sm">
            <div>
              <p className="mb-8">Halaman {currentPage}</p>
              <p className="italic opacity-70">"Konten buku akan muncul di sini. Ini adalah tampilan pembaca sederhana."</p>
              <img 
                src={book.cover} 
                alt={book.nama_buku} 
                className="mx-auto mt-10 w-48 opacity-30" 
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t mt-auto">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-5 py-2 text-xs font-bold border rounded-xl hover:bg-slate-50"
              disabled={currentPage === 1}
            >
              ← Sebelumnya
            </button>

            <span className="text-xs font-medium text-slate-400">
              {currentPage} / {book.totalPages || '?'}
            </span>

            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-5 py-2 text-xs font-bold border rounded-xl hover:bg-slate-50"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}