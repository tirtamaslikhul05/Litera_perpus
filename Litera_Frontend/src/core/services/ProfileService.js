import apiClient from "./ApiClient";

const ProfileService = {
  async getProfile() {
    const res = await apiClient.get("/student/profile");
    return res.data;
  },

  async updateProfile(formData) {
    const res = await apiClient.put("/student/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default ProfileService;
