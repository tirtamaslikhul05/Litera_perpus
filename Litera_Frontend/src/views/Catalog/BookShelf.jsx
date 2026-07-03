// src/views/Catalog/Bookshelf.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import FineService from '../../core/services/FineService';
import useFetch from '../../hooks/useFetch';

export default function Bookshelf() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('loans'); // 'loans' atau 'fines'

  // Fetch data sesuai tab
  const { data: loansResponse, loading: loansLoading } = useFetch(
    () => BookService.getMyLoans(activeTab === 'loans' ? null : 'approved'), 
    [activeTab]
  );

  const { data: finesResponse } = useFetch(
    () => FineService.getFines(), 
    [activeTab]
  );

  const loans = loansResponse?.data || [];
  const fines = finesResponse?.data || [];

  const currentData = activeTab === 'loans' ? loans : fines;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-slate-800 font-sans">
      
      {/* Top Navbar */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b">
        <span 
          onClick={() => navigate('/dashboard')} 
          className="text-xl font-bold text-[#0c3966] tracking-wide cursor-pointer"
        >
          Litera
        </span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="text-slate-600">
            👤
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-6 space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rak Buku Saya</h1>
          <p className="text-xs text-slate-500">Kelola pinjaman dan denda Anda</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('loans')}
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'loans' 
                ? 'border-[#0c3966] text-[#0c3966]' 
                : 'border-transparent text-slate-400'
            }`}
          >
            📖 Pinjaman Aktif
          </button>
          <button 
            onClick={() => setActiveTab('fines')}
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'fines' 
                ? 'border-[#0c3966] text-[#0c3966]' 
                : 'border-transparent text-slate-400'
            }`}
          >
            💰 Denda
          </button>
        </div>

        {/* Content */}
        {loansLoading ? (
          <div className="text-center py-12">Memuat data...</div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">
              {activeTab === 'loans' 
                ? 'Belum ada buku yang dipinjam.' 
                : 'Tidak ada denda yang perlu dibayar.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentData.map((item, index) => {
              const book = activeTab === 'loans' ? item.book : item.loan?.book;
              return (
                <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition-all">
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={book?.cover} 
                        alt={book?.nama_buku} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{book?.nama_buku}</h3>
                      <p className="text-xs text-slate-500 mt-1">ISBN: {book?.isbn}</p>
                      
                      {activeTab === 'loans' && item.tanggal_jatuh_tempo && (
                        <p className="text-xs text-amber-600 mt-2">
                          Jatuh tempo: {item.tanggal_jatuh_tempo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    {activeTab === 'loans' && (
                      <button 
                        onClick={() => navigate(`/catalog/reader/${book?.id}`)}
                        className="flex-1 bg-[#0c3966] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#092a4d] transition"
                      >
                        Baca Buku
                      </button>
                    )}
                    {activeTab === 'fines' && (
                      <button className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold">
                        Bayar Denda
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}