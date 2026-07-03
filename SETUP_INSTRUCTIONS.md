# 🚀 Setup Litera Perpus - Panduan Lengkap

## 📌 Prasyarat

Pastikan sudah terinstall:
- **PHP 8.2+** (cek: `php --version`)
- **Composer** (cek: `composer --version`)
- **Node.js 18+** (cek: `node --version`)
- **npm** (cek: `npm --version`)
- **MySQL/MariaDB** (cek: `mysql --version`)

---

## ⚙️ Langkah 1: Backend (Laravel API)

### 1A. Install dependensi Laravel
Buka terminal di `Litera_Backend/` lalu jalankan:
```bash
composer install
```

### 1B. Generate APP_KEY
```bash
php artisan key:generate
```

### 1C. Buat database MySQL
Buka MySQL client (cmd/terminal/xampp) lalu jalankan:
```sql
CREATE DATABASE litera_db;
```

Atau pakai phpMyAdmin / XAMPP GUI.

### 1D. Edit file .env
File `.env` sudah saya buatkan. Isinya untuk koneksi MySQL:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=litera_db
DB_USERNAME=root
DB_PASSWORD=
```

> **⚠️ Jika punya password MySQL**, ganti `DB_PASSWORD=` menjadi `DB_PASSWORD=passwordmu`

### 1E. Jalankan migrasi database
```bash
php artisan migrate
```

### 1F. Seed data demo
```bash
php artisan db:seed --class=DemoSeeder
```

### 1G. Buat storage link (untuk upload cover/foto)
```bash
php artisan storage:link
```

### 1H. Jalankan server backend
```bash
php artisan serve
```
Backend akan jalan di `http://localhost:8000`

---

## ⚙️ Langkah 2: Frontend (React)

### 2A. Install dependensi React
Buka terminal baru di `Litera_Frontend/` lalu jalankan:
```bash
npm install
```

### 2B. Jalankan server frontend
```bash
npm run dev
```
Frontend akan jalan di `http://localhost:5173`

---

## 🧪 Langkah 3: Testing

### Akun Demo (dari DemoSeeder)

| Role | Email/NISN | Password |
|------|-----------|----------|
| **Admin** | `admin@nusantara.sch.id` | `password` |
| **Siswa 1** | `0085274931` | `0085274931` |
| **Siswa 2** | `0081627384` | `0081627384` |

### Alur Test
1. Buka `http://localhost:5173`
2. Login sebagai **Admin** (email: `admin@nusantara.sch.id`, password: `password`)
3. Lihat Dashboard Admin
4. Register sekolah baru lewat halaman Register
5. Login sebagai **Siswa** (pakai NISN sebagai login_id)
6. Cari buku, pinjam buku, lihat rak buku, dll

---

## ❗ Troubleshooting

### "Target class [xxx] does not exist"
Jalankan:
```bash
composer dump-autoload
```

### "APP_KEY not set"
Jalankan:
```bash
php artisan key:generate
```

### "The only supported ciphers are AES-128-CBC..."
Jalankan ulang:
```bash
php artisan key:generate
```

### "Class DatabaseSeeder does not exist"
```bash
composer dump-autoload
php artisan db:seed --class=DemoSeeder
```

### CORS error (frontend ga bisa akses backend)
Pastikan `.env` backend ada `FRONTEND_URL=http://localhost:5173`
Restart server:
```bash
php artisan serve
```
