<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Fine;
use App\Models\Loan;
use App\Models\School;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Run the demo database seeds.
     *
     * Seed ini membuat data dummy lengkap untuk menguji semua fitur siswa:
     * - 1 Sekolah + 1 Admin + 2 Siswa
     * - 10 Buku (beberapa digital/pdf, beberapa fisik)
     * - 5 Peminjaman (pending, approved, returned)
     * - 1 Denda (terlambat)
     */
    public function run(): void
    {
        // ==================== 1. SEKOLAH ====================
        $school = School::firstOrCreate(
            ['name' => 'SMA Nusantara Demo'],
            ['license_key' => 'DEMO-LICENSE-2024']
        );

        // ==================== 2. ADMIN ====================
        $admin = User::firstOrCreate(
            ['email' => 'admin@nusantara.sch.id'],
            [
                'school_id' => $school->id,
                'name'      => 'Admin Perpustakaan',
                'password'  => Hash::make('password'),
                'role'      => 'admin',
            ]
        );

        // ==================== 3. SISWA ====================
        $siswa1 = User::firstOrCreate(
            ['nisn' => '0081234001'],
            [
                'school_id' => $school->id,
                'name'      => 'Ahmad Rizky Pratama',
                'password'  => Hash::make('0081234001'), // password = NISN
                'role'      => 'siswa',
                'kelas'     => 'XII IPA 1',
                'jurusan'   => 'IPA',
            ]
        );

        $siswa2 = User::firstOrCreate(
            ['nisn' => '0081234002'],
            [
                'school_id' => $school->id,
                'name'      => 'Siti Nurhaliza',
                'password'  => Hash::make('0081234002'), // password = NISN
                'role'      => 'siswa',
                'kelas'     => 'XI IPS 2',
                'jurusan'   => 'IPS',
            ]
        );

        // ==================== 4. BUKU ====================
        $booksData = [
            // Buku digital (PDF = true)
            [
                'nama_buku'       => 'Pemrograman Laravel 10',
                'isbn'            => '978-602-123-001-1',
                'pdf'             => true,
                'jumlah_buku'     => 5,
                'jumlah_pinjam'   => 2,
                'jumlah_tersedia' => 3,
            ],
            [
                'nama_buku'       => 'Dasar-Dasar Algoritma dan Pemrograman',
                'isbn'            => '978-602-123-002-8',
                'pdf'             => true,
                'jumlah_buku'     => 8,
                'jumlah_pinjam'   => 3,
                'jumlah_tersedia' => 5,
            ],
            [
                'nama_buku'       => 'Matematika Wajib Kelas XII',
                'isbn'            => '978-602-123-003-5',
                'pdf'             => true,
                'jumlah_buku'     => 10,
                'jumlah_pinjam'   => 1,
                'jumlah_tersedia' => 9,
            ],
            [
                'nama_buku'       => 'Bahasa Indonesia Peminatan',
                'isbn'            => '978-602-123-004-2',
                'pdf'             => true,
                'jumlah_buku'     => 6,
                'jumlah_pinjam'   => 0,
                'jumlah_tersedia' => 6,
            ],
            // Buku fisik (PDF = false)
            [
                'nama_buku'       => 'Sejarah Peradaban Islam',
                'isbn'            => '978-602-123-005-9',
                'pdf'             => false,
                'jumlah_buku'     => 12,
                'jumlah_pinjam'   => 4,
                'jumlah_tersedia' => 8,
            ],
            [
                'nama_buku'       => 'Fisika untuk SMA Kelas XII',
                'isbn'            => '978-602-123-006-6',
                'pdf'             => false,
                'jumlah_buku'     => 15,
                'jumlah_pinjam'   => 5,
                'jumlah_tersedia' => 10,
            ],
            [
                'nama_buku'       => 'Kimia Organik Dasar',
                'isbn'            => '978-602-123-007-3',
                'pdf'             => false,
                'jumlah_buku'     => 7,
                'jumlah_pinjam'   => 2,
                'jumlah_tersedia' => 5,
            ],
            [
                'nama_buku'       => 'Biologi Molekuler Modern',
                'isbn'            => '978-602-123-008-0',
                'pdf'             => false,
                'jumlah_buku'     => 4,
                'jumlah_pinjam'   => 1,
                'jumlah_tersedia' => 3,
            ],
            [
                'nama_buku'       => 'Seni Rupa dan Desain',
                'isbn'            => '978-602-123-009-7',
                'pdf'             => false,
                'jumlah_buku'     => 9,
                'jumlah_pinjam'   => 0,
                'jumlah_tersedia' => 9,
            ],
            [
                'nama_buku'       => 'Geografi Lingkungan Hidup',
                'isbn'            => '978-602-123-010-0',
                'pdf'             => true,
                'jumlah_buku'     => 3,
                'jumlah_pinjam'   => 1,
                'jumlah_tersedia' => 2,
            ],
        ];

        $books = [];
        foreach ($booksData as $bookData) {
            $books[] = Book::firstOrCreate(
                ['school_id' => $school->id, 'isbn' => $bookData['isbn']],
                $bookData
            );
        }

        // ==================== 5. PEMINJAMAN (LOANS) ====================
        // Siswa 1: Peminjaman pending (buku Sejarah Islam - fisik, butuh persetujuan admin)
        // Note: pending loan tidak memiliki tanggal_pinjam (hanya diisi saat approve)
        Loan::firstOrCreate(
            ['school_id' => $school->id, 'user_id' => $siswa1->id, 'book_id' => $books[4]->id, 'status' => 'pending'],
            [
                'tanggal_jatuh_tempo' => now()->addDays(13)->toDateString(),
                'status'              => 'pending',
            ]
        );

        // Siswa 1: Peminjaman approved (buku Dasar Algoritma)
        Loan::firstOrCreate(
            ['school_id' => $school->id, 'user_id' => $siswa1->id, 'book_id' => $books[1]->id, 'status' => 'approved'],
            [
                'tanggal_pinjam'      => now()->subDays(5)->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(9)->toDateString(),
                'status'              => 'approved',
            ]
        );

        // Siswa 2: Peminjaman approved (buku Matematika)
        Loan::firstOrCreate(
            ['school_id' => $school->id, 'user_id' => $siswa2->id, 'book_id' => $books[2]->id, 'status' => 'approved'],
            [
                'tanggal_pinjam'      => now()->subDays(3)->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(11)->toDateString(),
                'status'              => 'approved',
            ]
        );

        // Siswa 1: Peminjaman returned (buku Pemrograman Laravel - digital, sudah dibaca)
        Loan::firstOrCreate(
            ['school_id' => $school->id, 'user_id' => $siswa1->id, 'book_id' => $books[0]->id, 'status' => 'returned'],
            [
                'tanggal_pinjam'      => now()->subDays(20)->toDateString(),
                'tanggal_jatuh_tempo' => now()->subDays(6)->toDateString(),
                'tanggal_kembali'     => now()->subDays(5)->toDateString(),
                'status'              => 'returned',
            ]
        );

        // Siswa 2: Peminjaman returned TELAMBAT (buku Fisika) - terlambat 5 hari, ada denda
        $loanLate = Loan::firstOrCreate(
            ['school_id' => $school->id, 'user_id' => $siswa2->id, 'book_id' => $books[5]->id, 'status' => 'returned'],
            [
                'tanggal_pinjam'      => now()->subDays(21)->toDateString(),
                'tanggal_jatuh_tempo' => now()->subDays(7)->toDateString(),
                'tanggal_kembali'     => now()->subDays(2)->toDateString(),
                'status'              => 'returned',
            ]
        );

        // ==================== 6. DENDA ====================
        // Denda untuk peminjaman terlambat siswa 2 (5 hari × Rp 1.000 = Rp 5.000)
        Fine::firstOrCreate(
            [
                'school_id' => $school->id,
                'user_id'   => $siswa2->id,
                'loan_id'   => $loanLate->id,
            ],
            [
                'jumlah_denda'      => 5000,
                'hari_terlambat'    => 5,
                'status_denda'      => 'pending',
                'tanggal_dikenakan' => $loanLate->tanggal_kembali,
            ]
        );

        // ==================== OUTPUT ====================
        $this->command->info('========================================');
        $this->command->info('✅ Demo seeder berhasil dijalankan!');
        $this->command->info('========================================');
        $this->command->info('');
        $this->command->info('🏫 Sekolah: ' . $school->name);
        $this->command->info('🔑 License Key: ' . $school->license_key);
        $this->command->info('');
        $this->command->info('--- Akun Login ---');
        $this->command->info('👑 Admin   : email=admin@nusantara.sch.id | password=password');
        $this->command->info('🎓 Siswa 1 : nisn=0081234001 | password=0081234001 | ' . $siswa1->name);
        $this->command->info('🎓 Siswa 2 : nisn=0081234002 | password=0081234002 | ' . $siswa2->name);
        $this->command->info('');
        $this->command->info('--- Data Buku (' . count($books) . ' buku) ---');
        foreach ($books as $i => $book) {
            $tipe = $book->pdf ? '📄 Digital' : '📖 Fisik';
            $this->command->info('  ' . ($i + 1) . '. ' . $book->nama_buku . ' [' . $tipe . '] | Stok: ' . $book->jumlah_tersedia);
        }
        $this->command->info('');
        $this->command->info('--- Data Peminjaman (5 loans) ---');
        $this->command->info('  1. Pending   : ' . $siswa1->name . ' meminjam "Sejarah Peradaban Islam"');
        $this->command->info('  2. Approved  : ' . $siswa1->name . ' meminjam "Dasar-Dasar Algoritma"');
        $this->command->info('  3. Approved  : ' . $siswa2->name . ' meminjam "Matematika Wajib"');
        $this->command->info('  4. Returned  : ' . $siswa1->name . ' sudah mengembalikan "Pemrograman Laravel 10"');
        $this->command->info('  5. Returned  : ' . $siswa2->name . ' terlambat mengembalikan "Fisika untuk SMA" (5 hari)');
        $this->command->info('');
        $this->command->info('--- Data Denda ---');
        $this->command->info('  💰 ' . $siswa2->name . ': Rp 5.000 (5 hari × Rp 1.000)');
        $this->command->info('');
        $this->command->info('Untuk menjalankan: php artisan db:seed --class=DemoSeeder');
    }
}
