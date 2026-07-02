import apiClient from './ApiClient';

class AuthService {
<<<<<<< HEAD
=======
  // Daftar akun tiruan (fake accounts) untuk bypass login lokal
  #fakeUsers = [
    {
      nisn: "1234567890",
      password: "password123",
      token: "FAKE-JWT-TOKEN-ANDI",
      name: "Andi Pratama"
    },
    {
      nisn: "0987654321",
      password: "password123",
      token: "FAKE-JWT-TOKEN-BUDI",
      name: "Budi Santoso"
    }
  ];

>>>>>>> origin/admin_part1
  async login(nisn, password) {
    if (nisn.length !== 10) {
      throw new Error('NISN harus tepat berupa 10 digit angka!');
    }

<<<<<<< HEAD
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
=======
    // 1. Cek apakah kredensial yang dimasukkan cocok dengan daftar fake account
    const matchedFakeUser = this.#fakeUsers.find(
      (user) => user.nisn === nisn && user.password === password
    );

    if (matchedFakeUser) {
      // Jalankan skenario simulasi login sukses lokal (Bypass API)
      await new Promise((resolve) => setTimeout(resolve, 600));

      const now = new Date().getTime();
      const expiryTime = now + 3600000; // Sesi aktif 1 jam

      localStorage.setItem('litera_token', matchedFakeUser.token);
      localStorage.setItem('litera_token_expiry', expiryTime.toString());

      return { 
        success: true, 
        message: "Login sukses via Fake Account", 
        data: { nisn: matchedFakeUser.nisn, name: matchedFakeUser.name } 
      };
    }

    // 2. Jika tidak cocok dengan fake account, otomatis tembak ke Real API Backend
    try {
      const response = await apiClient.post('/auth/login', { nisn, password });
      const { token, expiresInMinutes } = response.data.data;

      const now = new Date().getTime();
      const expiryTime = now + (expiresInMinutes * 60 * 1000);

      localStorage.setItem('litera_token', token);
      localStorage.setItem('litera_token_expiry', expiryTime.toString());

      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Kombinasi sandi atau NISN salah.';
>>>>>>> origin/admin_part1
      throw new Error(message);
    }
  }

  async register(name, nisn, password) {
<<<<<<< HEAD
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
=======
    // Skenario registrasi tetap diarahkan ke API jika ingin menyimpan data nyata
    try {
      const response = await apiClient.post('/auth/register', { name, nisn, password });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mendaftarkan keanggotaan baru.';
>>>>>>> origin/admin_part1
      throw new Error(message);
    }
  }

  logout() {
    localStorage.removeItem('litera_token');
    localStorage.removeItem('litera_token_expiry');
<<<<<<< HEAD
    localStorage.removeItem('litera_user');
    window.location.href = '/login';
  }

  // Helper untuk cek apakah user sudah login
  isLoggedIn() {
    const token = localStorage.getItem('litera_token');
    const expiry = localStorage.getItem('litera_token_expiry');
    return !!(token && expiry && Date.now() < parseInt(expiry));
  }
=======
    window.location.href = '/login';
  }
>>>>>>> origin/admin_part1
}

export default new AuthService();