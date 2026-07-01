import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../hooks/useFetch';
import Loading from '../../components/Feedback/Loading';

export default function Bookshelf() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wishlist');
  const { data: books, loading, error } = useFetch(
    () => BookService.getBookshelf(activeTab), 
    [activeTab]
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">
      
      {/* ================= TOP NAVBAR ================= */}
      <nav className="bg-[#f8fafc] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <span onClick={()=> navigate('/dashboard')} className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</span>
        <div className="flex items-center gap-4">
          
          <button onClick={() => navigate('/profile')} className="p-0.5 rounded-full border border-slate-200 text-slate-600 bg-transparent flex items-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-6xl mx-auto px-6 pt-4 space-y-6">
        
        {/* Judul & Deskripsi */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rak Buku</h1>
          <p className="text-xs text-slate-500 font-medium">
            Kelola daftar keinginan dan buku yang sedang kamu baca.
          </p>
        </div>

        {/* Tab Switcher Menyilang Penuh */}
        <div className="w-full border-b border-slate-200 flex text-xs font-bold">
          <button 
            onClick={() => setActiveTab('wishlist')} 
            className={`w-1/2 flex items-center justify-center gap-2 pb-3 transition-all border-b-2 bg-transparent cursor-pointer ${
              activeTab === 'wishlist' 
                ? 'border-[#0c3966] text-[#0c3966]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>📁</span> Wishlist
          </button>
          <button 
            onClick={() => setActiveTab('pinjaman')} 
            className={`w-1/2 flex items-center justify-center gap-2 pb-3 transition-all border-b-2 bg-transparent cursor-pointer ${
              activeTab === 'pinjaman' 
                ? 'border-[#0c3966] text-[#0c3966]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>📖</span> Pinjaman Aktif
          </button>
        </div>

        {/* ================= CONTAINER GRID BUKU ================= */}
        <div>
          {loading ? (
            <Loading type="grid" />
          ) : books?.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed text-xs font-medium text-slate-400">
              {activeTab === 'wishlist' 
                ? 'Belum ada buku di dalam daftar keinginanmu.' 
                : 'Kamu belum memiliki daftar pinjaman aktif saat ini.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {books?.map((book, index) => {
                const isBookAvailable = book.stock > 0 || book.isAvailable;
                const cleanId = book.id || book.bookId || book._id || (book.book && book.book.id);
                const uniqueKey = cleanId ? `book-${activeTab}-${cleanId}` : `book-idx-${activeTab}-${index}`;
                const isSelesai = activeTab === 'pinjaman' && book.status === 'selesai';

                return (
                  <div 
                    key={uniqueKey} 
                    className={`rounded-xl border overflow-hidden shadow-sm flex flex-col justify-between group hover:border-slate-200 transition duration-200 ${
                      isSelesai ? 'bg-emerald-50/30 border-emerald-100 shadow-emerald-50/20' : 'bg-white border-slate-100'
                    }`}
                  >
                    {/* Area Cover Atas */}
                    <div className="p-3 relative">
                      
                      {/* Badge Status Kondisional */}
                      {activeTab === 'pinjaman' ? (
                        isSelesai ? (
                          <span className="absolute top-5 right-5 text-[9px] font-black px-2 py-0.5 rounded bg-emerald-600 text-white shadow-sm z-10 uppercase tracking-wider animate-pulse">
                            Selesai 🎉
                          </span>
                        ) : (
                          <span className="absolute top-5 right-5 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 shadow-sm z-10 uppercase">
                            Dipinjam
                          </span>
                        )
                      ) : isBookAvailable ? (
                        <span className="absolute top-5 right-5 text-[9px] font-bold px-2 py-0.5 rounded bg-[#fcd34d] text-amber-950 shadow-sm z-10 uppercase">
                          TERSEDIA
                        </span>
                      ) : null}

                      {/* Frame Gambar Cover */}
                      <div 
                        className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 border border-slate-100 relative cursor-pointer"
                        onClick={() => cleanId && navigate(`/catalog/book/${cleanId}`)}
                      >
                        <img src={book.cover || 'https://via.placeholder.com/150'} alt={book.title} className="w-full h-full object-cover" />
                        
                        {/* Ikon Centang Hijau Melayang tepat di tengah Cover jika Selesai Baca */}
                        {isSelesai && (
                          <div className="absolute inset-0 bg-emerald-950/10 flex items-center justify-center backdrop-blur-[0.5px]">
                            <div className="bg-white/95 p-2.5 rounded-full shadow-md flex items-center justify-center border border-emerald-200 transform scale-110">
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* Overlay Khusus untuk Buku yang Stok Habis di Tab Wishlist */}
                        {activeTab === 'wishlist' && !isBookAvailable && (
                          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-sm font-black text-rose-500 tracking-wide mt-1 drop-shadow-sm">STOK HABIS</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Tombol Aksi Bawah */}
                    <div className="p-3.5 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 
                          className={`text-xs font-bold line-clamp-2 leading-tight hover:underline cursor-pointer ${
                            isSelesai ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'
                          }`}
                          onClick={() => cleanId && navigate(`/catalog/book/${cleanId}`)}
                        >
                          {book.title}
                        </h3>
                        
                        {/* Status Label Progres Baca Tambahan */}
                        {isSelesai ? (
                          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <span>✅</span> 100% Selesai dibaca
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            {book.author}
                          </p>
                        )}
                      </div>

                      {/* Tombol Utama */}
                      <div>
                        {activeTab === 'pinjaman' ? (
                          <button
                            onClick={() => navigate(`/catalog/reader/${cleanId}`)}
                            className={`w-full py-1.5 rounded-lg text-xs font-bold transition shadow-sm border-none cursor-pointer text-white ${
                              isSelesai ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            {isSelesai ? 'Baca Lagi' : 'Mulai Baca'}
                          </button>
                        ) : isBookAvailable ? (
                          <button
                            onClick={() => navigate(`/catalog/book/${cleanId}`)}
                            className="w-full bg-[#0c3966] hover:bg-[#092a4d] text-white py-1.5 rounded-lg text-xs font-bold transition shadow-sm border-none cursor-pointer"
                          >
                            Pinjam
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-[#e2e8f0] text-slate-400 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed border-none"
                          >
                            Stok Habis
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= BOTTOM MENU NAVIGASI ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-4 flex items-center justify-around z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        
        <button onClick={() => navigate('/catalog/search')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span className="text-[10px] font-medium">Cari</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white bg-transparent border-none cursor-pointer">
          <div className="px-5 py-1 bg-[#0c3966] rounded-full text-white shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
          </div>
          <span className="text-[10px] font-bold text-[#0c3966]">Rak Buku</span>
        </button>

        <button onClick={() => navigate('/fines/fines-status')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span className="text-[10px] font-medium">Denda</span>
        </button>

        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>

    </div>
  );
}