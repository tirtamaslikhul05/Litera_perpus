import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService'; 
import Loading from '../../components/Feedback/Loading';
import Toast from '../../components/Feedback/Toast';

export default function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 Jam

  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Fetch Detail Buku
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await BookService.getBookDetail(bookId);
        setBook(data);
        setCurrentPage(data?.lastReadPage || 1);
      } catch (err) {
        setToast({ type: 'error', message: 'Gagal memuat konten buku.' });
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
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleAutoSaveAndExit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, book]);

  // Auto save saat waktu habis
  const handleAutoSaveAndExit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setToast({ type: 'error', message: 'Waktu baca habis! Menyimpan progres...' });

    try {
      await BookService.simulasikanUpdateProgresBaca(
        bookId, 
        currentPageRef.current, 
        book?.totalPages || 2,
        false
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => navigate('/bookshelf'), 1500);
    }
  };

  // Back & Save
  const handleBackAndExit = async () => {
    if (!book || submitting) return;
    setSubmitting(true);

    try {
      await BookService.simulasikanUpdateProgresBaca(
        bookId, 
        currentPage, 
        book?.totalPages || 2, 
        false
      );
      setToast({ type: 'success', message: `Progres disimpan di halaman ${currentPage}` });
      setTimeout(() => navigate('/bookshelf'), 1200);
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal menyimpan progres.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Selesai Membaca
  const handleFinishedReading = async () => {
    if (!book || submitting) return;
    setSubmitting(true);

    try {
      await BookService.simulasikanUpdateProgresBaca(
        bookId, 
        currentPage, 
        book?.totalPages || 2, 
        true
      );
      setToast({ type: 'success', message: 'Selamat! Anda telah menyelesaikan buku ini 🎉' });
      setTimeout(() => navigate('/bookshelf'), 1500);
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal menyimpan status selesai.' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  if (loading) return <Loading type="details" />;
  if (!book) return <div className="p-8 text-center text-xs text-slate-400">Buku tidak ditemukan.</div>;

  const totalPages = book.totalPages || 2;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none">
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackAndExit}
            disabled={submitting}
            className="text-slate-600 hover:text-slate-900 font-bold text-lg bg-transparent border-none cursor-pointer disabled:opacity-30"
          >
            ←
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-[#0c3966] leading-tight">{book.title}</h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {book.author} • Halaman {currentPage}
            </p>
          </div>
        </div>

        <button 
          onClick={handleFinishedReading}
          disabled={submitting}
          className="bg-[#0c3966] hover:bg-[#092a4d] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
        >
          <span>{submitting ? 'Menyimpan...' : 'Selesai Membaca'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-4">
        
        <div className="bg-[#f1f5f9] rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 px-4 border border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm ${
              currentPage === totalPages ? 'bg-emerald-100 text-emerald-800' : 'bg-[#fcd34d] text-amber-900'
            }`}>
              <span>Status: {currentPage === totalPages ? 'Halaman Akhir Tercapai' : 'Sedang Dibaca'}</span>
            </div>
            
            <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
              timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium italic">
            Akses otomatis berakhir saat waktu habis.
          </div>
        </div>

        {/* Halaman Buku */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <h2 className="text-base font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-3">
            Halaman {currentPage}
          </h2> 

          <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-600 text-justify font-normal">
            <p>
              Ini adalah lembaran cerita dari buku <strong>{book.title}</strong> pada halaman ke-{currentPage}.
            </p>
            <div className="w-full max-w-2xl mx-auto my-6 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={book.cover || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800"} 
                alt={book.title} 
                className="w-full h-auto object-cover max-h-[320px]"
              />
            </div>
          </div>

          {/* Navigation Halaman */}
          <div className="border-t border-slate-100 pt-6 flex items-center justify-between text-xs font-bold text-slate-500">
            <button 
              disabled={currentPage === 1 || submitting}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="text-slate-400 hover:text-[#0c3966] disabled:opacity-30 transition flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              ‹ Halaman Sebelumnya
            </button>
            
            <span className="text-slate-400 font-medium">
              Halaman <span className="text-slate-700 font-bold">{currentPage}</span> dari {totalPages}
            </span>

            <button 
              disabled={currentPage === totalPages || submitting}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="text-slate-400 hover:text-[#0c3966] disabled:opacity-30 transition flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              Halaman Berikutnya ›
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}