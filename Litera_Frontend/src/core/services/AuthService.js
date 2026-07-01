import apiClient from './ApiClient';

class AuthService {
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

  async login(nisn, password) {
    if (nisn.length !== 10) {
      throw new Error('NISN harus tepat berupa 10 digit angka!');
    }

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
      throw new Error(message);
    }
  }

  async register(name, nisn, password) {
    // Skenario registrasi tetap diarahkan ke API jika ingin menyimpan data nyata
    try {
      const response = await apiClient.post('/auth/register', { name, nisn, password });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mendaftarkan keanggotaan baru.';
      throw new Error(message);
    }
  }

  logout() {
    localStorage.removeItem('litera_token');
    localStorage.removeItem('litera_token_expiry');
    window.location.href = '/login';
  }
}

export default new AuthService();