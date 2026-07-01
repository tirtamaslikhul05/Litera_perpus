import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import Loading from '../../components/Feedback/Loading';
import Toast from '../../components/Feedback/Toast';

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Semua Buku');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Mengambil seluruh data buku dari API
  const { data: books, loading } = useFetch(() => BookService.getAllBooks());

  // PERBAIKAN: Menyesuaikan nama genre dengan data kategori asli dari API (Bahasa Inggris)
  const genres = ['Semua Buku', 'Self-Development', 'History', 'Psychology', 'Fiksi Ilmiah', 'Sastra'];

  // Fungsi Filter Pencarian yang adaptif terhadap properti .genre atau .category dari API
  const filteredBooks = books?.filter(book => {
    const matchesKeyword = 
      book.title?.toLowerCase().includes(keyword.toLowerCase()) || 
      book.author?.toLowerCase().includes(keyword.toLowerCase());
    
    // Normalisasi pengecekan kategori/genre dari API
    const bookGenre = book.genre || book.category || '';
    const matchesGenre = selectedGenre === 'Semua Buku' || 
                         bookGenre.toLowerCase() === selectedGenre.toLowerCase();
                         
    return matchesKeyword && matchesGenre;
  });

  // Fungsi Tambah Wishlist dengan proteksi payload data murni
  const handleAddWishlistDirect = async (book) => {
    if (submitting || !book) return;
    setSubmitting(true);
    try {
      // Normalisasi ID menjadi Number dan amankan fallback property data
      const cleanId = book.id ? String(book.id) : String(Date.now());
      
      const payloadBook = {
        id: cleanId,
        title: book.title || 'Judul Tidak Tersedia',
        author: book.author || 'Anonim',
        cover: book.cover || book.image || 'https://via.placeholder.com/150',
        category: book.category || book.genre || 'Umum',
        stock: book.stock !== undefined ? Number(book.stock) : 1,
        synopsis: book.synopsis || book.description || ''
      };

      // Pastikan fungsi ditunggu (awaited) sepenuhnya sebelum navigasi berjalan
      await BookService.simulasikanTambahWishlist(payloadBook);
      
      setToast({ type: 'success', message: `"${payloadBook.title}" masuk ke Wishlist kamu!` });
      
      // Berikan jeda waktu ideal agar state localStorage tersimpan aman
      setTimeout(() => {
        navigate('/bookshelf');
      }, 1000);
    } catch (err) {
      console.error("Gagal menambahkan ke wishlist di halaman Search:", err);
      setToast({ type: 'error', message: 'Gagal menambahkan ke wishlist. Silakan coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">
      
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* ================= TOP HEADER BAR ================= */}
      <nav className="w-full bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <span onClick={()=> navigate('/dashboard')} className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</span>
        <div className="flex items-center gap-4">
          
          <button onClick={() => navigate('/profile')} className="p-1 rounded-full border border-gray-200 text-gray-600 flex items-center bg-transparent cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-6">
        
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-[#0c3966] tracking-tight">Eksplorasi Katalog</h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Temukan ribuan koleksi buku digital dan fisik untuk mendukung kegiatan akademik Anda di Perpustakaan Litera.
          </p>
        </div>

        {/* Input Pencarian */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 relative flex items-center">
            <svg className="absolute left-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Input kata kunci cari (judul/penulis)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white border border-slate-300 pl-11 pr-4 py-2.5 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#0c3966] focus:ring-1 focus:ring-[#0c3966] transition shadow-sm"
            />
          </div>
          <button className="bg-[#0c3966] hover:bg-[#092a4d] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition border-none cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Cari</span>
          </button>
        </div>

        {/* Pills Kategori */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition border cursor-pointer ${
                selectedGenre === g 
                  ? 'bg-[#0c3966] border-[#0c3966] text-white' 
                  : 'bg-[#e2e8f0] border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* ================= GRID DATA BUKU ================= */}
        <div className="pt-2">
          {loading ? (
            <Loading type="grid" />
          ) : filteredBooks?.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed text-xs font-medium text-slate-400">
              Buku yang Anda cari tidak dapat ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filteredBooks?.map((book) => {
                const itemCover = book.cover || book.image;
                return (
                  <div 
                    key={book.id} 
                    className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-slate-200 hover:shadow-md transition duration-200 relative"
                  >
                    {/* FIX UX: Tombol Ikon Wishlist Melayang Di Atas Cover Buku */}
                    <button 
                      onClick={() => handleAddWishlistDirect(book)}
                      disabled={submitting}
                      className="absolute top-5 left-5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-amber-500 shadow flex items-center justify-center transition border-none cursor-pointer backdrop-blur-sm disabled:opacity-50"
                      title="Tambah ke Wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                    </button>

                    <div className="p-3 relative flex-1">
                      {/* Status badge */}
                      <span className={`absolute top-5 right-5 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-10 ${
                        book.stock === 0 ? 'bg-rose-500 text-white' : book.stock <= 2 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {book.stock === 0 ? 'STOK HABIS' : book.stock <= 2 ? 'TERBATAS' : 'TERSEDIA'}
                      </span>

                      {/* Cover Buku */}
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 border border-slate-100 mb-3 cursor-pointer" onClick={() => navigate(`/catalog/book/${book.id}`)}>
                        <img src={itemCover} alt={book.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-300" />
                      </div>

                      {/* Metadata Detail Buku */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[#0c3966] line-clamp-1 leading-snug group-hover:underline cursor-pointer" onClick={() => navigate(`/catalog/book/${book.id}`)}>
                          {book.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          {book.author} • <span className="text-slate-400 font-normal">{book.year || '2026'}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pt-0.5 font-normal">
                          {book.description || 'Kisah inspiratif dan materi edukatif pilihan berkualitas tinggi.'}
                        </p>
                      </div>
                    </div>

                    {/* Bagian Bawah Card */}
                    <div className="p-3 pt-0 flex items-center justify-between border-t border-slate-50 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-medium">Sisa Stok</span>
                        <span className={`text-[11px] font-bold ${book.stock === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                          {book.stock ?? 0} Buku
                        </span>
                      </div>

                      <button 
                        onClick={() => navigate(`/catalog/book/${book.id}`)} 
                        className="bg-[#0c3966] hover:bg-[#092a4d] text-white px-4 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer border-none"
                      >
                        {book.stock === 0 ? 'Detail' : 'Pinjam'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= BOTTOM STICKY NAVIGATION ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2.5 px-4 flex items-center justify-around z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-gray-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        <button onClick={() => navigate('/catalog/search')} className="flex flex-col items-center gap-1 text-[#0c3966] bg-transparent border-none cursor-pointer">
          <div className="px-4 py-1 bg-blue-50 rounded-full text-[#0c3966]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <span className="text-[10px] font-bold">Cari</span>
        </button>
        <button onClick={() => navigate('/bookshelf')} className="flex flex-col items-center gap-1 text-gray-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
          <span className="text-[10px] font-medium">Rak Buku</span>
        </button>
        <button onClick={() => navigate('/fines/fines-status')} className="flex flex-col items-center gap-1 text-gray-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span className="text-[10px] font-medium">Denda</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-gray-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>

    </div>
  );
}