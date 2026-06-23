import axiosClient from "../api/axiosClient";

const unwrap = (response) => response.data.data;

const quizService = {
  getPublishedQuizzes: async (params = {}) =>
    unwrap(await axiosClient.get("/quizzes/public", { params })),
  getPublishedQuizById: async (id) =>
    unwrap(await axiosClient.get(`/quizzes/public/${id}`)),
  generateQuiz: async (data, config = {}) =>
    unwrap(await axiosClient.post("/quizzes/generate", data, config)),
  getQuizzes: async (params = {}) =>
    unwrap(await axiosClient.get("/quizzes", { params })),
  getQuizById: async (id) => unwrap(await axiosClient.get(`/quizzes/${id}`)),
  createQuiz: async (data) => unwrap(await axiosClient.post("/quizzes", data)),
  updateQuiz: async (id, data) =>
    unwrap(await axiosClient.put(`/quizzes/${id}`, data)),
  deleteQuiz: (id) => axiosClient.delete(`/quizzes/${id}`),
};

export default quizService;
