import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import Loading from '../../components/Feedback/Loading';

export default function ReturnStatus() {
  const navigate = useNavigate();
  const [activeQrBook, setActiveQrBook] = useState(null);

  // Fetch data pinjaman aktif dari API
  const { data: returnData = {}, loading, refresh } = useFetch(
    () => BookService.getBookshelf('loans'), 
    []
  );

  const pendingReturns = returnData || [];
  const completedHistory = []; // Bisa diambil dari API nanti (misal /returns/history)

  const handleProsesKembali = async (book) => {
    const isDigital = book.format === 'digital';
    const message = isDigital 
      ? `Kembalikan E-Book "${book.title}" sekarang?` 
      : `Konfirmasi pengembalian fisik "${book.title}"?`;

    if (!window.confirm(message)) return;

    try {
      await BookService.kembalikanBuku(book.id);
      
      alert(`✅ Buku "${book.title}" berhasil dikembalikan!`);
      setActiveQrBook(null);
      refresh(); // Refresh daftar otomatis
    } catch (err) {
      console.error(err);
      alert('Gagal memproses pengembalian buku.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loading type="page" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">
      
      {/* TOP NAVBAR */}
      <nav className="bg-[#f8fafc] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span onClick={() => navigate('/dashboard')} className="text-[#0c3966] font-bold text-sm tracking-wide cursor-pointer">Litera</span>
          <button className="p-1 text-slate-500 hover:text-slate-700 bg-transparent border-none cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>
        </div>
        <button onClick={() => navigate('/profile')} className="p-0.5 rounded-full border border-slate-200 text-slate-600 bg-transparent flex items-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* Hero Banner */}
        <div className="bg-[#1e5391] text-white rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3 items-center min-h-[240px]">
          <div className="p-8 md:col-span-2 space-y-4">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Sistem Pengembalian Pintar</h1>
            <p className="text-xs text-blue-100/80 leading-relaxed font-medium">
              E-Book digital dapat dikembalikan langsung. Untuk buku fisik, tunjukkan QR Code ke petugas perpustakaan.
            </p>
          </div>
          <div className="h-full p-4 pr-6 hidden md:flex items-center justify-end">
            <div className="w-full h-[180px] rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=600&auto=format&fit=crop" 
                alt="Library Desk" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* QR Modal */}
        {activeQrBook && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
              <h4 className="text-xs font-bold text-[#0c3966]">📱 QR Code: {activeQrBook.title}</h4>
              <button onClick={() => setActiveQrBook(null)} className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-md font-bold">Tutup</button>
            </div>
            
            <div className="bg-white p-6 w-40 h-40 mx-auto rounded-xl border border-slate-200 flex items-center justify-center shadow-inner">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-[10px] font-mono text-slate-400">ID: {activeQrBook.id}</p>
              </div>
            </div>

            <button 
              onClick={() => handleProsesKembali(activeQrBook)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl w-full transition"
            >
              ✓ Simulasikan Scan Admin Berhasil
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Daftar Buku yang Harus Dikembalikan */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-950 tracking-tight">Buku yang Sedang Dipinjam</h2>
              <span className="bg-[#fef3c7] text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full">
                {pendingReturns.length} Buku
              </span>
            </div>

            {pendingReturns.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                Tidak ada buku yang perlu dikembalikan saat ini.
              </div>
            ) : (
              pendingReturns.map((book) => {
                const isDigital = book.format === 'digital';
                return (
                  <div key={book.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm truncate">{book.title}</h3>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${isDigital ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isDigital ? 'DIGITAL' : 'FISIK'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{book.author}</p>
                        <p className="text-[10px] text-slate-400">Batas: {book.dueDate ? new Date(book.dueDate).toLocaleDateString('id-ID') : '-'}</p>
                      </div>
                    </div>

                    {isDigital ? (
                      <button
                        onClick={() => handleProsesKembali(book)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
                      >
                        Kembalikan Instan
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveQrBook(book)}
                        className="bg-[#0c3966] hover:bg-[#092a4d] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
                      >
                        Tampilkan QR Code
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Timeline Status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Proses Pengembalian</h3>
            
            <div className="relative pl-6 space-y-8 before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-100">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute left-[-21px] top-1 w-5 h-5 rounded-full bg-[#0c3966] text-white flex items-center justify-center text-xs font-bold">1</div>
                <h4 className="font-bold text-sm">Pilih Buku</h4>
                <p className="text-xs text-slate-500">Pilih buku yang akan dikembalikan</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute left-[-21px] top-1 w-5 h-5 rounded-full bg-[#0c3966] text-white flex items-center justify-center text-xs font-bold">2</div>
                <h4 className="font-bold text-sm">Proses Pengembalian</h4>
                <p className="text-xs text-slate-500">Digital: Langsung • Fisik: Scan QR</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute left-[-21px] top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                <h4 className="font-bold text-sm text-emerald-700">Stok Dikembalikan</h4>
                <p className="text-xs text-slate-500">Buku tersedia kembali di katalog</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-4 flex items-center justify-around z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-4 flex items-center justify-around z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        <button onClick={() => navigate('/catalog/search')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span className="text-[10px] font-medium">Cari</span>
        </button>
        <button onClick={() => navigate('/bookshelf')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
          <span className="text-[10px] font-medium">Rak Buku</span>
        </button>
        <button onClick={() => navigate('/fines/fines-status')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span className="text-[10px] font-medium">Denda</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-[#0c3966] bg-transparent border-none cursor-pointer">
          <div className="px-5 py-1 bg-blue-50 rounded-full text-[#0c3966] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span className="text-[10px] font-bold">Profil</span>
        </button>
      </div>
      </div>
    </div>
  );
}