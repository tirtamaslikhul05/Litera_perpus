// src/services/adminService.js
import apiClient from "./ApiClient";

const AdminService = {
  // ================= SISWA =================
  async getAllStudents({
    search = "",
    kelas = "",
    jurusan = "",
    per_page = 15,
  }) {
    const params = { search, kelas, jurusan, per_page };
    const res = await apiClient.get("/students", { params });
    return res.data;
  },

  async getStudentDetail(id) {
    const res = await apiClient.get(`/students/${id}`);
    return res.data;
  },

  async createStudent(studentData) {
    const res = await apiClient.post("/register-student", studentData); // sesuai dokumentasi
    return res.data;
  },

  async updateStudent(id, studentData) {
    const res = await apiClient.put(`/students/${id}`, studentData);
    return res.data;
  },

  async deleteStudent(id) {
    const res = await apiClient.delete(`/students/${id}`);
    return res.data;
  },

  // ================= BUKU =================
  async getAllBooks({ search = "", pdf = null, per_page = 15 }) {
    const params = { search, per_page };
    if (pdf !== null) params.pdf = pdf;
    const res = await apiClient.get("/books", { params });
    return res.data;
  },

  async getBookDetail(id) {
    const res = await apiClient.get(`/books/${id}`);
    return res.data;
  },

  async createBook(bookFormData) {
    // bookFormData adalah FormData (untuk cover + pdf)
    const res = await apiClient.post("/books", bookFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async updateBook(id, bookFormData) {
    const res = await apiClient.post(`/books/${id}`, bookFormData, {
      // Laravel sering pakai POST untuk update dengan file
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async deleteBook(id) {
    const res = await apiClient.delete(`/books/${id}`);
    return res.data;
  },

  // ================= PEMINJAMAN (LOANS) =================
  async getAllLoans({ status = null, search = "" }) {
    let url = "/admin/loans";
    const params = [];
    if (status) params.push(`status=${status}`);
    if (search) params.push(`search=${search}`);
    if (params.length) url += "?" + params.join("&");

    const res = await apiClient.get(url);
    return res.data;
  },

  async approveLoan(loanId) {
    const res = await apiClient.put(`/admin/loans/${loanId}/approve`);
    return res.data;
  },

  async confirmReturn(loanId) {
    const res = await apiClient.put(`/admin/loans/${loanId}/return`);
    return res.data;
  },

  // ================= DASHBOARD / STATS =================
  async getDashboardStats() {
    // Jika backend belum ada endpoint khusus, bisa gabung beberapa call
    try {
      const [loansRes, booksRes] = await Promise.all([
        apiClient.get("/admin/loans"),
        apiClient.get("/books"),
      ]);
      return {
        totalLoans: loansRes.data.meta?.total || 0,
        totalBooks: booksRes.data.meta?.total || 0,
        // tambahkan stats lain sesuai kebutuhan
      };
    } catch (error) {
      console.error("Gagal mengambil dashboard stats:", error);
      return {};
    }
  },
};

export default AdminService;
