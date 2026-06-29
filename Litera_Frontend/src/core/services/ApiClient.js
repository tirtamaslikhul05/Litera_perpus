import axios from 'axios';

// Url diganti jika sudah ada
const API_BASE_URL = 'https://api.litera-sekolah.sch.id/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor otomatis menyisipkan Token JWT ke setiap request ke server
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('litera_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani otomatis jika token kedaluwarsa (Error 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Sesi habis, paksa logout dan bersihkan penyimpanan lokal
      localStorage.removeItem('litera_token');
      localStorage.removeItem('litera_token_expiry');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;