export default class User {
  constructor(data = {}) {
    this.name = data.name || 'Siswa Litera';
    this.nisn = data.nisn || '';
    this.status = data.status || 'ACTIVE MEMBERSHIP';
    this.avatar = data.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200';
    this.stats = {
      booksRead: data.stats?.booksRead || 0,
      activeLoans: data.stats?.activeLoans || 0,
      points: data.stats?.points || 0
    };
    this.fines = data.fines || [];
  }

  // OOP Getter untuk kalkulasi otomatis total denda terhutang secara real-time
  get totalFines() {
    return this.fines.reduce((total, fine) => total + (fine.fineAmount || 0), 0);
  }

  // Method pembantu mengecek status penangguhan akun akibat denda berat
  isSuspended() {
    return this.totalFines > 20000;
  }
}