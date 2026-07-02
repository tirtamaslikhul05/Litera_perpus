import apiClient from "./ApiClient";

const FineService = {
  async getFines() {
    const res = await apiClient.get("/student/fines");
    return res.data;
  },

  async getTotalFines() {
    const res = await apiClient.get("/student/fines/total");
    return res.data;
  },
};

export default FineService;
