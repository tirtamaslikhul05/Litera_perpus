export default class Book {
  constructor(data = {}) {
    this.id = data.id || data.bookId;
    this.title = data.title || 'Judul Tanpa Nama';
    this.author = data.author || 'Anonim';
    this.cover = data.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300';
    this.isAvailable = data.isAvailable ?? true;
    
    // PENTING: Merekam data stock/stok dari API/Dummy (default ke 0 jika tidak dikirim)
    this.stock = data.stock !== undefined ? data.stock : (data.stok !== undefined ? data.stok : 0);
    
    // Sinkronisasi status teks otomatis berdasarkan jumlah stok yang ada
    this.statusText = data.statusText || (this.stock === 0 ? 'STOK HABIS' : this.stock <= 2 ? 'TERBATAS' : 'TERSEDIA');
    
    this.genre = data.genre || 'Umum';
    this.synopsis = data.synopsis || 'Tidak ada sinopsis yang tersedia untuk buku ini.';
    this.format = data.format || 'digital';
    this.dueDate = data.dueDate || null;
    this.daysOverdue = data.daysOverdue || 0;
    this.fineAmount = data.fineAmount || 0;
  }
}