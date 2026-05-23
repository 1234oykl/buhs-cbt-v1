import axios from "axios";

const api = axios.create({
  baseURL: "https://buhs-cbt-v1.onrender.com",
});

export default api;