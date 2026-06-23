import axiosClient from "../api/axiosClient";

const authService = {
  register: async (data) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data.data;
  },
  login: async (data) => {
    const response = await axiosClient.post("/auth/login", data);
    return response.data.data;
  },
  getProfile: async () => {
    const response = await axiosClient.get("/auth/me");
    return response.data.data;
  },
};

export default authService;
