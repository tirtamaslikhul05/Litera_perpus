import apiClient from "./ApiClient";

const AuthService = {
  async login(loginId, password) {
    const response = await apiClient.post("/login", {
      login_id: loginId,
      password,
    });
    const { data } = response.data;
    if (data?.token) {
      localStorage.setItem("litera_token", data.token);
      localStorage.setItem("litera_role", data.role);
    }
    return response.data;
  },

  async registerSchool(data) {
    const response = await apiClient.post("/register", data);
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post("/logout");
    } catch (e) {}
    localStorage.clear();
  },

  getRole() {
    return localStorage.getItem("litera_role");
  },
};

export default AuthService;
