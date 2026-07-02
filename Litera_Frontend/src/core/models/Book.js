// src/models/Book.js
export default class Book {
  constructor(data = {}) {
    this.id = data.id;
    this.nama_buku = data.nama_buku || data.title || 'Judul Tanpa Nama';
    this.isbn = data.isbn || '';
    
    // Cover
    this.cover = data.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300';
    
    // Stok & Ketersediaan
    this.jumlah_buku = data.jumlah_buku || 0;
    this.jumlah_pinjam = data.jumlah_pinjam || 0;
    this.jumlah_tersedia = data.jumlah_tersedia ?? 
                          (data.stock !== undefined ? data.stock : 0);
    
    // Status otomatis
    this.isAvailable = this.jumlah_tersedia > 0;
    this.statusText = this.jumlah_tersedia === 0 
      ? 'STOK HABIS' 
      : this.jumlah_tersedia <= 2 
        ? 'TERBATAS' 
        : 'TERSEDIA';

    // Info tambahan
    this.pdf = data.pdf || false;                    // apakah ada versi digital
    this.synopsis = data.synopsis || 'Tidak ada sinopsis tersedia.';
    
    // Untuk keperluan pinjaman
    this.dueDate = data.tanggal_jatuh_tempo || data.dueDate || null;
    this.tanggal_kembali = data.tanggal_kembali || null;
    this.status = data.status || 'available';        // pending, approved, returned
    
    // Denda (jika ada)
    this.fineAmount = data.fineAmount || 0;
    this.daysOverdue = data.hari_terlambat || 0;
  }

  // Getter yang berguna
  get title() {
    return this.nama_buku;
  }

  get stock() {
    return this.jumlah_tersedia;
  }

  isDigital() {
    return this.pdf === true;
  }

  isOverdue() {
    return this.daysOverdue > 0;
  }
}