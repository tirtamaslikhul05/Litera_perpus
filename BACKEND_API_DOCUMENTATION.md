# 📚 Litera Perpustakaan - Backend API Documentation

> Dokumentasi lengkap penggunaan backend API untuk implementasi frontend (Web, Android, Desktop).

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Any)                        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Web    │  │   Android    │  │   Desktop        │   │
│  │ (React)  │  │ (Flutter)    │  │ (Electron/WPF)   │   │
│  └────┬─────┘  └──────┬───────┘  └────────┬─────────┘   │
│       │               │                   │              │
│       └───────────────┼───────────────────┘              │
│                       │                                  │
│                   HTTP / REST                            │
│                   JSON Format                            │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              LARAVEL BACKEND (API)                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Sanctum Auth (Token)                │    │
│  ├─────────────────────────────────────────────────┤    │
│  │  AuthController    │  BookController             │    │
│  │  StudentController │  AdminLoanController        │    │
│  │  StudentBookCtrl   │  StudentLoanController      │    │
│  │  StudentFineCtrl   │  StudentProfileController   │    │
│  └─────────────────────────────────────────────────┘    │
│                       │                                  │
│                       ▼                                  │
│              ┌─────────────────┐                        │
│              │   MySQL DB      │                        │
│              │  (Multi-Tenant) │                        │
│              └─────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication

### Base URL
```
http://localhost:8000/api
```

### Token-Based Auth (Laravel Sanctum)
Semua endpoint **protected** memerlukan header:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

---

## 📋 Complete API Reference

### 1. 🔑 Authentication (Public - No Token Required)

#### Register School & Admin
```
POST /api/register
```
**Request:**
```json
{
  "school_name": "SMA Nusantara",
  "admin_name": "Admin Perpustakaan",
  "email": "admin@nusantara.sch.id",
  "password": "secret123"
}
```
**Response (201):**
```json
{
  "status": "success",
  "message": "Sekolah dan Admin berhasil didaftarkan!",
  "data": {
    "user": { "id": 1, "name": "Admin Perpustakaan", "role": "admin" },
    "school": { "id": 1, "name": "SMA Nusantara" }
  }
}
```

#### Login (Email or NISN)
```
POST /api/login
```
**Request:**
```json
{
  "login_id": "admin@nusantara.sch.id",
  "password": "secret123"
}
```
Atau login pakai NISN:
```json
{
  "login_id": "0081234001",
  "password": "0081234001"
}
```
**Response (200):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "user": { "id": 2, "name": "Ahmad Rizky", "role": "siswa", "nisn": "0081234001" },
    "token": "1|abc123...",
    "role": "siswa"
  }
}
```

#### Logout (Token Required)
```
POST /api/logout
```

---

### 2. 🔍 Search Buku (Student)

#### List/Search Books
```
GET /api/student/books?search=laravel&tersedia=true&pdf=true&per_page=10
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Cari berdasarkan nama buku atau ISBN |
| `tersedia` | boolean | `true` = hanya stok > 0 |
| `pdf` | boolean | `true` = hanya buku digital |
| `per_page` | int | Jumlah item per halaman (default: 10) |

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "school_id": 1,
      "nama_buku": "Pemrograman Laravel 10",
      "isbn": "978-602-123-001-1",
      "pdf": true,
      "jumlah_buku": 5,
      "jumlah_pinjam": 2,
      "jumlah_tersedia": 3,
      "cover": "http://localhost:8000/storage/covers/cover1.jpg",
      "created_at": "2026-07-02 10:00:00",
      "updated_at": "2026-07-02 10:00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 1
  }
}
```

#### Book Detail
```
GET /api/student/books/{id}
```

#### Access Digital Book (PDF)
```
GET /api/student/books/{id}/read
```
**Response (200):**
```json
{
  "status": "success",
  "data": {
    "book": {
      "id": 1,
      "nama_buku": "Pemrograman Laravel 10",
      "isbn": "978-602-123-001-1",
      "cover": "http://localhost:8000/storage/covers/cover1.jpg"
    },
    "pdf_url": "http://localhost:8000/storage/pdf/978-602-123-001-1.pdf"
  }
}
```
> ⚠️ Hanya bisa diakses jika siswa memiliki loan `approved`/`returned` untuk buku tersebut.

---

### 3. 📖 Peminjaman Buku (Student)

#### Submit Borrowing Request
```
POST /api/student/loans
```
**Request:**
```json
{
  "book_id": 1
}
```
**Response (201):**
```json
{
  "status": "success",
  "message": "Peminjaman berhasil diajukan. Menunggu persetujuan admin.",
  "data": {
    "id": 1,
    "book": {
      "id": 1,
      "nama_buku": "Pemrograman Laravel 10",
      "isbn": "978-602-123-001-1"
    },
    "student": {
      "id": 2,
      "name": "Ahmad Rizky",
      "nisn": "0081234001"
    },
    "tanggal_pinjam": "2026-07-02",
    "tanggal_jatuh_tempo": "2026-07-16",
    "tanggal_kembali": null,
    "status": "pending"
  }
}
```

---

### 4. 📚 Rak Buku (Student Loan History)

#### List My Loans
```
GET /api/student/loans?status=approved&per_page=10
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `pending`, `approved`, atau `returned` |
| `per_page` | int | Jumlah item per halaman |

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "book": {
        "id": 2,
        "nama_buku": "Dasar-Dasar Algoritma",
        "isbn": "978-602-123-002-8"
      },
      "student": {
        "id": 2,
        "name": "Ahmad Rizky"
      },
      "tanggal_pinjam": "2026-06-27",
      "tanggal_jatuh_tempo": "2026-07-11",
      "tanggal_kembali": null,
      "status": "approved"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 1
  }
}
```

---

### 5. 🔄 Pengembalian Buku (Student)

#### Return a Book
```
PUT /api/student/loans/{id}/return
```
**Response (200):**
```json
{
  "status": "success",
  "message": "Buku berhasil dikembalikan.",
  "data": {
    "id": 2,
    "book": { "id": 2, "nama_buku": "Dasar-Dasar Algoritma" },
    "student": { "id": 2, "name": "Ahmad Rizky" },
    "tanggal_pinjam": "2026-06-27",
    "tanggal_jatuh_tempo": "2026-07-11",
    "tanggal_kembali": "2026-07-02",
    "status": "returned"
  }
}
```
> ⚠️ Hanya loan dengan status `approved` yang bisa dikembalikan. Jika terlambat, denda otomatis dibuat.

---

### 6. 💰 Status Denda (Student)

#### List My Fines
```
GET /api/student/fines?status=pending&per_page=10
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "loan": {
        "id": 5,
        "tanggal_jatuh_tempo": "2026-06-25",
        "tanggal_kembali": "2026-06-30",
        "book": {
          "id": 6,
          "nama_buku": "Fisika untuk SMA Kelas XII",
          "isbn": "978-602-123-006-6"
        }
      },
      "jumlah_denda": 5000,
      "hari_terlambat": 5,
      "status_denda": "pending",
      "tanggal_dikenakan": "2026-06-30",
      "tanggal_lunas": null
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 10, "total": 1 }
}
```

#### Total Unpaid Fines
```
GET /api/student/fines/total
```
**Response (200):**
```json
{
  "status": "success",
  "data": {
    "total_denda": 5000,
    "jumlah_item": 1
  }
}
```

---

### 7. 👤 Profil Siswa

#### View Profile
```
GET /api/student/profile
```

#### Update Profile
```
PUT /api/student/profile
```
**Request (multipart/form-data):**
```
name: Ahmad Rizky Pratama Baru
kelas: XII IPA 1
jurusan: IPA
foto: (file - optional, max 2MB, jpeg/png/jpg)
```
**Response (200):**
```json
{
  "status": "success",
  "message": "Profil berhasil diperbarui.",
  "data": {
    "id": 2,
    "name": "Ahmad Rizky Pratama Baru",
    "nisn": "0081234001",
    "kelas": "XII IPA 1",
    "jurusan": "IPA",
    "foto": "http://localhost:8000/storage/photos/photo1.jpg"
  }
}
```

---

### 8. 👑 Admin Routes

#### Register Student (Admin only)
```
POST /api/register-student
```
**Request:**
```json
{
  "name": "Siswa Baru",
  "nisn": "0081234003",
  "school_id": 1,
  "kelas": "X IPA 2",
  "jurusan": "IPA"
}
```

#### List All Loans (Admin)
```
GET /api/admin/loans?status=pending&search=ahmad
```

#### Approve Loan (Admin)
```
PUT /api/admin/loans/{loan_id}/approve
```

#### Confirm Return (Admin)
```
PUT /api/admin/loans/{loan_id}/return
```

#### CRUD Books (Admin)
```
GET    /api/books?search=laravel&pdf=true
GET    /api/books/{id}
POST   /api/books          (multipart/form-data)
PUT    /api/books/{id}     (multipart/form-data)
DELETE /api/books/{id}
```

#### CRUD Students (Admin)
```
GET    /api/students?search=ahmad&kelas=XII&jurusan=IPA
GET    /api/students/{id}
POST   /api/students        (multipart/form-data)
PUT    /api/students/{id}   (multipart/form-data)
DELETE /api/students/{id}
```

---

## 📱 Frontend Implementation Examples

### React / Next.js (Web)
```javascript
// api.js - API Client Setup
const BASE_URL = 'http://localhost:8000/api';

const api = {
  token: localStorage.getItem('token'),

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  },

  headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  },

  // Auth
  async login(loginId, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ login_id: loginId, password }),
    });
    const data = await res.json();
    if (data.status === 'success') this.setToken(data.data.token);
    return data;
  },

  // Search Books
  async searchBooks(query = '', filters = {}) {
    const params = new URLSearchParams({ search: query, ...filters });
    const res = await fetch(`${BASE_URL}/student/books?${params}`, {
      headers: this.headers(),
    });
    return res.json();
  },

  // Borrow Book
  async borrowBook(bookId) {
    const res = await fetch(`${BASE_URL}/student/loans`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ book_id: bookId }),
    });
    return res.json();
  },

  // My Loans (Rak Buku)
  async myLoans(status = null) {
    const params = status ? `?status=${status}` : '';
    const res = await fetch(`${BASE_URL}/student/loans${params}`, {
      headers: this.headers(),
    });
    return res.json();
  },

  // Return Book
  async returnBook(loanId) {
    const res = await fetch(`${BASE_URL}/student/loans/${loanId}/return`, {
      method: 'PUT',
      headers: this.headers(),
    });
    return res.json();
  },

  // Read Digital Book
  async getReadUrl(bookId) {
    const res = await fetch(`${BASE_URL}/student/books/${bookId}/read`, {
      headers: this.headers(),
    });
    return res.json();
  },

  // Fines
  async myFines() {
    const res = await fetch(`${BASE_URL}/student/fines`, {
      headers: this.headers(),
    });
    return res.json();
  },

  async totalFines() {
    const res = await fetch(`${BASE_URL}/student/fines/total`, {
      headers: this.headers(),
    });
    return res.json();
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${BASE_URL}/student/profile`, {
      headers: this.headers(),
    });
    return res.json();
  },

  async updateProfile(formData) {
    const res = await fetch(`${BASE_URL}/student/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json',
        // Note: Don't set Content-Type for FormData, browser sets it automatically
      },
      body: formData,
    });
    return res.json();
  },
};

export default api;
```

### Flutter (Android/iOS)
```dart
// api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api'; // Android emulator
  // static const String baseUrl = 'http://localhost:8000/api'; // iOS simulator

  String? _token;

  void setToken(String token) {
    _token = token;
  }

  Map<String, String> get _headers => {
    if (_token != null) 'Authorization': 'Bearer $_token',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  // Login
  Future<Map<String, dynamic>> login(String loginId, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: jsonEncode({'login_id': loginId, 'password': password}),
    );
    final data = jsonDecode(response.body);
    if (data['status'] == 'success') setToken(data['data']['token']);
    return data;
  }

  // Search Books
  Future<Map<String, dynamic>> searchBooks({String? search, bool? tersedia, bool? pdf}) async {
    final params = <String, String>{};
    if (search != null) params['search'] = search;
    if (tersedia != null) params['tersedia'] = tersedia.toString();
    if (pdf != null) params['pdf'] = pdf.toString();

    final uri = Uri.parse('$baseUrl/student/books').replace(queryParameters: params);
    final response = await http.get(uri, headers: _headers);
    return jsonDecode(response.body);
  }

  // Borrow Book
  Future<Map<String, dynamic>> borrowBook(int bookId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/student/loans'),
      headers: _headers,
      body: jsonEncode({'book_id': bookId}),
    );
    return jsonDecode(response.body);
  }

  // My Loans
  Future<Map<String, dynamic>> myLoans({String? status}) async {
    final uri = status != null
        ? Uri.parse('$baseUrl/student/loans?status=$status')
        : Uri.parse('$baseUrl/student/loans');
    final response = await http.get(uri, headers: _headers);
    return jsonDecode(response.body);
  }

  // Return Book
  Future<Map<String, dynamic>> returnBook(int loanId) async {
    final response = await http.put(
      Uri.parse('$baseUrl/student/loans/$loanId/return'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  // My Fines
  Future<Map<String, dynamic>> myFines() async {
    final response = await http.get(Uri.parse('$baseUrl/student/fines'), headers: _headers);
    return jsonDecode(response.body);
  }

  // Total Fines
  Future<Map<String, dynamic>> totalFines() async {
    final response = await http.get(Uri.parse('$baseUrl/student/fines/total'), headers: _headers);
    return jsonDecode(response.body);
  }
}
```

### Electron / WPF / Desktop (C# HTTP Client)
```csharp
// ApiClient.cs
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

public class ApiClient
{
    private readonly HttpClient _client = new();
    private readonly string _baseUrl = "http://localhost:8000/api";

    private void SetToken(string token)
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
        _client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<JsonDocument> Login(string loginId, string password)
    {
        var body = JsonSerializer.Serialize(new { login_id = loginId, password });
        var content = new StringContent(body, Encoding.UTF8, "application/json");
        var response = await _client.PostAsync($"{_baseUrl}/login", content);
        var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var token = json.RootElement.GetProperty("data").GetProperty("token").GetString();
        SetToken(token!);
        return json;
    }

    public async Task<JsonDocument> SearchBooks(string? search = null, bool? tersedia = null)
    {
        var query = new List<string>();
        if (search != null) query.Add($"search={search}");
        if (tersedia != null) query.Add($"tersedia={tersedia}");
        var url = $"{_baseUrl}/student/books" + (query.Any() ? "?" + string.Join("&", query) : "");
        var response = await _client.GetAsync(url);
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    }

    public async Task<JsonDocument> BorrowBook(int bookId)
    {
        var body = JsonSerializer.Serialize(new { book_id = bookId });
        var content = new StringContent(body, Encoding.UTF8, "application/json");
        var response = await _client.PostAsync($"{_baseUrl}/student/loans", content);
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    }

    public async Task<JsonDocument> ReturnBook(int loanId)
    {
        var response = await _client.PutAsync($"{_baseUrl}/student/loans/{loanId}/return", null);
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    }

    public async Task<JsonDocument> GetFines()
    {
        var response = await _client.GetAsync($"{_baseUrl}/student/fines");
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    }
}
```

---

## 🔄 Application Flow (Recommended)

```
┌──────────────────────────────────────────────────────┐
│                    STARTUP                             │
│                                                        │
│  1. Cek token di local storage                        │
│     ├─ Ada token? → GET /api/user/role → Route ke    │
│     │                 dashboard sesuai role            │
│     └─ Tidak ada? → Route ke Login Page               │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────┐
│                    LOGIN                               │
│                                                        │
│  POST /api/login                                       │
│  ├─ role = "admin"  → Admin Dashboard                 │
│  └─ role = "siswa"  → Student Dashboard               │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────┐
│              STUDENT DASHBOARD                         │
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ 🔍 Search │ │ 📖 Pinjam │ │ 📚 Rak   │              │
│  │  Buku     │ │  Buku    │ │  Buku    │              │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘              │
│       │             │             │                    │
│  ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐              │
│  │ 📄 Baca  │ │ 🔄 Kembali│ │ 💰 Denda │              │
│  │  Buku    │ │  Buku    │ │          │              │
│  └──────────┘ └──────────┘ └──────────┘              │
│                                                        │
│  ┌──────────┐                                         │
│  │ 👤 Profil │                                         │
│  └──────────┘                                         │
└──────────────────────────────────────────────────────┘
```

---

## ⚙️ Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- MySQL/MariaDB
- Node.js (for frontend dev server)

### Backend Setup
```bash
cd Litera_Backend

# Install dependencies
composer install

# Copy env file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database in .env
DB_DATABASE=litera
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed demo data
php artisan db:seed --class=DemoSeeder

# Create storage symlink (for file uploads)
php artisan storage:link

# Start server
php artisan serve
```

### API Base URL
```
Development: http://localhost:8000/api
```

---

## 📊 Data Models

### User (Student)
```json
{
  "id": 2,
  "school_id": 1,
  "name": "Ahmad Rizky Pratama",
  "nisn": "0081234001",
  "kelas": "XII IPA 1",
  "jurusan": "IPA",
  "foto": "http://localhost:8000/storage/photos/photo.jpg",
  "role": "siswa"
}
```

### Book
```json
{
  "id": 1,
  "school_id": 1,
  "nama_buku": "Pemrograman Laravel 10",
  "isbn": "978-602-123-001-1",
  "pdf": true,
  "jumlah_buku": 5,
  "jumlah_pinjam": 2,
  "jumlah_tersedia": 3,
  "cover": "http://localhost:8000/storage/covers/cover1.jpg"
}
```

### Loan
```json
{
  "id": 1,
  "book": { "id": 1, "nama_buku": "Laravel 10", "isbn": "978-..." },
  "student": { "id": 2, "name": "Ahmad", "nisn": "0081234001" },
  "tanggal_pinjam": "2026-07-02",
  "tanggal_jatuh_tempo": "2026-07-16",
  "tanggal_kembali": null,
  "status": "pending"
}
```

### Fine
```json
{
  "id": 1,
  "loan": { ... },
  "jumlah_denda": 5000,
  "hari_terlambat": 5,
  "status_denda": "pending",
  "tanggal_dikenakan": "2026-06-30",
  "tanggal_lunas": null
}
```

---

## ⚠️ Error Responses

```json
{
  "status": "error",
  "message": "Error message here"
}
```

### Common HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 401 | Unauthenticated (token invalid/missing) |
| 403 | Forbidden (no access to this resource) |
| 404 | Resource not found |
| 422 | Validation error |
| 500 | Server error |

---

## 📝 Demo Data (Seeder)

```
php artisan db:seed --class=DemoSeeder
```

| Role | Login | Password |
|------|-------|----------|
| Admin | `admin@nusantara.sch.id` | `password` |
| Siswa 1 | NISN: `0081234001` | `0081234001` |
| Siswa 2 | NISN: `0081234002` | `0081234002` |

---

*Generated for Litera Perpustakaan Backend v1.0 - July 2026*
