import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService'; 
import Loading from '../../components/Feedback/Loading';
import Toast from '../../components/Feedback/Toast';

export default function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  // ================= STATE UTAMA =================
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 Jam = 3600 detik

  // Ref agar timer selalu mendapatkan halaman terbaru tanpa stale closure
  const currentPageRef = useRef(currentPage);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // ================= EFFECT 1: AMBIL DATA BUKU =================
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const data = await BookService.getBookDetail(bookId);
        setBook(data);
        
        if (data && data.lastReadPage && data.lastReadPage > 0) {
          setCurrentPage(data.lastReadPage);
        } else {
          setCurrentPage(1);
        }
      } catch (err) {
        setToast({ type: 'error', message: 'Gagal memuat konten buku.' });
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);

  // ================= EFFECT 2: COUNTDOWN TIMER 1 JAM =================
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

  // ================= FUNCTIONS HANDLER (SIMPAN DATA) =================
  
  // 1. Fungsi Otomatis saat Waktu Habis (Keluar Tengah Jalan)
  const handleAutoSaveAndExit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setToast({ type: 'error', message: 'Waktu baca habis! Menyimpan progres...' });
    
    try {
      const totalPagesSafe = book?.totalPages || 2;
      await BookService.simulasikanUpdateProgresBaca(
        bookId, 
        currentPageRef.current, 
        totalPagesSafe,
        false // <--- FALSE: Keluar otomatis karena waktu habis, jangan set 'selesai'
      );
      setTimeout(() => navigate('/bookshelf'), 1500);
    } catch (err) {
      navigate('/bookshelf');
    }
  };

  // 2. Fungsi Manual saat Klik Tombol Back (←)
  const handleBackAndExit = async () => {
    if (!book || submitting) return;
    setSubmitting(true);
    
    try {
      const totalPages = book.totalPages || 2;
      await BookService.simulasikanUpdateProgresBaca(bookId, currentPage, totalPages, false); // <--- FALSE: Hanya simpan progres halaman terakhir
      setToast({ type: 'success', message: `Progres disimpan! Terakhir di halaman ${currentPage}.` });
      setTimeout(() => navigate('/bookshelf'), 1200);
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal menyimpan progres.' });
      setSubmitting(false);
    }
  };

  // 3. Fungsi Manual saat Klik Tombol Utama "Selesai Membaca" di Pojok Kanan
  const handleFinishedReading = async () => {
    if (!book || submitting) return;
    setSubmitting(true);
    
    try {
      const totalPages = book.totalPages || 2;
      
      // Jika user klik tombol Selesai Membaca, ubah status jadi true (tamat)
      await BookService.simulasikanUpdateProgresBaca(bookId, currentPage, totalPages, true); // <--- TRUE: Resmi tamat
      
      setToast({ type: 'success', message: 'Selamat! Anda telah menyelesaikan buku ini.' });
      setTimeout(() => navigate('/bookshelf'), 1200);
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal memproses status selesai.' });
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

  // Gunakan total halaman asli milik data buku
  const totalPages = book.totalPages || 2;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none">
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* ================= HEADER PEMBACA ================= */}
      <header className="bg-white px-6 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackAndExit} // <--- Panggil fungsi back mandiri
            disabled={submitting}
            className="text-slate-600 hover:text-slate-900 font-bold text-lg bg-transparent border-none cursor-pointer disabled:opacity-30"
            title="Simpan Progres dan Kembali"
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
          onClick={handleFinishedReading} // <--- Panggil fungsi tamat mandiri
          disabled={submitting}
          className="bg-[#0c3966] hover:bg-[#092a4d] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
        >
          <span>{submitting ? 'Menyimpan...' : 'Selesai Membaca'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-4">
        
        <div className="bg-[#f1f5f9] rounded-xl p-2 flex flex-wrap items-center justify-between gap-2 px-4 border border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm ${
              currentPage === totalPages 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-[#fcd34d] text-amber-900'
            }`}>
              <span>Status: {currentPage === totalPages ? 'Halaman Akhir Tercapai' : 'Sedang Dibaca'}</span>
            </div>
            
            <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
              timeLeft < 300 
                ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' 
                : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium italic">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
            <span>Akses otomatis berakhir saat waktu habis.</span>
          </div>
        </div>

        {/* Kertas Halaman Buku */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <h2 className="text-base font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-3">
            Halaman {currentPage}
          </h2> 

          <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-600 text-justify font-normal">
            <p>
              Ini adalah lembaran cerita dari buku <strong>{book.title}</strong> pada halaman ke-{currentPage}. Halaman ini memuat baris-baris ilmu dan wawasan berharga yang siap memperkaya khazanah berpikir Anda selama masa peminjaman digital di Litera.
            </p>
            <div className="w-full max-w-2xl mx-auto my-6 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={book.cover || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800"} 
                alt={book.title} 
                className="w-full h-auto object-cover max-h-[320px]"
              />
            </div>
          </div>

          {/* Kontrol Navigasi Halaman */}
          <div className="border-t border-slate-100 pt-6 flex items-center justify-between text-xs font-bold text-slate-500">
            <button 
              disabled={currentPage === 1 || submitting}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="text-slate-400 hover:text-[#0c3966] disabled:opacity-30 transition flex items-center gap-1 bg-transparent border-none cursor-pointer text-xs font-bold"
            >
              <span>‹</span> Halaman Sebelumnya
            </button>
            
            <span className="text-slate-400 font-medium text-xs">
              Halaman <span className="text-slate-700 font-bold">{currentPage}</span> dari {totalPages}
            </span>

            <button 
              disabled={currentPage === totalPages || submitting}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="text-slate-400 hover:text-[#0c3966] disabled:opacity-30 transition flex items-center gap-1 bg-transparent border-none cursor-pointer text-xs font-bold"
            >
              Halaman Berikutnya <span>›</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}