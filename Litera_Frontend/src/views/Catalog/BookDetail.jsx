import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import Toast from '../../components/Feedback/Toast';
import Loading from '../../components/Feedback/Loading';

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [formatBuku, setFormatBuku] = useState('digital');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { data: book, loading } = useFetch(() => BookService.getBookDetail(bookId), [bookId]);

  const handlePinjam = async () => {
    if (!book) return;
    setSubmitting(true);
    try {
      await BookService.simulasikanTransaksiPinjam(book, formatBuku);
      setToast({ type: 'success', message: 'Sirkulasi buku berhasil didaftarkan ke sistem!' });
      setTimeout(() => navigate('/catalog/search'), 1200);
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal memproses pinjaman.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTambahWishlist = async () => {
    if (!book || submitting) return;
    setSubmitting(true);
    try {
      // Cari ID dari params atau dari objek detail buku, lalu paksa menjadi tipe Number
      const exactId = book.id ? String(book.id) : String(bookId);

      const payloadBook = {
        id: exactId,
        title: book.title || 'Judul Tidak Tersedia',
        author: book.author || 'Anonim',
        cover: book.cover || book.image || 'https://via.placeholder.com/150',
        category: book.genre || book.category || 'Umum',
        stock: book.stock !== undefined ? Number(book.stock) : 1,
        synopsis: book.synopsis || ''
      };

      await BookService.simulasikanTambahWishlist(payloadBook);
      
      setToast({ type: 'success', message: 'Buku berhasil ditambahkan ke Wishlist kamu!' });
      
      // Diarahkan langsung ke halaman Rak Buku bagian Wishlist agar perubahannya kelihatan
      setTimeout(() => {
        navigate('/bookshelf');
      }, 1000);
    } catch (err) {
      console.error("Gagal menambahkan ke wishlist di halaman Detail Buku:", err);
      setToast({ type: 'error', message: 'Gagal menambahkan ke wishlist.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading type="details" />;

  const isBookAvailable = book?.stock > 0 || book?.isAvailable;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 text-slate-800 font-sans">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* ================= TOP NAVBAR ================= */}
      <nav className="bg-[#f8fafc] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="text-[#0c3966] font-bold text-sm bg-transparent border-none flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <span>←</span> Litera
        </button>
        <div className="flex items-center gap-4">
          
          <button onClick={() => navigate('/profile')} className="p-0.5 rounded-full border border-slate-200 text-slate-600 bg-transparent flex items-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Detail Kartu Informasi */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col sm:flex-row gap-6 shadow-sm">
          <div className="w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm flex-shrink-0 mx-auto sm:mx-0">
            <img src={book?.cover} alt={book?.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-[#eff6ff] text-[#2563eb] text-[10px] font-bold px-3 py-1 rounded-full">
                {book?.genre || 'Umum'}
              </span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${isBookAvailable ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-rose-100 text-rose-700'}`}>
                {isBookAvailable ? 'Tersedia' : 'Stok Habis'}
              </span>
            </div>

            <h1 className="text-xl font-bold text-[#0c3966] tracking-tight">{book?.title}</h1>
            <p className="text-xs text-slate-500 font-semibold">
              Penulis: <span className="text-slate-700">{book?.author}</span>
            </p>
            <p className="text-xs text-slate-400 font-normal text-justify leading-relaxed pt-2 border-t border-slate-100">
              {book?.synopsis}
            </p>
          </div>
        </div>

        {/* Pilih Format Buku */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#0c3966] tracking-tight">Pilih Format Buku</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setFormatBuku('digital')} 
              className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition shadow-sm ${
                formatBuku === 'digital' ? 'border-[#2563eb] bg-[#eff6ff]' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formatBuku === 'digital' ? 'bg-[#2563eb] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
                </div>
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-[#0c3966]">e-book (Digital)</p>
                  <p className="text-[11px] text-slate-400 font-medium">Baca langsung di aplikasi Litera</p>
                </div>
              </div>
              {formatBuku === 'digital' && (
                <div className="w-5 h-5 rounded-full bg-[#2563eb] flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>

            <div 
              onClick={() => setFormatBuku('fisik')} 
              className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition shadow-sm ${
                formatBuku === 'fisik' ? 'border-[#2563eb] bg-[#eff6ff]' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formatBuku === 'fisik' ? 'bg-[#2563eb] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-bold text-slate-700">cetak (Fisik)</p>
                  <p className="text-[11px] text-slate-400 font-medium">Ambil di meja sirkulasi perpustakaan</p>
                </div>
              </div>
              {formatBuku === 'fisik' && (
                <div className="w-5 h-5 rounded-full bg-[#2563eb] flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informasi Peminjaman Box */}
        <div className="bg-[#f1f5f9] border border-slate-200/60 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="text-slate-500 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#0c3966]">Informasi Peminjaman</h4>
              <p className="text-[11px] text-slate-500 font-medium">Durasi pinjam standar adalah 7 hari kalender.</p>
            </div>
          </div>
          <div className="bg-[#e2e8f0] border border-slate-300/50 rounded-xl px-5 py-2.5 text-center w-full sm:w-auto flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Tanggal Kembali</span>
            <span className="text-sm font-extrabold text-[#0c3966] mt-0.5">15 Juni 2026</span>
            <span className="text-[9px] font-semibold text-slate-400 mt-0.5">[Otomatis +7 hari]</span>
          </div>
        </div>

        {/* ================= FIX UX: ACTION BUTTONS DAN WISHLIST DUA KONDISI ================= */}
        <div className="flex items-center gap-3 w-full">
          {isBookAvailable ? (
            <>
              {/* Tombol Pinjam Utama */}
              <button 
                onClick={handlePinjam} 
                disabled={submitting} 
                className="flex-1 bg-[#0c3966] hover:bg-[#092a4d] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 cursor-pointer border-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                <span>{submitting ? 'Memproses Validasi...' : 'Konfirmasi Pinjam'}</span>
              </button>

              {/* Tombol Simpan Wishlist (Bersebelahan) */}
              <button 
                onClick={handleTambahWishlist}
                disabled={submitting}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition shadow-sm border-none cursor-pointer flex items-center justify-center disabled:opacity-50"
                title="Simpan ke Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
            </>
          ) : (
            /* Jika Stok Habis: Tombol Wishlist Mengambil Alih Penuh Halaman */
            <button 
              onClick={handleTambahWishlist} 
              disabled={submitting} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 cursor-pointer border-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              <span>{submitting ? 'Menyimpan...' : 'Simpan ke Wishlist (Stok Habis)'}</span>
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-400 font-medium tracking-wide">
          Dengan menekan tombol di atas, Anda menyetujui syarat dan ketentuan perpustakaan Litera.
        </p>

      </div>
    </div>
  );
}