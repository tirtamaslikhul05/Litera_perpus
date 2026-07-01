// src/core/services/AdminService.js
import apiClient from './ApiClient';

const AdminService = {
  // === KELOLA SISWA ===
  getAllStudents: async () => {
    const response = await apiClient.get('/admin/students');
    return response.data;
  },

  addStudent: async (studentData) => {
    const response = await apiClient.post('/admin/students', studentData);
    return response.data;
  },

  toggleStudentStatus: async (studentId) => {
    const response = await apiClient.patch(`/admin/students/${studentId}/toggle`);
    return response.data;
  },

  // === PENGELOLAAN BUKU ===
  getAllBooks: async () => {
    const response = await apiClient.get('/admin/books');
    return response.data;
  },

  addBook: async (bookData) => {
    // bookData bisa berupa FormData (untuk upload cover + file PDF)
    const response = await apiClient.post('/admin/books', bookData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // === TRANSAKSI & DENDA ===
  processReturn: async (loanId) => {
    const response = await apiClient.post(`/admin/loans/${loanId}/return`);
    return response.data;
  },

  getDendaDetail: async (transactionId) => {
    const response = await apiClient.get(`/admin/fines/${transactionId}`);
    return response.data;
  },

  payDenda: async (transactionId, nominal) => {
    const response = await apiClient.post(`/admin/fines/${transactionId}/pay`, { nominal });
    return response.data;
  },

  // === DASHBOARD STATS ===
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard-summary');
    return response.data;
  }
};

export default AdminService;