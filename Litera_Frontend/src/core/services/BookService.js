import Book from '../models/Book';
import apiClient from './ApiClient';

class BookService {
  constructor() {
    console.log('📚 BookService initialized - API First Mode');

    try {
      const response = await apiClient.get('/profile/me'); // Sesuaikan endpoint
      return response.data.data || response.data;
    } catch (error) {
      console.warn('⚠️ API Profile gagal, menggunakan fallback');
      // Fallback sementara (bisa dihapus nanti)
      return {
        name: "Andi Pratama",
        nisn: "1234567890",
        totalFines: 0,
        stats: { borrowedBooks: 0, booksRead: 0, points: 0 }
      };
    }

    return {
      name: "Andi Pratama",
      nisn: "1234567890",
      totalFines: totalDenda,
      stats: {
        borrowedBooks: borrowedBooksCount,
        booksRead: booksReadCount,
        points: booksReadCount * 100
      }
    };
  }

  // ================= 2. ALUR PINJAM (POTONG STOK & DAFTAR PINJAM) =================
  async simulasikanTransaksiPinjam(book, format = 'digital') {
    try {
      const payload = { 
        bookId: book.id, 
        format 
      };
      const res = await apiClient.post('/loans', payload);
      return res.data;
    } catch (error) {
      console.error('Gagal pinjam buku:', error);
      throw error;
  }
  }

  // ================= FIX WISHLIST: PAKSA VALIDASI STRING ID KONSISTEN =================
  async simulasikanTambahWishlist (book) {
    try {
      const res = await apiClient.post('/wishlist', { bookId: book.id });
      return res.data;
    } catch (error) {
      console.error('Gagal tambah wishlist:', error);
      throw error;
  }
  }

  // ================= 3. SELESAI BACA / UPDATE PROGRES =================
  // ================= REVISI TOTAL: UPDATE PROGRES & AMANKAN STATUS PINJAMAN =================
  async simulasikanUpdateProgresBaca(bookId, currentPage, totalPagesFromReader, isFinished = false) {
    try {
      const payload = { currentPage, totalPages: totalPagesFromReader, isFinished };
      const res = await apiClient.patch(`/loans/${bookId}/progress`, payload);
      return res.data;
    } catch (error) {
      console.error('Gagal update progres:', error);
      throw error;
  }
  }

  // ================= REVISI KEMBALIKAN BUKU: SELESAI/DIPINJAM SAMA-SAMA BISA DIKEMBALIKAN =================
  async kembalikanBuku(bookId) {
    try {
      const res = await apiClient.post(`/loans/${bookId}/return`);
      return res.data;
    } catch (error) {
      console.error('Gagal mengembalikan buku:', error);
      throw error;
  }
  }

  async getAllBooks() { 
    try {
      const res = await apiClient.get('/books'); // Tambah ?page=1&limit=50 jika perlu
      return (res.data.data || res.data).map(b => new Book(b));
    } catch (error) {
      console.error('Gagal fetch books:', error);
      return [];
    } 
  }
  
  async getBookDetail(bookId) {
    try {
      const res = await apiClient.get(`/books/${bookId}`);
      return new Book(res.data.data);
    } catch (error) {
      console.error('Gagal fetch detail buku:', error);
      throw error;
    }
  }

  // ================= REVISI GET BOOKSHELF: PINJAMAN AKTIF MENAMPILKAN 'DIPINJAM' & 'SELESAI' =================
  async getBookshelf(activeTab = 'loans') {
    try {
      if (activeTab === 'wishlist') {
        const res = await apiClient.get('/wishlist');
        return (res.data.data || res.data).map(b => new Book(b));
      }
      
      // Default: loans (dipinjam + selesai)
      const res = await apiClient.get('/loans?status=active,completed');
      return (res.data.data || res.data).map(b => {
        const item = new Book(b);
        item.status = b.status;
        return item;
      });
    } catch (error) {
      console.error('Gagal fetch bookshelf:', error);
      return [];
    }
  }
}

export default new BookService();