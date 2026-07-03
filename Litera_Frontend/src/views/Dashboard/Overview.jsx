// src/views/Dashboard/Overview.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import ProfileService from '../../core/services/ProfileService';
import FineService from '../../core/services/FineService';
import useFetch from '../../hooks/useFetch';
import BottomNav from '../../components/Navigation/BottomNav';

export default function Overview() {
  const navigate = useNavigate();
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Fetch Data
  const { data: userResponse, loading: userLoading } = useFetch(() => ProfileService.getProfile());
  const { data: finesData } = useFetch(() => FineService.getTotalFines());
  const { data: booksResponse, loading: booksLoading } = useFetch(() => 
    BookService.searchBooks({ per_page: 20 })
  );

  const user = userResponse?.data || userResponse;
  const allBooks = booksResponse?.data || [];

  // Rekomendasi Buku
  const recommendedBooks = useMemo(() => {
    if (!allBooks.length) return [];
    return [...allBooks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [allBooks]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBookClick = (book) => {
    navigate(`/catalog/book/${book.id}`);
  };

  if (userLoading || booksLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f7fa]">
        <div className="w-10 h-10 border-4 border-slate-200 border-b-[#0c3966] rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium tracking-wide mt-3">Memuat dashboard Litera...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f7fa] font-sans pb-24 text-[#1e293b] relative">
      
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white text-xs py-2.5 px-5 rounded-xl shadow-lg font-medium transition-all duration-300">
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <span className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</span>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>
          <button onClick={() => navigate('/profile')} className="p-1 rounded-full border border-gray-200 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Hero Banner */}
        <div className="w-full bg-[#0c3966] text-white rounded-2xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-[#0c3966] to-[#082a4d]">
          <div className="max-w-xl relative z-10">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              Selamat Datang, {user?.name || 'Pembaca'}!
            </h2>
            <p className="text-sm text-gray-200 mt-2 opacity-90">
              Temukan jendela dunia melalui koleksi buku digital dan fisik kami.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0c3966] rounded-xl flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Buku Sedang Dipinjam</span>
                <span className="text-lg font-bold text-gray-800">0 Buku</span>
              </div>
            </div>
            <button onClick={() => navigate('/bookshelf')} className="text-xs font-bold text-[#0c3966] hover:underline">Lihat Detail</button>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 block">Total Denda</span>
                <span className="text-lg font-bold text-red-600">
                  Rp {(finesData?.data?.total_denda || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <button onClick={() => navigate('/fines/fines-status')} className="text-xs font-bold text-[#0c3966] hover:underline">Bayar</button>
          </div>
        </div>

        {/* Rekomendasi Buku */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 tracking-wide">Rekomendasi Untukmu</h3>
            <button 
              onClick={() => navigate('/catalog/search')} 
              className="text-xs font-bold text-[#0c3966] hover:underline"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedBooks.map((book) => (
              <div 
                key={book.id} 
                onClick={() => handleBookClick(book)}
                className="bg-white border border-gray-100 rounded-xl p-3 cursor-pointer hover:shadow-md transition-all hover:border-[#0c3966]/30"
              >
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img 
                    src={book.cover} 
                    alt={book.nama_buku} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h4 className="text-xs font-bold line-clamp-2 leading-tight">{book.nama_buku}</h4>
                <p className="text-[10px] text-gray-500 mt-1">
                  {book.jumlah_tersedia > 0 ? `Tersedia (${book.jumlah_tersedia})` : 'Stok Habis'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
