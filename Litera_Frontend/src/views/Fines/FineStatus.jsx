// src/views/Fines/FinesStatus.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookService from '../../core/services/BookService';
import FineService from '../../core/services/FineService';
import useFetch from '../../hooks/useFetch';
import BottomNav from '../../components/Navigation/BottomNav';

export default function FinesStatus() {
  const navigate = useNavigate();
  
  // Fetch data denda
  const { data: finesResponse, loading: finesLoading } = useFetch(() => FineService.getFines());
  const { data: totalFinesResponse } = useFetch(() => FineService.getTotalFines());

  const fines = finesResponse?.data || [];
  const totalDenda = totalFinesResponse?.data?.total_denda || 0;

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
          <button onClick={() => navigate('/profile')} className="text-slate-600">👤</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-6 space-y-6">
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-xl">
            💰
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Status Denda</h1>
            <p className="text-xs text-slate-500">Informasi keterlambatan pengembalian</p>
          </div>
        </div>

        {/* Total Denda Box */}
        <div className="bg-[#0c3966] text-white rounded-2xl p-6 shadow-md">
          <p className="text-xs text-blue-200 font-bold tracking-wider">TOTAL DENDA TERHUTANG</p>
          <p className="text-4xl font-black mt-1">
            Rp {totalDenda.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-blue-100 mt-1">Rp 1.000 per hari keterlambatan</p>
        </div>

        {/* Daftar Denda */}
        {finesLoading ? (
          <div className="text-center py-12">Memuat data denda...</div>
        ) : fines.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <p className="text-slate-400">Tidak ada denda saat ini. Terima kasih telah tepat waktu!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50 text-xs text-slate-500 font-semibold">
                  <th className="py-4 px-6 text-left">BUKU</th>
                  <th className="py-4 px-4 text-center">TERLAMBAT</th>
                  <th className="py-4 px-6 text-right">DENDA</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {fines.map((fine, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">
                        {fine.loan?.book?.nama_buku}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        {fine.hari_terlambat} hari
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-800">
                      Rp {fine.jumlah_denda.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Info Pembayaran */}
        <div className="bg-[#f1f5f9] p-6 rounded-2xl text-xs text-slate-500 border border-slate-100">
          <p className="font-semibold text-slate-700 mb-2">Cara Bayar Denda</p>
          <p>Hubungi petugas perpustakaan di meja admin untuk melunasi denda Anda.</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
