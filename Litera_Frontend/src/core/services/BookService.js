import Book from '../models/Book';
<<<<<<< HEAD
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
=======

class BookService {
  constructor() {
    // 1. MASTER KATALOG UTAMA
    this.initialKatalogBuku = [
      { id: 'B001', title: 'Langkah di Atas Cakrawala', author: 'Dr. Aris Setiawan, Ph.D.', genre: 'Fiksi Ilmiah', year: '2024', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300', stock: 5, totalPages: 340, isAvailable: true },
      { id: 'B002', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', genre: 'Sastra', year: '1980', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300', stock: 2, totalPages: 535, isAvailable: true },
      { id: 'B003', title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finansial', year: '2020', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300', stock: 4, totalPages: 262, isAvailable: true },
      { id: 'B004', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Klasik', year: '1925', cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=300', stock: 1, totalPages: 2, isAvailable: true }
    ];

    // Setup LocalStorage agar data persisten layaknya API asli
    if (!localStorage.getItem('litera_catalog')) {
      localStorage.setItem('litera_catalog', JSON.stringify(this.initialKatalogBuku));
    }
    if (!localStorage.getItem('litera_books')) {
      localStorage.setItem('litera_books', JSON.stringify([])); // Akun baru otomatis kosong []
    }
  }

  _getCatalog() { return JSON.parse(localStorage.getItem('litera_catalog')); }
  _getUserBooks() { return JSON.parse(localStorage.getItem('litera_books')); }
  _saveCatalog(data) { localStorage.setItem('litera_catalog', JSON.stringify(data)); }
  _saveUserBooks(data) { localStorage.setItem('litera_books', JSON.stringify(data)); }

  // ================= 1. GET PROFILE & STATS (TERMASUK DENDA OTOMATIS) =================
  async getUserProfileComplete() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const bookList = this._getUserBooks();
    const kini = new Date();

    let borrowedBooksCount = 0;
    let booksReadCount = 0;
    let totalDenda = 0;

    bookList.forEach(book => {
      if (book.status === 'dipinjam') {
        borrowedBooksCount++;
        
        // Hitung Denda jika melewati batas waktu (DueDate)
        const batasKembali = new Date(book.dueDate);
        if (kini > batasKembali) {
          const selisihHari = Math.ceil((kini - batasKembali) / (1000 * 60 * 60 * 24));
          totalDenda += selisihHari * 2000; // Misal denda Rp 2.000 / hari
        }
      } else if (book.status === 'selesai') {
        booksReadCount++;
      }
    });
>>>>>>> origin/admin_part1

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
<<<<<<< HEAD
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
=======
    await new Promise(resolve => setTimeout(resolve, 200));
    let katalog = this._getCatalog();
    let userBooks = this._getUserBooks();

    // 1. Cari data buku asli dari katalog master berdasarkan ID
    const catalogIndex = katalog.findIndex(b => String(b.id) === String(book.id));
    if (catalogIndex === -1) throw new Error("Buku tidak ditemukan.");
    if (katalog[catalogIndex].stock <= 0) throw new Error("Stok buku habis!");

    // Cek apakah sedang meminjam buku ini dan belum dikembalikan (baik status dipinjam atau selesai dibaca tapi belum dipulangkan)
    const isAlreadyBorrowed = userBooks.some(b => String(b.id) === String(book.id));
    if (isAlreadyBorrowed) throw new Error("Kamu sedang meminjam atau menyelesaikan buku ini di rak!");

    // 2. Ambil data master buku yang divalidasi dari katalog
    const masterBookData = katalog[catalogIndex];

    // Kurangi Stok Katalog
    katalog[catalogIndex].stock -= 1;
    if (katalog[catalogIndex].stock === 0) katalog[catalogIndex].isAvailable = false;
    this._saveCatalog(katalog);

    // Set Batas Waktu Pinjam (+7 Hari dari sekarang)
    const tanggalPinjam = new Date();
    const tanggalKembali = new Date();
    tanggalKembali.setDate(tanggalPinjam.getDate() + 7);

    // 3. Tambah ke Rak Profil User (PASTIKAN totalPages mengambil dari masterBookData)
    userBooks.push({
      id: String(masterBookData.id),
      title: masterBookData.title,
      author: masterBookData.author,
      cover: masterBookData.cover,
      format: format, // 'digital' atau 'fisik'
      status: 'dipinjam',
      lastReadPage: 0,
      totalPages: Number(masterBookData.totalPages), // <--- DIKUNCI SESUAI KATALOG MASTER (340, 535, 262, 2)
      borrowedAt: tanggalPinjam.toISOString(),
      dueDate: tanggalKembali.toISOString()
    });

    this._saveUserBooks(userBooks);
    return { success: true };
>>>>>>> origin/admin_part1
  }

  // ================= FIX WISHLIST: PAKSA VALIDASI STRING ID KONSISTEN =================
  async simulasikanTambahWishlist (book) {
<<<<<<< HEAD
    try {
      const res = await apiClient.post('/wishlist', { bookId: book.id });
      return res.data;
    } catch (error) {
      console.error('Gagal tambah wishlist:', error);
      throw error;
  }
=======
    return new Promise((resolve, reject) => {
      try {
        const localWishlist = localStorage.getItem('litera_wishlist');
        let wishlistItems = localWishlist ? JSON.parse(localWishlist) : [];

        // Ambil ID murni dalam bentuk String (Mencegah NaN akibat id seperti 'B001')
        const cleanBookId = String(book.id);

        // Cek duplikasi dengan komparasi String aman
        const isExist = wishlistItems.some(item => String(item.id) === cleanBookId);

        if (isExist) {
          resolve({ success: true, message: 'Buku sudah ada di wishlist' });
          return;
        }

        wishlistItems.push({
          id: cleanBookId, // Masuk sebagai String utuh ('B001')
          title: book.title,
          author: book.author,
          cover: book.cover || book.image,
          category: book.category || book.genre || 'Umum',
          stock: book.stock !== undefined ? Number(book.stock) : 1,
          isAvailable: book.stock > 0 || book.isAvailable || false,
          synopsis: book.synopsis || ''
        });

        localStorage.setItem('litera_wishlist', JSON.stringify(wishlistItems));
        
        setTimeout(() => {
          resolve({ success: true });
        }, 300);

      } catch (error) {
        console.error("Error di dalam BookService wishlist:", error);
        reject(error);
      }
    });
>>>>>>> origin/admin_part1
  }

  // ================= 3. SELESAI BACA / UPDATE PROGRES =================
  // ================= REVISI TOTAL: UPDATE PROGRES & AMANKAN STATUS PINJAMAN =================
  async simulasikanUpdateProgresBaca(bookId, currentPage, totalPagesFromReader, isFinished = false) {
<<<<<<< HEAD
    try {
      const payload = { currentPage, totalPages: totalPagesFromReader, isFinished };
      const res = await apiClient.patch(`/loans/${bookId}/progress`, payload);
      return res.data;
    } catch (error) {
      console.error('Gagal update progres:', error);
      throw error;
  }
=======
    await new Promise(resolve => setTimeout(resolve, 200));
    let userBooks = this._getUserBooks();
    
    // Cari buku di list user (baik status dipinjam maupun selesai agar data tidak loss)
    const idx = userBooks.findIndex(b => String(b.id) === String(bookId));

    if (idx !== -1) {
      // Ambil total halaman asli dari data yang tersimpan, jika tidak ada baru pakai dari reader
      const totalHalaman = Number(userBooks[idx].totalPages || totalPagesFromReader);
      const pageToSave = Number(currentPage);

      // Batasi agar halaman simpanan tidak meluber melewati total halaman asli
      const finalPage = pageToSave > totalHalaman ? totalHalaman : pageToSave;
      
      userBooks[idx].lastReadPage = finalPage;
      userBooks[idx].totalPages = totalHalaman;

      // STATUS HANYA BERUBAH JIKA USER BENAR-BENAR MENGKLIK TOMBOL "SELESAI MEMBACA" (isFinished === true)
      if (isFinished) {
        userBooks[idx].status = 'selesai';
      } else {
        // Jika keluar tengah jalan / back / waktu habis, kunci status agar tetap 'dipinjam' kecuali sudah selesai
        if (userBooks[idx].status !== 'selesai') {
          userBooks[idx].status = 'dipinjam';
        }
      }

      this._saveUserBooks(userBooks);
    }
    return { success: true };
>>>>>>> origin/admin_part1
  }

  // ================= REVISI KEMBALIKAN BUKU: SELESAI/DIPINJAM SAMA-SAMA BISA DIKEMBALIKAN =================
  async kembalikanBuku(bookId) {
<<<<<<< HEAD
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
=======
    await new Promise(resolve => setTimeout(resolve, 200));
    let katalog = this._getCatalog();
    let userBooks = this._getUserBooks();

    const catalogIndex = katalog.findIndex(b => String(b.id) === String(bookId));
    if (catalogIndex !== -1) {
      katalog[catalogIndex].stock += 1;
      katalog[catalogIndex].isAvailable = true;
      this._saveCatalog(katalog);
    }

    // Filter keluar tanpa mempedulikan status dipinjam atau selesai dibaca (buku dihapus total dari rak user)
    userBooks = userBooks.filter(b => !(String(b.id) === String(bookId)));
    
    this._saveUserBooks(userBooks);
    return { success: true };
  }

  async getAllBooks() { return this._getCatalog().map(b => new Book(b)); }
  
  async getBookDetail(bookId) {
    const dataBuku = this._getCatalog().find(b => String(b.id) === String(bookId));
    const loan = this._getUserBooks().find(b => String(b.id) === String(bookId));
    return new Book({ ...dataBuku, lastReadPage: loan ? loan.lastReadPage : 0 });
  }

  // ================= REVISI GET BOOKSHELF: PINJAMAN AKTIF MENAMPILKAN 'DIPINJAM' & 'SELESAI' =================
  async getBookshelf(activeTab) {
    if (activeTab === 'wishlist') {
      const res = localStorage.getItem('litera_wishlist');
      if (!res) return [];
      
      const rawWishlist = JSON.parse(res);
      return rawWishlist.map(b => {
        const itemInstance = new Book(b);
        if (!itemInstance.id) itemInstance.id = b.id;
        return itemInstance;
      });
    }
    
    // Mengizinkan buku berstatus 'dipinjam' ATAU 'selesai' muncul di tab pinjaman
    return this._getUserBooks()
      .filter(b => b.status === 'dipinjam' || b.status === 'selesai')
      .map(b => {
        const itemInstance = new Book(b);
        if (!itemInstance.id) itemInstance.id = b.id;
        // Inject status database lokal agar komponen React bisa membaca status 'selesai' / 'dipinjam'
        itemInstance.status = b.status; 
        return itemInstance;
      });
>>>>>>> origin/admin_part1
  }
}

export default new BookService();