import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
<<<<<<< HEAD
import useFetch from '../../hooks/useFetch';
=======
import useFetch from '../hooks/useFetch';
>>>>>>> origin/admin_part1

export default function Overview() {
  const navigate = useNavigate();
  
  // State Toast Lokal Mandiri
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 1. Ambil data profil user dari API
  const { data: user, loading: userLoading } = useFetch(() => BookService.getUserProfileComplete());
<<<<<<< HEAD
  const { data: allBooks = [], loading: booksLoading } = useFetch(() => BookService.getAllBooks(), []);

=======

  // 2. AMBIL SEMUA DATA BUKU DARI BACKEND/SERVICE SECARA NYATA
  // Kita berikan fallback array kosong [] agar tidak pecah saat loading
  const { data: allBooksData, loading: booksLoading } = useFetch(() => BookService.getAllBooks(), []);
  
  // Ambil data array buku yang asli
  const allBooks = allBooksData?.books || allBooksData || [];
>>>>>>> origin/admin_part1

  // ================= LOGIKA REKOMENDASI PINTAR DARI DATA UTAMA =================
  const recommendedBooks = useMemo(() => {
    try {
      // Jika data buku belum beres dimuat dari API, berikan array kosong dulu
      if (allBooks.length === 0) return [];

      // 1. Ambil data buku sirkulasi aktif/riwayat dari localStorage milik user
      const localBooksData = localStorage.getItem('litera_books');
      const userBooks = localBooksData ? JSON.parse(localBooksData) : [];

      if (userBooks.length === 0) {
        // Fallback 1: Jika user belum punya riwayat baca, ambil 4 buku pertama dari data API
        return allBooks.slice(0, 4);
      }

      // 2. Petakan kategori apa saja yang paling sering dibuka/dibaca oleh user
      const categoryCounts = {};
      userBooks.forEach(userBook => {
        // Cari data buku asli di data API untuk mencocokkan kategorinya
        const matchedBook = allBooks.find(b => b.id === Number(userBook.id) || b.title?.toLowerCase() === userBook.title?.toLowerCase());
        if (matchedBook && matchedBook.category) {
          categoryCounts[matchedBook.category] = (categoryCounts[matchedBook.category] || 0) + 1;
        }
      });

      // 3. Urutkan kategori dari yang paling disukai
      const favoriteCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);

      if (favoriteCategories.length === 0) {
        return allBooks.slice(0, 4);
      }

      // 4. Saring data API: Ambil buku kategori sejenis yang BELUM pernah dibaca user
      const userBookTitles = userBooks.map(b => b.title?.toLowerCase());
      
      let filteredRecommendations = allBooks.filter(book => {
        const matchesCategory = favoriteCategories.includes(book.category);
        const alreadyRead = userBookTitles.includes(book.title?.toLowerCase());
        return matchesCategory && !alreadyRead;
      });

      // 5. Pengisi Slot Kosong: Jika kurang dari 4, penuhi dengan sisa buku lain dari data API
      if (filteredRecommendations.length < 4) {
        const remainingBooks = allBooks.filter(book => !filteredRecommendations.some(r => r.id === book.id));
        filteredRecommendations = [...filteredRecommendations, ...remainingBooks];
      }

      // Potong pas maksimal 4 buku untuk dikembalikan ke UI
      return filteredRecommendations.slice(0, 4);

    } catch (error) {
      console.error("Gagal memproses rekomendasi pintar:", error);
      return allBooks.slice(0, 4);
    }
  }, [user, allBooks]); // Memantau perubahan user dan daftar data buku dari API

  // Fungsi memicu Toast info
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBookClick = (book) => {
    // Normalisasi status pengecekan dari API (antisipasi huruf besar/kecil)
    const currentStatus = book.status?.toUpperCase();

    if (currentStatus === 'DIPINJAM' || currentStatus === 'BORROWED') {
      triggerToast(`Buku "${book.title}" sedang dipinjam anggota lain.`);
    } else {
      triggerToast(`Membuka katalog "${book.title}"...`);
      setTimeout(() => navigate(`/catalog/book/${book.id}`), 800);
    }
  };

  // LOADING HANDLER (Menunggu profil DAN data katalog buku selesai dimuat)
  if (userLoading || booksLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7fa]">
        <div className="w-10 h-10 border-4 border-slate-200 border-b-[#0c3966] rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium tracking-wide mt-3">Sinkronisasi data Litera...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f7fa] font-sans pb-24 text-[#1e293b] relative">
      
      {/* ELEMEN TOAST MURNI TAILWIND */}
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white text-xs py-2.5 px-5 rounded-xl shadow-lg font-medium transition-all duration-300">
          {toastMessage}
        </div>
      )}

      {/* ================= 1. TOP NAVBAR ================= */}
      <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <span className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</span>
        <div className="flex items-center gap-4">
<<<<<<< HEAD
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors relative bg-transparent border-none cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
=======
          
>>>>>>> origin/admin_part1
          <button onClick={() => navigate('/profile')} className="p-1 rounded-full border border-gray-200 text-gray-600 flex items-center bg-transparent cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* ================= 2. HERO BANNER ================= */}
        <div className="w-full bg-[#0c3966] text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-md bg-gradient-to-br from-[#0c3966] to-[#082a4d]">
          <div className="absolute right-[-40px] top-[-20px] w-56 h-56 border-[24px] border-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute right-[40px] bottom-[-60px] w-40 h-40 bg-white/10 rounded-full pointer-events-none"></div>
          
          <div className="max-w-xl z-10 relative">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">Selamat Datang, {user?.name || 'Pembaca'}!</h2>
            <p className="text-xs md:text-sm text-gray-200 font-normal mt-2 leading-relaxed opacity-90">
              Temukan jendela dunia melalui ribuan koleksi buku digital dan fisik kami. Mari mulai petualangan membaca Anda hari ini.
            </p>
          </div>
        </div>

        {/* ================= 3. INFO CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0c3966] rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Buku Sedang Dipinjam</span>
                <span className="text-sm font-bold text-gray-800">{user?.stats?.borrowedBooks ?? 0} Buku</span>
              </div>
            </div>
            <button onClick={() => navigate('/bookshelf')} className="text-xs font-bold text-[#0c3966] hover:underline bg-transparent border-none cursor-pointer">Lihat Detail</button>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Total Denda</span>
                <span className="text-sm font-bold text-red-600">
                  Rp {user?.totalFines ? user.totalFines.toLocaleString('id-ID') : '0'}
                </span>
              </div>
            </div>
            <button onClick={() => navigate('/fines/fines-status')} className="text-xs font-bold text-[#0c3966] hover:underline bg-transparent border-none cursor-pointer">Bayar Sekarang</button>
          </div>
        </div>

        {/* ================= 4. LAYANAN UTAMA ================= */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 tracking-wide">Layanan Utama</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* 1. Cari Buku */}
            <div onClick={() => navigate('/catalog/search')} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-[#0c3966] text-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0c3966] transition-colors">Cari Buku</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Telusuri ribuan katalog buku fisik dan digital.</p>
            </div>

            {/* 2. Peminjaman */}
            <div onClick={() => navigate('/bookshelf')} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-amber-400 text-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10M7 12h10M7 17h10"/></svg>
              </div>
              <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0c3966] transition-colors">Peminjaman</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Ajukan pinjaman baru atau lihat antrian.</p>
            </div>

            {/* 3. Rak Buku */}
            <div onClick={() => navigate('/bookshelf')} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-cyan-400 text-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
              </div>
              <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0c3966] transition-colors">Rak Buku</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Koleksi buku favorit dan riwayat bacaanmu.</p>
            </div>

            {/* PERBAIKAN BARU: 4. Baca Buku */}
            <div onClick={() => navigate('/bookshelf')} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0c3966] transition-colors">Baca Buku</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Akses ribuan E-Book langsung dari perangkatmu.</p>
            </div>

            {/* PERBAIKAN BARU: 5. Status Denda */}
            <div onClick={() => navigate('/fines/fines-status')} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-rose-400 text-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M12 14v2"/></svg>
              </div>
              <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0c3966] transition-colors">Status Denda</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Pantau kewajiban dan lunasi denda keterlambatan.</p>
            </div>

            {/* PERBAIKAN BARU: 6. Pengembalian */}
            <div onClick={() => navigate('/fines/return-status')} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-slate-400 text-white rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
              </div>
              <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0c3966] transition-colors">Pengembalian</h4>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Prosedur pengembalian dan scan barcode buku.</p>
            </div>

          </div>
        </div>

        {/* ================= 5. REKOMENDASI UNTUKMU (DARI API DATABASE ASLI) ================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 tracking-wide">Rekomendasi Untukmu</h3>
            <button onClick={() => navigate('/catalog/search')} className="text-xs font-bold text-[#0c3966] flex items-center gap-1 hover:underline bg-transparent border-none cursor-pointer">
              <span>Lihat Semua</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedBooks.length === 0 ? (
              <div className="col-span-full bg-white border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400 font-medium rounded-xl">
                Tidak ada data buku yang tersedia saat ini.
              </div>
            ) : (
              recommendedBooks.map((book) => {
                const isAvailable = book.status?.toUpperCase() === 'TERSEDIA';
                return (
                  <div 
                    key={book.id} 
                    onClick={() => handleBookClick(book)}
                    className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-[#0c3966]/20 transition-all animate-fadeIn"
                  >
                    <div>
                      <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative mb-3">
                        <img src={book.image || book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm ${isAvailable ? 'bg-amber-100 text-amber-700' : 'bg-gray-800 text-white'}`}>
                          {book.status || 'TERSEDIA'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#0c3966] transition-colors">{book.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] text-gray-400 font-medium truncate max-w-[60%]">{book.author}</p>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 rounded max-w-[35%] truncate">{book.category || 'Umum'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ================= 6. BOTTOM NAVIGATION ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2.5 px-4 flex items-center justify-around z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button className="flex flex-col items-center gap-1 text-[#0c3966] bg-transparent border-none cursor-pointer">
          <div className="px-4 py-1 bg-blue-50 rounded-full text-[#0c3966]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3-10 9h3v8a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-8h3L12 3z"/></svg>
          </div>
          <span className="text-[10px] font-bold">Beranda</span>
        </button>
        <button onClick={() => navigate('/catalog/search')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span className="text-[10px] font-medium">Cari</span>
        </button>
        <button onClick={() => navigate('/bookshelf')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
          <span className="text-[10px] font-medium">Rak Buku</span>
        </button>
        <button onClick={() => navigate('/fines/fines-status')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span className="text-[10px] font-medium">Denda</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>

    </div>
  );
}