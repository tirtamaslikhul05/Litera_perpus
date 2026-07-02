// src/views/Catalog/Search.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../services/BookService';
import useFetch from '../../hooks/useFetch';

export default function Search() {
  const navigate = useNavigate();
  
  const [keyword, setKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Semua Buku');
  const [toast, setToast] = useState(null);

  // Fetch buku dari API
  const { data: booksResponse, loading } = useFetch(
    () => BookService.searchBooks({ search: keyword, per_page: 30 }), 
    [keyword]
  );

  const allBooks = booksResponse?.data || [];

  const genres = ['Semua Buku', 'Self-Development', 'History', 'Psychology', 'Fiksi Ilmiah', 'Sastra'];

  // Filter client-side (genre)
  const filteredBooks = allBooks.filter(book => {
    const matchesKeyword = 
      book.nama_buku?.toLowerCase().includes(keyword.toLowerCase()) || 
      book.isbn?.toLowerCase().includes(keyword.toLowerCase());

    const matchesGenre = selectedGenre === 'Semua Buku';

    return matchesKeyword && matchesGenre;
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBorrow = async (book) => {
    try {
      await BookService.borrowBook(book.id);
      showToast(`Peminjaman "${book.nama_buku}" berhasil diajukan!`);
    } catch (err) {
      showToast(err.message || 'Gagal mengajukan peminjaman', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">
      
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#0c3966] text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Top Nav */}
      <nav className="w-full bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <span className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="p-1 rounded-full border border-gray-200 text-gray-600">
            👤
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0c3966] tracking-tight">Eksplorasi Katalog</h2>
          <p className="text-xs text-slate-500 mt-1">Temukan buku yang Anda butuhkan</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari judul buku atau ISBN..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-white border border-slate-300 pl-12 pr-4 py-3 rounded-xl text-sm focus:border-[#0c3966] focus:ring-1 focus:ring-[#0c3966] outline-none"
          />
          <svg className="absolute left-4 top-3.5 text-slate-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>

        {/* Genre Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-5 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedGenre === genre 
                  ? 'bg-[#0c3966] text-white' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">Memuat buku...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Tidak ada buku yang ditemukan.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-all group">
                <div className="aspect-[3/4] bg-slate-100 relative">
                  <img 
                    src={book.cover} 
                    alt={book.nama_buku} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded ${
                    book.jumlah_tersedia > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {book.jumlah_tersedia > 0 ? 'Tersedia' : 'Habis'}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 leading-tight text-slate-800 group-hover:text-[#0c3966]">
                    {book.nama_buku}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{book.isbn}</p>

                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => navigate(`/catalog/book/${book.id}`)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-semibold transition"
                    >
                      Detail
                    </button>
                    {book.jumlah_tersedia > 0 && (
                      <button 
                        onClick={() => handleBorrow(book)}
                        className="flex-1 bg-[#0c3966] hover:bg-[#092a4d] text-white py-2 rounded-lg text-xs font-semibold transition"
                      >
                        Pinjam
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}