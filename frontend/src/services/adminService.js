import axiosClient from "../api/axiosClient";

const adminService = {
  getDashboard: async (config = {}) => {
    const response = await axiosClient.get("/admin/dashboard", config);
    return response.data.data;
  },

  getSubmissions: async (params = {}, config = {}) => {
    const response = await axiosClient.get("/admin/submissions", {
      ...config,
      params,
    });
    return response.data.data;
  },

  getSubmissionById: async (id, config = {}) => {
    const response = await axiosClient.get(`/admin/submissions/${id}`, config);
    return response.data.data;
  },

  reviewSubmission: async (id, data) => {
    const response = await axiosClient.patch(`/admin/submissions/${id}/review`, data);
    return response.data.data;
  },
};

export default adminService;
