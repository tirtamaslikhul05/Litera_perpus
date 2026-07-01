// src/core/services/AdminService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin';

const AdminService = {
  // === KELOLA SISWA ===
  getAllStudents: () => axios.get(`${API_URL}/students`),
  addStudent: (studentData) => axios.post(`${API_URL}/students`, studentData),
  toggleStudentStatus: (studentId) => axios.patch(`${API_URL}/students/${studentId}/toggle`),

  // === PENGELOLAAN BUKU ===
  getAllBooks: () => axios.get(`${API_URL}/books`),
  addBook: (bookData) => {
    // Menggunakan FormData karena UI kamu mendukung upload file Cover (Gambar) & E-Book (PDF)
    return axios.post(`${API_URL}/books`, bookData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // === TRANSAKSI & DENDA (PENGHUBUNG UTAMA) ===
  processReturn: (loanId) => axios.post(`${API_URL}/loans/${loanId}/return`),
  getDendaDetail: (transactionId) => axios.get(`${API_URL}/fines/${transactionId}`),
  payDenda: (transactionId, nominal) => axios.post(`${API_URL}/fines/${transactionId}/pay`, { nominal }),
  
  // === DASHBOARD STATS ===
  getDashboardStats: () => axios.get(`${API_URL}/dashboard-summary`)
};

export default AdminService;