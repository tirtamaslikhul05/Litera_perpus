// src/core/services/AdminAuthService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminAuthService = {
  // Service untuk Login Admin
  login: async (email, password) => {
    // -----------------------------------------------------------------
    // FAKE ACCOUNT BYPASS (MOCKING FRONTEND)
    // -----------------------------------------------------------------
    if (email === 'admin@litera.id' && password === 'admin123') {
      console.log('--- LOGIN ADMIN MOCK SUCCESS ---');
      
      // Mengembalikan struktur data yang persis sama seperti respons asli backend
      return {
        success: true,
        message: 'Login Berhasil (Fake Account)',
        token: 'mock_jwt_token_admin_litera_2026_xyz',
        expiresIn: 7200, // Berlaku 2 jam (dalam satuan detik)
        role: 'Admin'
      };
    }
    // -----------------------------------------------------------------

    // Jika inputan bukan akun tiruan di atas, sistem akan tetap mencoba menembak API backend asli
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      return response.data;
    } catch (error) {
      // Jika backend mati dan bukan fake account, kunci pesan errornya
      throw new Error(error.response?.data?.message || 'Email atau Kata Sandi salah / API Offline.');
    }
  },

  // Service untuk Registrasi Admin Baru
  register: async (adminData) => {
    try {
      const response = await axios.post(`${API_URL}/admin/register`, adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Gagal melakukan registrasi admin.');
    }
  },

  // Service untuk Logout Admin
  logout: () => {
    localStorage.removeItem('litera_token');
    localStorage.removeItem('litera_token_expiry');
    localStorage.removeItem('litera_role');
  }
};

export default AdminAuthService;