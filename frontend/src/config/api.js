import axios from "axios";

const api = axios.create({
  baseURL: "https://buhs-cbt-v1.onrender.com/api",
});

// AUTO ATTACH TOKEN
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;