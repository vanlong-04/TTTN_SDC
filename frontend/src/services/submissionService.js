import axiosClient from "../api/axiosClient";

const unwrap = (response) => response.data.data;

export const submissionService = {
  submitQuiz: async (data) => unwrap(await axiosClient.post("/submissions", data)),
  
  getHistory: async () => unwrap(await axiosClient.get("/submissions/history")),
  
  getSubmissionById: async (id) => unwrap(await axiosClient.get(`/submissions/${id}`)),
  
  // For backwards compatibility with older usages if any
  getById: async (id) => unwrap(await axiosClient.get(`/submissions/${id}`)),
};

export default submissionService;
