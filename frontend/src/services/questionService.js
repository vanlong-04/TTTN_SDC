import axiosClient from "../api/axiosClient";

const unwrap = (response) => response.data.data;

export const questionService = {
  getQuestionBank: (params) => {
    return axiosClient.get("/questions/bank", { params });
  },

  getQuestions: async (params = {}, config = {}) =>
    unwrap(await axiosClient.get("/questions", { ...config, params })),

  getQuestionById: (id) => {
    return axiosClient.get(`/questions/${id}`);
  },

  createQuestion: (data) => {
    return axiosClient.post("/questions", data);
  },

  updateQuestion: (id, data) => {
    return axiosClient.put(`/questions/${id}`, data);
  },

  deleteQuestion: (id) => {
    return axiosClient.delete(`/questions/${id}`);
  },
};

export default questionService;
