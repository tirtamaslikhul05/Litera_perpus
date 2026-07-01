import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import useFetch from '../../hooks/useFetch';
import Loading from '../../components/Feedback/Loading';

export default function ReturnStatus() {
  const navigate = useNavigate();
  const [activeQrBook, setActiveQrBook] = useState(null);
  
  // 1. Gunakan 'refresh' bawaan dari useFetch kamu untuk memicu reload data
  // Mengambil data buku yang sedang dipinjam
  // POTONGAN KODE DARURAT (Ganti bagian useFetch dengan ini):
  const { data: returnData, loading, refresh } = useFetch(
    () => BookService.getBookshelf('loans').then(loans => {
      // TAMPILKAN SEMUA BUKU YANG ADA DI RAK TANPA DI-FILTER STATUSNYA
      const pendingReturns = loans || []; 
      
      const completedHistory = JSON.parse(localStorage.getItem('litera_completed_history')) || [];
      
      return {
        pendingReturns,
        completedHistory,
        currentStep: pendingReturns.length > 0 ? 2 : 3
      };
    }), 
    []
  );

  // HANDLER PENGEMBALIAN OTOMATIS (DIGITAL ATAU SIMULASI ADMIN FISIK)
  const handleProsesKembali = async (book) => {
    const tipeBuku = book.format === 'digital' ? 'Digital (E-Book)' : 'Cetak';
    const pesanKonfirmasi = book.format === 'digital' 
      ? `Apakah Anda ingin mengembalikan E-Book "${book.title}" sekarang?` 
      : `[Simulasi Admin] Apakah Admin sudah menerima dan memindai fisik buku "${book.title}"?`;

    if (window.confirm(pesanKonfirmasi)) {
      try {
        // 1. Eksekusi pengembalian di file service
        await BookService.kembalikanBuku(book.id);

        // 2. Catat ke riwayat lokal localStorage
        const historyRaw = localStorage.getItem('litera_completed_history');
        let history = historyRaw ? JSON.parse(historyRaw) : [];
        history.unshift({
          id: 'H_' + Date.now(),
          title: book.title,
          completedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          stockAdded: true,
          format: book.format
        });
        localStorage.setItem('litera_completed_history', JSON.stringify(history));

        alert(`Sukses! Buku ${tipeBuku} "${book.title}" berhasil dikembalikan ke katalog.`);
        
        // 3. Tutup modal QR jika ada
        setActiveQrBook(null);
        
        // 4. PANGGIL REFRESH BAWAAN HOOK ANDA (Ini yang bikin UI langsung terupdate otomatis!)
        refresh();
        
      } catch (err) {
        console.error(err);
        alert('Gagal memproses pengembalian buku.');
      }
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
      
      {/* ================= TOP NAVBAR ================= */}
      <nav className="bg-[#f8fafc] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span onClick={() => navigate('/dashboard')} className="text-xl font-bold text-[#0c3966] tracking-wide">Litera</span>
        </div>
        <button onClick={() => navigate('/profile')} className="p-0.5 rounded-full border border-slate-200 text-slate-600 bg-transparent flex items-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* HERO BANNER */}
        <div className="bg-[#1e5391] text-white rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-3 items-center min-h-[240px]">
          <div className="p-8 md:col-span-2 space-y-4">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Sistem Pengembalian Pintar</h1>
            <p className="text-xs text-blue-100/80 leading-relaxed font-medium">
              E-Book digital dapat dikembalikan langsung secara mandiri. Untuk buku cetak fisik, silakan tunjukkan QR Code sirkulasi buku ke petugas perpustakaan.
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

        {/* MODAL / PANEL POPUP QR CODE JIKA BUKU CETAK DIKLIK */}
        {activeQrBook && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
              <h4 className="text-xs font-bold text-[#0c3966]">📱 QR Code Sirkulasi: {activeQrBook.title}</h4>
              <button onClick={() => setActiveQrBook(null)} className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border-none cursor-pointer font-bold">Tutup</button>
            </div>
            <div className="bg-white p-4 w-36 h-36 mx-auto rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1 shadow-inner">
              <div className="w-full h-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono">
                <span>[QR CODE]</span>
                <span className="text-[8px]">{activeQrBook.id}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Tunjukkan layar ini pada scanner meja admin. Atau klik tombol di bawah ini untuk mensimulasikan pemindaian sukses oleh admin.
            </p>
            <button 
              onClick={() => handleProsesKembali(activeQrBook)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl border-none cursor-pointer transition"
            >
              ✓ Simulasikan Scan Admin Berhasil
            </button>
          </div>
        )}

        {/* SECTION SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ================= KIRI: DAFTAR BUKU AKTIF DIPINJAM ================= */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-950 tracking-tight">Sedang Dikembalikan / Dipinjam</h2>
                <span className="bg-[#fef3c7] text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {returnData?.pendingReturns?.length || 0} Buku
                </span>
              </div>

              <div className="space-y-3">
                {returnData?.pendingReturns?.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 font-medium">
                    Semua buku telah dikembalikan dengan aman! Stok katalog penuh.
                  </div>
                ) : (
                  returnData?.pendingReturns?.map((book) => {
                    const isDigital = book.format === 'digital';
                    return (
                      <div key={book.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-11 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 flex-shrink-0 shadow-xs">
                            <img src={book.cover} alt="Cover" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-sm text-slate-900 truncate">{book.title}</h3>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${isDigital ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-purple-50 text-purple-600 border border-purple-200'}`}>
                                {book.format?.toUpperCase() || 'CETAK'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium truncate">{book.author}</p>
                            <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                              ⏳ Batas: {book.dueDate ? new Date(book.dueDate).toLocaleDateString('id-ID') : '-'}
                            </p>
                          </div>
                        </div>
                        
                        {/* AKSI TOMBOL DINAMIS */}
                        {isDigital ? (
                          <button
                            onClick={() => handleProsesKembali(book)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border-none shadow-xs flex items-center gap-1 self-end sm:self-center"
                          >
                            ⚡ Kembalikan Instan
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveQrBook(book)}
                            className="bg-[#0c3966] hover:bg-[#092a4d] text-white text-[11px] font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border-none shadow-xs flex items-center gap-1 self-end sm:self-center"
                          >
                            📱 Tampilkan QR Code
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Riwayat Selesai */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-slate-950 tracking-tight">Riwayat Selesai</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {returnData?.completedHistory?.length === 0 ? (
                  <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-5 text-center text-xs text-slate-400 font-medium">
                    Belum ada riwayat buku yang selesai dikembalikan.
                  </div>
                ) : (
                  returnData?.completedHistory?.map((history) => (
                    <div key={history.id} className="bg-white border border-slate-50 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
                      <div className="w-9 h-12 bg-slate-50 border border-slate-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center text-sm">📖</div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{history.title}</h4>
                        <p className="text-[9px] text-slate-400 font-medium">Kembali pada: {history.completedDate}</p>
                        <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
                          ✓ Stok Kembali Tersedia
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* ================= KANAN: STATUS TIMELINE STEPS ================= */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Status Validasi Transaksi</h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              <div className="relative space-y-0.5">
                <div className="absolute left-[-25px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold z-10 bg-[#0c3966] text-white">✓</div>
                <h4 className="text-xs font-bold text-slate-800">Pengecekan Tipe Hak Akses</h4>
                <p className="text-[10px] text-slate-400 font-medium">Sistem memisahkan jalur otomasi Digital vs Fisik.</p>
              </div>

              <div className={`relative space-y-0.5 ${returnData?.currentStep < 2 ? 'opacity-60' : ''}`}>
                <div className={`absolute left-[-25px] top-0.5 w-4 h-4 rounded-full z-10 shadow-xs ${returnData?.currentStep === 2 ? 'bg-white border-4 border-[#1e5391]' : 'bg-[#0c3966] text-white flex items-center justify-center text-[9px]'}`}>
                  {returnData?.currentStep > 2 ? '✓' : ''}
                </div>
                <h4 className="text-xs font-bold text-slate-800">Menunggu Deklarasi Valid</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Menunggu klik pengembalian e-book atau pemindaian sirkulasi fisik.</p>
              </div>

              <div className={`relative space-y-0.5 ${returnData?.currentStep < 3 ? 'opacity-60' : ''}`}>
                <div className={`absolute left-[-25px] top-0.5 w-4 h-4 rounded-full z-10 ${returnData?.currentStep === 3 ? 'bg-emerald-500 text-white text-[8px] flex items-center justify-center font-bold' : 'bg-slate-300 border-2 border-white'}`}>
                  {returnData?.currentStep === 3 ? '✓' : ''}
                </div>
                <h4 className="text-xs font-bold text-slate-700">Restorasi Inventaris Berhasil</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Kuantitas stok buku pada menu utama bertambah kembali otomatis.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM MENU NAVIGASI FIXED ================= */}
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
        <button className="flex flex-col items-center gap-1 text-white bg-transparent border-none cursor-pointer">
          <div className="px-5 py-1 bg-[#0c3966] rounded-full text-white shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <span className="text-[10px] font-bold text-[#0c3966]">Denda</span>
        </button>

        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-400 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </div>

    </div>
  );
}