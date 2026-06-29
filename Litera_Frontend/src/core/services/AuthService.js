import apiClient from './ApiClient';

class AuthService {
  async login(nisn, password) {
    if (nisn.length !== 10) {
      throw new Error('NISN harus tepat berupa 10 digit angka!');
    }

    try {
      const response = await apiClient.post('/auth/login', { 
        nisn, 
        password 
      });

      const { token, expiresInMinutes, user } = response.data.data || response.data;

      if (!token) {
        throw new Error('Token tidak diterima dari server');
      }

      // Simpan token unik dari backend
      const expiryTime = Date.now() + (expiresInMinutes * 60 * 1000);

      localStorage.setItem('litera_token', token);
      localStorage.setItem('litera_token_expiry', expiryTime.toString());
      
      // Optional: Simpan data user
      if (user) {
        localStorage.setItem('litera_user', JSON.stringify(user));
      }

      return response.data.data || response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Kombinasi NISN atau password salah.';
      throw new Error(message);
    }
  }

  async register(name, nisn, password) {
    try {
      const response = await apiClient.post('/auth/register', { 
        name, 
        nisn, 
        password 
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 
                     'Gagal mendaftarkan akun baru.';
      throw new Error(message);
    }
  }

  logout() {
    localStorage.removeItem('litera_token');
    localStorage.removeItem('litera_token_expiry');
    localStorage.removeItem('litera_user');
    window.location.href = '/login';
  }

  // Helper untuk cek apakah user sudah login
  isLoggedIn() {
    const token = localStorage.getItem('litera_token');
    const expiry = localStorage.getItem('litera_token_expiry');
    return !!(token && expiry && Date.now() < parseInt(expiry));
  }
}

export default new AuthService();