import apiClient from "./ApiClient";

const BookService = {
  async searchBooks({
    search = "",
    tersedia = true,
    pdf = null,
    per_page = 12,
  }) {
    const params = { search, tersedia, per_page };
    if (pdf !== null) params.pdf = pdf;
    const res = await apiClient.get("/student/books", { params });
    return res.data;
  },

  async getBookDetail(id) {
    const res = await apiClient.get(`/student/books/${id}`);
    return res.data;
  },

  async getReadUrl(id) {
    const res = await apiClient.get(`/student/books/${id}/read`);
    return res.data.data.pdf_url;
  },

  async borrowBook(bookId) {
    const res = await apiClient.post("/student/loans", { book_id: bookId });
    return res.data;
  },

  async getMyLoans(status = null) {
    const url = status ? `/student/loans?status=${status}` : "/student/loans";
    const res = await apiClient.get(url);
    return res.data;
  },

  async returnBook(loanId) {
    const res = await apiClient.put(`/student/loans/${loanId}/return`);
    return res.data;
  },
};

export default BookService;
