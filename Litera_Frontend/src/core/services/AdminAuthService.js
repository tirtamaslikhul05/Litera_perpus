// src/core/services/AdminAuthService.js
import apiClient from './ApiClient';

const AdminAuthService = {
  /**
   * Login Admin - Full API (Tanpa Fake Account)
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/admin/login', { 
        email, 
        password 
      });

      const { token, expiresInMinutes, admin } = response.data.data || response.data;

      if (!token) {
        throw new Error('Token tidak diterima dari server');
      }

      // Simpan token admin
      const expiryTime = Date.now() + (expiresInMinutes * 60 * 1000);

      localStorage.setItem('litera_token', token);
      localStorage.setItem('litera_token_expiry', expiryTime.toString());
      localStorage.setItem('litera_role', 'Admin');

      if (admin) {
        localStorage.setItem('litera_user', JSON.stringify(admin));
      }

      return response.data.data || response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Email atau password admin salah.';
      throw new Error(message);
    }
  },

  /**
   * Register Admin Baru
   */
  async register(adminData) {
    try {
      const response = await apiClient.post('/admin/register', adminData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     'Gagal mendaftarkan akun admin baru.';
      throw new Error(message);
    }
  },

  /**
   * Logout Admin
   */
  logout() {
    localStorage.removeItem('litera_token');
    localStorage.removeItem('litera_token_expiry');
    localStorage.removeItem('litera_role');
    localStorage.removeItem('litera_user');
    
    // Redirect ke halaman login admin
    window.location.href = '/admin/login';
  },

  /**
   * Cek apakah admin sedang login
   */
  isLoggedIn() {
    const token = localStorage.getItem('litera_token');
    const expiry = localStorage.getItem('litera_token_expiry');
    const role = localStorage.getItem('litera_role');

    return !!(token && expiry && role === 'Admin' && Date.now() < parseInt(expiry));
  }
};

export default AdminAuthService;